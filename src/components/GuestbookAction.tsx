"use client";

import { motion } from "framer-motion";
import { Disc3, Music, Headset } from "lucide-react";
import { eventConfig } from "../data/event-config";

export function MusicSuggestion() {
  const cancionesUrl = eventConfig.canciones?.formularioUrl || "#";

  // Configuración para las barras del ecualizador
  const bars = Array.from({ length: 40 });

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* ONDA SUPERIOR */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px]">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff"></path>
        </svg>
      </div>

      {/* EFECTO DE LUZ DE FONDO (GLOW) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[120px]"
        />
      </div>

      {/* BARRAS DE ECUALIZADOR DINÁMICAS */}
      <div className="absolute bottom-24 left-0 w-full flex justify-center items-end gap-1 px-4 opacity-30 z-0 h-20">
        {bars.map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: [
                Math.random() * 20 + 10, 
                Math.random() * 80 + 20, 
                Math.random() * 20 + 10
              ] 
            }}
            transition={{ 
              duration: Math.random() * 0.5 + 0.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-1 md:w-2 bg-gradient-to-t from-white/0 via-white/50 to-white rounded-full"
          />
        ))}
      </div>

      {/* Fondo de Ondas Animadas (Tu código original) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <motion.path
            animate={{ 
              d: [
                "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,202.7C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,224C672,245,768,235,864,208C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,202.7C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            fill="#1a1a1a"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-30 text-center flex flex-col items-center">
        
        {/* ÍCONO PRINCIPAL - Disco Girando + Aura */}
        <div className="relative mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="relative z-10 text-white/40"
          >
            <Disc3 className="w-20 h-20 md:w-28 md:h-28 stroke-[0.5px]" />
          </motion.div>
          {/* Nota musical saltarina */}
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute -top-4 -right-4 text-white/60"
          >
            <Music size={24} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="text-[10px] tracking-[0.5em] text-rose-300 uppercase font-bold mb-4 block">
            The Party Soundtrack
          </span>
          <h3 className="text-5xl md:text-7xl font-serif italic text-white tracking-tight mb-6">
            ¡Te invito a ser <br />mi DJ personal!
          </h3>
          <p className="text-white/40 text-sm md:text-base font-light tracking-[0.2em] uppercase max-w-sm mx-auto leading-loose">
            ¿Qué canción no puede <br /> faltar en la pista?
          </p>
        </motion.div>

        {/* BOTÓN ESTILO "PLAYER" */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <a
            href={cancionesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase rounded-full transition-all duration-500 overflow-hidden"
          >
            {/* Efecto de brillo al pasar el mouse */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
            
            <Headset className="w-5 h-5" />
            SUGERÍ TU TEMA ACÁ
          </a>
        </motion.div>

        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-24 mx-auto" />
      </div>

      {/* ONDA INFERIOR */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px] md:h-[120px]"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#ffffff"
          ></path>
        </svg>
      </div>
    </section>
  );
}