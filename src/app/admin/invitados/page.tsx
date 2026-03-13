"use client";

import { useState, useEffect } from "react";
import { TicketPlus, Copy, Trash2, Loader2, CheckCircle2, XCircle, Clock, Users, Mail, Utensils } from "lucide-react";

export default function GestionInvitados() {
  const [apellido, setApellido] = useState("");
  const [cupos, setCupos] = useState(1);
  const [listaInvitados, setListaInvitados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetch("/api/guests")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setListaInvitados(data);
      })
      .catch((err) => console.error("Error cargando invitados:", err));
  }, []);

  const stats = {
    totalPersonas: listaInvitados.reduce((acc, inv) => acc + inv.cupos, 0),
    confirmados: listaInvitados
      .filter(inv => inv.status === "CONFIRMED")
      .reduce((acc, inv) => acc + inv.cupos, 0),
    inasistencias: listaInvitados
      .filter(inv => inv.status === "CANCELLED")
      .reduce((acc, inv) => acc + inv.cupos, 0),
    invitacionesPendientes: listaInvitados
      .filter(inv => inv.status === "PENDING" || !inv.status).length
  };

  const generarCodigo = (ape: string) => {
    const prefijo = ape.trim().substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefijo}${randomNum}`;
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apellido || cargando) return;
    setCargando(true);
    const nuevoInvitado = {
      apellido: apellido.trim(),
      cupos: cupos,
      codigo: generarCodigo(apellido),
    };

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoInvitado),
      });
      if (response.ok) {
        const guardado = await response.json();
        setListaInvitados([guardado, ...listaInvitados]);
        setApellido("");
        setCupos(1);
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const eliminarInvitado = async (id: string) => {
    if (!confirm("¿Eliminar a este invitado?")) return;
    try {
      const response = await fetch(`/api/guests?id=${id}`, { method: "DELETE" });
      if (response.ok) setListaInvitados(listaInvitados.filter((inv) => inv.id !== id));
    } catch (error) {
      alert("No se pudo eliminar");
    }
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    const toast = document.createElement('div');
    toast.innerText = `Código ${codigo} copiado`;
    toast.className = "fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold z-50 animate-bounce shadow-2xl";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100"><CheckCircle2 size={10} /> Confirmado</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100"><XCircle size={10} /> No asiste</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100"><Clock size={10} /> Pendiente</span>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER Y STATS */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif italic font-bold text-zinc-900">Gestión de Invitados</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium mt-1">Control de accesos y rsvp</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Personas" value={stats.totalPersonas} icon={<Users size={14}/>} />
          <StatCard label="Confirmados" value={stats.confirmados} color="emerald" icon={<CheckCircle2 size={14}/>} />
          <StatCard label="No Asisten" value={stats.inasistencias} color="rose" icon={<XCircle size={14}/>} />
          <StatCard label="RSVP Pendientes" value={stats.invitacionesPendientes} color="dark" icon={<Mail size={14}/>} />
        </div>
      </div>

      {/* FORMULARIO DE ALTA */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-100">
        <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Familia / Apellido</label>
            <input 
              type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
              placeholder="Ej: Familia Garcia"
              className="w-full bg-zinc-50 border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-black transition-all font-bold text-zinc-800 placeholder:text-zinc-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Cupos</label>
            <select 
              value={cupos} onChange={(e) => setCupos(parseInt(e.target.value))}
              className="w-full bg-zinc-50 border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-black font-bold text-zinc-800 cursor-pointer appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Persona' : 'Personas'}</option>)}
            </select>
          </div>
          <button 
            type="submit" disabled={cargando || !apellido}
            className="w-full bg-zinc-900 hover:bg-black text-white py-3.5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 active:scale-95"
          >
            {cargando ? <Loader2 className="animate-spin" size={16} /> : <TicketPlus size={16} />} Generar Pase
          </button>
        </form>
      </div>

      {/* TABLA / LISTADO */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50/50">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Invitado</th>
                <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest text-center">Lugares</th>
                <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest text-center">Estado</th>
                <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest text-center">Código</th>
                <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {listaInvitados.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="p-6">
                    <span className="font-bold text-zinc-900">{inv.apellido}</span>
                    {inv.dietary && inv.dietary !== "Ninguna" && (
                      <span className="block text-[9px] text-rose-500 font-black mt-1 uppercase italic flex items-center gap-1">
                        <Utensils size={10} /> {inv.dietary}
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-center font-black text-zinc-400 text-sm">{inv.cupos}</td>
                  <td className="p-6 text-center">{renderStatus(inv.status)}</td>
                  <td className="p-6 text-center">
                    {/* CODIGO CORREGIDO: NEGRO Y VISIBLE */}
                    <button 
                      onClick={() => copiarCodigo(inv.codigo)} 
                      className="inline-flex items-center gap-2 font-mono font-bold bg-zinc-100 text-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 hover:bg-black hover:text-white hover:border-black transition-all group/code shadow-sm"
                    >
                      {inv.codigo} 
                      <Copy size={12} className="text-zinc-400 group-hover/code:text-white transition-colors"/>
                    </button>
                  </td>
                  <td className="p-6 text-right">
                    <button onClick={() => eliminarInvitado(inv.id)} className="text-zinc-200 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-zinc-100">
          {listaInvitados.length === 0 ? (
             <div className="p-10 text-center text-zinc-300 italic">No hay invitados registrados.</div>
          ) : (
            listaInvitados.map((inv) => (
              <div key={inv.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-zinc-900 text-lg leading-tight">{inv.apellido}</p>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">{inv.cupos} {inv.cupos === 1 ? 'Lugar' : 'Lugares'}</p>
                  </div>
                  {renderStatus(inv.status)}
                </div>
                
                {inv.dietary && inv.dietary !== "Ninguna" && (
                  <div className="bg-rose-50/50 p-3 rounded-2xl flex items-center gap-2 border border-rose-100">
                    <Utensils size={14} className="text-rose-500"/>
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-tighter">{inv.dietary}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => copiarCodigo(inv.codigo)} 
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 border border-zinc-200 py-3 rounded-2xl font-mono text-sm font-black active:scale-95 transition-all shadow-sm"
                  >
                    {inv.codigo} <Copy size={14} className="text-zinc-400"/>
                  </button>
                  <button onClick={() => eliminarInvitado(inv.id)} className="bg-zinc-100 text-zinc-400 p-3 rounded-2xl border border-zinc-200 active:bg-rose-50 active:text-rose-500 transition-colors">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: any) {
  const styles: any = {
    emerald: "border-emerald-100 text-emerald-600 bg-emerald-50/30",
    rose: "border-rose-100 text-rose-600 bg-rose-50/30",
    dark: "bg-zinc-900 text-white border-transparent",
    default: "bg-white border-zinc-100 text-zinc-900"
  };
  const current = styles[color] || styles.default;
  
  return (
    <div className={`${current} border p-5 rounded-[2rem] shadow-sm flex flex-col justify-between h-full transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center gap-2 opacity-50 mb-2">
        {icon}
        <p className="text-[9px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-2xl font-bold font-sans">{value}</p>
    </div>
  );
}