"use client";
import { Warehouse, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const warehouses = [
  {
    id: "W-01",
    name: 'Склад "Північ-1"',
    city: "Харків",
    region: "Харківська обл.",
    reserves: [
      { label: "Пальне", value: "2,400 л" },
      { label: "Турнікети", value: "450 шт" },
      { label: "Медикаменти", value: "120 ящ" },
      { label: "Генератори", value: "8 шт" },
      { label: "БК 155мм", value: "200 од" },
      { label: "Сухпайки", value: "1,500 шт" },
    ],
  },
  {
    id: "W-02",
    name: 'Логістичний Хаб "Дніпро"',
    city: "Дніпро",
    region: "Дніпропетровська обл.",
    reserves: [
      { label: "Пальне", value: "8,200 л" },
      { label: "Турнікети", value: "1,200 шт" },
      { label: "Медикаменти", value: "400 ящ" },
      { label: "Генератори", value: "24 шт" },
      { label: "Запчастини", value: "15 компл" },
      { label: "Зв’язок", value: "12 од" },
    ],
  },
  {
    id: "W-03",
    name: 'Склад "Схід-4"',
    city: "Краматорськ",
    region: "Донецька обл.",
    reserves: [
      { label: "Пальне", value: "1,100 л" },
      { label: "Турнікети", value: "180 шт" },
      { label: "Медикаменти", value: "45 ящ" },
      { label: "Генератори", value: "3 шт" },
      { label: "БК 122мм", value: "80 од" },
    ],
  },
  {
    id: "W-04",
    name: 'Резервний Склад "Захід"',
    city: "Львів",
    region: "Львівська обл.",
    reserves: [
      { label: "Пальне", value: "15,000 л" },
      { label: "Турнікети", value: "5,000 шт" },
      { label: "Медикаменти", value: "1,200 ящ" },
      { label: "Генератори", value: "50 шт" },
      { label: "Форма", value: "2,000 к-т" },
      { label: "Взуття", value: "1,500 пар" },
    ],
  },
  {
    id: "W-05",
    name: 'Склад "Південь-2"',
    city: "Миколаїв",
    region: "Миколаївська обл.",
    reserves: [
      { label: "Пальне", value: "400 л" },
      { label: "Турнікети", value: "50 шт" },
      { label: "Медикаменти", value: "12 ящ" },
      { label: "Генератори", value: "1 шт" },
    ],
  },
  {
    id: "W-06",
    name: "Центральний Склад",
    city: "Київ",
    region: "Київська обл.",
    reserves: [
      { label: "Пальне", value: "5,500 л" },
      { label: "Турнікети", value: "2,100 шт" },
      { label: "Медикаменти", value: "600 ящ" },
      { label: "Генератори", value: "15 шт" },
      { label: "Рації", value: "45 од" },
      { label: "Дрони", value: "20 од" },
    ],
  },
];

const WarehousesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-y-auto p-10 custom-scrollbar"
    >
      <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            Склади Резервів
          </h2>
          <span className="text-[10px] font-black text-military-orange uppercase tracking-[0.2em]">
            Моніторинг стратегічних запасів
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
              Всього об'єктів
            </span>
            <span className="text-xl font-black text-white font-mono">
              {warehouses.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {warehouses.map((w, idx) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="military-panel notched-corner p-8 border-l-4 border-military-orange group hover:bg-white/5 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                  {w.id}
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight mt-1">
                  {w.name}
                </h3>
              </div>
              <Warehouse
                size={24}
                className="text-military-orange/30 group-hover:text-military-orange transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-military-orange" />
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  {w.city}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-5">
                {w.region}
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2 mb-4">
                Резерви на складі
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {w.reserves.map((res, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-military-gray/50 p-3 notched-corner border border-white/5"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {res.label}
                    </span>
                    <span className="text-xs font-black text-white font-mono">
                      {res.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WarehousesPage;
