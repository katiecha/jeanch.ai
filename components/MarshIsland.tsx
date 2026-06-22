"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function MarshGrass({
  position,
  phase = 0,
  height = 0.9,
}: {
  position: [number, number, number];
  phase?: number;
  height?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 1.1 + phase) * 0.18;
    ref.current.rotation.x = Math.cos(t * 0.75 + phase) * 0.09;
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, height * 0.5, 0]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.06, height, 0.04]} />
        <meshStandardMaterial color="#5a7a30" roughness={1} />
      </mesh>
      <mesh position={[0.1, height * 0.45, 0.03]} rotation={[0.06, 0.2, -0.12]}>
        <boxGeometry args={[0.05, height * 0.85, 0.04]} />
        <meshStandardMaterial color="#6a8c3a" roughness={1} />
      </mesh>
      <mesh position={[-0.08, height * 0.47, -0.03]} rotation={[-0.04, -0.15, 0.10]}>
        <boxGeometry args={[0.05, height * 0.9, 0.04]} />
        <meshStandardMaterial color="#4c6a24" roughness={1} />
      </mesh>
    </group>
  );
}

function Cattail({ position, phase = 0 }: { position: [number, number, number]; phase?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.6 + phase) * 0.08;
  });

  return (
    <group ref={ref} position={position}>
      {/* Stem */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 5]} />
        <meshStandardMaterial color="#7a6030" roughness={1} />
      </mesh>
      {/* Cattail head */}
      <mesh position={[0, 1.68, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 6]} />
        <meshStandardMaterial color="#5a3a18" roughness={1} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0.15, 0.7, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.04, 1.1, 0.04]} />
        <meshStandardMaterial color="#6a8040" roughness={1} />
      </mesh>
      <mesh position={[-0.12, 0.65, 0.08]} rotation={[0.1, 0.2, 0.20]}>
        <boxGeometry args={[0.04, 1.0, 0.04]} />
        <meshStandardMaterial color="#5a7030" roughness={1} />
      </mesh>
    </group>
  );
}

function WhiteCrane({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = position[0] + Math.sin(t * 0.35) * 1.1;
    ref.current.position.z = position[2] + Math.cos(t * 0.25) * 0.45;
    ref.current.rotation.y = Math.sin(t * 0.35) * 0.28;
  });

  return (
    <group ref={ref} position={position}>
      {/* Legs */}
      <mesh position={[-0.1, 0.45, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 5]} />
        <meshStandardMaterial color="#3a3124" roughness={1} />
      </mesh>
      <mesh position={[0.12, 0.45, 0.02]}>
        <cylinderGeometry args={[0.025, 0.025, 0.85, 5]} />
        <meshStandardMaterial color="#3a3124" roughness={1} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.08, 0]} scale={[1.0, 0.55, 0.42]}>
        <sphereGeometry args={[0.48, 12, 8]} />
        <meshStandardMaterial color="#f7f4ea" roughness={0.75} />
      </mesh>
      {/* Neck and head */}
      <mesh position={[0.43, 1.45, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.045, 0.06, 0.95, 6]} />
        <meshStandardMaterial color="#f7f4ea" roughness={0.75} />
      </mesh>
      <mesh position={[0.74, 1.86, 0]} scale={[1.15, 0.75, 0.7]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#f7f4ea" roughness={0.75} />
      </mesh>
      {/* Beak */}
      <mesh position={[0.96, 1.86, 0]}>
        <boxGeometry args={[0.34, 0.04, 0.04]} />
        <meshStandardMaterial color="#c49a34" roughness={0.8} />
      </mesh>
      {/* Wing */}
      <mesh position={[-0.12, 1.12, 0.08]} rotation={[0.1, 0, -0.18]}>
        <boxGeometry args={[0.65, 0.08, 0.34]} />
        <meshStandardMaterial color="#eee8d8" roughness={0.85} />
      </mesh>
    </group>
  );
}

