"use client";

import { useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { Ocean } from "./Ocean";
import { Sailboat } from "./Sailboat";
import { Island } from "./Island";
import { MarshIsland } from "./MarshIsland";
import { ISLAND_NODES } from "@/lib/graph";
import {
  markVisited,
  isNodeUnlocked,
  hasCompletedAll,
  hasShownCompletion,
  markCompletionShown,
} from "@/lib/discovery";

export function SailboatScene() {
  const router = useRouter();
  const [nearIslandId, setNearIslandId] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const islandPositions = ISLAND_NODES.map((n) => ({
    id: n.id,
    x: n.worldPosition.x,
    z: n.worldPosition.z,
  }));

  // Show the Father's Day message once all islands have been visited
  useEffect(() => {
    if (hasCompletedAll() && !hasShownCompletion()) {
      setShowCompletion(true);
    }
  }, []);

  const handleDiscover = useCallback(
    (id: string, route: string) => {
      markVisited(id);
      router.push(route);
    },
    [router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || !nearIslandId) return;
      e.preventDefault();
      const node = ISLAND_NODES.find((n) => n.id === nearIslandId);
      if (!node || !isNodeUnlocked(nearIslandId, node.requires)) return;
      handleDiscover(nearIslandId, node.route);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearIslandId, handleDiscover]);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 14, 20], fov: 55 }} gl={{ antialias: true }}>
        <ambientLight intensity={2.0} />
        <directionalLight position={[50, 80, 30]} intensity={1.2} color="#fff8f0" />
        <Sky sunPosition={[80, 60, -40]} turbidity={2} rayleigh={2} mieCoefficient={0.003} mieDirectionalG={0.8} />
        <Ocean />
        <Sailboat onNearIsland={setNearIslandId} islandPositions={islandPositions} />
        {ISLAND_NODES.map((node) => (
          <Island
            key={node.id}
            id={node.id}
            route={node.route}
            position={[node.worldPosition.x, 0, node.worldPosition.z]}
            isNear={nearIslandId === node.id}
            isUnlocked={isNodeUnlocked(node.id, node.requires)}
            onDiscover={handleDiscover}
          />
        ))}
        {/* Decorative marsh — two low mudflat patches with swaying grass */}
        <MarshIsland position={[-40, 0, 5]} />
      </Canvas>

      {/* Father's Day completion modal */}
      {showCompletion && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 18, 42, 0.82)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-6 overflow-hidden">
            {/* Ocean gradient header */}
            <div
              className="px-8 py-7 text-center"
              style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)" }}
            >
              <div className="text-5xl mb-3">⛵</div>
              <h2 className="text-white text-2xl font-bold tracking-wide">
                All Islands Explored!
              </h2>
              <p className="text-blue-200 text-sm mt-1">You&apos;ve sailed every shore</p>
            </div>
            {/* Message */}
            <div className="px-8 py-8 text-center">
              <p className="text-slate-700 text-lg leading-relaxed font-medium">
                Happy Father&apos;s Day Dad! Thank you for always believing and supporting me.
                Love you to the moon and back!
              </p>
              <p className="text-slate-400 italic mt-5 text-base">— Love, Katie</p>
              <button
                onClick={() => {
                  markCompletionShown();
                  setShowCompletion(false);
                }}
                className="mt-8 px-10 py-3 rounded-full font-semibold text-base text-white transition-colors"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #0ea5e9)" }}
              >
                ♡ &nbsp;With Love
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
