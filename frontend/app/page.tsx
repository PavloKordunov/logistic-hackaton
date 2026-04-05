"use client";

import React, { useState } from "react";
import {
  Truck,
  ShieldAlert,
  Lock,
  Mail,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email === "qwe@qwe.com" && password === "qweqwe") {
        console.log("Успішна авторизація:", email);
      } else {
        setError("НЕВІРНІ ОБЛІКОВІ ДАНІ. ДОСТУП ЗАБОРОНЕНО.");
        setIsLoading(false);
      }
    }, 800);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-military-black flex items-center justify-center relative overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] z-10 p-1"
      >
        <div className="military-panel notched-corner p-10 border-t-4 border-military-orange relative bg-military-black/80 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-military-orange flex items-center justify-center notched-corner mb-6 shadow-[0_0_30px_rgba(255,157,0,0.3)]">
              <Truck size={32} className="text-black" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-1">
              ResiLog
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-[#0057b7] rounded-sm" />
              <div className="w-4 h-2 bg-[#ffd700] rounded-sm" />
              <span className="text-[10px] text-military-orange font-black uppercase tracking-[0.3em]">
                Front UA
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Ідентифікатор (Email)
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-military-orange transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="OPERATOR@RESILOG.UA"
                  className="w-full bg-military-gray border border-white/10 notched-corner py-4 pl-12 pr-6 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-military-orange/50 transition-all placeholder:text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Код Доступу (Password)
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-military-orange transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-military-gray border border-white/10 notched-corner py-4 pl-12 pr-6 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-military-orange/50 transition-all placeholder:text-slate-700"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/20 notched-corner"
              >
                <AlertTriangle size={16} className="text-red-500 shrink-0" />
                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-tight">
                  {error}
                </span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`
                cursor-pointer w-full py-4 bg-military-orange text-black text-xs font-black uppercase tracking-[0.2em] notched-button transition-all flex items-center justify-center gap-3 hover:bg-white active:scale-[0.98]
                ${isLoading && "opacity-50 cursor-not-allowed"}
              `}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Авторизація <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <ShieldAlert size={14} />
              <span>Захищене з'єднання активне</span>
            </div>
            {/* <p className="text-[8px] text-slate-700 text-center uppercase tracking-widest leading-relaxed">
              Ця система призначена виключно для авторизованого персоналу.
              <br />
              Будь-яка спроба несанкціонованого доступу буде зафіксована.
            </p> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
