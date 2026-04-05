"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  Route,
  ShieldAlert,
  Package,
  MapPin,
} from "lucide-react";

const BRIGADES_LIST = [
  "3-тя Окрема Штурмова",
  "47-ма Окрема Механізована",
  "93-тя Холодний Яр",
  "80-та Окрема ДШВ",
  "1-ша Окрема Танкова",
  "24-та Короля Данила",
];

type Resource = {
  id: string;
  name: string;
  quantity: string;
};

type Destination = {
  id: string;
  brigade: string;
  priority: "GREEN" | "YELLOW" | "RED";
  resources: Resource[];
};

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (routeData: Destination[]) => void;
}

const CreateRouteModal: React.FC<CreateRouteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: crypto.randomUUID(),
      brigade: "",
      priority: "GREEN",
      resources: [{ id: crypto.randomUUID(), name: "", quantity: "" }],
    },
  ]);

  if (!isOpen) return null;

  const addDestination = () => {
    setDestinations([
      ...destinations,
      {
        id: crypto.randomUUID(),
        brigade: "",
        priority: "GREEN",
        resources: [{ id: crypto.randomUUID(), name: "", quantity: "" }],
      },
    ]);
  };

  const removeDestination = (id: string) => {
    setDestinations(destinations.filter((d) => d.id !== id));
  };

  const updateDestination = (
    id: string,
    field: keyof Destination,
    value: any,
  ) => {
    setDestinations(
      destinations.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    );
  };

  const addResource = (destId: string) => {
    setDestinations(
      destinations.map((d) => {
        if (d.id === destId) {
          return {
            ...d,
            resources: [
              ...d.resources,
              { id: crypto.randomUUID(), name: "", quantity: "" },
            ],
          };
        }
        return d;
      }),
    );
  };

  const removeResource = (destId: string, resourceId: string) => {
    setDestinations(
      destinations.map((d) => {
        if (d.id === destId) {
          return {
            ...d,
            resources: d.resources.filter((r) => r.id !== resourceId),
          };
        }
        return d;
      }),
    );
  };

  const updateResource = (
    destId: string,
    resourceId: string,
    field: keyof Resource,
    value: string,
  ) => {
    setDestinations(
      destinations.map((d) => {
        if (d.id === destId) {
          return {
            ...d,
            resources: d.resources.map((r) =>
              r.id === resourceId ? { ...r, [field]: value } : r,
            ),
          };
        }
        return d;
      }),
    );
  };

  const handleSave = () => {
    onSubmit(destinations);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 notched-corner max-h-[90vh] flex flex-col shadow-2xl shadow-military-orange/5"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-military-orange/10 text-military-orange notched-corner">
              <Route size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                Формування рейсу
              </h2>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Комплексний маршрут постачання
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/10 transition-colors notched-corner"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <AnimatePresence>
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                className="military-panel notched-corner p-6 border-l-4 relative group"
                style={{
                  borderLeftColor:
                    dest.priority === "RED"
                      ? "#ef4444"
                      : dest.priority === "YELLOW"
                        ? "#f59e0b"
                        : "#10b981",
                }}
              >
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-white/5 px-3 py-1 notched-corner text-slate-400 uppercase tracking-widest">
                      Точка скиду {index + 1}
                    </span>
                  </div>
                  {destinations.length > 1 && (
                    <button
                      onClick={() => removeDestination(dest.id)}
                      className="text-slate-500 hover:text-red-500 transition-colors"
                      title="Видалити точку"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Вибір бригади та пріоритету */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <MapPin size={12} /> Підрозділ / Бригада
                    </label>
                    <select
                      value={dest.brigade}
                      onChange={(e) =>
                        updateDestination(dest.id, "brigade", e.target.value)
                      }
                      className="w-full bg-military-gray/50 border border-white/10 text-white p-3 outline-none focus:border-military-orange notched-corner text-sm font-bold uppercase appearance-none"
                    >
                      <option value="" disabled>
                        Оберіть бригаду...
                      </option>
                      {BRIGADES_LIST.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <ShieldAlert size={12} /> Пріоритет
                    </label>
                    <div className="flex gap-2">
                      {(["GREEN", "YELLOW", "RED"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() =>
                            updateDestination(dest.id, "priority", p)
                          }
                          className={`
                            flex-1 py-3 text-[10px] font-black uppercase tracking-widest notched-corner transition-all border
                            ${
                              dest.priority === p
                                ? p === "RED"
                                  ? "bg-red-600/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                  : p === "YELLOW"
                                    ? "bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                    : "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                : "bg-military-gray border-white/5 text-slate-600 hover:bg-white/5"
                            }
                          `}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-black/30 p-4 notched-corner border border-white/5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Package size={12} /> Вантаж (Ресурси)
                  </h4>

                  <div className="space-y-3">
                    {dest.resources.map((res, rIndex) => (
                      <div key={res.id} className="flex gap-3 items-start">
                        <input
                          type="text"
                          placeholder="Назва (напр. Турнікети СІЧ)"
                          value={res.name}
                          onChange={(e) =>
                            updateResource(
                              dest.id,
                              res.id,
                              "name",
                              e.target.value,
                            )
                          }
                          className="flex-1 bg-military-gray/80 border border-white/10 text-white p-2.5 outline-none focus:border-military-orange notched-corner text-xs font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Кількість (напр. 120 шт)"
                          value={res.quantity}
                          onChange={(e) =>
                            updateResource(
                              dest.id,
                              res.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                          className="w-1/3 bg-military-gray/80 border border-white/10 text-white p-2.5 outline-none focus:border-military-orange notched-corner text-xs font-mono font-bold"
                        />
                        <button
                          onClick={() => removeResource(dest.id, res.id)}
                          disabled={dest.resources.length === 1}
                          className="p-3 bg-military-gray/80 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors notched-corner disabled:opacity-30 disabled:hover:text-slate-500 border border-transparent hover:border-red-500/30"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addResource(dest.id)}
                    className="mt-4 flex items-center gap-2 text-[10px] font-black text-military-orange uppercase tracking-widest hover:text-white transition-colors"
                  >
                    <Plus size={14} /> Додати ще ресурс
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={addDestination}
            className="w-full py-6 border-2 border-dashed border-white/10 hover:border-military-orange/50 bg-white/[0.02] hover:bg-military-orange/5 transition-all text-slate-400 hover:text-military-orange flex flex-col items-center justify-center gap-2 notched-corner group"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-military-orange/20 transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Додати наступну точку маршруту
            </span>
          </button>
        </div>

        <div className="p-6 border-t border-white/10 bg-military-gray/30 flex justify-end gap-4 mt-auto">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-transparent text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Відмінити
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-military-orange hover:bg-[#ffb033] text-black text-xs font-black uppercase tracking-[0.2em] notched-button shadow-[0_0_20px_rgba(255,157,0,0.2)] transition-all flex items-center gap-2"
          >
            <Route size={16} /> Сформувати рейс
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRouteModal;
