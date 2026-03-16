"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, X, Loader2, KeyRound, CheckCircle2, AlertCircle, PartyPopper, Heart, MessageSquareHeart } from "lucide-react";
import { useEffect, useState } from "react";

export function RSVP() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const [familyCode, setFamilyCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [guestInfo, setGuestInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    attendance: "", 
    dietary: [] as string[],
    message: "",
  });

  // --- FUNCIÓN PARA RESETEAR TODO EL ESTADO ---
  const resetAll = () => {
    setIsValidated(false);
    setAlreadyResponded(false);
    setFamilyCode("");
    setErrorMessage("");
    setGuestInfo(null);
    setFormData({
      name: "",
      attendance: "",
      dietary: [],
      message: "",
    });
  };

  // Función para cerrar y limpiar
  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      // Usamos un pequeño timeout para que la animación de salida termine antes de resetear visualmente
      setTimeout(resetAll, 300);
    }
  };

  const handleValidateCode = async () => {
    if (!familyCode) return;
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/guests");
      const invitados = await response.json();
      
      const invitadoEncontrado = invitados.find(
        (inv: any) => inv.codigo === familyCode.toUpperCase().trim()
      );

      if (invitadoEncontrado) {
        if (invitadoEncontrado.status !== "PENDING" && invitadoEncontrado.status !== null) {
          setAlreadyResponded(true);
          setIsValidated(true);
          return;
        }

        setGuestInfo(invitadoEncontrado);
        setIsValidated(true);
        setFormData(prev => ({ ...prev, name: invitadoEncontrado.apellido }));
      } else {
        setErrorMessage("Código no reconocido. Revisa tu invitación física.");
      }
    } catch (error) {
      setErrorMessage("Error de conexión. Inténtalo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.attendance) {
      alert("Por favor, completa tu nombre y confirma tu asistencia.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dietaFinal = formData.dietary.length > 0 ? formData.dietary.join(", ") : "Ninguna";
      const infoFinal = formData.message 
        ? `${dietaFinal} | Mensaje: ${formData.message}` 
        : dietaFinal;

      const response = await fetch("/api/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: familyCode.toUpperCase().trim(),
          name: formData.name,
          status: formData.attendance === "YES" ? "CONFIRMED" : "CANCELLED",
          dietary: infoFinal,
        }),
      });

      if (response.ok) {
        setAlreadyResponded(true);
      } else {
        alert("Hubo un problema al guardar. Por favor intenta de nuevo.");
      }
    } catch (error) {
      alert("Error de red. Verifica tu conexión.");
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

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <section className="relative py-24 bg-white overflow-hidden font-sans">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-sm">
            <CalendarCheck className="w-7 h-7 text-black stroke-[1.5]" />
          </div>
        </motion.div>

        <h2 className="font-serif italic text-5xl md:text-6xl text-black mb-10 tracking-tight">¡No podés faltar!</h2>
     
        <p className="text-zinc-600 font-medium tracking-[0.1em] mb-12 uppercase text-xs">
          Confirma tu asistencia ahora
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="px-12 py-4 border border-black text-black tracking-[0.3em] text-[10px] uppercase font-bold hover:bg-black hover:text-white rounded-full transition-all duration-300 shadow-lg shadow-black/5"
        >
          CONFIRMAR MI ASISTENCIA
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100"
            >
              {!isValidated ? (
                <div className="p-10 text-center">
                   <button onClick={handleClose} className="absolute right-8 top-8 text-zinc-300 hover:text-black transition-colors">
                    <X size={20} />
                  </button>
                  <KeyRound className="w-12 h-12 text-black/20 mx-auto mb-6" />
                  <p className="tracking-[0.4em] text-[10px] font-bold uppercase text-zinc-400 mb-2">Seguridad</p>
                  <h3 className="font-serif italic text-3xl text-black mb-8">Ingresá tu código</h3>
                  
                  <input 
                    type="text"
                    value={familyCode}
                    onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                    placeholder="TU CÓDIGO AQUÍ"
                    className="w-full bg-zinc-50 border-b-2 border-zinc-100 rounded-t-xl py-5 text-center text-2xl font-mono tracking-[0.3em] focus:border-black outline-none transition-all text-black uppercase"
                  />
                  {errorMessage && (
                    <p className="mt-4 text-rose-500 text-[11px] font-bold flex items-center justify-center gap-2 uppercase tracking-wide">
                      <AlertCircle size={14} /> {errorMessage}
                    </p>
                  )}
                  <button 
                    onClick={handleValidateCode}
                    disabled={isSubmitting || familyCode.length < 3}
                    className="w-full mt-8 bg-black text-white py-5 rounded-2xl font-bold text-[11px] tracking-widest uppercase disabled:bg-zinc-100 transition-all shadow-xl shadow-black/10"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "ACCEDER"}
                  </button>
                </div>
              ) : alreadyResponded ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-black mx-auto mb-6 border border-zinc-100 shadow-inner">
                    <PartyPopper size={40} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif italic text-3xl text-black mb-4">¡Muchas gracias!</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-light">
                    Tu respuesta ya fue registrada. Estamos muy felices de compartir este día con vos.
                  </p>
                  <button onClick={handleClose} className="px-10 py-4 bg-black text-white rounded-full text-[10px] font-bold tracking-widest uppercase">
                    CERRAR
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-zinc-900 text-center py-10 px-8 relative">
                    <button onClick={handleClose} className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                    <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Invitado / Familia</p>
                    <h3 className="font-serif italic text-4xl text-white mb-2">{guestInfo?.apellido}</h3>
                    <div className="inline-block px-4 py-1 bg-white/5 rounded-full border border-white/10">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Cupos: {guestInfo?.cupos}</p>
                    </div>
                  </div>

                  <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-3">
                      <label className="text-[9px] font-bold tracking-widest uppercase text-zinc-400">Confirmado por:</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-b-2 border-zinc-100 py-2 outline-none focus:border-black text-black font-serif italic text-xl transition-colors placeholder:text-zinc-200"
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFormData({...formData, attendance: "YES"})}
                        className={`py-6 rounded-2xl text-[10px] font-bold transition-all border-2 flex flex-col items-center gap-3 ${formData.attendance === "YES" ? 'bg-black text-white border-black shadow-xl shadow-black/20' : 'bg-white text-zinc-300 border-zinc-100 hover:border-zinc-200'}`}
                      >
                        <CheckCircle2 size={20} strokeWidth={formData.attendance === "YES" ? 2.5 : 1.5} /> SÍ, ASISTIRÉ
                      </button>
                      <button
                        onClick={() => setFormData({...formData, attendance: "NO"})}
                        className={`py-6 rounded-2xl text-[10px] font-bold transition-all border-2 flex flex-col items-center gap-3 ${formData.attendance === "NO" ? 'bg-zinc-800 text-white border-zinc-800 shadow-xl' : 'bg-white text-zinc-300 border-zinc-100 hover:border-zinc-200'}`}
                      >
                        <X size={20} strokeWidth={formData.attendance === "NO" ? 2.5 : 1.5} /> NO PUEDO
                      </button>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 block text-center">Preferencias de menú</label>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["NINGUNA 🍽️", "SIN TACC 🚫🌾", "VEGANO 🥑", "VEGETARIANO 🥗"].map((item) => (
                          <button
                            key={item}
                            onClick={() => handleDietaryChange(item)}
                            className={`py-3 px-5 rounded-full text-[9px] font-bold transition-all border ${formData.dietary.includes(item) ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100'}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-6 rounded-3xl space-y-3">
                      <label className="text-[9px] font-bold tracking-widest uppercase block text-zinc-400 flex items-center gap-2">
                        <MessageSquareHeart size={16} className="text-black" /> Un mensaje especial
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full border-none bg-transparent p-0 outline-none focus:ring-0 text-black font-medium text-sm placeholder:text-zinc-300 resize-none italic"
                        rows={3}
                        placeholder="Escribí tus deseos aquí..."
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-black text-white py-6 rounded-2xl text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <><Heart size={16} className="fill-current"/> ENVIAR RESPUESTA</>}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}