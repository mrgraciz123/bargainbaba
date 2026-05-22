import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ 
  subsets: ["latin"], 
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"]
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "BargainBaba AI | India's First AI Wedding Negotiation & Budget Intelligence Platform",
  description: "Indian weddings are not planned. They are negotiated. Meet the AI agent that negotiates smarter than your smartest chacha. Get budget optimization, vendor overpricing detection, and emotional negotiation templates.",
  keywords: ["wedding planning", "wedding negotiation", "indian wedding budget", "wedding cost calculator", "shaadi negotiation", "openrouter ai wedding planner"],
  openGraph: {
    title: "BargainBaba AI | Indian Wedding Budget Strategy",
    description: "Squeeze vendor margins, predict relative drama, and plan your Indian wedding budget like a billionaire. India's first AI-native wedding negotiator.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${cinzel.variable} font-sans bg-[#110204] text-gray-100 min-h-screen relative selection:bg-amber-500 selection:text-black overflow-x-hidden`}>
        {/* Cinematic ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#8B1E3F]/20 via-transparent to-transparent pointer-events-none z-0" />
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none z-0" />
        
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}

