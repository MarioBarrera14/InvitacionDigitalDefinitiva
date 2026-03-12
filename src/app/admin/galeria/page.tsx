"use client";

import { useState, useRef } from "react";
import { ImagePlus, Save, Trash2, Layout, Upload } from "lucide-react";

export default function GestionGaleria() {
  const [fotoPrincipal, setFotoPrincipal] = useState<string | null>(null);
  const [carrusel, setCarrusel] = useState<(string | null)[]>([null, null, null, null, null]);
  
  // Referencias para disparar los inputs ocultos
  const mainInputRef = useRef<HTMLInputElement>(null);
  const carruselRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Manejador para la foto principal
  const handleMainFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoPrincipal(URL.createObjectURL(file));
    }
  };

  // Manejador para el carrusel
  const handleCarruselFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const nuevasFotos = [...carrusel];
      nuevasFotos[index] = URL.createObjectURL(file);
      setCarrusel(nuevasFotos);
    }
  };

  const removeFotoCarrusel = (index: number) => {
    const nuevasFotos = [...carrusel];
    nuevasFotos[index] = null;
    setCarrusel(nuevasFotos);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif italic font-bold text-zinc-900">Gestión de Imágenes</h1>
        <p className="text-zinc-500 text-sm mt-2">Sube las fotos directamente desde tu dispositivo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FOTO PRINCIPAL */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <div className="flex items-center gap-2 mb-6">
              <Layout className="text-zinc-400" size={20} />
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-800">Foto de Portada</h2>
            </div>
            
            <div 
              onClick={() => mainInputRef.current?.click()}
              className="aspect-[3/4] w-full bg-zinc-50 rounded-xl overflow-hidden mb-4 border-2 border-dashed border-zinc-200 flex items-center justify-center relative cursor-pointer hover:bg-zinc-100 transition-colors group"
            >
              {fotoPrincipal ? (
                <img src={fotoPrincipal} alt="Principal" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto text-zinc-300 mb-2 group-hover:text-zinc-500 transition-colors" size={32} />
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Click para subir</p>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={mainInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleMainFile} 
            />
            
            <button 
              onClick={() => mainInputRef.current?.click()}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800"
            >
              {fotoPrincipal ? "Cambiar Foto" : "Seleccionar Archivo"}
            </button>
          </div>
        </div>

        {/* CARRUSEL */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <ImagePlus className="text-zinc-400" size={20} />
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-800">Carrusel (Máx 5)</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {carrusel.map((url, index) => (
                <div key={index} className="space-y-3">
                  <div 
                    onClick={() => carruselRefs.current[index]?.click()}
                    className="aspect-[2/3] bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 relative group cursor-pointer hover:border-zinc-300 transition-all"
                  >
                    {url ? (
                      <img src={url} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-300">
                        <Upload size={20} className="mb-1" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter">Subir {index + 1}</span>
                      </div>
                    )}
                    
                    {url && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFotoCarrusel(index); }}
                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  
                  <input 
                    type="file"
                    ref={el => { carruselRefs.current[index] = el }}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleCarruselFile(index, e)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-zinc-100 flex justify-end">
              <button className="bg-black text-white px-8 py-4 rounded-xl text-xs font-black tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg">
                <Save size={18} /> Guardar Galería
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}