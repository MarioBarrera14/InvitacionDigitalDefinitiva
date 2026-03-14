"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft as IconLeft, 
  ChevronRight as IconRight, 
  Pause, 
  Play,
  Volume2, 
  VolumeX, 
  Clapperboard,
  Loader2 
} from "lucide-react";
import { getEventConfig } from "@/app/api/admin/galeria/route"; 
import { eventConfig } from "../data/event-config";

export function FotoCarousel() {
  const { imagenes } = eventConfig;
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [fotos, setFotos] = useState([
    { id: 1, url: imagenes.hero, caption: "Comenzando el sueño" },
    { id: 2, url: "/img/foto2.jpg", caption: "Detalles que ilusionan" },
    { id: 3, url: "/img/foto3.jpg", caption: "Cada vez más cerca" },
    { id: 4, url: "/img/foto4.jpg", caption: "Mi sesión especial" },
    { id: 5, url: "/img/foto5.jpg", caption: "Preparando la magia" },
  ]);

  useEffect(() => {
    async function loadMedia() {
      try {
        const config = await getEventConfig();
        if (config) {
          if (config.videoUrl) setVideoUrl(config.videoUrl);
          if (config.carruselImages) {
            const urls = JSON.parse(config.carruselImages);
            setFotos(prev => urls.map((url: string | null, i: number) => ({
              ...prev[i],
              url: url || prev[i].url
            })));
          }
        }
      } catch (error) {
        console.error("Error cargando galería:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMedia();
  }, []);

  useEffect(() => {
    if (!isHovered && !loading) {
      const interval = setInterval(() => {
        nextStep();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [index, isHovered, loading]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const nextStep = () => setIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  const prevStep = () => setIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));

  if (loading) return (
    <div className="py-24 flex justify-center items-center bg-[#fdfdfd]">
       <Loader2 className="animate-spin text-rose-300 w-8 h-8" />
    </div>
  );

  return (
    <section className="relative py-24 md:py-32 bg-[#fdfdfd] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] -right-[5%] w-96 h-96 bg-rose-50 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] -left-[5%] w-72 h-72 bg-neutral-100 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20 flex flex-col items-center"
        >
          <h3 className="text-5xl font-serif italic text-neutral-900 tracking-tight mb-6">
            Rumbo a mis 15
          </h3>
          <div className="flex items-center gap-4 w-full max-w-md opacity-40 mb-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-neutral-400" />
            <svg width="80" height="40" viewBox="0 0 100 50" fill="none" className="text-neutral-500">
                <path d="M10 25C30 10 30 40 50 25C70 10 70 40 90 25" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="25" r="3" fill="currentColor" />
            </svg>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-neutral-400" />
          </div>
          <p className="text-xs tracking-[0.5em] text-neutral-400 uppercase italic">Un pequeño adelanto de lo que viene</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start max-w-6xl mx-auto">
          
          {/* COLUMNA FOTOS */}
          <div 
            className="w-full relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={fotos[index].url}
                  src={fotos[index].url}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <button onClick={prevStep} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-neutral-800 opacity-0 group-hover:opacity-100 transition-all z-30 shadow-lg hover:bg-white">
                <IconLeft size={20} />
              </button>
              <button onClick={nextStep} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-neutral-800 opacity-0 group-hover:opacity-100 transition-all z-30 shadow-lg hover:bg-white">
                <IconRight size={20} />
              </button>
            </div>
            
            <div className="mt-8 text-center space-y-2">
              <span className="text-[10px] tracking-[0.4em] text-rose-300 uppercase font-semibold italic">Galería de fotos</span>
              <h4 className="text-4xl font-serif italic text-neutral-800">{fotos[index].caption}</h4>
            </div>
          </div>

          {/* COLUMNA VIDEO */}
          <div className="w-full">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] group">
              {videoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
                  <div className="absolute inset-0 opacity-30 blur-2xl scale-110">
                    <video src={videoUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                  </div>

                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="relative z-10 w-full h-full object-contain cursor-pointer" 
                    loop 
                    muted={isMuted}
                    autoPlay
                    playsInline
                    onClick={togglePlay}
                  />
                  
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-30">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-colors">
                          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white">
                          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                      </div>
                      <Clapperboard className="text-white/30 w-4 h-4" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500 text-[10px] tracking-widest uppercase text-center px-6 italic">
                  Cargando video...
                </div>
              )}
            </div>

            <div className="mt-8 text-center space-y-2">
              <span className="text-[10px] tracking-[0.4em] text-rose-300 uppercase font-semibold italic">Video destacado</span>
              <h4 className="text-4xl font-serif italic text-neutral-800">Backstage</h4>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}