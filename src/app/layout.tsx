import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Delfi - ¡MIS XV! | Invitación Digital",
  description: "Te invito a celebrar conmigo mis XV años. 19 de diciembre de 2026 - ¡La fiesta del año!",
  keywords: ["invitación", "XV años", "quinceañera", "fiesta", "celebración"],
  openGraph: {
    title: "Delfi - ¡MIS XV!",
    description: "Te invito a celebrar conmigo mis XV años",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-grab/dist/index.global.js"
        />
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
