"use client";

import { useState, useEffect } from "react";
import { SailboatScene } from "@/components/SailboatScene";
import { markVisited } from "@/lib/discovery";
import { GRAPH } from "@/lib/graph";

const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  "happy-fathers-day": { x: 200, y: 300 },
  "ferry-dock": { x: 70, y: 190 },
  "old-baldy": { x: 200, y: 80 },
  "old-boat-house": { x: 330, y: 190 },
  "marsh-island": { x: 70, y: 280 },
  "shoals-club": { x: 200, y: 200 },
  "commons-tower": { x: 200, y: 20 },
};

const MAP_EDGES: Array<[string, string]> = [
  ["happy-fathers-day", "ferry-dock"],
  ["happy-fathers-day", "old-baldy"],
  ["happy-fathers-day", "old-boat-house"],
  ["happy-fathers-day", "marsh-island"],
  ["ferry-dock", "shoals-club"],
  ["old-baldy", "shoals-club"],
  ["old-boat-house", "shoals-club"],
  ["marsh-island", "shoals-club"],
  ["shoals-club", "commons-tower"],
];

export default function HappyFathersDay() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMap, setShowMap] = useState(false);

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

      {showMap && !showIntro && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#002147]/10 backdrop-blur-[2px]">
          <div className="relative w-[min(92vw,560px)] bg-white/95 p-8 shadow-[0_36px_90px_rgba(0,33,71,0.22)] border-t-2 border-[#002147]">
            <button
              onClick={() => setShowMap(false)}
              aria-label="Close map"
              className="absolute right-4 top-4 w-7 h-7 text-[#002147]/45 hover:text-[#002147] font-mono text-sm transition-colors"
            >
              x
            </button>
            <svg viewBox="-12 -12 424 336" className="w-full" aria-label="Island map graph">
              {MAP_EDGES.map(([a, b]) => {
                const nA = MAP_POSITIONS[a];
                const nB = MAP_POSITIONS[b];
                if (!nA || !nB) return null;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={nA.x}
                    y1={nA.y}
                    x2={nB.x}
                    y2={nB.y}
                    stroke="#002147"
                    strokeWidth={0.75}
                    strokeOpacity={0.22}
                  />
                );
              })}
              {Object.values(GRAPH).map((node) => {
                const pos = MAP_POSITIONS[node.id];
                if (!pos) return null;
                return (
                  <g key={node.id}>
                    <rect
                      x={pos.x - 6}
                      y={pos.y - 6}
                      width={12}
                      height={12}
                      fill="#002147"
                      fillOpacity={node.id === "happy-fathers-day" ? 0.28 : 0.82}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 21}
                      textAnchor="middle"
                      fontSize={7}
                      fontFamily="monospace"
                      letterSpacing="0.08em"
                      fill="#002147"
                      fillOpacity={0.58}
                    >
                      {node.title.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Help — bottom right, silent until tapped */}
      {!showIntro && (
        <div className="absolute bottom-6 right-6">
          {showHelp && (
            <div className="mb-3 ml-auto w-fit bg-white/90 backdrop-blur-sm text-[#002147] text-[9px] font-mono tracking-widest p-4 space-y-2 shadow-lg border-l-2 border-[#002147]">
              <p>W A S D — sail</p>
              <p>Space — enter island</p>
              <p>Sail close to discover</p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMap((v) => !v);
                setShowHelp(false);
              }}
              aria-label="Map"
              className="w-7 h-7 bg-white/80 hover:bg-white text-[#002147] text-xs font-mono rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              □
            </button>
            <button
              onClick={() => {
                setShowHelp((v) => !v);
                setShowMap(false);
              }}
              aria-label="Help"
              className="w-7 h-7 bg-white/80 hover:bg-white text-[#002147] text-xs font-mono rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              i
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
