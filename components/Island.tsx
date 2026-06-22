"use client";

import { useRef, useMemo } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface IslandProps {
  id: string;
  route: string;
  position: [number, number, number];
  isNear: boolean;
  isUnlocked: boolean;
  onDiscover: (id: string, route: string) => void;
}

export function GrassTuft({ position, phase = 0 }: { position: [number, number, number]; phase?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 1.3 + phase) * 0.14;
    ref.current.rotation.x = Math.cos(t * 0.9 + phase) * 0.07;
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.07, 0.9, 0.05]} />
        <meshStandardMaterial color="#6b8c3a" roughness={1} />
      </mesh>
      <mesh position={[0.12, 0.38, 0.05]} rotation={[0.1, 0.3, -0.15]}>
        <boxGeometry args={[0.06, 0.75, 0.05]} />
        <meshStandardMaterial color="#7a9c45" roughness={1} />
      </mesh>
      <mesh position={[-0.1, 0.40, -0.05]} rotation={[-0.05, -0.2, 0.12]}>
        <boxGeometry args={[0.06, 0.8, 0.05]} />
        <meshStandardMaterial color="#5c7a2e" roughness={1} />
      </mesh>
    </group>
  );
}

function OldBaldyMonument() {
  const stoneMap = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#9a9080";
    ctx.fillRect(0, 0, 256, 512);
    // Fixed stucco / plaster patches matching the peeling weathered look
    const patches = [
      { x: 30,  y: 60,  w: 90,  h: 130, a: 0.50 },
      { x: 160, y: 180, w: 75,  h: 110, a: 0.40 },
      { x: 70,  y: 300, w: 100, h: 90,  a: 0.55 },
      { x: 180, y: 400, w: 65,  h: 80,  a: 0.38 },
      { x: 20,  y: 430, w: 55,  h: 70,  a: 0.32 },
      { x: 120, y: 80,  w: 45,  h: 170, a: 0.28 },
      { x: 200, y: 280, w: 50,  h: 120, a: 0.42 },
    ];
    patches.forEach(({ x, y, w, h, a }) => {
      ctx.fillStyle = `rgba(214, 202, 174, ${a})`;
      ctx.fillRect(x, y, w, h);
    });
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Subtle historical off-center: lantern was added to one side when tower was raised
  const ox = 0.22;
  const oz = 0.08;

  return (
    <>
      {/* Main tapered tower — wider top (0.82) so offset lantern still sits on it */}
      <mesh position={[0, 5.5, 0]}>
        <cylinderGeometry args={[0.82, 2.2, 9, 4]} />
        <meshStandardMaterial color="#a09688" roughness={1} map={stoneMap} />
      </mesh>
      {/* Gallery ring — offset */}
      <mesh position={[ox, 10.15, oz]}>
        <cylinderGeometry args={[0.88, 0.88, 0.18, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
      {/* Lantern room — dark teal, offset */}
      <mesh position={[ox, 10.72, oz]}>
        <cylinderGeometry args={[0.70, 0.70, 0.9, 8]} />
        <meshStandardMaterial color="#2d5a50" roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Finial */}
      <mesh position={[ox, 11.25, oz]}>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshStandardMaterial color="#7a5c1e" roughness={0.5} metalness={0.4} />
      </mesh>
      <pointLight position={[ox, 10.72, oz]} color="#e8f4ff" intensity={1.5} distance={25} />
    </>
  );
}

function Monument({ id }: { id: string }) {
  const stone = "#e0d8c4";
  const stoneDark = "#c8bea8";
  const stoneLight = "#f0eadc";

  if (id === "old-baldy") {
    return <OldBaldyMonument />;
  }

  if (id === "ferry-dock") {
    const wood = "#7b5e2a";
    const woodDark = "#4a3010";
    const ferryBlue = "#1e3a8a";
    const ferryWhite = "#f2f5f8";
    const buildingRed = "#7a2e20";
    const trim = "#f0ebe0";

    return (
      <>
        {/* === BOAT SUPPLY BUILDING === */}
        {/* Platform deck */}
        <mesh position={[0.5, 1.58, 0]}>
          <boxGeometry args={[3.2, 0.2, 2.8]} />
          <meshStandardMaterial color={wood} roughness={1} />
        </mesh>
        <mesh position={[0.5, 1.70, 0]}>
          <boxGeometry args={[3.4, 0.08, 3.0]} />
          <meshStandardMaterial color={trim} roughness={0.8} />
        </mesh>
        {/* Main walls — deep red */}
        <mesh position={[0.5, 2.88, 0]}>
          <boxGeometry args={[2.8, 2.2, 2.4]} />
          <meshStandardMaterial color={buildingRed} roughness={0.9} />
        </mesh>
        {/* White corner trim — 4 posts */}
        {([[ 1.9, 1.2], [-0.9, 1.2], [1.9, -1.2], [-0.9, -1.2]] as [number, number][]).map(([x, z], i) => (
          <mesh key={i} position={[x, 2.88, z]}>
            <boxGeometry args={[0.10, 2.35, 0.10]} />
            <meshStandardMaterial color={trim} roughness={0.8} />
          </mesh>
        ))}
        {/* Navy accent band at wall top */}
        <mesh position={[0.5, 4.03, 0]}>
          <boxGeometry args={[2.85, 0.2, 2.45]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
        </mesh>
        {/* Large boat door on dock-facing side (+x face) */}
        <mesh position={[1.92, 2.48, 0]}>
          <boxGeometry args={[0.08, 1.8, 1.1]} />
          <meshStandardMaterial color={trim} roughness={0.8} />
        </mesh>
        <mesh position={[1.935, 2.48, 0]}>
          <boxGeometry args={[0.06, 1.6, 0.92]} />
          <meshStandardMaterial color="#0a1020" roughness={1} />
        </mesh>
        {/* Windows — z+ side */}
        {([-0.1, 1.1] as number[]).map((x, i) => (
          <mesh key={i} position={[x, 3.1, 1.23]}>
            <boxGeometry args={[0.55, 0.42, 0.07]} />
            <meshStandardMaterial color="#2a4a6a" roughness={0.5} metalness={0.1} />
          </mesh>
        ))}
        {/* Windows — z- side */}
        {([-0.1, 1.1] as number[]).map((x, i) => (
          <mesh key={i} position={[x, 3.1, -1.23]}>
            <boxGeometry args={[0.55, 0.42, 0.07]} />
            <meshStandardMaterial color="#2a4a6a" roughness={0.5} metalness={0.1} />
          </mesh>
        ))}
        {/* Peaked gable roof */}
        <mesh position={[0.5, 4.30, 0.52]} rotation={[0.44, 0, 0]}>
          <boxGeometry args={[3.2, 0.13, 1.5]} />
          <meshStandardMaterial color="#2a2018" roughness={1} />
        </mesh>
        <mesh position={[0.5, 4.30, -0.52]} rotation={[-0.44, 0, 0]}>
          <boxGeometry args={[3.2, 0.13, 1.5]} />
          <meshStandardMaterial color="#2a2018" roughness={1} />
        </mesh>
        {/* Ridge beam */}
        <mesh position={[0.5, 4.62, 0]}>
          <boxGeometry args={[3.3, 0.13, 0.22]} />
          <meshStandardMaterial color="#1a1408" roughness={1} />
        </mesh>

        {/* === PIER / DOCK === */}
        <mesh position={[7.0, 0.7, 0]}>
          <boxGeometry args={[6.5, 0.2, 2.2]} />
          <meshStandardMaterial color={wood} roughness={1} />
        </mesh>
        {Array.from({ length: 11 }, (_, i) => (
          <mesh key={i} position={[4.2 + i * 0.6, 0.82, 0]}>
            <boxGeometry args={[0.07, 0.06, 2.2]} />
            <meshStandardMaterial color={woodDark} roughness={1} />
          </mesh>
        ))}
        {[4.5, 6.5, 8.5, 10.2].map((x, i) =>
          [-1.0, 1.0].map((z, j) => (
            <mesh key={`p-${i}-${j}`} position={[x, 0, z]}>
              <cylinderGeometry args={[0.14, 0.14, 2.6, 6]} />
              <meshStandardMaterial color={woodDark} roughness={1} />
            </mesh>
          ))
        )}

        {/* === RANGER FERRY — 2 levels === */}
        {/* Hull */}
        <mesh position={[8.5, 0.1, -3.0]}>
          <boxGeometry args={[5.8, 1.3, 2.5]} />
          <meshStandardMaterial color={ferryBlue} roughness={0.5} />
        </mesh>
        {/* Waterline stripe */}
        <mesh position={[8.5, 0.78, -3.0]}>
          <boxGeometry args={[5.85, 0.14, 2.56]} />
          <meshStandardMaterial color={ferryBlue} roughness={0.4} />
        </mesh>
        {/* Single passenger cabin */}
        <mesh position={[8.5, 1.85, -3.0]}>
          <boxGeometry args={[5.2, 1.3, 2.3]} />
          <meshStandardMaterial color={ferryWhite} roughness={0.5} />
        </mesh>
        {/* Blue trim stripe */}
        <mesh position={[8.5, 2.54, -3.0]}>
          <boxGeometry args={[5.3, 0.13, 2.35]} />
          <meshStandardMaterial color={ferryBlue} roughness={0.4} />
        </mesh>
        {/* Cabin windows — pier-facing side (z+) */}
        {[6.2, 6.9, 7.6, 8.3, 9.0, 9.7, 10.4].map((wx, i) => (
          <mesh key={`cw-${i}`} position={[wx, 1.85, -1.82]}>
            <boxGeometry args={[0.42, 0.36, 0.06]} />
            <meshStandardMaterial color="#1a2a40" roughness={0.4} metalness={0.1} />
          </mesh>
        ))}
        {/* Cabin windows — far side (z-) */}
        {[6.5, 7.2, 7.9, 8.6, 9.3, 10.0].map((wx, i) => (
          <mesh key={`cw2-${i}`} position={[wx, 1.85, -4.18]}>
            <boxGeometry args={[0.42, 0.36, 0.06]} />
            <meshStandardMaterial color="#1a2a40" roughness={0.4} metalness={0.1} />
          </mesh>
        ))}
        {/* Wheelhouse */}
        <mesh position={[8.5, 3.35, -3.0]}>
          <boxGeometry args={[2.6, 1.0, 1.8]} />
          <meshStandardMaterial color={ferryWhite} roughness={0.5} />
        </mesh>
        {/* Wheelhouse roof */}
        <mesh position={[8.5, 3.95, -3.0]}>
          <boxGeometry args={[3.0, 0.18, 2.0]} />
          <meshStandardMaterial color={ferryWhite} roughness={0.4} />
        </mesh>
        {/* Wheelhouse windows — forward face (+x) */}
        {[-2.5, -3.0, -3.5].map((wz, i) => (
          <mesh key={`wh-${i}`} position={[9.82, 3.35, wz]}>
            <boxGeometry args={[0.06, 0.5, 0.42]} />
            <meshStandardMaterial color="#1a2a40" roughness={0.4} metalness={0.1} />
          </mesh>
        ))}
        {/* Navigation mast */}
        <mesh position={[8.5, 4.82, -3.0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
          <meshStandardMaterial color="#c8c8c8" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[8.5, 5.58, -3.0]}>
          <boxGeometry args={[0.9, 0.06, 0.06]} />
          <meshStandardMaterial color="#c8c8c8" roughness={0.4} metalness={0.3} />
        </mesh>
      </>
    );
  }

  if (id === "old-boat-house") {
    return (
      <>
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[1.0, 7.0, 1.0]} />
          <meshStandardMaterial color={stone} roughness={1} />
        </mesh>
        <mesh position={[0.8, 6.5, 0]}>
          <boxGeometry args={[2.6, 0.25, 0.5]} />
          <meshStandardMaterial color={stoneDark} roughness={1} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[2.5, 0.35, 2.5]} />
          <meshStandardMaterial color={stoneLight} roughness={1} />
        </mesh>
      </>
    );
  }

  if (id === "shoals-club") {
    return (
      <>
        {/* Main dune — flattened hemisphere */}
        <mesh position={[0, 1.6, 0]} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[3.0, 14, 9]} />
          <meshStandardMaterial color="#e8d898" roughness={1} />
        </mesh>
        {/* Secondary bumps */}
        <mesh position={[1.8, 1.5, 1.2]} scale={[1, 0.28, 1]}>
          <sphereGeometry args={[2.0, 10, 7]} />
          <meshStandardMaterial color="#e2d08a" roughness={1} />
        </mesh>
        <mesh position={[-1.5, 1.45, -1.0]} scale={[1, 0.26, 1]}>
          <sphereGeometry args={[1.8, 10, 7]} />
          <meshStandardMaterial color="#ead890" roughness={1} />
        </mesh>
        <GrassTuft position={[0.5,  2.65, 0.3]}  phase={0.0} />
        <GrassTuft position={[-0.8, 2.60, 0.6]}  phase={1.2} />
        <GrassTuft position={[1.1,  2.52, -0.4]} phase={2.4} />
        <GrassTuft position={[-0.3, 2.62, -0.9]} phase={0.7} />
        <GrassTuft position={[0.8,  2.55, 1.0]}  phase={1.8} />
        <GrassTuft position={[-1.2, 2.46, 0.2]}  phase={3.1} />
        <GrassTuft position={[0.2,  2.50, 1.3]}  phase={2.0} />
        <GrassTuft position={[-0.6, 2.58, -0.5]} phase={0.4} />
        <GrassTuft position={[1.4,  2.42, 0.7]}  phase={1.5} />
        <GrassTuft position={[-0.1, 2.64, 0.9]}  phase={2.8} />
      </>
    );
  }

  if (id === "commons-tower") {
    return (
      <>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[3.0, 0.3, 3.0]} />
          <meshStandardMaterial color={stoneLight} roughness={1} />
        </mesh>
        <mesh position={[0, 2.4, 0]}>
          <boxGeometry args={[2.0, 1.5, 2.0]} />
          <meshStandardMaterial color={stone} roughness={1} />
        </mesh>
        <mesh position={[0, 5.5, 0]}>
          <boxGeometry args={[0.9, 5.5, 0.9]} />
          <meshStandardMaterial color={stone} roughness={1} />
        </mesh>
        <mesh position={[0, 8.5, 0]}>
          <boxGeometry args={[1.4, 0.3, 1.4]} />
          <meshStandardMaterial color={stoneDark} roughness={1} />
        </mesh>
        <mesh position={[0, 8.8, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color={stoneDark} roughness={1} />
        </mesh>
      </>
    );
  }

  return null;
}

export function Island({ id, route, position, isNear, isUnlocked, onDiscover }: IslandProps) {
  return (
    <group
      position={position}
      onClick={isNear && isUnlocked ? () => onDiscover(id, route) : undefined}
    >
      <mesh receiveShadow>
        <cylinderGeometry args={[4, 4.5, 1.2, 20]} />
        <meshStandardMaterial color="#ddc888" roughness={1} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[3.5, 4, 0.5, 20]} />
        <meshStandardMaterial color="#f0e0a8" roughness={1} />
      </mesh>

      <Monument id={id} />

      {isNear && isUnlocked && (
        <Html position={[0, 2, 0]} center distanceFactor={20}>
          <button
            onClick={() => onDiscover(id, route)}
            aria-label="Enter"
            className="w-5 h-5 rounded-full bg-white/90 hover:bg-white shadow-lg animate-pulse"
          />
        </Html>
      )}
    </group>
  );
}
