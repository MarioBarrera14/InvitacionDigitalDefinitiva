'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  UserCircle, 
  Users, 
  Baby, 
  Loader2,
  Search,
  ChevronDown,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Guest {
  id: string;
  name: string;
  adults: number;
  kids: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  attendanceChoice?: string; // Campo opcional para el texto exacto del emoji
  allergy?: string;
  updatedAt: string;
}

export default function AdminAttendancePage() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/asistencia');
      if (res.ok) {
        const data = await res.json();
        setGuests(data || []);
      } else {
        const mockData: Guest[] = [
          { id: '1', name: 'Juan Pérez', adults: 2, kids: 1, status: 'CONFIRMED', allergy: 'Maní', updatedAt: '' },
          { id: '2', name: 'Maria Garcia', adults: 1, kids: 0, status: 'PENDING', updatedAt: '' },
          { id: '3', name: 'Familia Rodríguez', adults: 4, kids: 2, status: 'CANCELLED', allergy: 'Gluten', updatedAt: '' },
        ];
        setGuests(mockData);
      }
    } catch (error) {
      console.error('Error al cargar invitados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const filteredGuests = useMemo(() => {
    return guests.filter(guest => 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guests, searchTerm]);

  const handleUpdateStatus = async () => {
    if (!selectedGuest) return;
    
    try {
      const res = await fetch(`/api/asistencia/${selectedGuest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setGuests(prev => prev.map(g => 
          g.id === selectedGuest.id ? { ...g, status: newStatus as any } : g
        ));
        setShowModal(false);
      } else {
        setGuests(prev => prev.map(g => 
          g.id === selectedGuest.id ? { ...g, status: newStatus as any } : g
        ));
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error al actualizar");
    }
  };

  const openStatusModal = (guest: Guest) => {
    setSelectedGuest(guest);
    setNewStatus(guest.status);
    setShowModal(true);
  };

  // --- MODIFICACIÓN AQUÍ: Función mejorada para mostrar los textos que quieres ---
  const getStatusBadge = (guest: Guest) => {
    const styles: Record<string, string> = {
      CONFIRMED: 'bg-emerald-50 text-emerald-700 border border-emerald-100', // Verde suave para el SI
      PENDING: 'bg-zinc-100 text-zinc-500',
      CANCELLED: 'bg-rose-50 text-rose-600 border border-rose-100',
    };

    // Si la DB trae un texto personalizado (attendanceChoice), lo usamos. 
    // Si no, usamos los labels por defecto que pediste.
    const labels: Record<string, string> = {
      CONFIRMED: '¡SÍ, OBVIO! 🤩',
      PENDING: 'PENDIENTE ⏳',
      CANCELLED: 'NO ASISTE 😥',
    };

    const displayLabel = guest.attendanceChoice || labels[guest.status] || guest.status;

    return (
      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${styles[guest.status] || ''}`}>
        {displayLabel}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-6 sm:py-12">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center w-fit gap-2 px-3 py-2 text-zinc-400 hover:text-black transition-colors rounded-lg hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </button>
            <button onClick={fetchGuests} className="p-2 text-zinc-400 hover:text-black transition-all bg-white rounded-full shadow-sm border border-zinc-100">
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif italic text-black">Lista de Asistencia</h1>
              <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">XV Luz Jazmín — Gestión</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre..."
                className="pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-black outline-none text-sm transition-colors w-full md:w-80 font-medium shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden md:block border border-zinc-100 rounded-3xl overflow-hidden shadow-md bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Invitado</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">Max</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Estado</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                        <UserCircle className="h-6 w-6 text-zinc-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-black uppercase tracking-tight">{guest.name}</div>
                        <div className="text-[10px] text-zinc-400 italic font-medium">{guest.allergy || 'Sin restricciones'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded text-zinc-600">{guest.adults} Ad.</span>
                        {guest.kids > 0 && <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded text-zinc-600">{guest.kids} Niñ.</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(guest)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => openStatusModal(guest)} 
                      className="text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-all rounded-xl h-9 px-5 inline-flex items-center"
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredGuests.length === 0 && (
            <div className="p-20 text-center text-zinc-400 text-sm italic">No se encontraron invitados.</div>
          )}
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredGuests.map((guest) => (
            <div key={guest.id} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-black text-base uppercase tracking-tight leading-none mb-2">{guest.name}</h3>
                  <p className="text-[10px] text-zinc-400 font-bold italic">{guest.allergy || 'Sin restricciones'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                    <Users className="h-3 w-3 text-zinc-400" />
                    <span className="text-[10px] font-black">{guest.adults}</span>
                  </div>
                  {guest.kids > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                      <Baby className="h-3 w-3 text-zinc-400" />
                      <span className="text-[10px] font-black">{guest.kids}</span>
                    </div>
                  )}
                </div>
                {getStatusBadge(guest)}
              </div>

              <button 
                onClick={() => openStatusModal(guest)} 
                className="w-full bg-zinc-100 text-black h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all border border-zinc-200"
              >
                Cambiar Estado
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Estado */}
      <AnimatePresence>
        {showModal && selectedGuest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
              className="bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl w-full max-w-sm p-10 border border-zinc-100"
            >
              <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-8 sm:hidden" />
              <h2 className="text-2xl font-serif italic text-black mb-2 text-center">Gestionar Pase</h2>
              <p className="text-center text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-8">{selectedGuest.name}</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 text-center">Estado de Asistencia</label>
                  <div className="relative">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full h-14 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 transition-all appearance-none text-center"
                    >
                      <option value="CONFIRMED">¡SÍ, OBVIO! 🤩</option>
                      <option value="PENDING">PENDIENTE ⏳</option>
                      <option value="CANCELLED">NO ASISTE ❌</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={handleUpdateStatus} 
                    className="w-full h-14 bg-black text-white hover:bg-zinc-800 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/10 active:scale-95"
                  >
                    Guardar Cambios
                  </button>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="w-full h-12 text-zinc-400 hover:text-black font-bold uppercase tracking-widest text-[10px] transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}