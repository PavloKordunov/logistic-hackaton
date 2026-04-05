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
    <div className="flex h-screen w-full overflow-hidden bg-military-black text-slate-200 font-sans">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex min-w-0 flex-col relative h-full">
        <div className="absolute inset-0 tactical-grid opacity-50 pointer-events-none" />

        <div className="">
          <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        </div>

        <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
