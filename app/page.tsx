"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GRAPH } from "@/lib/graph";
import { getVisited, isMapFound } from "@/lib/discovery";

interface NodeMeta {
  id: string;
  title: string;
  route: string;
  visited: boolean;
  x: number;
  y: number;
}

const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  "happy-fathers-day": { x: 200, y: 300 },
  "ferry-dock":        { x: 70,  y: 190 },
  "old-baldy":         { x: 200, y: 80  },
  "old-boat-house":    { x: 330, y: 190 },
  "shoals-club":       { x: 200, y: 200 },
  "commons-tower":     { x: 200, y: 20  },
};

const EDGES: Array<[string, string]> = [
  ["happy-fathers-day", "ferry-dock"],
  ["happy-fathers-day", "old-baldy"],
  ["happy-fathers-day", "old-boat-house"],
  ["ferry-dock",        "shoals-club"],
  ["old-baldy",         "shoals-club"],
  ["old-boat-house",    "shoals-club"],
  ["shoals-club",       "commons-tower"],
];

export default function Home() {
  const router = useRouter();
  const [nodes, setNodes] = useState<NodeMeta[]>([]);
  const [mapFound, setMapFound] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const visited = getVisited();
      setMapFound(isMapFound());
      setNodes(
        Object.values(GRAPH).map((n) => ({
          id: n.id,
          title: n.title,
          route: n.route,
          visited: visited.includes(n.id),
          x: MAP_POSITIONS[n.id]?.x ?? 200,
          y: MAP_POSITIONS[n.id]?.y ?? 160,
        }))
      );
    }, 0);

    return () => window.clearTimeout(t);
  }, []);

  if (!mapFound) {
    return (
      <main className="min-h-screen bg-[#e8eff7] flex flex-col items-center justify-center">
        <p className="text-[8px] font-mono tracking-[0.7em] uppercase text-[#002147]/30">
          Keep sailing
        </p>
        <p className="text-[8px] font-mono tracking-[0.5em] uppercase text-[#002147]/15 mt-3">
          The map reveals itself
        </p>
        <Link
          href="/happy-fathers-day"
          className="mt-14 text-[8px] font-mono tracking-[0.5em] uppercase text-[#002147]/30 hover:text-[#002147] transition-colors"
        >
          Return to sea
        </Link>
      </main>
    );
  }

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
              strokeOpacity={nA.visited && nB.visited ? 0.25 : 0.06}
            />
          );
        })}

        {/* Nodes as squares — geometric, not circular */}
        {nodes.map((n) => (
          <g
            key={n.id}
            onClick={n.visited ? () => router.push(n.route) : undefined}
            style={{ cursor: n.visited ? "pointer" : "default" }}
          >
            <rect
              x={n.x - 7} y={n.y - 7}
              width={14} height={14}
              fill={n.visited ? "#002147" : "none"}
              stroke="#002147"
              strokeWidth={0.75}
              strokeOpacity={n.visited ? 1 : 0.2}
            />
            <text
              x={n.x}
              y={n.y + 24}
              textAnchor="middle"
              fontSize={7.5}
              fontFamily="monospace"
              letterSpacing="0.08em"
              fill="#002147"
              fillOpacity={n.visited ? 0.6 : 0.18}
            >
              {n.title.toUpperCase()}
            </text>
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
