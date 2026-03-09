'use client';

import { useEffect, useState, useCallback } from 'react'; // Añadido useCallback
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  UserCircle, 
  Users, 
  Baby, 
  Loader2,
  Search,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Guest {
  id: string;
  name: string;
  adults: number;
  kids: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  allergy?: string;
  updatedAt: string;
}

export default function AdminAttendancePage() {
  const status = 'authenticated'; 
  const session = { user: { role: 'ADMIN' } }; 
  
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newStatus, setNewStatus] = useState('');

  // Usamos useCallback para que la función no cambie en cada renderizado
  const fetchGuests = useCallback(async () => {
    try {
      // COMENTADO PARA EVITAR 404: 
      /*
      const res = await fetch('/api/asistencia');
      if (res.ok) {
        const data = await res.json();
        setGuests(data || []);
        return;
      }
      */

      // DATOS DE PRUEBA (Se mostrarán estos mientras no habilites la API arriba)
      const mockData: Guest[] = [
        { id: '1', name: 'Juan Pérez', adults: 2, kids: 1, status: 'CONFIRMED', allergy: 'Maní', updatedAt: '' },
        { id: '2', name: 'Maria Garcia', adults: 1, kids: 0, status: 'PENDING', updatedAt: '' },
        { id: '3', name: 'Familia Rodríguez', adults: 4, kids: 2, status: 'CANCELLED', allergy: 'Gluten', updatedAt: '' },
      ];
      setGuests(mockData);

    } catch (error) {
      console.error('Error al cargar invitados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGuests();
    }
  }, [status, fetchGuests]); // Dependencias limpias

  const openStatusModal = (guest: Guest) => {
    setSelectedGuest(guest);
    setNewStatus(guest.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedGuest) return;
    
    // Actualización local para que veas el cambio sin necesidad de API
    setGuests(prev => prev.map(g => 
      g.id === selectedGuest.id ? { ...g, status: newStatus as any } : g
    ));
    
    setShowModal(false);
    console.log(`Estado de ${selectedGuest.name} actualizado a ${newStatus}`);
    
    // Aquí iría el fetch PUT cuando tu API esté lista
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: 'bg-black text-white',
      PENDING: 'bg-zinc-100 text-zinc-500',
      CANCELLED: 'bg-rose-50 text-rose-600 border border-rose-100',
    };

    const labels: Record<string, string> = {
      CONFIRMED: 'Confirmado',
      PENDING: 'Pendiente',
      CANCELLED: 'No asiste',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${styles[status] || ''}`}>
        {labels[status] || status}
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
    <div className="min-h-screen bg-white py-6 sm:py-12">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-10">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center w-fit gap-2 -ml-2 px-3 py-2 text-zinc-400 hover:text-black transition-colors rounded-lg hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Panel
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif italic text-black">Lista de Asistencia</h1>
              <p className="text-zinc-400 text-xs uppercase tracking-[0.3em] mt-2">XV Luz Jazmín — Invitados</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Buscar invitado..."
                className="pl-10 pr-4 py-2 border-b border-zinc-200 focus:border-black outline-none text-sm transition-colors w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block border border-zinc-100 rounded-3xl overflow-hidden shadow-sm bg-white">
          <table className="w-full">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Invitado</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">Adultos</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">Niños</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Estado</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-zinc-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                        <UserCircle className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-black">{guest.name}</div>
                        <div className="text-[10px] text-zinc-400 italic">{guest.allergy || 'Sin alergias'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">{guest.adults}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium">{guest.kids}</td>
                  <td className="px-6 py-4">{getStatusBadge(guest.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openStatusModal(guest)} 
                      className="text-[10px] font-bold uppercase tracking-widest border border-zinc-200 hover:bg-black hover:text-white transition-all rounded-full h-8 px-4 inline-flex items-center"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {guests.map((guest) => (
            <div key={guest.id} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-black">{guest.name}</h3>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Invitado</p>
                </div>
                {getStatusBadge(guest.status)}
              </div>
              <div className="flex gap-4 mb-4 p-3 bg-zinc-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-bold">{guest.adults} Adultos</span>
                </div>
                <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
                  <Baby className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-bold">{guest.kids} Niños</span>
                </div>
              </div>
              <button 
                onClick={() => openStatusModal(guest)} 
                className="w-full bg-black text-white hover:bg-zinc-800 rounded-xl h-11 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Cambiar Estado
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedGuest && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl w-full max-w-md p-8 border border-zinc-100"
            >
              <h2 className="text-xl font-serif italic text-black mb-6 text-center">Actualizar Asistencia</h2>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Invitado</p>
                  <p className="font-bold text-lg">{selectedGuest.name}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 text-center">Nuevo Estado</label>
                  <div className="relative">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full h-12 rounded-xl border border-zinc-100 bg-zinc-50 px-4 text-sm outline-none focus:ring-1 focus:ring-black transition-all appearance-none text-center"
                    >
                      <option value="CONFIRMED">Confirmado</option>
                      <option value="PENDING">Pendiente</option>
                      <option value="CANCELLED">No asiste</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleUpdateStatus} 
                    className="w-full h-12 bg-black text-white hover:bg-zinc-800 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-black/10"
                  >
                    Guardar Cambios
                  </button>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="w-full h-12 text-zinc-400 hover:text-black font-bold uppercase tracking-widest text-[10px] transition-colors"
                  >
                    Cerrar
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