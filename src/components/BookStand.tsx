import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getDeskWoodTexture } from '../utils/proceduralTextures';

interface BookStandProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const BookStand: React.FC<BookStandProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const woodTexture = useMemo(() => getDeskWoodTexture(), []);

  // Dark rich mahogany / walnut for lectern
  const standMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        color: '#2b1a13',
        roughness: 0.45,
        metalness: 0.08,
      }),
    [woodTexture]
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Horizontal base on table (lowered to sit flat on desk at local y = 0.04) */}
      <mesh position={[0, 0.03, -0.05]} receiveShadow castShadow material={standMaterial}>
        <boxGeometry args={[1.90, 0.06, 0.90]} />
      </mesh>

      {/* Angled rest plate (tilted at -Math.PI / 5.2, matching book angle) */}
      <group position={[0, 0.08, -0.2]}>
        <group rotation={[-Math.PI / 5.2, 0, 0]}>
          {/* Main backboard — supporting the book from behind */}
          <mesh position={[0, 0.74, -0.16]} receiveShadow castShadow material={standMaterial}>
            <boxGeometry args={[1.90, 1.48, 0.04]} />
          </mesh>

          {/* Lower retention shelf/ledge — positioned directly underneath the book's bottom edge (Y = -0.08)
              so the book rests gently on top of the shelf without cutting through the book edges or cover */}
          <mesh position={[0, -0.08, -0.05]} receiveShadow castShadow material={standMaterial}>
            <boxGeometry args={[1.90, 0.04, 0.22]} />
          </mesh>

          {/* Front upward lip of the retention shelf to stop book from sliding forward */}
          <mesh position={[0, -0.04, 0.06]} receiveShadow castShadow material={standMaterial}>
            <boxGeometry args={[1.90, 0.05, 0.025]} />
          </mesh>

          {/* Left decorative side bracket */}
          <mesh position={[-0.92, 0.74, -0.16]} castShadow material={standMaterial}>
            <boxGeometry args={[0.05, 1.48, 0.06]} />
          </mesh>

          {/* Right decorative side bracket */}
          <mesh position={[0.92, 0.74, -0.16]} castShadow material={standMaterial}>
            <boxGeometry args={[0.05, 1.48, 0.06]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
