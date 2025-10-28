import React from "react";
import LetterGlitch from "@/components/background/LetterGlitch";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* LetterGlitch background */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ filter: 'blur(0.5px) opacity(0.95)' }}>
        <LetterGlitch
          glitchColors={['#1e3a8a', '#7c3aed', '#ec4899', '#2563eb', '#0ea5e9', '#be123c']}
          glitchSpeed={150}
          centerVignette={false}
          outerVignette={true}
          smooth={true}
        />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}

