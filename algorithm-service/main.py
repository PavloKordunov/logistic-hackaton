import math
from typing import Any, Literal

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

OSRM_TABLE_BASE = "http://router.project-osrm.org/table/v1/driving"

PRIORITY_TIERS: list[Literal["RED", "YELLOW", "GREEN"]] = ["RED", "YELLOW", "GREEN"]


class LatLng(BaseModel):
    lat: float
    lng: float


class OptimizePoint(BaseModel):
    id: str
    lat: float
    lng: float
    priority: Literal["GREEN", "YELLOW", "RED"]


class OptimizeRequest(BaseModel):
    start_point: LatLng
    points: list[OptimizePoint] = Field(default_factory=list)


class OptimizeResponse(BaseModel):
    optimizedOrder: list[str]


app = FastAPI(title="Logistics route optimizer", version="1.0.0")


def _safe_matrix_value(matrix: list[list[float | None]], i: int, j: int) -> float:
    if i < 0 or j < 0 or i >= len(matrix) or j >= len(matrix[i]):
        return math.inf
    v = matrix[i][j]
    if v is None:
        return math.inf
    return float(v)


def _build_osrm_coordinates(start: LatLng, points: list[OptimizePoint]) -> str:
    parts = [f"{start.lng},{start.lat}"]
    for p in points:
        parts.append(f"{p.lng},{p.lat}")
    return ";".join(parts)


async def _fetch_osrm_matrix(start: LatLng, points: list[OptimizePoint]) -> list[list[float | None]]:
    coord_path = _build_osrm_coordinates(start, points)
    url = f"{OSRM_TABLE_BASE}/{coord_path}"
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"OSRM request failed with status {response.status_code}",
        )
    body: dict[str, Any] = response.json()
    if body.get("code") != "Ok":
        raise HTTPException(status_code=502, detail=f"OSRM error: {body.get('message', body)}")
    distances = body.get("distances")
    if not isinstance(distances, list) or not distances:
        durations = body.get("durations")
        if not isinstance(durations, list) or not durations:
            raise HTTPException(status_code=502, detail="OSRM response missing distance matrix")
        return durations  # type: ignore[return-value]
    return distances  # type: ignore[return-value]


def _greedy_priority_order(
    matrix: list[list[float | None]],
    points: list[OptimizePoint],
) -> list[str]:
    """
    Index 0 = start. Indices 1..n map to points[0]..points[n-1].
    Visit all RED, then YELLOW, then GREEN; within each tier pick nearest neighbor from current index.
    """
    n = len(points)
    if n == 0:
        return []

    unvisited: set[int] = set(range(1, n + 1))
    current = 0
    ordered_ids: list[str] = []

    while unvisited:
        picked: int | None = None
        for tier in PRIORITY_TIERS:
            candidates = [
                idx
                for idx in unvisited
                if points[idx - 1].priority == tier
            ]
            if not candidates:
                continue
            best = min(
                candidates,
                key=lambda idx: _safe_matrix_value(matrix, current, idx),
            )
            picked = best
            break

        if picked is None:
            break

        ordered_ids.append(points[picked - 1].id)
        unvisited.remove(picked)
        current = picked

    return ordered_ids


@app.post("/optimize", response_model=OptimizeResponse)
async def optimize(body: OptimizeRequest) -> OptimizeResponse:
    if not body.points:
        return OptimizeResponse(optimizedOrder=[])

    try:
        matrix = await _fetch_osrm_matrix(body.start_point, body.points)
    except HTTPException:
        raise
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"OSRM HTTP error: {exc}") from exc

    expected = len(body.points) + 1
    if len(matrix) != expected or any(len(row) != expected for row in matrix):
        raise HTTPException(status_code=502, detail="Unexpected OSRM matrix shape")

    ordered = _greedy_priority_order(matrix, body.points)
    return OptimizeResponse(optimizedOrder=ordered)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
