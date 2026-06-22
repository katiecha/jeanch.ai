"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Ocean } from "./Ocean";

function GalleryCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 7.5, 26);
    camera.lookAt(0, 0.35, -24);
  }, [camera]);

  return null;
}

export function GalleryOceanBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 7.5, 26], fov: 62 }} gl={{ antialias: true }}>
        <color attach="background" args={["#7BAFD4"]} />
        <ambientLight intensity={2.0} />
        <directionalLight position={[50, 80, 30]} intensity={1.2} color="#fff8f0" />
        <GalleryCamera />
        <Ocean />
      </Canvas>
    </div>
  );
}
