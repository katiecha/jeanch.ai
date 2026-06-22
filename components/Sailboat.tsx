"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SailboatProps {
  onNearIsland: (id: string | null) => void;
  islandPositions: Array<{ id: string; x: number; z: number }>;
}

const SPEED = 24;
const TURN_SPEED = 3.0;
const DRAG = 0.94;
const DETECTION_RADIUS = 7;
const BOAT_WATER_CLEARANCE = 0.58;
const TRUE_WIND = new THREE.Vector3(-0.4, 0, -1).normalize().multiplyScalar(9);

function getOceanHeight(x: number, z: number, t: number) {
  const longWave = Math.sin(x * 0.13 + t * 0.42) * 0.34;
  const crossWave = Math.cos((x + z) * 0.18 - t * 0.36) * 0.22;
  const chop = Math.sin(z * 0.62 + t * 1.15) * 0.06;
  return longWave + crossWave + chop;
}

export function Sailboat({ onNearIsland, islandPositions }: SailboatProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mainSailRef = useRef<THREE.Mesh>(null);
  const jibSailRef = useRef<THREE.Mesh>(null);
  const elapsedRef = useRef(0);
  const { camera } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const velocity = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      // Normalize to -0.5 → 0.5
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((_, delta) => {
    const boat = groupRef.current;
    if (!boat) return;

    elapsedRef.current += delta;
    const t = elapsedRef.current;
    const k = keys.current;

    if (k.has("a") || k.has("arrowleft")) boat.rotation.y += TURN_SPEED * delta;
    if (k.has("d") || k.has("arrowright")) boat.rotation.y -= TURN_SPEED * delta;

    if (k.has("w") || k.has("arrowup")) {
      velocity.current = Math.min(velocity.current + SPEED * delta * 1.8, SPEED * 0.7);
    } else if (k.has("s") || k.has("arrowdown")) {
      velocity.current = Math.max(velocity.current - SPEED * delta * 0.6, -SPEED * 0.15);
    } else {
      velocity.current *= DRAG;
    }

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(boat.quaternion);
    boat.position.addScaledVector(dir, velocity.current * delta);
    const waterHeight = getOceanHeight(boat.position.x, boat.position.z, t);
    boat.position.y = waterHeight + BOAT_WATER_CLEARANCE + Math.sin(t * 1.4) * 0.035;

    const boatMotion = dir.clone().multiplyScalar(velocity.current);
    const apparentWind = TRUE_WIND.clone().sub(boatMotion);
    const localWind = apparentWind.clone().applyQuaternion(boat.quaternion.clone().invert());
    const sailSide = THREE.MathUtils.clamp(localWind.x / 8, -1, 1);
    const aftWindEase = THREE.MathUtils.smoothstep(localWind.z, -5, 8);
    const mainTarget = sailSide * THREE.MathUtils.lerp(0.24, 0.68, aftWindEase);
    const jibTarget = sailSide * THREE.MathUtils.lerp(0.32, 0.78, aftWindEase);

    if (mainSailRef.current) {
      mainSailRef.current.rotation.y = THREE.MathUtils.lerp(
        mainSailRef.current.rotation.y,
        mainTarget,
        0.08
      );
    }
    if (jibSailRef.current) {
      jibSailRef.current.rotation.y = THREE.MathUtils.lerp(
        jibSailRef.current.rotation.y,
        jibTarget,
        0.1
      );
    }

    if (k.has("a") || k.has("arrowleft")) {
      boat.rotation.z = THREE.MathUtils.lerp(boat.rotation.z, 0.08, 0.1);
    } else if (k.has("d") || k.has("arrowright")) {
      boat.rotation.z = THREE.MathUtils.lerp(boat.rotation.z, -0.08, 0.1);
    } else {
      boat.rotation.z = THREE.MathUtils.lerp(boat.rotation.z, 0, 0.05);
    }

    // Camera: base follow position + mouse look offset
    // mouse.y: negative (up) = lower camera height = look toward horizon
    // mouse.y: positive (down) = raise camera = look down at water
    const baseHeight = 8.5;
    const baseBack = 16;
    const camHeight = baseHeight - mouse.current.y * 8; // range: ~4.5–12.5
    const camSide = mouse.current.x * 10;

    const offset = new THREE.Vector3(camSide, camHeight, baseBack).applyQuaternion(
      boat.quaternion
    );
    camera.position.lerp(boat.position.clone().add(offset), 0.05);

    // Look slightly ahead of the boat, adjusted by mouse tilt
    const lookAhead = new THREE.Vector3(0, 0, -10).applyQuaternion(boat.quaternion);
    const lookTarget = boat.position
      .clone()
      .add(lookAhead)
      .add(new THREE.Vector3(0, 1.1 + mouse.current.y * -4, 0));
    camera.lookAt(lookTarget);

    // Island proximity
    let nearest: string | null = null;
    for (const isl of islandPositions) {
      const dist = boat.position.distanceTo(new THREE.Vector3(isl.x, 0, isl.z));
      if (dist < DETECTION_RADIUS) {
        nearest = isl.id;
        break;
      }
    }
    onNearIsland(nearest);
  });

  return (
    <group ref={groupRef} position={[0, 0, 5]}>
      {/* Hull */}
      <mesh>
        <boxGeometry args={[1.6, 0.5, 4]} />
        <meshStandardMaterial color="#8b5a2a" roughness={0.6} />
      </mesh>
      {/* Hull accent */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.62, 0.08, 4.02]} />
        <meshStandardMaterial color="#6a3e18" />
      </mesh>
      {/* Deck */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.3, 0.08, 3.2]} />
        <meshStandardMaterial color="#e8c07a" roughness={0.8} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.72, 0.6]}>
        <boxGeometry args={[0.9, 0.7, 1.2]} />
        <meshStandardMaterial color="#f0e0c0" />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 2.8, -0.3]}>
        <cylinderGeometry args={[0.055, 0.07, 5.2, 8]} />
        <meshStandardMaterial color="#6a4418" roughness={0.7} />
      </mesh>
      {/* Main sail */}
      <mesh ref={mainSailRef} position={[-0.6, 2.5, -0.3]} rotation={[0, 0.15, 0]}>
        <planeGeometry args={[1.8, 4]} />
        <meshStandardMaterial color="#f8f4ee" side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      {/* Jib sail */}
      <mesh ref={jibSailRef} position={[0.1, 1.8, -1.4]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[1.2, 2.5]} />
        <meshStandardMaterial color="#f8f4ee" side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      {/* Flag */}
      <mesh position={[0, 5.5, -0.3]} rotation={[0, 0.2, 0]}>
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial color="#dc2626" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
