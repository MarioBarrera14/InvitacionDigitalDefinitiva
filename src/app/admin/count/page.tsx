"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Calendar, Clock, RefreshCw, User, MapPin, Link as LinkIcon, Home } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export default function CountConfigPage() {
  const [eventDate, setEventDate] = useState<string>("2026-12-19");
  const [eventTime, setEventTime] = useState<string>("21:00");
  const [eventName, setEventName] = useState<string>("Luz Jazmín");
  const [venueName, setVenueName] = useState<string>("Howard Johnson");
  const [venueAddress, setVenueAddress] = useState<string>("RP11 km 400, Cariló");
  const [mapLink, setMapLink] = useState<string>("https://maps.google.com");

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    setEventDate(localStorage.getItem("eventDate") || "2026-12-19");
    setEventTime(localStorage.getItem("eventTime") || "21:00");
    setEventName(localStorage.getItem("eventName") || "Luz Jazmín");
    setVenueName(localStorage.getItem("venueName") || "Howard Johnson");
    setVenueAddress(localStorage.getItem("venueAddress") || "RP11 km 400, Cariló");
    setMapLink(localStorage.getItem("mapLink") || "");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(`${eventDate}T${eventTime}:00`);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  const handleSave = () => {
    try {
      localStorage.setItem("eventDate", eventDate);
      localStorage.setItem("eventTime", eventTime);
      localStorage.setItem("eventName", eventName);
      localStorage.setItem("venueName", venueName);
      localStorage.setItem("venueAddress", venueAddress);
      localStorage.setItem("mapLink", mapLink);
      
      alert(`¡Configuración guardada! 🎉`);
      window.location.reload();
    } catch (error) {
      alert("Hubo un error al guardar.");
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-serif italic font-bold text-zinc-900 dark:text-white">Panel de Control</h1>
        <p className="text-zinc-500 text-sm">Personaliza los detalles de tu invitación</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        {/* Formulario de Configuración */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-white dark:bg-slate-950 p-8 rounded-3xl border border-zinc-100 dark:border-slate-900 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <User className="h-3 w-3" /> Nombre de la Agasajada
              </label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white outline-none font-medium focus:ring-2 focus:ring-zinc-200" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <Calendar className="h-3 w-3" /> Fecha
              </label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white outline-none font-medium" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <Clock className="h-3 w-3" /> Hora
              </label>
              <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white outline-none font-medium" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <Home className="h-3 w-3" /> Nombre del Salón
              </label>
              <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white outline-none font-medium" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <MapPin className="h-3 w-3" /> Dirección (Texto)
              </label>
              <input type="text" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white outline-none font-medium" />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <LinkIcon className="h-3 w-3" /> Link de Google Maps
              </label>
              <input type="url" placeholder="https://maps.google.com/..." value={mapLink} onChange={(e) => setMapLink(e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white outline-none font-medium" />
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-lg">
            <Save className="h-5 w-5" /> GUARDAR TODO
          </button>
        </motion.div>

        {/* Vista Previa */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Card del Lugar */}
          <div className="bg-white p-10 rounded-3xl border border-zinc-100 shadow-xl flex flex-col items-center text-center space-y-6">
             <div className="space-y-1">
                <h2 className="text-4xl font-serif italic text-zinc-800">{venueName}</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold uppercase">LA CELEBRACIÓN</p>
             </div>
             <div className="w-16 h-[1px] bg-zinc-100" />
             <div className="flex items-center gap-4 text-4xl font-serif italic font-bold text-zinc-900">
                <span className="w-8 h-[1px] bg-zinc-200" />
                {eventTime} HS
                <span className="w-8 h-[1px] bg-zinc-200" />
             </div>
             <p className="text-zinc-500 font-medium tracking-wide">{venueAddress}</p>
             
             {/* BOTÓN NEGRO ACTUALIZADO */}
             <button className="flex items-center gap-3 px-10 py-4 bg-zinc-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-md">
                <MapPin className="w-3 h-3 stroke-[2px]" />
                CÓMO LLEGAR
             </button>
          </div>

          {/* Widget Contador con Nombre */}
          <div className="bg-zinc-900 text-white p-8 rounded-3xl flex flex-col items-center gap-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <RefreshCw className="h-16 w-16 rotate-12" />
             </div>
             
             <div className="grid grid-cols-4 gap-6 w-full text-center">
                {[
                  { label: 'Días', value: timeLeft.days }, 
                  { label: 'Hrs', value: timeLeft.hours }, 
                  { label: 'Min', value: timeLeft.mins }, 
                  { label: 'Seg', value: timeLeft.secs }
                ].map((unit, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl font-serif italic font-bold">{unit.value}</span>
                    <span className="text-[8px] uppercase tracking-tighter opacity-50">{unit.label}</span>
                  </div>
                ))}
             </div>

             <div className="w-full border-t border-white/10 pt-4 text-center">
                <p className="text-[10px] font-light opacity-60 uppercase tracking-[0.2em] mb-1">Faltan para el gran día de</p>
                <p className="text-xl font-serif italic">{eventName}</p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}