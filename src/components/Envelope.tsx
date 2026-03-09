"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Envelope({ children }: { children: React.ReactNode }) {
  const [passcode, setPasscode] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState(false)

  // Cambia aquí tu clave secreta
// 1. Definimos el código en MAYÚSCULAS para comparar fácil
  const SECRET_CODE = "LUZ" 

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault()
    // Convertimos lo que escribe el usuario a MAYÚSCULAS y comparamos
    if (passcode.toUpperCase() === SECRET_CODE) {
      setIsAuthorized(true)
      setError(false)
    } else {
      setError(true)
      setPasscode("")
      setTimeout(() => setError(false), 2000)
    }
  }

  // 1. Pantalla de Bloqueo (Solo se ve si no está autorizado)
  /*if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h2 className="mb-8 font-serif text-xl tracking-[0.4em] text-white uppercase">
            Acceso Privado
          </h2>
          <form onSubmit={handleAccess} className="space-y-6">
            <input
              type="password"
              placeholder="INGRESA TU CÓDIGO"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={`w-full bg-transparent border-b ${
                error ? "border-red-500" : "border-white/30"
              } py-3 text-center text-white outline-none transition-colors focus:border-white tracking-[0.5em] text-sm`}
            />
            {error && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase animate-shake">
                Código Incorrecto
              </p>
            )}
            <button
              type="submit"
              className="mt-4 px-10 py-3 border border-white/20 text-white text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all rounded-full"
            >
              Entrar
            </button>
          </form>
          <p className="mt-12 text-white/30 text-[9px] tracking-widest leading-loose uppercase">
            Esta invitación es personal.<br />Por favor, no compartas este enlace.
          </p>
        </motion.div>
      </div>
    )
  }*/

  // 2. Si está autorizado, mostramos el Sobre (Envelope)
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-100">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="envelope-wrapper"
            className="fixed inset-0 z-[100] flex items-center justify-center"
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              
              <motion.div 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-[#ebeae6] z-0" 
              />

              <motion.div
                exit={{ y: "-100%", rotateX: 180, opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.45, 0, 0.55, 1] }}
                className="absolute top-0 left-0 w-full h-1/2 bg-[#f9f9f9] origin-top z-40 shadow-xl"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  perspective: "1200px"
                }}
              />

              <motion.div
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.45, 0, 0.55, 1] }}
                className="absolute inset-0 z-30 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.05)]"
                style={{
                  clipPath: "polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)",
                }}
              />
              
              <motion.div 
                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
                className="z-50 flex flex-col items-center justify-center px-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(true)}
                  className="group relative flex h-32 w-32 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-black text-white shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all"
                >
                  <div className="text-center select-none z-10">
                    <span className="block font-serif text-2xl sm:text-3xl font-light tracking-tight">
                      Mis 15
                    </span>
                    <span className="block text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-2 opacity-60">
                      Abrir
                    </span>
                  </div>
                  <div className="absolute inset-2 rounded-full border border-white/10 group-hover:border-white/30 transition-colors" />
                </motion.button>
                
                <motion.p className="mt-8 font-serif italic text-neutral-500 text-base sm:text-xl tracking-wide animate-pulse">
                  Toca el sello para descubrir la magia
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className={`transition-opacity duration-1000 ${!isOpen ? "h-screen overflow-hidden opacity-0" : "min-h-screen opacity-100"}`}>
        {children}
      </main>
    </div>
  )
}