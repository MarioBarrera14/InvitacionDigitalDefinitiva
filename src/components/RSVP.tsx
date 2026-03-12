"use client";

import { motion, AnimatePresence } from "framer-motion";
import { eventConfig } from "../data/event-config";
import { CalendarCheck, X, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export function RSVP() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidated, setIsValidated] = useState(false); // Nuevo estado para el código
  const [familyCode, setFamilyCode] = useState(""); // Input del código
  
  const [formData, setFormData] = useState({
    name: "",
    attendance: "",
    dietary: [] as string[],
  });

  const { personal } = eventConfig;
  const [displayName, setDisplayName] = useState(personal.nombre);

  // Simulación de validación (Aquí podrías conectar con tu API/Base de datos)
  const handleValidateCode = async () => {
    if (!familyCode) return;
    setIsSubmitting(true);
    
    // Simulamos una pequeña carga de validación
    setTimeout(() => {
      // Aquí podrías validar contra la DB. Por ahora aceptamos cualquier código de 7 caracteres (como los del dashboard)
      if (familyCode.length >= 4) {
        setIsValidated(true);
      } else {
        alert("Código no reconocido. Por favor, revisa tu invitación.");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.attendance) {
      alert("Por favor, completa tu nombre y confirma tu asistencia.");
      return;
    }

    setIsSubmitting(true);
    try {
      const isConfirmed = formData.attendance === "¡SÍ, OBVIO! 🤩";
      
      const response = await fetch("/api/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          code: familyCode,
          status: isConfirmed ? "CONFIRMED" : "CANCELLED",
          attendanceChoice: formData.attendance,
          allergy: formData.dietary.length > 0 ? formData.dietary.join(", ") : "Ninguna",
        }),
      });

      if (response.ok) {
        alert("¡Muchas gracias! Tu respuesta ha sido enviada.");
        setIsOpen(false);
        setIsValidated(false);
        setFormData({ name: "", attendance: "", dietary: [] });
      }
    } catch (error) {
      alert("Hubo un error al enviar el formulario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDietaryChange = (item: string) => {
    setFormData(prev => {
      if (item.includes("NINGUNA")) return { ...prev, dietary: [item] };
      const newDietary = prev.dietary.filter(i => !i.includes("NINGUNA"));
      return {
        ...prev,
        dietary: newDietary.includes(item) ? newDietary.filter(i => i !== item) : [...newDietary, item]
      };
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-black/5 border border-black/10 flex items-center justify-center">
            <CalendarCheck className="w-9 h-9 text-black/60" />
          </div>
        </motion.div>

        <h2 className="font-serif italic text-3xl md:text-5xl text-black mb-8">
          ¡No podés faltar!
        </h2>

        <motion.button
          onClick={() => setIsOpen(true)}
          className="px-12 py-5 border border-black text-black tracking-[0.3em] text-[10px] uppercase font-semibold hover:bg-black hover:text-white rounded-full transition-all"
        >
          CONFIRMAR MI ASISTENCIA
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-[#f4f4f4] rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-black text-white p-8 text-center relative">
                <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 opacity-50 hover:opacity-100">
                  <X size={24} />
                </button>
                <h3 className="tracking-[0.3em] text-[10px] font-bold">RSVP</h3>
                <p className="font-serif italic text-xl">Confirmación</p>
              </div>

              <div className="p-8">
                {!isValidated ? (
                  /* VISTA 1: VALIDACIÓN DE CÓDIGO */
                  <div className="space-y-6 text-center">
                    <div className="flex justify-center">
                      <KeyRound className="w-12 h-12 text-zinc-300" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block mb-4">Ingresa tu código familiar</label>
                      <input 
                        type="text"
                        value={familyCode}
                        onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                        placeholder="EJ: GAR4829"
                        className="w-full bg-white border-2 border-zinc-100 rounded-xl py-4 text-center text-xl font-mono tracking-[0.5em] focus:border-black outline-none transition-all text-black"
                      />
                    </div>
                    <button 
                      onClick={handleValidateCode}
                      disabled={isSubmitting || familyCode.length < 3}
                      className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs tracking-widest uppercase disabled:opacity-30"
                    >
                      {isSubmitting ? "VALIDANDO..." : "INGRESAR"}
                    </button>
                  </div>
                ) : (
                  /* VISTA 2: FORMULARIO (Desbloqueado) */
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    {/* Nombre */}
                    <div className="bg-white p-6 rounded-xl border border-black/5">
                      <label className="text-[10px] font-black tracking-widest uppercase block mb-2 text-black">Tu Nombre</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-b border-zinc-200 py-2 outline-none focus:border-black text-black font-semibold"
                        placeholder="Nombre y Apellido"
                      />
                    </div>

                    {/* Asistencia */}
                    <div className="bg-white p-6 rounded-xl border border-black/5">
                      <label className="text-[10px] font-black tracking-widest uppercase block mb-4 text-black">¿Asistirás?</label>
                      <div className="space-y-3">
                        {["¡SÍ, OBVIO! 🤩", "NO VOY A PODER ASISTIR 😥"].map((op) => (
                          <button
                            key={op}
                            onClick={() => setFormData({...formData, attendance: op})}
                            className={`w-full py-3 px-4 rounded-lg text-xs font-bold transition-all border ${formData.attendance === op ? 'bg-black text-white border-black' : 'bg-zinc-50 text-zinc-400 border-transparent'}`}
                          >
                            {op}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dieta */}
                    <div className="bg-white p-6 rounded-xl border border-black/5">
                      <label className="text-[10px] font-black tracking-widest uppercase block mb-4 text-black">Menú Especial</label>
                      <div className="grid grid-cols-1 gap-2">
                        {["NINGUNA 🍽️", "SIN TACC 🚫🌾", "VEGANO 🥑"].map((item) => (
                          <button
                            key={item}
                            onClick={() => handleDietaryChange(item)}
                            className={`text-left py-3 px-4 rounded-lg text-[10px] font-bold transition-all ${formData.dietary.includes(item) ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500'}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-black text-white py-5 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={16}/> ENVIAR CONFIRMACIÓN</>}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}