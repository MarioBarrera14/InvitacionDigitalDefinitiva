"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Gift, Shirt, Copy, Pencil, Loader2 } from "lucide-react";
import { getEventConfig, updateEventDetails } from "@/app/api/admin/details/route";
import Swal from "sweetalert2";

export default function DetailsConfigPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados
  const [dressCode, setDressCode] = useState<string>("Elegante Sport");
  const [dressDescription, setDressDescription] = useState<string>("");
  const [cbu, setCbu] = useState<string>("");
  const [alias, setAlias] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [holderName, setHolderName] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const config = await getEventConfig();
        if (config) {
          setDressCode(config.dressCode || "");
          setDressDescription(config.dressDescription || "");
          setCbu(config.cbu || "");
          setAlias(config.alias || "");
          setBankName(config.bankName || "");
          setHolderName(config.holderName || "");
        }
      } catch (err) {
        console.error("Error cargando configuración:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateEventDetails({
        dressCode,
        dressDescription,
        cbu,
        alias,
        bankName,
        holderName,
      });

      if (result.success) {
        Swal.fire({
          title: "¡Guardado!",
          text: "Los detalles se actualizaron correctamente. ✨",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: "#18181b",
          customClass: {
            popup: 'rounded-3xl'
          }
        });
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar los cambios.",
        icon: "error",
        confirmButtonColor: "#18181b",
        customClass: {
          popup: 'rounded-3xl'
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif italic font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <Pencil className="h-7 w-7 text-zinc-400" /> Editar Detalles
          </h1>
          <p className="text-zinc-500 text-sm">Configura la vestimenta y datos de regalos</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? "GUARDANDO..." : "GUARDAR"}
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* SECCIÓN VESTIMENTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-zinc-100 dark:border-slate-900 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-zinc-100 dark:bg-slate-900 rounded-2xl text-zinc-600 dark:text-zinc-300">
              <Shirt className="h-6 w-6" />
            </div>
            <h2 className="font-bold text-zinc-800 dark:text-zinc-100 uppercase text-xs tracking-widest">Código de Vestimenta</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block">Tipo de Outfit</label>
              <input 
                type="text" 
                value={dressCode} 
                onChange={(e) => setDressCode(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-xl p-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-zinc-100 font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block">Sugerencia corta</label>
              <textarea 
                value={dressDescription} 
                onChange={(e) => setDressDescription(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-xl p-4 text-black dark:text-white outline-none h-24 resize-none focus:ring-2 focus:ring-zinc-100 font-medium"
              />
            </div>
          </div>
        </motion.div>

        {/* SECCIÓN REGALOS / CBU */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-zinc-100 dark:border-slate-900 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-zinc-100 dark:bg-slate-900 rounded-2xl text-zinc-600 dark:text-zinc-300">
              <Gift className="h-6 w-6" />
            </div>
            <h2 className="font-bold text-zinc-800 dark:text-zinc-100 uppercase text-xs tracking-widest">Datos de Regalos</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block">CBU / CVU</label>
              <input 
                type="text" 
                value={cbu} 
                onChange={(e) => setCbu(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-xl p-4 font-mono text-sm text-black dark:text-white outline-none focus:ring-2 focus:ring-zinc-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block">Alias</label>
                <input 
                  type="text" 
                  value={alias} 
                  onChange={(e) => setAlias(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-xl p-4 font-serif italic text-black dark:text-white outline-none focus:ring-2 focus:ring-zinc-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block">Banco / App</label>
                <input 
                  type="text" 
                  value={bankName} 
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-xl p-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-zinc-100 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block">Titular de la cuenta</label>
              <input 
                type="text" 
                value={holderName} 
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-slate-900 border-none rounded-xl p-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-zinc-100 font-medium"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}