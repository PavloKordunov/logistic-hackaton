"use client";

import { useState } from "react";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // Змінено min-h-screen на h-screen
    <div className="flex h-screen w-full overflow-hidden bg-military-black text-slate-200 font-sans">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Обгортка для правого блоку */}
      <div className="flex-1 flex min-w-0 flex-col relative h-full">
        <div className="absolute inset-0 tactical-grid opacity-50 pointer-events-none" />

        {/* Хедер завжди зверху */}
        <div className="relative z-10">
          <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        </div>

        {/* Скролиться ТІЛЬКИ main контент, а не вся сторінка */}
        <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
