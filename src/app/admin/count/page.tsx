"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Calendar, Clock, RefreshCw, User } from "lucide-react";

// Definimos el tipo para el contador
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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const savedDate = localStorage.getItem("eventDate");
    const savedTime = localStorage.getItem("eventTime");
    const savedName = localStorage.getItem("eventName");
    
    if (savedDate) setEventDate(savedDate);
    if (savedTime) setEventTime(savedTime);
    if (savedName) setEventName(savedName);
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
      
      alert(`¡Configuración guardada! 🎉`);
      window.location.reload();
    } catch (error) {
      console.error("Error", error);
      alert("Hubo un error al guardar.");
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-serif italic font-bold text-zinc-900 dark:text-white">Configuración</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-zinc-100 dark:border-slate-900 shadow-sm"
        >
          <div className="space-y-6">
            {/* Input Nombre */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-slate-300 mb-2">
                <User className="h-4 w-4" /> NOMBRE DEL EVENTO
              </label>
              <input 
                type="text" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none font-medium"
              />
            </div>

            {/* Input Fecha - Agregado text-zinc-900 para que se note */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-slate-300 mb-2">
                <Calendar className="h-4 w-4" /> FECHA
              </label>
              <input 
                type="date" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)} 
                className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white transition-all outline-none font-medium" 
              />
            </div>

            {/* Input Hora - Agregado text-zinc-900 para que se note */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-slate-300 mb-2">
                <Clock className="h-4 w-4" /> HORA
              </label>
              <input 
                type="time" 
                value={eventTime} 
                onChange={(e) => setEventTime(e.target.value)} 
                className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-zinc-900 dark:text-white transition-all outline-none font-medium" 
              />
            </div>

            <button onClick={handleSave} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition-all">
              <Save className="h-5 w-5" /> GUARDAR CAMBIOS
            </button>
          </div>
        </motion.div>

        {/* Vista Previa */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 dark:bg-white p-8 rounded-3xl text-white dark:text-black flex flex-col justify-center items-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <RefreshCw className="h-24 w-24 rotate-12" />
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: 'Días', value: timeLeft.days }, 
              { label: 'Hrs', value: timeLeft.hours }, 
              { label: 'Min', value: timeLeft.mins }, 
              { label: 'Seg', value: timeLeft.secs }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-3xl font-serif italic font-bold leading-none">{unit.value}</span>
                <span className="text-[10px] uppercase tracking-tighter mt-1 opacity-60">{unit.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 dark:border-black/10 pt-6 text-center">
            <p className="text-xs font-medium opacity-70">
              Faltan para el gran día de <br/>
              <span className="text-lg italic font-serif">{eventName}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}