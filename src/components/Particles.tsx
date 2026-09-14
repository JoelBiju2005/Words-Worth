import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const Particles: React.FC<{ count?: number }> = ({ count = 280 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate initial particle positions and random drift offsets
  const [positions, offsets, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offs = new Float32Array(count * 3);
    const scs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Bounding box: X in [-3.2, 3.2], Y in [0.2, 3.2], Z in [-1.5, 2.2]
      pos[i * 3 + 0] = (Math.random() - 0.5) * 6.4;
      pos[i * 3 + 1] = 0.2 + Math.random() * 3.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.8;

      offs[i * 3 + 0] = Math.random() * Math.PI * 2;
      offs[i * 3 + 1] = Math.random() * Math.PI * 2;
      offs[i * 3 + 2] = Math.random() * Math.PI * 2;

      scs[i] = 0.5 + Math.random() * 0.9;
    }
    return [pos, offs, scs];
  }, [count]);

  const candlePos = useMemo(() => new THREE.Vector3(-1.85, 1.33, 0.35), []);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current || delta > 0.1) return; // Prevent teleportation when tab is idle
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Drift upwards slowly
      array[idx + 1] += 0.003 * scales[i];

      // Subtle horizontal brownian wobble
      array[idx + 0] += Math.sin(t * 0.8 + offsets[idx]) * 0.001;
      array[idx + 2] += Math.cos(t * 0.7 + offsets[idx + 2]) * 0.001;

      // Wrap around if too high
      if (array[idx + 1] > 3.2) {
        array[idx + 1] = 0.2;
        array[idx + 0] = (Math.random() - 0.5) * 6.0;
        array[idx + 2] = (Math.random() - 0.5) * 3.5;
      }

      // Check proximity to candle to brighten near the flame
      const dx = array[idx + 0] - candlePos.x;
      const dy = array[idx + 1] - candlePos.y;
      const dz = array[idx + 2] - candlePos.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      // Motes close to candle get extra vertical lift from heat
      if (distSq < 1.2) {
        array[idx + 1] += 0.004 * (1.2 - distSq);
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffdfa0"
        size={0.024}
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
