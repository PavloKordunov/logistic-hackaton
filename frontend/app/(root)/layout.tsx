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
    <div className="flex min-h-screen w-full overflow-hidden bg-military-black text-slate-200 font-sans">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 flex min-w-0 flex-col overflow-hidden relative">
        <div className="absolute inset-0 tactical-grid opacity-50 pointer-events-none" />
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        {children}
      </main>
    </div>
  );
}
