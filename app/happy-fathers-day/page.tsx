"use client";

import { useState, useEffect } from "react";
import { SailboatScene } from "@/components/SailboatScene";
import { markVisited } from "@/lib/discovery";

export default function HappyFathersDay() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    markVisited("happy-fathers-day");
    const handleKey = (e: KeyboardEvent) => {
      if (showIntro && e.code !== "Space") dismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showIntro]);

  function dismiss() {
    setFadingOut(true);
    setTimeout(() => setShowIntro(false), 600);
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <SailboatScene />

      {/* Intro — monument plaque floating over the ocean */}
      {showIntro && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-600 ${
            fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Barely-there backdrop — ocean stays present */}
          <div
            className="absolute inset-0 backdrop-blur-[2px]"
            onClick={dismiss}
          />

          {/* Monument plaque — sharp geometry, generous whitespace */}
          <div
            className="relative bg-white w-[232px]"
            style={{
              boxShadow:
                "0 48px 96px rgba(0,33,71,0.14), 0 0 0 1px rgba(0,33,71,0.05)",
            }}
          >
            {/* Accent bar — the only color element */}
            <div className="h-[2px] bg-[#002147]" />

            <div className="px-10 py-14 text-center">
              {/* Location micro-label */}
              <p className="text-[7px] font-mono tracking-[0.8em] uppercase text-[#002147]/25 mb-14">
                Bald Head Island
              </p>

              {/* Dominant heading — carved in, not layered on */}
              <h1 className="text-[#002147] text-[32px] font-bold leading-[1.1] tracking-tight mb-8">
                Happy
                <br />
                Father&apos;s
                <br />
                Day
              </h1>

              {/* Thin rule */}
              <div className="w-6 h-px bg-[#002147]/20 mx-auto mb-6" />

              {/* Secondary — quiet, recessive */}
              <p className="text-[#002147]/35 text-[10px] tracking-[0.5em] uppercase font-light mb-14">
                Dad
              </p>

              {/* Signature */}
              <p className="text-[7px] font-mono tracking-[0.7em] uppercase text-[#002147]/20 mb-12">
                Love, Katie
              </p>

              {/* Ghost button — fills solid on hover */}
              <button
                onClick={dismiss}
                className="w-full py-3 border border-[#002147]/25 text-[#002147] text-[8px] font-mono tracking-[0.7em] uppercase hover:bg-[#002147] hover:text-white hover:border-[#002147] transition-all duration-500"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help — bottom right, silent until tapped */}
      {!showIntro && (
        <div className="absolute bottom-6 right-6">
          {showHelp && (
            <div className="mb-3 bg-white/90 backdrop-blur-sm text-[#002147] text-[9px] font-mono tracking-widest p-4 space-y-2 shadow-lg border-l-2 border-[#002147]">
              <p>W A S D — sail</p>
              <p>Space — enter island</p>
              <p>Sail close to discover</p>
            </div>
          )}
          <button
            onClick={() => setShowHelp((v) => !v)}
            className="w-7 h-7 bg-white/80 hover:bg-white text-[#002147] text-xs font-mono rounded-full flex items-center justify-center shadow-md transition-colors"
          >
            i
          </button>
        </div>
      )}
    </main>
  );
}
