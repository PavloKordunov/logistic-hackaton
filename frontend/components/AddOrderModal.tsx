"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  Route,
  ShieldAlert,
  Package,
  MapPin,
  Loader2,
} from "lucide-react";

type Brigade = {
  id: string;
  name: string;
  location?: { lat: number; lng: number };
};

type Resource = {
  id: string;
  name: string;
  quantity: string;
};

type Destination = {
  id: string;
  brigadeId: string;
  priority: "GREEN" | "YELLOW" | "RED";
  resources: Resource[];
};

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (routeData: Destination[]) => void;
}

const MOCK_RESOURCES = [
  "Аптечки (IFAK)",
  "Зимова форма",
  "Термінали Starlink",
  "Сухпайки (MRE)",
  "FPV-дрони",
];

const CreateRouteModal: React.FC<CreateRouteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: crypto.randomUUID(),
      brigadeId: "",
      priority: "GREEN",
      resources: [{ id: crypto.randomUUID(), name: "", quantity: "" }],
    },
  ]);

  const [brigadesList, setBrigadesList] = useState<Brigade[]>([]);
  const [isLoadingBrigades, setIsLoadingBrigades] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      const fetchBrigades = async () => {
        setIsLoadingBrigades(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${baseUrl}/brigades`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Не вдалося завантажити список бригад");
          }

          const data = await response.json();
          setBrigadesList(data);
        } catch (err: any) {
          console.error("Помилка завантаження бригад:", err);
          setError("Помилка завантаження списку бригад. Спробуйте пізніше.");
        } finally {
          setIsLoadingBrigades(false);
        }
      };

      fetchBrigades();
    }
  }, [isOpen, baseUrl]);

  if (!isOpen) return null;

  const addDestination = () => {
    setDestinations([
      ...destinations,
      {
        id: crypto.randomUUID(),
        brigadeId: "",
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

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const plans = new Map<
        string,
        { brigadeId: string; quantity: number }[]
      >();

      for (const dest of destinations) {
        if (!dest.brigadeId) continue;

        for (const res of dest.resources) {
          const trimmedName = res.name.trim();
          const quantityNum = parseInt(res.quantity, 10);

          if (!trimmedName || isNaN(quantityNum)) continue;

          const currentTargets = plans.get(trimmedName) || [];
          currentTargets.push({
            brigadeId: dest.brigadeId,
            quantity: quantityNum,
          });

          plans.set(trimmedName, currentTargets);
        }
      }

      if (plans.size === 0) {
        throw new Error(
          "Заповніть хоча б один ресурс з коректною кількістю та виберіть бригаду.",
        );
      }

      const token = localStorage.getItem("token");

      const requests = Array.from(plans.entries()).map(
        ([resourceName, targets]) => {
          return fetch(`${baseUrl}/routes/auto-plan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              resourceName,
              targets,
            }),
          });
        },
      );

      const responses = await Promise.all(requests);

      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              "Сталася помилка при формуванні рейсу на сервері.",
          );
        }
      }

      onSubmit(destinations);
      onClose();
    } catch (err: any) {
      setError(err.message || "Помилка сервера");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 notched-corner max-h-[96vh] sm:max-h-[90vh] flex flex-col shadow-2xl shadow-military-orange/5"
      >
        <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/[0.02] gap-3">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-military-orange/10 text-military-orange notched-corner">
              <Route size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter italic">
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

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar">
          {error && (
            <div className="p-4 mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/50 notched-corner">
              {error}
            </div>
          )}

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <MapPin size={12} /> Підрозділ / Бригада
                    </label>
                    <select
                      value={dest.brigadeId}
                      onChange={(e) =>
                        updateDestination(dest.id, "brigadeId", e.target.value)
                      }
                      disabled={isLoadingBrigades}
                      className="w-full bg-military-gray/50 border border-white/10 text-white p-3 outline-none focus:border-military-orange notched-corner text-sm font-bold uppercase appearance-none disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {isLoadingBrigades
                          ? "Завантаження бригад..."
                          : "Оберіть бригаду..."}
                      </option>
                      {brigadesList.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <ShieldAlert size={12} /> Пріоритет
                    </label>
                    <div className="grid grid-cols-3 gap-2">
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
                      <div
                        key={res.id}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-start"
                      >
                        <select
                          value={res.name}
                          onChange={(e) =>
                            updateResource(
                              dest.id,
                              res.id,
                              "name",
                              e.target.value,
                            )
                          }
                          className="flex-1 bg-military-gray/80 border border-white/10 text-white p-2.5 outline-none focus:border-military-orange notched-corner text-xs font-bold appearance-none"
                        >
                          <option value="" disabled>
                            Оберіть ресурс...
                          </option>
                          {MOCK_RESOURCES.map((resource) => (
                            <option key={resource} value={resource}>
                              {resource}
                            </option>
                          ))}
                        </select>
                        <input
                          type="string"
                          placeholder="Кількість (напр. 120)"
                          value={res.quantity}
                          min="1"
                          onChange={(e) =>
                            updateResource(
                              dest.id,
                              res.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                          className="w-full bg-military-gray/80 border border-white/10 text-white p-2.5 outline-none focus:border-military-orange notched-corner text-xs font-mono font-bold"
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

        <div className="p-4 sm:p-6 border-t border-white/10 bg-military-gray/30 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-auto">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 sm:px-8 py-3 bg-transparent text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            Відмінити
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting || isLoadingBrigades}
            className="px-6 sm:px-8 py-3 bg-military-orange hover:bg-[#ffb033] text-black text-xs font-black uppercase tracking-[0.2em] notched-button shadow-[0_0_20px_rgba(255,157,0,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Route size={16} />
            )}
            {isSubmitting ? "Формування..." : "Сформувати рейс"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRouteModal;
