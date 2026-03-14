"use client";

import { useState, useRef, useEffect } from "react";
import { ImagePlus, Save, Trash2, Layout, Upload, Film, Play, X, CheckCircle2, Loader2, Eraser } from "lucide-react";
// 1. IMPORTAMOS LAS ACCIONES DE SERVIDOR
import { getEventConfig, updateEventDetails } from "@/app/api/admin/galeria/route";

export default function GestionGaleria() {
  const [fotoPrincipal, setFotoPrincipal] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [carrusel, setCarrusel] = useState<(string | null)[]>([null, null, null, null, null]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState<string | null>(null); 
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Estado de carga inicial

  const mainInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const carruselRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isVideo = (url: string | null) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(url) || url.includes("video/upload");
  };

  // --- 2. CARGA INICIAL DESDE LA BASE DE DATOS (No localstorage) ---
  useEffect(() => {
    async function loadData() {
      const config = await getEventConfig();
      if (config) {
        setFotoPrincipal(config.heroImage);
        setVideoFile(config.videoUrl);
        if (config.carruselImages) {
          try {
            const parsed = JSON.parse(config.carruselImages);
            if (Array.isArray(parsed)) setCarrusel(parsed);
          } catch (e) { console.error("Error carrusel", e); }
        }
      }
      setIsInitialLoading(false);
    }
    loadData();
  }, []);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Error al subir");
    const data = await res.json();
    return data.url; 
  };

  // --- 3. FUNCIÓN PUBLICAR CORREGIDA PARA USAR LA DB ---
  const handlePublicar = async () => {
    setIsSaving(true);
    
    // Preparamos los datos para Prisma
    const datosParaGuardar = {
      heroImage: fotoPrincipal || "",
      videoUrl: videoFile || "",
      carruselImages: JSON.stringify(carrusel)
    };

    const result = await updateEventDetails(datosParaGuardar);

    if (result.success) {
      alert("¡Invitación actualizada con éxito en la base de datos! ✨");
    } else {
      alert("Error al guardar en la base de datos.");
    }
    setIsSaving(false);
  };

  const handleLimpiarTodo = async () => {
    if (confirm("¿Borrar todo el contenido multimedia?")) {
      setFotoPrincipal(null);
      setVideoFile(null);
      setCarrusel([null, null, null, null, null]);
      
      // También limpiamos en la DB
      await updateEventDetails({
        heroImage: "",
        videoUrl: "",
        carruselImages: JSON.stringify([null, null, null, null, null])
      });
      alert("Contenido reseteado.");
    }
  };

  // --- HANDLERS (Se mantienen igual) ---
  const handleMainFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading("main");
      const url = await uploadFile(file);
      setFotoPrincipal(url);
    } catch (err) { alert("Error en portada"); } finally { setLoading(null); }
  };

  const handleVideoPrincipal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading("video-main");
      const url = await uploadFile(file);
      setVideoFile(url);
    } catch (err) { alert("Error al subir video"); } finally { setLoading(null); }
  };

  const handleCarruselFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(`carrusel-${index}`);
      const url = await uploadFile(file);
      const nuevasFotos = [...carrusel];
      nuevasFotos[index] = url;
      setCarrusel(nuevasFotos);
    } catch (err) { alert("Error en el archivo"); } finally { setLoading(null); }
  };

  if (isInitialLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-zinc-300" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2 block">Panel de Control</span>
          <h1 className="text-4xl font-serif italic text-zinc-900">Core Gallery</h1>
          <p className="text-zinc-500 text-sm mt-2">Sube fotos o videos cortos para tu invitación.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleLimpiarTodo} className="px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase border border-zinc-200 text-zinc-400 hover:text-rose-500 transition-all flex items-center gap-2">
            <Eraser size={16} /> Limpiar Todo
          </button>
          <button onClick={handlePublicar} disabled={isSaving} className="bg-zinc-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-xl active:scale-95">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} 
            {isSaving ? "GUARDANDO..." : "PUBLICAR"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* PORTADA Y VIDEO PRINCIPAL */}
        <div className="md:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-800 mb-6 flex items-center gap-2"><Layout size={16}/> Portada</h2>
            <div onClick={() => mainInputRef.current?.click()} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-50 border-2 border-dashed border-zinc-200 cursor-pointer flex items-center justify-center">
              {loading === "main" ? <Loader2 className="animate-spin text-indigo-500" /> : fotoPrincipal ? <img src={fotoPrincipal} className="w-full h-full object-cover" /> : <div className="text-center"><ImagePlus className="mx-auto text-zinc-300 mb-2"/><p className="text-[10px] font-bold text-zinc-400 uppercase">Subir Foto</p></div>}
            </div>
            <input type="file" ref={mainInputRef} className="hidden" accept="image/*" onChange={handleMainFile} />
          </section>

          <section className="bg-zinc-900 p-6 rounded-[2rem] text-white">
            <h2 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-indigo-400"><Film size={16}/> Video Destacado</h2>
            <div onClick={() => videoInputRef.current?.click()} className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 overflow-hidden relative">
              {loading === "video-main" ? <Loader2 className="animate-spin text-indigo-400" /> : videoFile ? <video src={videoFile} className="w-full h-full object-cover" autoPlay muted loop /> : <Play size={24} className="text-zinc-600" />}
            </div>
            <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoPrincipal} />
          </section>
        </div>

        {/* GALERÍA HÍBRIDA (CARRUSEL) */}
        <div className="md:col-span-8">
          <section className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm h-full">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-800 mb-8 flex items-center gap-2"><Upload size={16} className="text-indigo-600"/> Galería Dinámica (Fotos o Videos)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 h-[400px]">
              {carrusel.map((url, index) => (
                <div key={index} className="relative h-full">
                  <div 
                    onClick={() => carruselRefs.current[index]?.click()}
                    className={`h-full rounded-2xl overflow-hidden border-2 flex items-center justify-center cursor-pointer transition-all ${url ? 'border-transparent' : 'border-dashed border-zinc-100 bg-zinc-50'}`}
                  >
                    {loading === `carrusel-${index}` ? (
                      <Loader2 className="animate-spin text-indigo-500" size={16} />
                    ) : url ? (
                      isVideo(url) ? (
                        <video src={url} className="w-full h-full object-cover" muted loop autoPlay />
                      ) : (
                        <img src={url} className="w-full h-full object-cover" alt="Galería" />
                      )
                    ) : (
                      <Upload size={14} className="text-zinc-300" />
                    )}
                    
                    {url && (
                      <button onClick={(e) => { e.stopPropagation(); const n = [...carrusel]; n[index]=null; setCarrusel(n); }} className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-rose-500 shadow-sm opacity-100 transition-opacity"><X size={12}/></button>
                    )}
                  </div>
                  <input type="file" ref={el => { carruselRefs.current[index] = el }} className="hidden" accept="image/*,video/*" onChange={(e) => handleCarruselFile(index, e)} />
                </div>
              ))}
            </div>
            <p className="mt-6 text-[10px] text-zinc-400 italic font-medium tracking-tight">** Soporta formatos: JPG, PNG, MP4 y MOV.</p>
          </section>
        </div>
      </div>
    </div>
  );
}