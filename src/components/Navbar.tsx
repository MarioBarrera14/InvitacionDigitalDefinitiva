"use client";

import { useState, useEffect } from "react"; // IMPORTACIÓN FALTANTE
import Link from "next/link";
import { Heart, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { eventConfig } from "../data/event-config"; // IMPORTACIÓN FALTANTE

export const Navbar = () => {
  const router = useRouter();
  const { personal } = eventConfig;

  // Estado para el nombre dinámico
  const [displayName, setDisplayName] = useState(personal.nombre);

  useEffect(() => {
    const savedName = localStorage.getItem("eventName");
    if (savedName) {
      setDisplayName(savedName);
    }
  }, []);

  const goToDashboard = () => {
    router.push("/admin");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10 py-2.5 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* NOMBRE DINÁMICO */}
        <Link href="/" className="group">
          <h1 className="text-white text-xl font-serif italic tracking-widest transition-colors group-hover:text-pink-300">
            {/* Aquí usamos el displayName directamente para que cambie de verdad */}
            {displayName}
          </h1>
          <span className="block text-[9px] uppercase tracking-[0.3em] font-sans not-italic text-zinc-400">
            ¡Mis XV años!
          </span>
        </Link>

        {/* CONTENEDOR DE ACCESO */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-0.5">
            <button 
              onClick={goToDashboard}
              className="group relative flex items-center justify-center w-10 h-10 
                         bg-white/5 border border-white/10 hover:border-pink-400/50
                         rounded-full text-white transition-all duration-300
                         hover:bg-pink-400/10 hover:scale-110 active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4 text-zinc-400 group-hover:text-pink-400 transition-colors" />
            </button>
            <span className="text-[7px] uppercase tracking-[0.2em] font-bold text-zinc-500">
              Admin
            </span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <button 
              onClick={() => router.push("/login")}
              className="group relative flex items-center justify-center w-9 h-9 
                         bg-gradient-to-br from-pink-400 to-rose-600 
                         rounded-full text-white transition-all duration-300
                         hover:scale-110 active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white text-white group-hover:animate-pulse" />
            </button>
            <span className="text-[8px] uppercase tracking-[0.2em] font-semibold text-pink-400/90 italic">
              Invitado
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};