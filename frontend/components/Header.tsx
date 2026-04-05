"use client";

import { Bell, ChevronRight, Menu, Plus, ShieldAlert } from "lucide-react";
import { useState } from "react";
import CreateRouteModal from "./AddOrderModal";

const Header = ({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) => {
  const [isAlertActive, setIsAlertActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <header className="h-[72px] sm:h-[80px] border-b border-white/10 bg-military-black/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-10 z-10 gap-3">
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-10 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 min-w-0">
            <span className="hover:text-military-orange cursor-pointer transition-colors">
              Головна
            </span>
            <ChevronRight size={14} className="text-slate-700" />
            <span className="text-white truncate">Оперативний Дашборд</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
              Дизель / Market
            </span>
            <span className="text-sm font-black text-amber-500 font-mono">
              92.00 UAH/L
            </span>
          </div>

          <div className="relative cursor-pointer group">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest notched-button flex items-center gap-2"
            >
              <Plus size={14} /> Створити рейс
            </button>
          </div>

          <div className="relative cursor-pointer group">
            <div className="p-3 bg-military-gray notched-corner border border-white/10 group-hover:bg-military-orange group-hover:text-black transition-all">
              <Bell size={20} />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-[10px] font-black flex items-center justify-center notched-corner border-2 border-military-black">
              3
            </span>
          </div>

          <button
            onClick={() => setIsAlertActive(!isAlertActive)}
            className={`
                       hidden sm:flex items-center gap-4 px-4 lg:px-6 py-2.5 lg:py-3 notched-button transition-all duration-300
                        ${
                          isAlertActive
                            ? "bg-red-600 text-white animate-pulse"
                            : "bg-military-orange text-black"
                        }
                      `}
          >
            {isAlertActive ? <ShieldAlert size={20} /> : <Menu size={20} />}
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isAlertActive ? "Повітряна Тривога" : "Статус Системи"}
              </span>
              <span className="text-[9px] font-bold opacity-80 uppercase">
                {isAlertActive ? "Харківська Обл." : "Все Спокійно"}
              </span>
            </div>
          </button>
        </div>
      </header>
      {isModalOpen && (
        <CreateRouteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => {}}
        />
      )}
    </>
  );
};

export default Header;
