import MapWrapper from "@/components/map/MapWrapper";

import {
  Warehouse,
  Brigade,
  Truck,
  RouteInfo,
} from "@/components/map/MapWrapper";

export const mockWarehouses: Warehouse[] = [
  {
    id: "W-01",
    name: "Центральний Хаб (Київ)",
    lat: 50.4501,
    lng: 30.5234,
  },
  {
    id: "W-02",
    name: "Південний Хаб (Дніпро)",
    lat: 48.4647,
    lng: 35.0462,
  },
];

export const mockBrigades: Brigade[] = [
  {
    id: "B-93",
    name: "93-тя ОМБр",
    priority: "GREEN",
    needs: "Провізія, вода",
    lat: 48.739,
    lng: 37.5843,
  },
  {
    id: "B-47",
    name: "47-ма ОМБр",
    priority: "YELLOW",
    needs: "Боєприпаси 155мм, дрони",
    lat: 48.282,
    lng: 37.1828,
  },
  {
    id: "B-82",
    name: "82-га ОДШБр",
    priority: "RED",
    needs: "Турнікети, евакуація",
    lat: 48.5878,
    lng: 37.8385,
  },
];

export const mockRoutes: RouteInfo[] = [
  {
    id: "R-101",
    coordinates: [
      [48.4647, 35.0462],
      [48.35, 36.1],
      [48.282, 37.1828],
    ],
  },
  {
    id: "R-102",
    coordinates: [
      [50.4501, 30.5234],
      [49.5883, 34.5514],
      [48.739, 37.5843],
    ],
  },
];

export const mockTrucks: Truck[] = [
  {
    id: "T-001",
    routeId: "R-101",
    status: "ACTIVE",
    lat: 48.35,
    lng: 36.1,
  },
  {
    id: "T-002",
    routeId: "R-102",
    status: "ACTIVE",
    lat: 49.5883,
    lng: 34.5514,
  },
  {
    id: "T-003",
    status: "IDLE",
    lat: 48.8756,
    lng: 35.0462,
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#050505] p-6 font-mono text-white selection:bg-[#FF9900] selection:text-black">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header className="flex justify-between items-end border-b border-[#222222] pb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-[#FF9900] ui-cut-sm flex items-center justify-center text-black font-bold text-xl">
                R
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-widest text-[#FF9900]">
                Resilog<span className="text-white">_Front UA</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[#666666] text-[10px] uppercase tracking-widest mt-2 font-bold">
              <span>Головна</span>
              <span>&gt;</span>
              <span className="text-white">Оперативний дашборд</span>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <div className="text-right border-r border-[#222222] pr-6">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Система
              </div>
              <div className="text-[#FF9900] text-sm font-bold uppercase flex items-center gap-2 justify-end">
                <span className="w-2 h-2 bg-[#FF9900] inline-block"></span>
                Algo_Online
              </div>
            </div>

            <div className="ui-cut-sm bg-[#FF1111] text-white px-5 py-2.5 text-xs font-bold flex items-center gap-3 uppercase tracking-widest cursor-pointer hover:bg-red-600 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 bg-white"></span>
              </span>
              Критичних запитів: 1
            </div>
          </div>
        </header>

        <div className="bg-[#0a0a0a] p-1 border border-[#222222] relative ui-cut shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF9900] -translate-x-[1px] -translate-y-[1px] z-10"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF9900] translate-x-[1px] translate-y-[1px] z-10"></div>

          <MapWrapper
            warehouses={mockWarehouses}
            brigades={mockBrigades}
            trucks={mockTrucks}
            routes={mockRoutes}
          />
        </div>
      </div>
    </main>
  );
}
