"use client";

import { Html } from "@react-three/drei";

interface IslandProps {
  id: string;
  route: string;
  position: [number, number, number];
  isNear: boolean;
  isUnlocked: boolean;
  onDiscover: (id: string, route: string) => void;
}

// Geometric monument — different silhouette per island name
function Monument({ id }: { id: string }) {
  // Muted stone palette — flat surfaces, no texture noise
  const stone = "#e0d8c4";
  const stoneDark = "#c8bea8";
  const stoneLight = "#f0eadc";

  if (id === "old-baldy") {
    // Lighthouse — already architectural, keep it
    return (
      <>
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 5, 12]} />
          <meshStandardMaterial color="#f8f6f2" roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.8, 0]}>
          <cylinderGeometry args={[0.62, 0.74, 0.8, 12]} />
          <meshStandardMaterial color="#c0392b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 6.2, 0]}>
          <cylinderGeometry args={[0.8, 0.6, 1, 12]} />
          <meshStandardMaterial color="#002147" roughness={0.4} />
        </mesh>
        <pointLight position={[0, 6.8, 0]} color="#e8f4ff" intensity={1.5} distance={25} />
      </>
    );
  }

  if (id === "ferry-dock") {
    // Wide platform + short tower — dock building
    return (
      <>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[3.5, 0.4, 2.5]} />
          <meshStandardMaterial color={stoneLight} roughness={1} />
        </mesh>
        <mesh position={[0, 3.0, 0]}>
          <boxGeometry args={[2.4, 2.5, 1.8]} />
          <meshStandardMaterial color={stone} roughness={1} />
        </mesh>
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[2.8, 0.3, 2.2]} />
          <meshStandardMaterial color={stoneDark} roughness={1} />
        </mesh>
      </>
    );
  }

  if (id === "old-boat-house") {
    // Tall narrow tower — crane / mast silhouette
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
    // Two towers joined by a lintel
    return (
      <>
        <mesh position={[-1.2, 3.5, 0]}>
          <boxGeometry args={[1.0, 5.0, 1.0]} />
          <meshStandardMaterial color={stone} roughness={1} />
        </mesh>
        <mesh position={[1.2, 3.5, 0]}>
          <boxGeometry args={[1.0, 5.0, 1.0]} />
          <meshStandardMaterial color={stone} roughness={1} />
        </mesh>
        {/* Lintel */}
        <mesh position={[0, 6.2, 0]}>
          <boxGeometry args={[3.6, 0.35, 1.1]} />
          <meshStandardMaterial color={stoneDark} roughness={1} />
        </mesh>
        {/* Base platform */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[3.8, 0.3, 2.2]} />
          <meshStandardMaterial color={stoneLight} roughness={1} />
        </mesh>
      </>
    );
  }

  if (id === "commons-tower") {
    // Tall, slender, elegant tower — the final landmark
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
        {/* Cap */}
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
      {/* Island base */}
      <mesh receiveShadow>
        <cylinderGeometry args={[4, 4.5, 1.2, 20]} />
        <meshStandardMaterial color="#ddc888" roughness={1} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[3.5, 4, 0.5, 20]} />
        <meshStandardMaterial color="#f0e0a8" roughness={1} />
      </mesh>

      <Monument id={id} />

      {/* Silent discover pulse — only when near and unlocked */}
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
