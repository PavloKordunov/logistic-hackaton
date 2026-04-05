import SideBar from "@/components/SideBar";
import Header from "@/components/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-military-black text-slate-200 font-sans">
      <SideBar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 tactical-grid opacity-50 pointer-events-none" />
        <Header />
        {children}
      </main>
    </div>
  );
}
