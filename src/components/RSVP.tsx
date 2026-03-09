"use client";

import { motion, AnimatePresence } from "framer-motion";
import { eventConfig } from "../data/event-config";
import { CalendarCheck, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface Particle {
  id: string;
  left: string;
  top: string;
  duration: number;
  delay: number;
}

export function RSVP() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
 const { personal } = eventConfig;
  const particles = useMemo(() => {
    if (typeof window === "undefined") return [];
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `particle-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  const [displayName, setDisplayName] = useState(personal.nombre);

  useEffect(() => {
    const savedName = localStorage.getItem("eventName");
    if (savedName) {
      setDisplayName(savedName);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <section className="relative py-32 md:py-48 bg-white overflow-hidden">
      {/* Partículas decorativas */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-black/10 rounded-full"
              style={{ left: particle.left, top: particle.top }}
              animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
              transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-black/5 border border-black/10 flex items-center justify-center">
            <CalendarCheck className="w-9 h-9 text-black/60" />
          </div>
        </motion.div>

        <motion.span className="text-black/40 tracking-[0.4em] text-[10px] md:text-xs uppercase font-light block mb-8">
          CONFIRMACIÓN DE ASISTENCIA
        </motion.span>

        <h2 className="font-serif italic text-3xl md:text-5xl text-black mb-8 leading-tight">
          En un día tan importante para mí, <br /> ¡no podés faltar!
        </h2>

        <p className="text-black/50 leading-relaxed tracking-wide font-light text-sm md:text-base mb-12 max-w-xl mx-auto">
          Recordá completar el formulario
        </p>

        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative px-12 py-5 border border-black text-black tracking-[0.3em] text-[10px] md:text-xs uppercase font-semibold transition-all duration-700 hover:bg-black hover:text-white rounded-full"
        >
          CONFIRMAR MI ASISTENCIA
        </motion.button>

        <p className="font-serif italic text-4xl md:text-6xl text-black mt-24 opacity-80">¡Te espero!</p>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#e8e8e8] rounded-xl shadow-2xl"
            >
              {/* Header */}
              <div className="bg-black text-white p-10 text-center sticky top-0 z-20 shadow-lg">
                <button onClick={() => setIsOpen(false)} className="absolute right-6 top-6 text-white hover:scale-110 transition-transform">
                  <X size={28} />
                </button>
                <h3 className="tracking-[0.4em] text-[10px] uppercase font-bold mb-2">CONFIRMACIÓN DE ASISTENCIA</h3>
                <h1 className="text-white text-xl font-serif italic tracking-widest transition-colors group-hover:text-pink-300">

                  {displayName}
                </h1>
              </div>

              {/* Formulario */}
              <div className="p-4 md:p-8 space-y-6">

                {/* Card Intro */}
                <div className="bg-white p-6 rounded-xl border-l-8 border-l-black shadow-md">
                  <h4 className="font-black text-black text-base uppercase tracking-widest mb-2">¿HAY EQUIPO?</h4>
                  <p className="text-black text-sm font-medium">Espero que puedas acompañarme en este momento tan especial.</p>
                </div>

                {/* Card Nombre */}
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <label className="font-black text-black text-sm uppercase tracking-widest block mb-4">NOMBRE Y APELLIDO</label>
                  <input
                    type="text"
                    placeholder="Tu respuesta"
                    className="w-full border-b-2 border-zinc-200 py-3 outline-none focus:border-black transition-colors text-black text-base font-semibold placeholder:text-zinc-300"
                  />
                </div>

                {/* Card Radio Buttons */}
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <label className="font-black text-black text-sm uppercase tracking-widest block mb-6">¿VENÍS A MIS QUINCE?</label>
                  <div className="space-y-5">
                    {["¡SÍ, OBVIO! 🤩", "NO VOY A PODER ASISTIR 😥"].map((opcion) => (
                      <label key={opcion} className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="radio" name="asiste" className="peer appearance-none w-5 h-5 border-2 border-black rounded-full checked:bg-black transition-all" />
                          <div className="absolute w-2 h-2 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                        </div>
                        <span className="text-black text-base font-bold uppercase tracking-tight">{opcion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Card Checkboxes */}
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <label className="font-black text-black text-sm uppercase tracking-widest block mb-2">
                    RESTRICCIÓN ALIMENTICIA
                  </label>
                  <p className="text-black text-xs mb-6 font-bold italic opacity-70">
                    Haré lo posible para sumar al menú alguna opción apta para vos.
                  </p>
                  <div className="space-y-5">
                    {[
                      "NINGUNA, ¡COMO DE TODO! 🍽️",
                      "COMO SIN TACC 🚫🌾",
                      "SOY VEGANO 🚫🥩",
                      "SOY VEGETARIANO 🥑"
                    ].map((item) => (
                      <label key={item} className="flex items-center gap-4 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-black border-2 border-black rounded"
                        />
                        <span className="text-black text-base font-bold uppercase tracking-tight">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Footer Modal */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6">
                  <button className="w-full md:w-auto bg-black text-white px-12 py-4 rounded-lg text-sm font-black tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl active:scale-95">
                    ENVIAR
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-black text-[10px] font-black uppercase tracking-widest border-b-2 border-black hover:opacity-50 transition-opacity">
                    BORRAR FORMULARIO
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Onda inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[120px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#000000" />
        </svg>
      </div>
    </section>
  );
}