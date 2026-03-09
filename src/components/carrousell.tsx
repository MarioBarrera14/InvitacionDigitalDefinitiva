"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { eventConfig } from "../data/event-config";

export function FotoCarousel() {
  const { imagenes } = eventConfig;
  const [index, setIndex] = useState(0);

  // Array de fotos extendido
  const fotos = [
    { id: 1, url: imagenes.hero, caption: "Momentos Inolvidables" },
    { id: 2, url: "/img/foto2.jpg", caption: "Cuenta Regresiva" },
    { id: 3, url: "/img/foto3.jpg", caption: "Un Sueño Hecho Realidad" },
    { id: 4, url: "/img/foto4.jpg", caption: "Mi Mejor Versión" },
    { id: 5, url: "/img/foto5.jpg", caption: "Dando Luz a mis 15" },
  ];

  const nextStep = () => {
    setIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Encabezado del Carrusel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <Camera className="w-8 h-8 mb-6 text-black/20 stroke-[1px]" />
          <span className="text-black/30 tracking-[0.6em] text-[10px] md:text-xs uppercase ml-[0.6em]">
            ÁLBUM DE RECUERDOS
          </span>
          <motion.h3 
            className="text-5xl md:text-7xl font-serif italic text-black mt-6 tracking-tight"
          >
            Mis Momentos
          </motion.h3>
          <div className="h-[1px] w-12 bg-black/10 mx-auto mt-8" />
        </motion.div>

        {/* Contenedor del Carrusel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[4/5] md:aspect-video overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={fotos[index].id}
                src={fotos[index].url}
                alt={`Galería Luz - ${fotos[index].caption}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Controles de Navegación */}
            <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
              <button
                onClick={prevStep}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextStep}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Indicador de posición (Puntitos dinámicos) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {fotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1 transition-all duration-500 rounded-full ${
                    i === index ? "w-10 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Caption dinámico */}
          <motion.p
            key={`caption-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 text-black/50 text-sm md:text-base tracking-[0.3em] uppercase font-light"
          >
            {fotos[index].caption}
          </motion.p>
        </div>
      </div>
    </section>
  );
}