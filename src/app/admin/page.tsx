"use client";

import { useEffect, useState } from "react";
import { MessageSquare, CheckCheck, Utensils } from "lucide-react"; // Añadí Utensils para coherencia visual
import { motion } from "framer-motion";

interface Message {
  id: string;
  apellido: string; // Cambiado de 'name' a 'apellido' para coincidir con tu DB
  dietary: string;
  status: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/guests");
        const invitados = await response.json();
        
        // Filtramos solo los que confirmaron
        const confirmados = invitados
          .filter((inv: any) => inv.status === "CONFIRMED")
          .reverse(); 

        setMessages(confirmados);
      } catch (error) {
        console.error("Error cargando mensajes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* HEADER ESTILO WHATSAPP */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Muro de Confirmaciones</h1>
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            En línea ahora
          </p>
        </div>
        <div className="bg-zinc-100 p-3 rounded-full text-zinc-400">
          <MessageSquare size={20} />
        </div>
      </div>

      {/* CONTENEDOR DE CHAT */}
      <div className="space-y-4 bg-[#efe7dd] p-4 sm:p-6 rounded-[2rem] min-h-[500px] border border-zinc-200 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        {loading ? (
          <div className="flex justify-center items-center h-full text-zinc-400 font-serif italic">
            Abriendo chat...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">
            Aún no hay mensajes de confirmación.
          </div>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-start"
            >
              {/* BURBUJA DE MENSAJE */}
              <div className="relative max-w-[85%] bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-zinc-100">
                <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent" />
                
                {/* NOMBRE DEL INVITADO (APELLIDO) */}
                <p className="text-[10px] font-bold text-pink-500 mb-1 uppercase tracking-tighter">
                  {msg.apellido}
                </p>
                
                <p className="text-zinc-800 text-sm leading-snug mb-2">
                 {msg.dietary}
                </p>

                <div className="flex items-center justify-end gap-1">
                  <span className="text-[9px] text-zinc-400 uppercase">
                    Confirmado
                  </span>
                  <CheckCheck size={14} className="text-blue-400" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <p className="text-center text-[9px] text-zinc-400 uppercase tracking-widest font-medium">
        Las confirmaciones se actualizan automáticamente
      </p>
    </div>
  );
}