"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GRAPH } from "@/lib/graph";

interface NodeMeta {
  id: string;
  route: string;
  x: number;
  y: number;
}

const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  "happy-fathers-day": { x: 200, y: 300 },
  "ferry-dock":        { x: 70,  y: 190 },
  "old-baldy":         { x: 200, y: 80  },
  "old-boat-house":    { x: 330, y: 190 },
  "marsh-island": { x: 70, y: 280 },
  "shoals-club":       { x: 200, y: 200 },
  "commons-tower":     { x: 200, y: 20  },
};

const EDGES: Array<[string, string]> = [
  ["happy-fathers-day", "ferry-dock"],
  ["happy-fathers-day", "old-baldy"],
  ["happy-fathers-day", "old-boat-house"],
  ["happy-fathers-day", "marsh-island"],
  ["ferry-dock",        "shoals-club"],
  ["old-baldy",         "shoals-club"],
  ["old-boat-house",    "shoals-club"],
  ["marsh-island", "shoals-club"],
  ["shoals-club",       "commons-tower"],
];

export default function Home() {
  const router = useRouter();
  const nodes: NodeMeta[] = Object.values(GRAPH).map((n) => ({
    id: n.id,
    route: n.route,
    x: MAP_POSITIONS[n.id]?.x ?? 200,
    y: MAP_POSITIONS[n.id]?.y ?? 160,
  }));

  return (
    <main className="min-h-screen bg-[#e8eff7] flex flex-col items-center justify-center px-8 py-16">
      {/* Micro-label */}
      <p className="text-[7px] font-mono tracking-[0.8em] uppercase text-[#002147]/25 mb-12">
        Bald Head Island
      </p>

      {/* Graph — squares not circles, very sparse */}
      <svg
        viewBox="-10 -10 420 340"
        className="w-full max-w-sm"
        style={{ overflow: "visible" }}
      >
        {/* Edges */}
        {EDGES.map(([a, b]) => {
          const nA = nodes.find((n) => n.id === a);
          const nB = nodes.find((n) => n.id === b);
          if (!nA || !nB) return null;
          return (
            <line
              key={`${a}-${b}`}
              x1={nA.x} y1={nA.y} x2={nB.x} y2={nB.y}
              stroke="#002147"
              strokeWidth={0.75}
              strokeOpacity={0.22}
            />
          );
        })}

        {/* Nodes as squares — geometric, not circular */}
        {nodes.map((n) => (
          <g
            key={n.id}
            onClick={() => router.push(n.route)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={n.x - 7} y={n.y - 7}
              width={14} height={14}
              fill="#002147"
              fillOpacity={n.id === "happy-fathers-day" ? 0.32 : 0.9}
              stroke="#002147"
              strokeWidth={0.75}
              strokeOpacity={1}
            />
          </g>
        ))}
      </svg>

      {/* Return link — only UI element besides the graph */}
      <Link
        href="/happy-fathers-day"
        className="mt-16 text-[7px] font-mono tracking-[0.7em] uppercase text-[#002147]/25 hover:text-[#002147]/60 transition-colors"
      >
        Return to sea
      </Link>
    </main>
  );
}
