"use client";

import {
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
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
  return (
    <div className="flex-1 overflow-y-auto p-10 space-y-10 relative z-10">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      <section className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-6 military-panel notched-corner p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">
              Динаміка пріоритетів (6г)
            </h3>
            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest">
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
          <div className="h-[320px] w-full">
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

        <div className="lg:col-span-4 military-panel notched-corner p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">
              Прогноз пального
            </h3>
            <RefreshCw
              size={16}
              className="text-slate-600 cursor-pointer hover:text-military-orange transition-colors"
            />
          </div>
          <div className="h-[320px] w-full">
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

      <section className="grid grid-cols-1 lg:grid-cols-10 gap-8 pb-10">
        <div className="lg:col-span-7 military-panel notched-corner relative overflow-hidden h-[550px] bg-black">
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
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">
              Активні Завдання
            </h3>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
              Count: 42
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
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
