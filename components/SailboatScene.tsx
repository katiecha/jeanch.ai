"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useRouter } from "next/navigation";
import { Ocean } from "./Ocean";
import { FishSchool } from "./FishSchool";
import { Sailboat, type SailboatHandle } from "./Sailboat";
import { Island } from "./Island";
import { ISLAND_NODES } from "@/lib/graph";
import { markVisited, isNodeUnlocked } from "@/lib/discovery";

export function SailboatScene() {
  const router = useRouter();
  const [nearIslandId, setNearIslandId] = useState<string | null>(null);
  const nearIslandIdRef = useRef<string | null>(null);
  const sailboatRef = useRef<SailboatHandle>(null);

  const islandPositions = ISLAND_NODES.map((n) => ({
    id: n.id,
    x: n.worldPosition.x,
    z: n.worldPosition.z,
  }));

  const handleNearIsland = useCallback((id: string | null) => {
    nearIslandIdRef.current = id;
    setNearIslandId(id);
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
      const id = nearIslandIdRef.current;
      if (e.code !== "Space" || !id) return;
      e.preventDefault();
      const node = ISLAND_NODES.find((n) => n.id === id);
      if (!node || !isNodeUnlocked(id, node.requires)) return;
      handleDiscover(id, node.route);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleDiscover]);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 7.5, 26], fov: 62 }} gl={{ antialias: true }}>
        <color attach="background" args={["#7BAFD4"]} />
        <ambientLight intensity={2.0} />
        <directionalLight position={[50, 80, 30]} intensity={1.2} color="#fff8f0" />
        <Ocean />
        <FishSchool />
        <Sailboat ref={sailboatRef} onNearIsland={handleNearIsland} islandPositions={islandPositions} />
        {ISLAND_NODES.map((node) => (
          <Island
            key={node.id}
            id={node.id}
            title={node.title}
            route={node.route}
            position={[node.worldPosition.x, 0, node.worldPosition.z]}
            isNear={nearIslandId === node.id}
            isUnlocked={isNodeUnlocked(node.id, node.requires)}
            onDiscover={handleDiscover}
          />
        ))}
        <EffectComposer multisampling={4}>
          <Bloom luminanceThreshold={0.65} luminanceSmoothing={0.45} intensity={0.45} />
          <Vignette eskil={false} offset={0.18} darkness={0.45} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new Vector2(0.00045, 0.0003)}
            opacity={0.12}
          />
        </EffectComposer>
      </Canvas>
      <button
        onClick={() => sailboatRef.current?.reset()}
        className="absolute bottom-6 right-8 z-10 text-white/60 hover:text-white text-xl font-mono transition-colors"
        title="Return to start"
      >
        ⌂
      </button>
    </div>
  );
}
