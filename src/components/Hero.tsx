"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getEventConfig } from "@/app/api/admin/galeria/route"; 
import { eventConfig } from "../data/event-config";

export function Hero() {
  const { personal, imagenes } = eventConfig;
  
  const [displayName, setDisplayName] = useState(personal.nombre);
  const [heroImage, setHeroImage] = useState(imagenes.hero);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const config = await getEventConfig();
        if (config) {
          if (config.heroImage) setHeroImage(config.heroImage);
          if (config.nombre) setDisplayName(config.nombre);
        }
      } catch (error) {
        console.error("Error cargando datos del Hero:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="h-[85vh] flex items-center justify-center bg-black">
      <Loader2 className="animate-spin text-white/20 w-10 h-10" />
    </div>
  );

  return (
    <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden bg-black">
      
      {/* CONTENEDOR DE IMAGEN */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <div key={heroImage} className="relative w-full h-full flex items-center justify-center">
            
            {/* 1. FONDO BORROSO (Mantenemos el relleno de color) */}
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              src={heroImage}
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl"
              aria-hidden="true"
            />

            {/* 2. OVERLAY NEGRO RADIAL (Aumenta el contraste en los bordes) */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none" 
              style={{
                background: `radial-gradient(circle at center, transparent 0%, black 0%)`
              }}
            />
            
            {/* 3. IMAGEN PRINCIPAL CON DEGRADADO PROFUNDO */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="relative z-20 w-full h-full flex items-center justify-center"
              style={{
                /* Ajustamos a 30% y 70% para que el desvanecimiento sea mucho más largo */
                WebkitMaskImage: `
                  linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%),
                  linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)
                `,
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                maskImage: `
                  linear-gradient(to bottom, transparent 0%, black 30%, black 60%, transparent 100%),
                  linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)
                `
              }}
            >
              <img
                src={heroImage}
                alt={displayName}
                /* En móvil se ve completa, en PC se agranda para llenar */
                className="w-full h-full object-contain md:object-cover md:scale-10"
                style={{
                  imageRendering: 'auto',
                }}
              />
            </motion.div>
          </div>
        </AnimatePresence>
      </div>

      {/* TEXTO */}
      <div className="relative z-30 text-center px-4 mt-20 md:mt-32 pointer-events-none">
        <motion.h1
          key={displayName}
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="font-script text-7xl md:text-9xl lg:text-[10rem] text-white leading-[1.1] drop-shadow-[0_4px_40px_rgba(0,0,0,1)]"
        >
          {displayName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-white/60" />
          <h2 className="text-base md:text-2xl text-white font-light tracking-[0.6em] uppercase drop-shadow-lg">
            {personal.titulo}
          </h2>
          <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-white/60" />
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white via-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}