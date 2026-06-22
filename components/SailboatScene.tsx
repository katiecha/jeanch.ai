"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2, Group } from "three";
import { useRouter } from "next/navigation";
import { Ocean } from "./Ocean";
import { Sailboat, type SailboatHandle } from "./Sailboat";
import { Island } from "./Island";
import { ISLAND_NODES } from "@/lib/graph";
import { markVisited, isNodeUnlocked } from "@/lib/discovery";

type FishDatum = { x: number; y: number; z: number; color: string; s: number; spd: number; r: number };

const FISH_DATA: FishDatum[] = [
  { x: 8,   y: -1.8, z: 8,   color: "#f5a623", s: 0.9,  spd: 0.28, r: 7  },
  { x: -12, y: -2.2, z: 3,   color: "#e74c3c", s: 0.7,  spd: 0.35, r: 5  },
  { x: 5,   y: -1.2, z: -12, color: "#f0c060", s: 1.1,  spd: 0.22, r: 9  },
  { x: -5,  y: -3.0, z: 18,  color: "#48c774", s: 0.85, spd: 0.18, r: 6  },
  { x: 18,  y: -1.6, z: -8,  color: "#ff9f43", s: 0.95, spd: 0.30, r: 8  },
  { x: -18, y: -2.5, z: -12, color: "#ffd93d", s: 1.0,  spd: 0.25, r: 7  },
  { x: 0,   y: -1.4, z: 28,  color: "#74b9ff", s: 0.8,  spd: 0.32, r: 5  },
  { x: 10,  y: -2.8, z: -20, color: "#fd79a8", s: 1.15, spd: 0.20, r: 10 },
  { x: -20, y: -1.9, z: 15,  color: "#a29bfe", s: 0.75, spd: 0.28, r: 6  },
  { x: 15,  y: -1.5, z: 25,  color: "#00b894", s: 0.9,  spd: 0.33, r: 7  },
  { x: -8,  y: -3.5, z: -18, color: "#e17055", s: 1.0,  spd: 0.15, r: 8  },
  { x: 25,  y: -2.0, z: 5,   color: "#6c5ce7", s: 0.85, spd: 0.27, r: 6  },
];

function SingleFish({ datum }: { datum: FishDatum }) {
  const ref = useRef<Group>(null);
  const angle = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    angle.current += delta * datum.spd;
    const a = angle.current;
    ref.current.position.set(
      datum.x + Math.sin(a) * datum.r,
      datum.y + Math.sin(a * 2.3) * 0.3,
      datum.z + Math.cos(a) * datum.r
    );
    ref.current.rotation.y = a - Math.PI / 2;
  });

  const s = datum.s;
  return (
    <group ref={ref}>
      <mesh scale={[s * 0.9, s * 0.35, s * 0.6]}>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshStandardMaterial color={datum.color} roughness={0.8} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0, s * 0.52]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[s * 0.45, s * 0.45, 0.06]} />
        <meshStandardMaterial color={datum.color} roughness={0.8} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function FishSchool() {
  return (
    <>
      {FISH_DATA.map((f, i) => <SingleFish key={i} datum={f} />)}
    </>
  );
}

export function SailboatScene() {
  const router = useRouter();
  const [nearIslandId, setNearIslandId] = useState<string | null>(null);
  const sailboatRef = useRef<SailboatHandle>(null);

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
      <Canvas camera={{ position: [0, 7.5, 26], fov: 62 }} gl={{ antialias: true }}>
        <color attach="background" args={["#7BAFD4"]} />
        <ambientLight intensity={2.0} />
        <directionalLight position={[50, 80, 30]} intensity={1.2} color="#fff8f0" />
        <Ocean />
        <FishSchool />
        <Sailboat ref={sailboatRef} onNearIsland={setNearIslandId} islandPositions={islandPositions} />
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
