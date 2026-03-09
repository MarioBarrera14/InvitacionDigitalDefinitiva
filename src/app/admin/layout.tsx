// import { redirect } from 'next/navigation'; 
// import NextAuth from "next-auth"; 
// import { authOptions } from '@/lib/auth-options';
import { AdminSidebar } from '@/components/admin-sidebar';

// Comentamos la inicialización de auth
// const { auth } = NextAuth(authOptions as any);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Comentamos la obtención de sesión para evitar errores de módulo
  // const session = await auth();

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR: Se mantiene para ver la estructura */}
      <AdminSidebar />
      
      {/* MAIN CONTENT */}
      <main className="flex-1 w-full lg:ml-64 flex flex-col transition-all duration-300">
        
        {/* BARRA SUPERIOR DISCRETA */}
        <div className="h-14 border-b border-zinc-100 flex items-center justify-between px-8">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] uppercase tracking-tighter text-zinc-400 font-bold">Modo Diseño Activo</span>
           </div>
           <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
             Panel de Administración — Luz Jazmín
           </span>
        </div>

        <div className="p-4 sm:p-8 lg:p-12 flex-1">
          <div className="max-w-6xl mx-auto w-full">
            <div className="max-w-full">
              {children}
            </div>
          </div>
        </div>
        
        {/* FOOTER */}
        <footer className="p-8 border-t border-zinc-50">
          <p className="text-center text-[9px] uppercase tracking-widest text-zinc-300">
            © 2026 Dashboard de Evento Privado
          </p>
        </footer>
      </main>
    </div>
  );
}