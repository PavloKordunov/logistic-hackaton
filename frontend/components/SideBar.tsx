"use client";

import {
  X,
  LayoutDashboard,
  LogOut,
  Package,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  link,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  link: string;
  onClick?: () => void;
}) => (
  <Link
    href={link}
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-all duration-200 group relative
      ${
        active
          ? "bg-military-orange text-black"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
  >
    {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />}
    <Icon
      size={20}
      className={`
        transition-transform group-hover:scale-110
        ${active ? "text-black" : "text-slate-500"}
      `}
    />
    <span className="font-black text-xs uppercase tracking-widest">
      {label}
    </span>
  </Link>
);

const SideBar = ({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/";
  const logOut = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    localStorage.removeItem("token");
    router.push("/");
    onClose?.();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Додано h-full та shrink-0 для надійності розмірів */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-military-black border-r border-white/10 flex flex-col h-full shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-4 pt-4 md:hidden">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-4">
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-military-orange flex items-center justify-center notched-corner">
                <Truck size={22} className="text-black" />
              </div>
              <div className="flex flex-col leading-none">
                <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                  ResiLog
                </h1>
                <span className="text-military-orange font-black text-xs uppercase tracking-widest">
                  Front UA
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-3 bg-[#0057b7] rounded-sm" />
            <div className="w-5 h-3 bg-[#ffd700] rounded-sm" />
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
              Логістика Перемоги
            </span>
          </div>
        </div>

        {/* Додано overflow-y-auto сюди, щоб меню можна було гортати, не зсуваючи кнопку виходу */}
        <nav className="flex-1 mt-4 overflow-y-auto custom-scrollbar">
          <SidebarItem
            icon={LayoutDashboard}
            label="Головна"
            link="/dashboard"
            active={pathname === "/dashboard"}
            onClick={onClose}
          />
          <SidebarItem
            icon={Package}
            label="Замовлення"
            link="/orders"
            active={pathname === "/orders"}
            onClick={onClose}
          />
          <SidebarItem
            icon={Warehouse}
            label="Склади"
            link="/warehouses"
            active={pathname === "/warehouses"}
            onClick={onClose}
          />
          <SidebarItem
            icon={Users}
            label="Бригади"
            link="/brigade"
            active={pathname === "/brigade"}
            onClick={onClose}
          />
        </nav>

        {/* Блок з аватаром і кнопкою виходу надійно зафіксований знизу */}
        <div className="p-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-4 p-4 bg-military-gray notched-corner border border-white/5">
            <div className="w-12 h-12 bg-military-orange flex items-center justify-center notched-corner">
              <img
                src="./logo-team.png"
                alt="Avatar"
                className="w-full h-full object-cover grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Логіст Оператор
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 bg-military-orange animate-pulse" />
                <span className="text-[9px] text-military-orange font-mono font-bold uppercase">
                  ALGO_ONLINE
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logOut}
            className="cursor-pointer w-full mt-6 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 notched-button"
          >
            <LogOut size={14} />
            <span>Завершити сесію</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
