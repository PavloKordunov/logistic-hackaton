"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useState, useEffect } from "react";
import { Brigade, Priority, RouteInfo, Truck, Warehouse } from "./MapWrapper";

interface MapComponentProps {
  warehouses: Warehouse[];
  brigades: Brigade[];
  trucks: Truck[];
  routes: RouteInfo[];
}

const UI_COLORS = {
  ORANGE: "#FF9900",
  RED: "#FF1111",
  GREEN: "#11CC11",
  BLUE: "#0066FF",
  DARK_BG: "#111111",
  DARK_BORDER: "#222222",
};

const createWarehouseIcon = (w: Warehouse) =>
  new L.DivIcon({
    className: "bg-transparent",
    html: `
        <div style="width: 40px; height: 40px; background-color: ${UI_COLORS.DARK_BG}; border: 1px solid ${UI_COLORS.DARK_BORDER}; display: flex; align-items: center; justify-content: center; position: relative;" class="ui-cut-sm shadow-lg">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background-color: ${UI_COLORS.BLUE};"></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${UI_COLORS.BLUE}" stroke-width="2" stroke-linecap="square">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createBrigadeIcon = (b: Brigade) => {
  const color =
    b.priority === "RED"
      ? UI_COLORS.RED
      : b.priority === "YELLOW"
        ? UI_COLORS.ORANGE
        : UI_COLORS.GREEN;
  const pulseClass = b.priority === "RED" ? "animate-pulse" : "";

  return new L.DivIcon({
    className: "bg-transparent",
    html: `
            <div style="width: 32px; height: 32px; background-color: ${UI_COLORS.DARK_BG}; border: 1px solid ${UI_COLORS.DARK_BORDER}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color}40;" class="ui-cut-sm ${pulseClass}">
                <div style="width: 12px; height: 12px; background-color: ${color};"></div>
            </div>
        `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createTruckIcon = (truck: Truck) => {
  const isIdle = truck.status === "IDLE";
  const color = isIdle ? "#666666" : UI_COLORS.ORANGE;

  return new L.DivIcon({
    className: "bg-transparent",
    html: `
            <div style="width: 40px; height: 40px; background-color: ${UI_COLORS.DARK_BG}; border: 1px solid ${UI_COLORS.DARK_BORDER}; display: flex; align-items: center; justify-content: center; position: relative;" class="ui-cut-sm">
                ${!isIdle ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background-color: ${color};"></div>` : ""}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="square">
                    <path d="M10 17h4V5H2v12h3"></path><path d="M20 17h2v-9h-5v9h2"></path>
                    <path d="M2 12h18"></path><circle cx="8.5" cy="17.5" r="2.5"></circle>
                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
            </div>
        `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="military-cluster-inner"><span>${count}</span></div>`,
    className: "military-cluster",
    iconSize: [40, 40],
  });
};

