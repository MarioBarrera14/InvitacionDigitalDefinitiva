"use client";

import { useState } from "react";
import { TicketPlus, Copy, Trash2 } from "lucide-react";

export default function GestionInvitados() {
  const [apellido, setApellido] = useState("");
  const [cupos, setCupos] = useState(1);
  const [listaInvitados, setListaInvitados] = useState<any[]>([]);

  // Función para generar código aleatorio
  const generarCodigo = (ape: string) => {
    const prefijo = ape.trim().substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefijo}${randomNum}`;
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apellido) return;

    const nuevoInvitado = {
      id: Date.now(),
      apellido: apellido.trim(),
      cupos: cupos,
      codigo: generarCodigo(apellido),
    };

    setListaInvitados([nuevoInvitado, ...listaInvitados]);
    setApellido("");
    setCupos(1);
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    alert(`Código ${codigo} copiado al portapapeles`);
  };

  return (
    <div className="p-6 lg:p-10 bg-zinc-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <div>
          <h1 className="text-3xl font-serif italic font-bold text-zinc-900">Gestión de Invitados</h1>
          <p className="text-zinc-500 text-sm mt-2">Carga las familias y genera sus códigos de acceso.</p>
        </div>

        {/* Formulario de Carga */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Familia / Apellido</label>
              <input 
                type="text" 
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej: Familia Garcia"
                /* He cambiado text-zinc-900 por text-black para mayor contraste */
                className="w-full border-b-2 border-zinc-100 py-2 outline-none focus:border-zinc-900 transition-colors font-semibold text-black placeholder:text-zinc-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cantidad de Lugares</label>
              <select 
                value={cupos}
                onChange={(e) => setCupos(parseInt(e.target.value))}
                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-lg py-2 px-2 outline-none focus:border-black font-bold text-black"
              >
                {/* Modificado para mostrar hasta 10 personas */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n} className="text-black bg-white">
                    {n} {n === 1 ? 'persona' : 'personas'}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              className="bg-zinc-900 text-white py-3 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              <TicketPlus size={18} /> Generar Pase
            </button>
          </form>
        </div>

        {/* Tabla de Resultados */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="p-4 text-[10px] font-black uppercase text-zinc-400">Familia</th>
                <th className="p-4 text-[10px] font-black uppercase text-zinc-400 text-center">Cupos</th>
                <th className="p-4 text-[10px] font-black uppercase text-zinc-400">Código Único</th>
                <th className="p-4 text-[10px] font-black uppercase text-zinc-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {listaInvitados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-zinc-400 italic text-sm">
                    No hay invitados cargados todavía.
                  </td>
                </tr>
              ) : (
                listaInvitados.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4 font-bold text-black">{inv.apellido}</td>
                    <td className="p-4 text-center">
                      <span className="bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold text-zinc-600">
                        {inv.cupos}
                      </span>
                    </td>
                    <td className="p-4">
                      <code className="bg-black text-white px-3 py-1 rounded text-sm font-mono tracking-wider">
                        {inv.codigo}
                      </code>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => copiarCodigo(inv.codigo)}
                        className="p-2 text-zinc-400 hover:text-black transition-colors"
                        title="Copiar Código"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}