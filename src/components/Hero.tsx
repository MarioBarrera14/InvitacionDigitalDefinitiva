"use client";

import { useState, useEffect } from "react"; // Añadimos esto
import { motion } from "framer-motion";
import { eventConfig } from "../data/event-config";

export function Hero() {
  const { personal, imagenes } = eventConfig;
  const [displayName, setDisplayName] = useState(personal.nombre); // Estado inicial del archivo data

  useEffect(() => {
    // Al cargar, verifica si hay un nombre personalizado en localStorage
    const savedName = localStorage.getItem("eventName");
    if (savedName) {
      setDisplayName(savedName);
    }
  }, []);

  return (
    <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 z-10"
          style={{ background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.5) 100%)" }}
        />
        <img
          src={imagenes.hero}
          alt={displayName}
          className="w-full h-full object-cover opacity-80 transition-transform ease-out hover:scale-110"
          style={{
            transitionDuration: '10000ms',
            maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-20 text-center px-4 mt-20 md:mt-32">
        <motion.h1
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="font-script text-7xl md:text-9xl lg:text-[10rem] text-white leading-[1.1] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          {displayName} {/* Aquí ahora es dinámico */}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-white/60" />
          <h2 className="text-base md:text-2xl text-white font-light tracking-[0.6em] uppercase">
            {personal.titulo}
          </h2>
          <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-white/60" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 2, duration: 3, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white via-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}