const MapComponent = ({
  warehouses,
  brigades,
  trucks,
  routes,
}: MapComponentProps) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [realRoutes, setRealRoutes] = useState<
    { id: string; coords: [number, number][] }[]
  >([]);
  const defaultCenter: [number, number] = [48.3794, 31.1656];

  useEffect(() => {
    if (routes.length === 0) return;

    const fetchRealRoads = async () => {
      const fetchedRoutes = await Promise.all(
        routes.map(async (route) => {
          const start = route.coordinates[0];
          const end = route.coordinates[route.coordinates.length - 1];

          try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
              const roadCoords = data.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]],
              );
              return { id: route.id, coords: roadCoords };
            }
          } catch (error) {
            console.error("Помилка OSRM:", error);
          }
          return { id: route.id, coords: route.coordinates };
        }),
      );
      console.log("Отримані реальні маршрути:", fetchedRoutes);
      setRealRoutes(fetchedRoutes);
    };
    fetchRealRoads();
  }, [routes]);

  return (
    <div className="relative">
      <div className="border border-[#222222] p-1 bg-[#0a0a0a]">
        <MapContainer
          center={defaultCenter}
          zoom={6}
          className="h-[380px] sm:h-[500px] lg:h-[600px] w-full z-0 bg-[#0a0a0a]"
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="© CARTO"
          />

          {realRoutes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.coords}
              color={UI_COLORS.ORANGE}
              weight={2}
              dashArray="6, 8"
              className="animate-route-dash"
            />
          ))}

          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterIcon}
            showCoverageOnHover
            spiderfyOnMaxZoom={false}
          >
            {warehouses.map((w) => (
              <Marker
                key={w.id}
                position={[w.lat, w.lng]}
                icon={createWarehouseIcon(w)}
              >
                <Popup className="custom-popup" offset={[0, -10]}>
                  <div className="ui-cut bg-[#0a0a0a] border border-[#222] w-[260px] relative font-mono text-white p-4 pl-5">
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "4px",
                        height: "100%",
                        backgroundColor: UI_COLORS.BLUE,
                      }}
                    ></div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2">
                      <span>#{w.id}</span>
                      <span
                        style={{ backgroundColor: UI_COLORS.BLUE }}
                        className="text-black px-1.5 py-0.5 font-bold"
                      >
                        ХАБ
                      </span>
                    </div>
                    <h3 className="font-bold text-sm tracking-wider uppercase mb-1">
                      {w.name}
                    </h3>
                    <p className="text-xs text-gray-400 uppercase">
                      ЗАПОВНЕНІСТЬ: 78%
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {brigades.map((b) => {
              const priorityColor =
                b.priority === "RED"
                  ? UI_COLORS.RED
                  : b.priority === "YELLOW"
                    ? UI_COLORS.ORANGE
                    : UI_COLORS.GREEN;

              return (
                <Marker
                  key={b.id}
                  position={[b.lat, b.lng]}
                  icon={createBrigadeIcon(b)}
                >
                  <Popup className="custom-popup" offset={[0, -10]}>
                    <div className="ui-cut bg-[#0a0a0a] border border-[#222] w-[260px] relative font-mono text-white p-4 pl-5">
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "4px",
                          height: "100%",
                          backgroundColor: priorityColor,
                        }}
                      ></div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2">
                        <span>#{b.id}</span>
                        <span
                          style={{ backgroundColor: priorityColor }}
                          className="text-black px-1.5 py-0.5 font-bold"
                        >
                          {b.priority}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm tracking-wider uppercase mb-1">
                        {b.name}
                      </h3>
                      <p className="text-xs text-gray-400 uppercase mb-5">
                        {b.needs}
                      </p>
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                        <span
                          className={
                            b.priority === "RED"
                              ? "text-red-500 animate-pulse"
                              : "text-gray-600"
                          }
                        >
                          {b.priority === "RED" ? "КРИТИЧНО" : "ОНОВЛЕНО"}
                        </span>
                        <button
                          style={{ color: UI_COLORS.ORANGE }}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          REROUTE &rarr;
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {trucks.map((t) => {
              const isActive = t.status === "ACTIVE";
              const statusColor = isActive ? UI_COLORS.ORANGE : "#666666";

              return (
                <Marker
                  key={t.id}
                  position={[t.lat, t.lng]}
                  icon={createTruckIcon(t)}
                >
                  <Popup className="custom-popup" offset={[0, -10]}>
                    <div className="ui-cut bg-[#0a0a0a] border border-[#222] w-[220px] relative font-mono text-white p-4 pl-5">
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "4px",
                          height: "100%",
                          backgroundColor: statusColor,
                        }}
                      ></div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-2">
                        <span>БОРТ #{t.id}</span>
                      </div>
                      <h3 className="font-bold text-sm tracking-wider uppercase mb-1">
                        {isActive ? `МАРШРУТ ${t.routeId}` : "ПРОСТІЙ"}
                      </h3>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
