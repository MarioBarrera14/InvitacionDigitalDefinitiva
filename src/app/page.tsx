import { Hero } from "../components/Hero";
import { Countdown } from "../components/Countdownn";
import { Location } from "../components/Location";
import { Details } from "../components/Details";
import { RSVP } from "../components/RSVP";
import { Footer } from "../components/Footer";
import Envelope from "@/components/Envelope";
import { FotoCarousel } from "../components/carrousell";
import { MusicSuggestion } from "@/components/GuestbookAction";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma"; 

export default async function Home() {
  // 1. Traemos la configuración de la DB
  const config = await prisma.eventConfig.findUnique({
    where: { id: 1 },
  });

  // Si no existe la fila con ID 1, mostramos un aviso
  if (!config) return <div className="text-white text-center py-20">No se encontró la configuración en la base de datos.</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Envelope musicUrl={config.musicUrl || ""}>
        
        {/* 1. NAVBAR: Ahora recibe el nombre de la DB */}
        <Navbar eventName={config.eventName} />
        
        {/* 2. HERO: También usa eventName */}
        <Hero 
          eventName={config.eventName || "Nuestra Boda"} 
          heroImage={config.heroImage} 
        />

        {/* 3. CONTADOR */}
        <Countdown 
          eventDate={config.eventDate || "2026-12-19"} 
          eventTime={config.eventTime || "21:00"} 
        />

        {/* 4. CAROUSEL */}
        <FotoCarousel 
          images={config.carruselImages} 
          videoUrl={config.videoUrl} 
        />

        {/* 5. DETALLES: Vestimenta y Regalos */}
        <Details 
          dressCode={config.dressCode}
          dressDescription={config.dressDescription}
          alias={config.alias}
          cbu={config.cbu}
          bankName={config.bankName}
          holderName={config.holderName}
        />

        {/* 6. UBICACIÓN */}
        <Location 
          venueName={config.venueName}
          venueAddress={config.venueAddress}
          mapLink={config.mapLink}
        />

        {/* 7. EXTRAS Y CIERRE */}
        <MusicSuggestion />     
        <RSVP />
        <Footer />
      </Envelope>
    </main>
  );
}