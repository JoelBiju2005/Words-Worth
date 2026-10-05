import React from 'react';
import { ContactShadows } from '@react-three/drei';
import { Room } from './Room';
import { DeskProps } from './DeskProps';
import { BookStand } from './BookStand';
import { Book } from './Book';
import { CameraRig } from './CameraRig';

import { BackWallDisplay } from './BackWallDisplay';

export const Scene: React.FC = () => {
  return (
    <>
      {/* ── Warm Dark Atmospheric Environment ─────────────── */}
      <color attach="background" args={['#0e0907']} />
      <fog attach="fog" args={['#0e0907', 7.5, 16.0]} />

      {/* ── Ambient & Interior Bounce Lighting ─────────────── */}
      {/* Primary warm ambient tone */}
      <ambientLight color="#ffeed8" intensity={0.65} />

      {/* Hemisphere light: warms the ceiling while bouncing floor light into the lower frame */}
      <hemisphereLight
        color="#ffeedb"
        groundColor="#4a2a16"
        intensity={0.48}
      />

      {/* Overhead warm room fill */}
      <directionalLight
        position={[1.5, 5.5, 2.5]}
        color="#ffe2be"
        intensity={0.52}
      />

      {/* ── Soft Ground Contact Shadows on Table (raised to match desk at y=0.20) ───────── */}
      <ContactShadows
        position={[0, 0.205, 0.05]}
        opacity={0.55}
        scale={5.8}
        blur={2.0}
        far={2.0}
        color="#0a0502"
      />

      {/* ── Floor Contact Shadow under Desk & Rug ──────────── */}
      <ContactShadows
        position={[0, -0.782, 0.4]}
        opacity={0.65}
        scale={6.2}
        blur={2.5}
        far={2.5}
        color="#080402"
      />

      {/* ── Scene Objects & Environment ────────────────────── */}
      <Room />
      <BackWallDisplay />
      <DeskProps />
      {/* ── Scaled Book & Bookstand Group (Central anchor on expanded desk) ── */}
      <group position={[0, 0.20, -0.12]} scale={0.54}>
        <BookStand position={[0, 0, 0]} />
        <Book position={[0, 0.70, -0.63]} />
      </group>
      <CameraRig />
    </>
  );
};
