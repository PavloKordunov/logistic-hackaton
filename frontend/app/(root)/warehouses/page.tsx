"use client";
import { Warehouse, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Warehouse {
  id: string;
  name: string;
  city: string;
  region: string;
  Resource: { name: string; quantity: string }[];
}

const WarehousesPage = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllWarehouses = async () => {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/warehouses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setWarehouses(data);
      setIsLoading(false);
    };
    getAllWarehouses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 rounded-full border-white/10 border-t-military-orange animate-spin" />
          <span className="text-sm text-slate-500 font-mono">
            Завантаження...
          </span>
        </div>
      </div>
    );
  }
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
        {warehouses?.map((w, idx) => (
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
                  {`W-0${idx + 1}`}
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
                {w.Resource.map((res, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-military-gray/50 p-3 notched-corner border border-white/5"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {res.name}
                    </span>
                    <span className="text-xs font-black text-white font-mono">
                      {res.quantity}
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
