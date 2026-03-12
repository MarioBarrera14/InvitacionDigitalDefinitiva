import { AdminSidebar } from '@/components/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <AdminSidebar />
      
      {/* MAIN CONTENT */}
      {/* Explicación de cambios:
          - lg:ml-64: Solo aplica margen en pantallas grandes.
          - pt-16 lg:pt-0: Deja espacio arriba en móvil para que el botón de menú (que suele estar fijo) no tape el contenido.
      */}
      <main className="flex-1 w-full lg:ml-64 flex flex-col transition-all duration-300 min-w-0">
        
        {/* BARRA SUPERIOR DISCRETA */}
        {/* Ajustada con padding responsivo (px-4 en móvil, px-8 en PC) */}
        <div className="h-14 border-b border-zinc-100 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-tighter text-zinc-400 font-bold">
                Modo Diseño Activo
              </span>
           </div>
           <span className="hidden xs:block text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-400 font-medium text-right">
             Panel de Administración
           </span>
        </div>

        {/* CONTENEDOR DINÁMICO DE HIJOS */}
        {/* - p-4: Espaciado mínimo en móvil.
            - md:p-8 / lg:p-12: Espaciado generoso en pantallas grandes.
            - overflow-x-hidden: Evita que tablas anchas rompan el diseño del celular.
        */}
        <div className="p-4 md:p-8 lg:p-12 flex-1 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full">
            <div className="w-full overflow-hidden">
              {children}
            </div>
          </div>
        </div>
        
        {/* FOOTER */}
        <footer className="p-6 md:p-8 border-t border-zinc-50 bg-zinc-50/30">
          <p className="text-center text-[9px] uppercase tracking-widest text-zinc-300">
            © 2026 Dashboard de Evento Privado
          </p>
        </footer>
      </main>
    </div>
  );
}