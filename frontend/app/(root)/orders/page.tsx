"use client";

import { MapPin, RefreshCw, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// const activeOrders = [
//   {
//     id: "#4782",
//     unit: "2-га Механізована",
//     type: "Турнікети",
//     amount: "120 шт.",
//     time: "11 хв тому",
//     priority: "RED",
//     status: "В дорозі",
//   },
//   {
//     id: "#4781",
//     unit: "1-ша Танкова",
//     type: "Пальне",
//     amount: "800 л",
//     time: "34 хв тому",
//     priority: "YELLOW",
//     status: "Завантажено",
//   },
//   {
//     id: "#4780",
//     unit: "93-тя Холодний Яр",
//     type: "БК 155мм",
//     amount: "40 од",
//     time: "1 год тому",
//     priority: "GREEN",
//     status: "В дорозі",
//   },
//   {
//     id: "#4779",
//     unit: "47-ма Маґура",
//     type: "Запчастини",
//     amount: "12 од",
//     time: "2 год тому",
//     priority: "YELLOW",
//     status: "Завантажено",
//   },
//   {
//     id: "#4778",
//     unit: "3-тя Штурмова",
//     type: "Медикаменти",
//     amount: "5 ящиків",
//     time: "3 год тому",
//     priority: "RED",
//     status: "В дорозі",
//   },
//   {
//     id: "#4777",
//     unit: "80-та ДШВ",
//     type: "Рації",
//     amount: "15 шт.",
//     time: "5 год тому",
//     priority: "GREEN",
//     status: "Завантажено",
//   },
// ];

const OrdersPage = () => {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    "#4782",
  );
  const selectedOrder =
    ordersData.find((o) => o.id === selectedOrderId) || ordersData[0];
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/deliveries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      const data = await res.json();
      setOrdersData(data);
      console.log("Дані замовлень:", data);
    } catch (error) {
      console.error("Деталі помилки:", error);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();

    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return "щойно";
    if (diffInMins < 60) return `${diffInMins} хв. тому`;
    if (diffInHours < 24) return `${diffInHours} год. тому`;
    return `${diffInDays} дн. тому`;
  };

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <button className="px-6 py-2 bg-military-orange text-black text-[10px] font-black uppercase tracking-widest notched-button">
            Активні
          </button>
          {/* <button className="px-6 py-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest relative">
            Нові
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[8px] px-1.5 py-0.5 notched-corner">
              7
            </span>
          </button> */}
          <button className="px-6 py-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest">
            Історія
          </button>
        </div>

        <div className="military-panel notched-corner overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-military-gray border-b border-white/10">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  ID
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Бригада
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Тип вантажу
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Кількість
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Час
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Статус
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ordersData.map((order) => (
                <tr
                  key={order.id}
                  className={`
                              hover:bg-white/5 transition-all cursor-pointer group relative
                              ${selectedOrderId === order.id && "bg-white/5"}
                            `}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <td className="px-6 py-4">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{
                        backgroundColor:
                          order.priority === "RED"
                            ? "#ef4444"
                            : order.priority === "YELLOW"
                              ? "#f59e0b"
                              : "#ff9d00",
                      }}
                    />
                    <span className="text-[10px] font-mono font-black text-slate-400">
                      {order.id.slice(-4)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`
                                  w-2 h-2 notched-corner
                                  ${order.priority === "RED" ? "bg-red-500" : order.priority === "YELLOW" ? "bg-amber-500" : "bg-military-orange"}
                                `}
                      />
                      <span className="text-xs font-black uppercase tracking-tight">
                        {order.Brigade.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-300">
                    {order.Resource.name}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-black text-military-orange">
                    {order.Resource.quantity}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">
                    {getRelativeTime(order.updatedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                                text-[9px] font-black uppercase tracking-widest px-2 py-1 notched-corner
                                ${order.status === "В дорозі" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}
                              `}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-military-gray hover:bg-military-orange hover:text-black transition-all notched-corner border border-white/5">
                        <MapPin size={14} />
                      </button>
                      <button className="p-2 bg-military-gray hover:bg-red-600 hover:text-white transition-all notched-corner border border-white/5">
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-[400px] h-full bg-military-black border-l border-white/10 p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
              Деталі Замовлення
            </span>
            <span
              className={`
                        text-[10px] font-black px-3 py-1 uppercase tracking-widest notched-corner
                        ${selectedOrder?.priority === "RED" ? "bg-red-600 text-white" : "bg-military-orange text-black"}
                      `}
            >
              {selectedOrder?.priority}
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            {selectedOrder?.Brigade.name}
          </h2>
        </div>

        <div className="military-panel notched-corner p-6 space-y-4">
          <div className="flex justify-between border-b border-white/5 pb-3">
            <span className="text-[10px] font-black uppercase text-slate-500">
              Вантаж
            </span>
            <span className="text-xs font-black text-white uppercase">
              {selectedOrder?.Resource.name}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-3">
            <span className="text-[10px] font-black uppercase text-slate-500">
              Кількість
            </span>
            <span className="text-xs font-black text-military-orange">
              {selectedOrder?.Resource.quantity}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-3">
            <span className="text-[10px] font-black uppercase text-slate-500">
              Статус
            </span>
            <span className="text-xs font-black text-emerald-500 uppercase">
              {selectedOrder?.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-black uppercase text-slate-500">
              Час Створення
            </span>
            <span className="text-xs font-black text-white uppercase">
              {getRelativeTime(selectedOrder?.updatedAt)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Маршрут (Tactical Preview)
          </h3>
          <div className="space-y-3">
            {[
              { point: "BASE_DELTA", status: "COMPLETED", time: "14:20" },
              { point: "CHECKPOINT_7", status: "ACTIVE", time: "14:55" },
              { point: "SECTOR_G_ENTRY", status: "PENDING", time: "15:30" },
              { point: "UNIT_DROP_ZONE", status: "PENDING", time: "16:00" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-4 relative">
                {i < 3 && (
                  <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-white/10" />
                )}
                <div
                  className={`
                            w-4 h-4 notched-corner z-10
                            ${p.status === "COMPLETED" ? "bg-emerald-500" : p.status === "ACTIVE" ? "bg-military-orange animate-pulse" : "bg-slate-800"}
                          `}
                />
                <div className="flex-1 flex justify-between items-center">
                  <span
                    className={`
                              text-[10px] font-black uppercase tracking-widest
                              ${p.status === "PENDING" ? "text-slate-600" : "text-white"}
                            `}
                  >
                    {p.point}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600">
                    {p.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="military-panel notched-corner p-6 bg-military-orange/5 border-military-orange/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase text-military-orange">
              Прогноз Пального
            </span>
            <TrendingUp size={14} className="text-military-orange" />
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tighter">
            142.5 L
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">
            Очікуваний залишок: 45%
          </p>
        </div>

        <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.2em] notched-button shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all flex items-center justify-center gap-3">
          <RefreshCw size={16} className="animate-spin-slow" />
          Миттєво перекинути маршрут
        </button>
      </div>
    </motion.div>
  );
};

export default OrdersPage;
