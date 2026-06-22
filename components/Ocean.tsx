"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Ocean() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color("#002147") },
      uMidColor: { value: new THREE.Color("#00356b") },
      uHighlightColor: { value: new THREE.Color("#5fb7d2") },
      uFoamColor: { value: new THREE.Color("#f2fbff") },
    }),
    []
  );

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsedRef.current;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[300, 300, 70, 70]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={`
          uniform float uTime;

          varying vec2 vUv;
          varying float vWave;

          float waveHeight(vec2 p, float t) {
            float longWave = sin(p.x * 0.13 + t * 0.42) * 0.34;
            float crossWave = cos((p.x + p.y) * 0.18 - t * 0.36) * 0.22;
            float chop = sin(p.y * 0.62 + t * 1.15) * 0.06;
            return longWave + crossWave + chop;
          }

          void main() {
            vUv = uv;
            vec3 transformed = position;
            float wave = waveHeight(position.xy, uTime);
            transformed.z += wave;
            vWave = wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uDeepColor;
          uniform vec3 uMidColor;
          uniform vec3 uHighlightColor;
          uniform vec3 uFoamColor;

          varying vec2 vUv;
          varying float vWave;

          void main() {
            float depth = smoothstep(0.0, 1.0, vUv.y);
            float softCurrent = sin((vUv.x * 34.0) + (vUv.y * 18.0) + uTime * 0.7) * 0.5 + 0.5;
            float crossingCurrent = cos((vUv.x * 11.0) - (vUv.y * 29.0) - uTime * 0.45) * 0.5 + 0.5;
            float glint = pow(softCurrent * crossingCurrent, 3.0) * 0.18;
            float foamBands = smoothstep(0.58, 0.82, vWave + softCurrent * 0.16);
            float travelFoam = smoothstep(0.965, 1.0, sin((vUv.x + vUv.y) * 54.0 - uTime * 1.55) * 0.5 + 0.5);
            float foam = foamBands * travelFoam * 0.56;

            vec3 color = mix(uDeepColor, uMidColor, depth * 0.55 + 0.18);
            color = mix(color, uHighlightColor, glint);
            color = mix(color, uFoamColor, foam);

            gl_FragColor = vec4(color, 0.72);
          }
        `}
      />
    </mesh>
  );
}