export function MarshIsland({ position }: { position: [number, number, number] }) {
  const mud = "#6f6242";
  const wetMud = "#554c36";
  const marsh = "#647540";
  const marshLight = "#78864a";
  const water = "#6ec8dc";

  return (
    <group position={position}>
      {/* Stream between the two marsh banks */}
      <mesh position={[0.6, 0.08, 0]} scale={[0.55, 1, 2.3]}>
        <cylinderGeometry args={[2.0, 2.4, 0.12, 12]} />
        <meshStandardMaterial color={water} roughness={0.95} transparent opacity={0.78} />
      </mesh>
      <mesh position={[0.55, 0.18, 0]} scale={[0.34, 1, 2.0]}>
        <cylinderGeometry args={[1.7, 1.9, 0.08, 12]} />
        <meshStandardMaterial color="#8ee0ed" roughness={1} transparent opacity={0.5} />
      </mesh>

      {/* === BANK 1 — larger, low mudflat with marsh cap === */}
      <mesh position={[-3.8, -0.22, 0]} scale={[1.85, 1, 1.22]}>
        <cylinderGeometry args={[3.5, 4.0, 0.72, 12]} />
        <meshStandardMaterial color={mud} roughness={1} />
      </mesh>
      <mesh position={[-3.05, 0.18, 0]} scale={[1.1, 1, 1.0]}>
        <cylinderGeometry args={[3.0, 3.4, 0.25, 10]} />
        <meshStandardMaterial color={marsh} roughness={1} />
      </mesh>
      <mesh position={[-0.55, 0.2, 0]} scale={[0.42, 1, 1.65]}>
        <cylinderGeometry args={[2.1, 2.35, 0.22, 10]} />
        <meshStandardMaterial color={wetMud} roughness={1} />
      </mesh>

      {/* === BANK 2 — smaller island across the channel === */}
      <mesh position={[4.5, -0.25, 0.5]} scale={[1.35, 1, 0.96]}>
        <cylinderGeometry args={[3.0, 3.4, 0.65, 12]} />
        <meshStandardMaterial color={mud} roughness={1} />
      </mesh>
      <mesh position={[4.5, 0.22, 0.5]} scale={[1.2, 1, 0.85]}>
        <cylinderGeometry args={[2.8, 3.1, 0.25, 10]} />
        <meshStandardMaterial color={marshLight} roughness={1} />
      </mesh>
      <mesh position={[2.35, 0.17, 0.45]} scale={[0.38, 1, 1.25]}>
        <cylinderGeometry args={[1.8, 2.0, 0.18, 10]} />
        <meshStandardMaterial color={wetMud} roughness={1} />
      </mesh>

      {/* === MARSH GRASS — patch 1 === */}
      <MarshGrass position={[-6.0, 0.42, -1.0]} phase={0.0} />
      <MarshGrass position={[-5.2, 0.42,  1.2]} phase={1.1} />
      <MarshGrass position={[-4.3, 0.42, -0.5]} phase={2.2} />
      <MarshGrass position={[-3.5, 0.42,  1.8]} phase={0.6} />
      <MarshGrass position={[-2.8, 0.42, -1.5]} phase={1.7} />
      <MarshGrass position={[-2.0, 0.42,  0.4]} phase={2.8} />
      <MarshGrass position={[-1.2, 0.42, -0.8]} phase={0.3} />
      <MarshGrass position={[-0.5, 0.42,  1.0]} phase={1.4} />
      <MarshGrass position={[-4.8, 0.42,  0.2]} phase={3.0} />
      <MarshGrass position={[-3.1, 0.42,  2.5]} phase={0.9} />
      <MarshGrass position={[-5.5, 0.42,  2.2]} phase={2.1} />
      <MarshGrass position={[-1.8, 0.42,  2.0]} phase={1.3} />
      {/* Taller reeds at channel edge — patch 1 side */}
      <MarshGrass position={[0.5,  0.42, -0.5]} phase={0.2} height={1.3} />
      <MarshGrass position={[0.8,  0.42,  0.6]} phase={1.5} height={1.4} />
      <MarshGrass position={[0.3,  0.42,  1.2]} phase={2.7} height={1.2} />

      {/* === CATTAILS — patch 1 === */}
      <Cattail position={[-4.0, 0.42, -2.2]} phase={0.5} />
      <Cattail position={[-2.5, 0.42, -2.0]} phase={1.8} />
      <Cattail position={[-5.8, 0.42, -0.5]} phase={3.0} />
      <Cattail position={[-1.5, 0.42,  2.5]} phase={0.8} />

      {/* === MARSH GRASS — patch 2 === */}
      <MarshGrass position={[2.8, 0.42, -0.8]} phase={0.7} />
      <MarshGrass position={[3.5, 0.42,  1.0]} phase={1.9} />
      <MarshGrass position={[4.2, 0.42, -0.2]} phase={2.5} />
      <MarshGrass position={[5.0, 0.42,  1.5]} phase={0.4} />
      <MarshGrass position={[5.8, 0.42,  0.1]} phase={1.6} />
      <MarshGrass position={[6.5, 0.42,  1.2]} phase={2.9} />
      <MarshGrass position={[3.8, 0.42,  2.0]} phase={0.1} />
      <MarshGrass position={[4.8, 0.42, -1.4]} phase={1.2} />
      {/* Taller reeds at channel edge — patch 2 side */}
      <MarshGrass position={[2.2, 0.42,  0.0]} phase={0.8} height={1.3} />
      <MarshGrass position={[2.5, 0.42,  1.0]} phase={2.0} height={1.5} />
      <MarshGrass position={[1.9, 0.42, -0.9]} phase={2.8} height={1.45} />
      <MarshGrass position={[2.0, 0.42,  1.8]} phase={1.1} height={1.35} />

      {/* === CATTAILS — patch 2 === */}
      <Cattail position={[3.2, 0.42, -1.2]} phase={1.0} />
      <Cattail position={[5.5, 0.42,  2.2]} phase={2.3} />
      <Cattail position={[6.2, 0.42, -0.5]} phase={0.2} />

      <WhiteCrane position={[1.3, 0.32, -1.0]} />
    </group>
  );
}
