"use client";

import { TrendingUp, TrendingDown, ArrowRight, RefreshCw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import MapWrapper from "@/components/map/MapWrapper";

import {
  Warehouse,
  Brigade,
  Truck,
  RouteInfo,
} from "@/components/map/MapWrapper";
import { useEffect, useState } from "react";

const priorityData = [
  { name: "12:00", green: 40, yellow: 24, red: 10 },
  { name: "13:00", green: 30, yellow: 13, red: 22 },
  { name: "14:00", green: 20, yellow: 38, red: 15 },
  { name: "15:00", green: 27, yellow: 39, red: 18 },
  { name: "16:00", green: 18, yellow: 48, red: 25 },
  { name: "17:00", green: 23, yellow: 38, red: 30 },
];

const fuelData = [
  { time: "00:00", actual: 420, forecast: 420 },
  { time: "04:00", actual: 450, forecast: 460 },
  { time: "08:00", actual: 480, forecast: 490 },
  { time: "12:00", actual: 470, forecast: 485 },
  { time: "16:00", actual: 487, forecast: 500 },
  { time: "20:00", forecast: 510 },
  { time: "23:59", forecast: 525 },
];

const orders = [
  {
    id: "#4782",
    unit: "2-га Механізована",
    type: "Турнікети 120 шт.",
    time: "11 хв тому",
    priority: "RED",
  },
  {
    id: "#4780",
    unit: "93-тя Холодний Яр",
    type: "БК 155мм (40 од)",
    time: "1 год тому",
    priority: "GREEN",
  },
  {
    id: "#4778",
    unit: "3-тя Штурмова",
    type: "Медикаменти",
    time: "3 год тому",
    priority: "RED",
  },
  {
    id: "#4777",
    unit: "80-та ДШВ",
    type: "Рації Motorola",
    time: "5 год тому",
    priority: "GREEN",
  },
];

export const mockWarehouses: Warehouse[] = [
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

const KPICard = ({
  title,
  value,
  trend,
  trendType,
  color,
}: {
  title: string;
  value: string;
  trend?: string;
  trendType?: "up" | "down";
  color?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="military-panel notched-corner p-6 flex flex-col gap-3 relative border-l-4"
    style={{
      borderLeftColor:
        color === "text-red-500"
          ? "#ef4444"
          : color === "text-amber-500"
            ? "#f59e0b"
            : "#ff9d00",
    }}
  >
    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
      {title}
    </span>
    <div className="flex items-end justify-between">
      <span
        className={`
          text-4xl font-black tracking-tighter
          ${color || "text-white"}
        `}
      >
        {value}
      </span>
      {trend && (
        <div
          className={`
            flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1
            ${trendType === "up" ? "text-military-orange" : "text-red-500"}
          `}
        >
          {trendType === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {trend}
        </div>
      )}
    </div>
  </motion.div>
);

export default function App() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [brigades, setBrigades] = useState<Brigade[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [brigadesRes, warehousesRes, trucksRes, routesRes] =
          await Promise.all([
            fetch(`${BASE_URL}/brigades`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${BASE_URL}/warehouses`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${BASE_URL}/vehicles`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${BASE_URL}/routes`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (
          !brigadesRes.ok ||
          !warehousesRes.ok ||
          !trucksRes.ok ||
          !routesRes.ok
        ) {
          throw new Error("Помилка завантаження даних з сервера");
        }

        const brigadesData = await brigadesRes.json();
        const warehousesData = await warehousesRes.json();
        const trucksData = await trucksRes.json();
        const routesData = await routesRes.json();

        const formattedBrigades = brigadesData.map((b: any, idx: number) => {
          let formattedNeeds = "Невідомі потреби";

          if (Array.isArray(b.needs)) {
            formattedNeeds =
              b.needs.length > 0
                ? b.needs.join(", ")
                : "Немає нагальних потреб";
          } else if (typeof b.needs === "string") {
            formattedNeeds = b.needs;
          }

          return {
            id: `B-0${idx + 1}`,
            name: b.name,
            priority: b.priority || "GREEN",
            needs: formattedNeeds,
            lat: b.lat,
            lng: b.lng,
          };
        });

        const formattedWarehouses = warehousesData.map(
          (w: any, idx: number) => ({
            id: `W-0${idx + 1}`,
            name: w.name,
            lat: w.lat,
            lng: w.lng,
          }),
        );

        const formattedTrucks = trucksData.map((t: any, idx: number) => ({
          id: `T-0${idx + 1}`,
          status: t.status,
          lat: t.lat,
          lng: t.lng,
        }));

        setBrigades(formattedBrigades);
        setWarehouses(formattedWarehouses);
        setTrucks(formattedTrucks);
        setRoutes(routesData);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Brigades:", brigades);
    console.log("Warehouses:", warehouses);
    console.log("Trucks:", trucks);
  }, [brigades, warehouses, trucks]);
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-8 lg:space-y-10 relative z-10">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <KPICard
          title="Активні маршрути"
          value="12"
          trend="+2"
          trendType="up"
        />
        <KPICard
          title="Бригади в RED"
          value="04"
          trend="КРИТИЧНО"
          trendType="down"
          color="text-red-500"
        />
        <KPICard
          title="Витрата пального"
          value="487K"
          trend="+12%"
          trendType="up"
        />
        <KPICard
          title="Фур у простої"
          value="07"
          trend="-3"
          trendType="up"
          color="text-amber-500"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-6 military-panel notched-corner p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">
              Динаміка пріоритетів (6г)
            </h3>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[9px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-military-orange" /> Норма
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500" /> Увага
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500" /> Бойовий
              </div>
            </div>
          </div>
          <div className="h-[260px] sm:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#262626"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#525252"
                  fontSize={10}
                  fontWeight={900}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#525252"
                  fontSize={10}
                  fontWeight={900}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #262626",
                    borderRadius: "0px",
                  }}
                  itemStyle={{
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                />
                <Bar dataKey="green" fill="#ff9d00" barSize={15} />
                <Bar dataKey="yellow" fill="#f59e0b" barSize={15} />
                <Bar dataKey="red" fill="#ef4444" barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 military-panel notched-corner p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">
              Прогноз пального
            </h3>
            <RefreshCw
              size={16}
              className="text-slate-600 cursor-pointer hover:text-military-orange transition-colors"
            />
          </div>
          <div className="h-[260px] sm:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={fuelData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#262626"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#525252"
                  fontSize={10}
                  fontWeight={900}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#525252"
                  fontSize={10}
                  fontWeight={900}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #262626",
                    borderRadius: "0px",
                  }}
                />
                <Line
                  type="stepAfter"
                  dataKey="actual"
                  stroke="#ff9d00"
                  strokeWidth={4}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#404040"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6 lg:gap-8 pb-6 lg:pb-10">
        {/* <div className="lg:col-span-7 military-panel notched-corner relative overflow-hidden h-[550px] bg-black">
          <div className="absolute inset-0 tactical-grid opacity-30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-32 h-32 bg-military-gray notched-corner flex items-center justify-center mb-8 border border-white/10">
              <MapPin size={48} className="text-military-orange" />
            </div>
          </div>

          <div className="absolute bottom-10 left-10 flex items-center gap-10 bg-black/90 px-8 py-4 notched-corner border border-white/10">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <div className="w-3 h-3 bg-military-orange" /> Secure
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <div className="w-3 h-3 bg-amber-500" /> Contested
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <div className="w-3 h-3 bg-red-600" /> Hostile
            </div>
          </div>

          <div className="absolute top-10 right-10 flex flex-col gap-4">
            <div className="p-3 bg-military-gray notched-corner border border-white/10 text-slate-500 hover:text-military-orange cursor-pointer transition-all">
              <RefreshCw size={18} />
            </div>
            <div className="p-3 bg-military-gray notched-corner border border-white/10 text-slate-500 hover:text-military-orange cursor-pointer transition-all font-black text-xs">
              +
            </div>
            <div className="p-3 bg-military-gray notched-corner border border-white/10 text-slate-500 hover:text-military-orange cursor-pointer transition-all font-black text-xs">
              -
            </div>
          </div>
        </div> */}
        <div className="lg:col-span-7 military-panel notched-corner relative overflow-hidden h-[550px] bg-black">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF9900] -translate-x-[1px] -translate-y-[1px] z-10"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF9900] translate-x-[1px] translate-y-[1px] z-10"></div>

          <MapWrapper
            warehouses={warehouses}
            brigades={brigades}
            trucks={trucks}
            routes={routes}
          />
        </div>

        <div
          id="map"
          className="lg:col-span-3 flex flex-col gap-6 overflow-hidden"
        >
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">
              Активні Завдання
            </h3>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
              Count: 42
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 custom-scrollbar max-h-[360px] lg:max-h-none">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="military-panel notched-corner p-5 border-l-4 group hover:bg-white/5 transition-all cursor-pointer"
                style={{
                  borderLeftColor:
                    order.priority === "RED"
                      ? "#ef4444"
                      : order.priority === "YELLOW"
                        ? "#f59e0b"
                        : "#ff9d00",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-mono text-slate-600 font-black tracking-widest">
                    {order.id}
                  </span>
                  <span
                    className={`
                          text-[9px] font-black px-2 py-1 uppercase tracking-widest
                          ${
                            order.priority === "RED"
                              ? "bg-red-600 text-white"
                              : order.priority === "YELLOW"
                                ? "bg-amber-500 text-black"
                                : "bg-military-orange text-black"
                          }
                        `}
                  >
                    {order.priority}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white mb-1 uppercase tracking-tight">
                  {order.unit}
                </h4>
                <p className="text-[10px] text-slate-500 mb-4 font-bold uppercase tracking-wide">
                  {order.type}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                    {order.time}
                  </span>
                  <button className="text-[10px] font-black text-military-orange hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest">
                    Reroute <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
