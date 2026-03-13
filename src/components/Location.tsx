"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, PartyPopper } from "lucide-react";

export function Location() {
  // Estados para que la UI sea dinámica
  const [datosUbicacion, setDatosUbicacion] = useState({
    nombreLugar: "Cargando...",
    subtituloLugar: "",
    hora: "00:00 HS",
    direccion: "",
    googleMapsUrl: "#"
  });

  useEffect(() => {
    // Leemos los datos guardados por el configurador
    const savedVenue = localStorage.getItem("venueName") || "Nombre del Salón";
    const savedAddress = localStorage.getItem("venueAddress") || "Dirección del evento";
    const savedTime = localStorage.getItem("eventTime") || "21:00";
    const savedLink = localStorage.getItem("mapLink") || "#";

    setDatosUbicacion({
      nombreLugar: savedVenue,
      subtituloLugar: "LA CELEBRACIÓN", // Puedes hacerlo editable también si gustas
      hora: `${savedTime} HS`,
      direccion: savedAddress,
      googleMapsUrl: savedLink
    });
  }, []);

  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Encabezado con Icono Animado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 flex flex-col items-center"
        >
          <motion.div 
            className="mb-4 text-black"
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <PartyPopper className="w-12 h-12 md:w-16 md:h-16 stroke-[1px] text-black/20" />
          </motion.div>
          
          <span className="text-black/30 tracking-[0.5em] text-[10px] uppercase font-light">
            LA CELEBRACIÓN
          </span>
        </motion.div>

        {/* Contenido principal dinámico */}
        <div className="max-w-2xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-5xl md:text-7xl font-serif italic text-black mb-2 tracking-tighter">
              {datosUbicacion.nombreLugar}
            </h3>
            <p className="text-black/50 text-[10px] md:text-xs tracking-[0.4em] uppercase font-light mb-8">
              {/* Aquí podrías poner un subtitulo fijo o hacerlo dinámico */}
              DETALLES DEL EVENTO
            </p>
          </motion.div>

          {/* Bloque central (Hora + Dirección) dinámico */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-y border-black/[0.08] py-8 mb-10"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-6 bg-black/20" />
              <p className="text-black font-serif italic text-3xl md:text-5xl">
                {datosUbicacion.hora}
              </p>
              <div className="h-[1px] w-6 bg-black/20" />
            </div>
            
            <p className="text-black/70 font-light text-base md:text-xl tracking-wide">
              {datosUbicacion.direccion}
            </p>
          </motion.div>

          {/* Botón de Acción con el link dinámico */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a
              href={datosUbicacion.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-10 py-4 border border-black text-black rounded-full hover:bg-black hover:text-white transition-all duration-500 ease-in-out"
            >
              <MapPin className="w-3 h-3 stroke-[1.5px]" />
              <span className="tracking-[0.3em] text-[10px] uppercase font-medium">
                CÓMO LLEGAR
              </span>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}