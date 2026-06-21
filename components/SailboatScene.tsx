"use client";

import { useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { Ocean } from "./Ocean";
import { Sailboat } from "./Sailboat";
import { Island } from "./Island";
import { ISLAND_NODES } from "@/lib/graph";
import { markVisited, isNodeUnlocked } from "@/lib/discovery";

export function SailboatScene() {
  const router = useRouter();
  const [nearIslandId, setNearIslandId] = useState<string | null>(null);

  const islandPositions = ISLAND_NODES.map((n) => ({
    id: n.id,
    x: n.worldPosition.x,
    z: n.worldPosition.z,
  }));

  const handleDiscover = useCallback(
    (id: string, route: string) => {
      markVisited(id);
      router.push(route);
    },
    [router]
  );

  // Spacebar enters the nearest unlocked island
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
    <div className="w-full h-full">
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
      </Canvas>
    </div>
  );
}
