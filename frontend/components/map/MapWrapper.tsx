"use client";

import dynamic from "next/dynamic";

export type Priority = "GREEN" | "YELLOW" | "RED";

export interface Warehouse {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Brigade {
  id: string;
  name: string;
  priority: Priority;
  needs: string;
  lat: number;
  lng: number;
}

export interface Truck {
  id: string;
  routeId?: string;
  status: "ACTIVE" | "IDLE";
  lat: number;
  lng: number;
}

export interface RouteInfo {
  id: string;
  coordinates: [number, number][];
}

interface MapWrapperProps {
  warehouses: Warehouse[];
  brigades: Brigade[];
  trucks: Truck[];
  routes: RouteInfo[];
}

const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-[#1a1a1a] animate-pulse rounded-3xl flex items-center justify-center text-gray-500 border border-gray-800">
      Завантаження тактичної мапи...
    </div>
  ),
});

const MapWrapper = (props: MapWrapperProps) => {
  return <MapWithNoSSR {...props} />;
};

export default MapWrapper;
