"use client";

import React, { useState } from "react";
import { MapPin, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const brigades = [
  {
    id: "1",
    name: "3-тя Окрема Штурмова",
    number: "3 ОШБр",
    priority: "RED",
    location: "Бахмутський напрямок",
    demand: 24,
    needs: ["Турнікети: 120", "БК 155мм: 40", "Рації: 15"],
    coordinates: "48.59, 37.99",
  },
  {
    id: "2",
    name: "47-ма Окрема Механізована",
    number: "47 ОМБр",
    priority: "RED",
    location: "Авдіївський напрямок",
    demand: 18,
    needs: ["Запчастини: 12", "Пальне: 800л", "Медикаменти: 5я"],
    coordinates: "48.13, 37.74",
  },
  {
    id: "3",
    name: "93-тя Холодний Яр",
    number: "93 ОМБр",
    priority: "YELLOW",
    location: "Лиманський напрямок",
    demand: 12,
    needs: ["БК 122мм: 20", "Мастило: 50л"],
    coordinates: "49.01, 37.61",
  },
  {
    id: "4",
    name: "80-та Окрема ДШВ",
    number: "80 ОДШБр",
    priority: "GREEN",
    location: "Куп’янський напрямок",
    demand: 8,
    needs: ["Продукти: 200кг", "Вода: 500л"],
    coordinates: "49.71, 37.61",
  },
  {
    id: "5",
    name: "1-ша Окрема Танкова",
    number: "1 ОТБр",
    priority: "YELLOW",
    location: "Запорізький напрямок",
    demand: 15,
    needs: ["Пальне: 1200л", "Акумулятори: 8"],
    coordinates: "47.83, 35.18",
  },
  {
    id: "6",
    name: "24-та Короля Данила",
    number: "24 ОМБр",
    priority: "GREEN",
    location: "Торецький напрямок",
    demand: 5,
    needs: ["Форма: 50к", "Взуття: 30п"],
    coordinates: "48.39, 37.84",
  },
];

const priorityStats = [
  { name: "RED", value: 2, color: "#ef4444" },
  { name: "YELLOW", value: 2, color: "#f59e0b" },
  { name: "GREEN", value: 2, color: "#ff9d00" },
];

const BrigadesPage = () => {
  const [unitFilter, setUnitFilter] = useState<
    "all" | "green" | "yellow" | "red" | "frontline"
  >("all");

  const filteredBrigades = brigades.filter((b) => {
    if (unitFilter === "all") return true;
    if (unitFilter === "green") return b.priority === "GREEN";
    if (unitFilter === "yellow") return b.priority === "YELLOW";
    if (unitFilter === "red") return b.priority === "RED";
    if (unitFilter === "frontline") return b.demand > 15;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto p-10 space-y-10 custom-scrollbar"
    >
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        {[
          { id: "all", label: "Всі" },
          { id: "green", label: "Зелений" },
          { id: "yellow", label: "Жовтий" },
          { id: "red", label: "Червоний" },
          { id: "frontline", label: "Прифронтові" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setUnitFilter(f.id as any)}
            className={`
              px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all notched-button
              ${unitFilter === f.id ? "bg-military-orange text-black" : "text-slate-500 hover:text-white bg-military-gray/50"}
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredBrigades.map((b, idx) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="military-panel notched-corner p-6 border-t-4 group hover:bg-white/5 transition-all relative"
            style={{
              borderTopColor:
                b.priority === "RED"
                  ? "#ef4444"
                  : b.priority === "YELLOW"
                    ? "#f59e0b"
                    : "#ff9d00",
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                  {b.number}
                </span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight mt-1">
                  {b.name}
                </h3>
              </div>
              <div
                className={`
                  w-4 h-4 notched-corner shadow-[0_0_15px_rgba(255,255,255,0.1)]
                  ${
                    b.priority === "RED"
                      ? "bg-red-500 shadow-red-500/50"
                      : b.priority === "YELLOW"
                        ? "bg-amber-500 shadow-amber-500/50"
                        : "bg-military-orange shadow-military-orange/50"
                  }
                `}
              />
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-slate-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {b.location}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp size={14} className="text-slate-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Запитів (24г): <span className="text-white">{b.demand}</span>
                </span>
              </div>
            </div>

            <div className="bg-black/40 p-4 notched-corner border border-white/5 mb-8">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                Критичні Потреби
              </h4>
              <div className="flex flex-wrap gap-2">
                {b.needs.map((need, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-black bg-military-gray px-2 py-1 notched-corner text-white uppercase tracking-widest border border-white/5"
                  >
                    {need}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 py-3 bg-military-gray hover:bg-military-orange hover:text-black text-[10px] font-black uppercase tracking-widest notched-button transition-all flex items-center justify-center gap-2">
                <MapPin size={14} /> На карті
              </button>
              <button
                className={`
                  flex-1 py-3 text-[10px] font-black uppercase tracking-widest notched-button transition-all
                  ${
                    b.priority === "RED"
                      ? "bg-red-600/20 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white"
                      : "bg-military-gray text-slate-400 hover:text-white"
                  }
                `}
              >
                Підняти пріоритет
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="military-panel notched-corner p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">
            Динаміка пріоритетів бригад
          </h3>
          <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-500">
            <span>Оновлено: 2 хв тому</span>
          </div>
        </div>
        <div className="h-[200px] w-full flex items-center justify-center gap-20">
          <div className="h-full w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityStats}
                layout="vertical"
                margin={{ left: -20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#525252"
                  fontSize={10}
                  fontWeight={900}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar dataKey="value" barSize={20}>
                  {priorityStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-10">
            {priorityStats.map((stat) => (
              <div key={stat.name} className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  {stat.name}
                </span>
                <span className="text-3xl font-black text-white font-mono">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrigadesPage;
