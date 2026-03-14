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



export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
       <Envelope>
        <Navbar/>
      <Hero />
      <Countdown />
       <FotoCarousel/>
       <MusicSuggestion/>
      <Location />
      <Details />
      <RSVP />
      <Footer />
      </Envelope>
    </main>
  );
}
