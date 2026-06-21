"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Ocean() {
  const geoRef = useRef<THREE.PlaneGeometry>(null);

  useFrame(({ clock }) => {
    const geo = geoRef.current;
    if (!geo) return;
    const t = clock.getElapsedTime();
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i];
      const y = pos[i + 1];
      pos[i + 2] = Math.sin(x * 0.4 + t * 0.8) * 0.18 + Math.cos(y * 0.3 + t * 0.6) * 0.12;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry ref={geoRef} args={[300, 300, 40, 40]} />
      <meshStandardMaterial
        color="#7dd4e8"
        metalness={0}
        roughness={1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
