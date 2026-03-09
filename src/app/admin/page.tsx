"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";

// Interfaz simplificada para la fiesta
interface GuestStats {
  totalInvitados: number;
  confirmados: number;
  cancelados: number;
  pendientes: number;
  dataGrafica: { name: string; cantidad: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos (Sustituir por tu fetch real)
    const mockData: GuestStats = {
      totalInvitados: 150,
      confirmados: 85,
      cancelados: 12,
      pendientes: 53,
      dataGrafica: [
        { name: "Confirmados", cantidad: 85 },
        { name: "Pendientes", cantidad: 53 },
        { name: "Cancelados", cantidad: 12 },
      ],
    };
    setStats(mockData);
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-zinc-500">Cargando...</div>;

  // Paleta monocromática para las barras
  const COLORS = ["#000000", "#71717a", "#d4d4d8"];

  return (
    <div className="min-h-screen bg-white py-10 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl px-6">
        
        {/* HEADER ESTILO EDITORIAL */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-zinc-100 pb-8"
        >
          <h1 className="text-4xl font-serif italic text-black mb-1">Resumen de Invitados</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">XV Luz Jazmín • Dashboard</p>
        </motion.div>

        {/* METRICAS PRINCIPALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: stats?.totalInvitados, icon: Users, bg: 'bg-zinc-50' },
            { label: 'Confirmados', value: stats?.confirmados, icon: CheckCircle2, bg: 'bg-zinc-900', text: 'text-white', iconCol: 'text-white' },
            { label: 'Cancelados', value: stats?.cancelados, icon: XCircle, bg: 'bg-zinc-50' },
            { label: 'Pendientes', value: stats?.pendientes, icon: Clock, bg: 'bg-zinc-50' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`${item.bg} ${item.text || 'text-black'} rounded-2xl p-6 border border-zinc-100 flex items-center justify-between`}
            >
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${item.text ? 'opacity-70' : 'text-zinc-400'} mb-1`}>{item.label}</p>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
              <item.icon className={`h-6 w-6 ${item.iconCol || 'text-zinc-400'}`} />
            </motion.div>
          ))}
        </div>

        {/* GRÁFICA DE ASISTENCIA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-8 flex items-center gap-2 text-black">
            <TrendingUp className="h-4 w-4" /> 
            Estado de Confirmaciones
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.dataGrafica} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#71717a', fontWeight: 'bold' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#71717a' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f8f8' }}
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} barSize={50}>
                  {stats?.dataGrafica.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}