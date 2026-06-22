"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

type FishDatum = { x: number; y: number; z: number; color: string; s: number; spd: number; r: number };

const COLORS = [
  "#f5a623", "#e74c3c", "#f0c060", "#48c774", "#ff9f43",
  "#ffd93d", "#74b9ff", "#fd79a8", "#a29bfe", "#00b894",
  "#e17055", "#6c5ce7", "#fdcb6e", "#55efc4", "#fab1a0",
];

function makeFishData(count: number, spread: number, centerZ: number): FishDatum[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (Math.random() - 0.5) * spread * 2,
    y: -(1.2 + Math.random() * 2.8),
    z: centerZ + (Math.random() - 0.5) * spread * 2,
    color: COLORS[i % COLORS.length],
    s: 0.7 + Math.random() * 0.6,
    spd: 0.15 + Math.random() * 0.25,
    r: 4 + Math.random() * 8,
  }));
}

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

interface FishSchoolProps {
  count?: number;
  spread?: number;
  centerZ?: number;
}

export function FishSchool({ count = 12, spread = 30, centerZ = 0 }: FishSchoolProps) {
  const [fishData] = useState<FishDatum[]>(() => makeFishData(count, spread, centerZ));
  return (
    <>
      {fishData.map((f, i) => <SingleFish key={i} datum={f} />)}
    </>
  );
}
