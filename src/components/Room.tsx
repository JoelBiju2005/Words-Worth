import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useBookStore } from '../store/useBookStore';
import { WindowView } from './WindowView';
import {
  getDeskWoodTexture,
  getFloorPlanksTexture,
  getPersianRugTexture,
} from '../utils/proceduralTextures';
import { VintageTv } from './VintageTv';

export const Room: React.FC = () => {
  const woodTexture = useMemo(() => getDeskWoodTexture(), []);
  const floorTexture = useMemo(() => getFloorPlanksTexture(), []);
  const rugTexture = useMemo(() => getPersianRugTexture(), []);

  // ── Shared Materials ──────────────────────────────────────
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#342318',
        roughness: 0.85,
        metalness: 0.02,
      }),
    []
  );

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floorTexture,
        color: '#462b18',
        roughness: 0.42,
        metalness: 0.08,
      }),
    [floorTexture]
  );

  const ceilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#22150e',
        roughness: 0.90,
        metalness: 0.0,
      }),
    []
  );

  const shelfWoodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        color: '#3e2416',
        roughness: 0.48,
        metalness: 0.10,
      }),
    [woodTexture]
  );

  const baseboardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        color: '#28160c',
        roughness: 0.50,
        metalness: 0.12,
      }),
    [woodTexture]
  );

  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.28,
        metalness: 0.88,
      }),
    []
  );

  const windowGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#e8f3ff',
        transmission: 0.96,
        opacity: 0.85,
        transparent: true,
        roughness: 0.02,
        ior: 1.45,
        thickness: 0.02,
        reflectivity: 0.25,
      }),
    []
  );



  // ── Window Interaction & Casement Sash Animation ─────────
  const windowState = useBookStore((s) => s.windowState);
  const setWindowState = useBookStore((s) => s.setWindowState);
  const cameraState = useBookStore((s) => s.cameraState);
  const setCameraState = useBookStore((s) => s.setCameraState);
  const openWindow = useBookStore((s) => s.openWindow);

  const leftSashRef = useRef<THREE.Group>(null);
  const rightSashRef = useRef<THREE.Group>(null);

  // Sash opening/closing GSAP animation
  useEffect(() => {
    if (!leftSashRef.current || !rightSashRef.current) return;

    if (windowState === 'opening' || (cameraState === 'window' && windowState === 'closed')) {
      setWindowState('opening');
      // Swing outward into the night air:
      // Left sash (rear, hinge local z = -0.70) swings outward
      gsap.to(leftSashRef.current.rotation, {
        y: -Math.PI * 0.55,
        duration: 1.2,
        ease: 'power2.inOut',
      });
      // Right sash (front, hinge local z = +0.70) swings outward
      gsap.to(rightSashRef.current.rotation, {
        y: Math.PI * 0.55,
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
          setWindowState('open');
        },
      });
    } else if (windowState === 'closing') {
      // Swing closed
      gsap.to(leftSashRef.current.rotation, {
        y: 0,
        duration: 0.9,
        ease: 'power2.inOut',
      });
      gsap.to(rightSashRef.current.rotation, {
        y: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => {
          setWindowState('closed');
          setCameraState('wide');
        },
      });
    }
  }, [windowState, cameraState, setWindowState, setCameraState]);

  // ── Candelabra gentle flame flicker ───────────────────────
  const candelabraRef = useRef<THREE.PointLight>(null);
  const candelabraWallRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flicker = 1.0 + Math.sin(t * 8.5) * 0.06 + Math.sin(t * 17.3) * 0.035;
    if (candelabraRef.current) {
      candelabraRef.current.intensity = 0.45 * flicker;
    }
    if (candelabraWallRef.current) {
      candelabraWallRef.current.intensity = 0.35 * flicker;
    }
  });

  // Moonlight target aimed from window directly at the raised desk center
  const moonlightTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(3.92, -0.90, 0.70);
    return obj;
  }, []);

  return (
    <group>
      {/* ══════════════════════════════════════════════════════
          1. ROOM SHELL — Floor, Walls, Ceiling, Baseboards
          (Reconciled for 4.0m Victorian room: floor y = -0.80, ceiling y = 3.20)
          ══════════════════════════════════════════════════════ */}

      {/* Hardwood floor at standard floor level y = -0.80 */}
      <mesh
        position={[0, -0.80, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={floorMaterial}
      >
        <planeGeometry args={[16, 14]} />
      </mesh>

      {/* Back wall (y = -0.80 to y = 3.20, center y = 1.20) */}
      <mesh position={[0, 1.20, -2.6]} receiveShadow material={wallMaterial}>
        <planeGeometry args={[10, 4.0]} />
      </mesh>

      {/* Left wall with precision aperture for window opening (y: 0.35 to 2.05, z: -1.30 to 0.10) */}
      {/* 1. Bottom panel under sill (height 1.15m, y: -0.80 to 0.35) */}
      <mesh position={[-4.0, -0.225, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} receiveShadow>
        <planeGeometry args={[10, 1.15]} />
      </mesh>

      {/* 2. Top header panel above window (height 1.15m, y: 2.05 to 3.20) */}
      <mesh position={[-4.0, 2.625, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial}>
        <planeGeometry args={[10, 1.15]} />
      </mesh>

      {/* 3. Rear panel behind window (width 1.30m, z: -2.60 to -1.30) */}
      <mesh position={[-4.0, 1.20, -1.95]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} receiveShadow>
        <planeGeometry args={[1.30, 1.70]} />
      </mesh>

      {/* 4. Front panel forward of window (width 4.90m, z: 0.10 to 5.00) */}
      <mesh position={[-4.0, 1.20, 2.55]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} receiveShadow>
        <planeGeometry args={[4.90, 1.70]} />
      </mesh>

      {/* Right wall */}
      <mesh position={[4.0, 1.20, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMaterial}>
        <planeGeometry args={[10, 4.0]} />
      </mesh>

      {/* Ceiling at y = 3.20 */}
      <mesh position={[0, 3.20, 0]} rotation={[Math.PI / 2, 0, 0]} material={ceilingMaterial}>
        <planeGeometry args={[16, 14]} />
      </mesh>

      {/* Ceiling beams */}
      <mesh position={[-1.6, 3.11, 0]} material={shelfWoodMaterial}>
        <boxGeometry args={[0.18, 0.18, 12]} />
      </mesh>
      <mesh position={[1.6, 3.11, 0]} material={shelfWoodMaterial}>
        <boxGeometry args={[0.18, 0.18, 12]} />
      </mesh>

      {/* Antique Baseboard Moldings (height 0.16m, centered at y = -0.72) */}
      <mesh position={[0, -0.72, -2.58]} material={baseboardMaterial}>
        <boxGeometry args={[10, 0.16, 0.04]} />
      </mesh>
      <mesh position={[-3.98, -0.72, 0]} rotation={[0, Math.PI / 2, 0]} material={baseboardMaterial}>
        <boxGeometry args={[10, 0.16, 0.04]} />
      </mesh>
      <mesh position={[3.98, -0.72, 0]} rotation={[0, -Math.PI / 2, 0]} material={baseboardMaterial}>
        <boxGeometry args={[10, 0.16, 0.04]} />
      </mesh>



      {/* ══════════════════════════════════════════════════════
          3. CASEMENT WINDOW (left wall) & MOONLIT VISTA
          Multi-pane casement with outward-swinging hinged sashes
          ══════════════════════════════════════════════════════ */}
      <group position={[-3.92, 1.20, -0.6]}>
        {/* Window outer fixed frame — dark oak */}
        {/* Top header */}
        <mesh position={[0, 0.85, 0]} material={shelfWoodMaterial} castShadow>
          <boxGeometry args={[0.16, 0.10, 1.48]} />
        </mesh>
        {/* Bottom sill (with projecting ledge) */}
        <mesh position={[0, -0.85, 0]} material={shelfWoodMaterial} castShadow>
          <boxGeometry args={[0.22, 0.12, 1.56]} />
        </mesh>
        {/* Rear post / jamb (local z = -0.70) */}
        <mesh position={[0, 0, -0.70]} material={shelfWoodMaterial} castShadow>
          <boxGeometry args={[0.16, 1.70, 0.10]} />
        </mesh>
        {/* Front post / jamb (local z = +0.70) */}
        <mesh position={[0, 0, 0.70]} material={shelfWoodMaterial} castShadow>
          <boxGeometry args={[0.16, 1.70, 0.10]} />
        </mesh>

        {/* ── Left / Rear Hinged Sash (pivots at local z = -0.70) ── */}
        <group ref={leftSashRef} position={[0, 0, -0.70]}>
          {/* Offset sash contents forward along Z by half-width (+0.3475) so hinge is at z = 0 */}
          <group position={[0, 0, 0.3475]}>
            {/* Outer sash frame stiles & rails */}
            {/* Top rail */}
            <mesh position={[0, 0.80, 0]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.045, 0.05, 0.695]} />
            </mesh>
            {/* Bottom rail */}
            <mesh position={[0, -0.80, 0]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.045, 0.05, 0.695]} />
            </mesh>
            {/* Hinge stile (at -0.325) */}
            <mesh position={[0, 0, -0.325]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.045, 1.64, 0.045]} />
            </mesh>
            {/* Center meeting stile (at +0.325) */}
            <mesh position={[0, 0, 0.325]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.045, 1.64, 0.045]} />
            </mesh>

            {/* Horizontal muntin bars dividing into 3 vertical panes */}
            <mesh position={[0, -0.27, 0]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.035, 0.035, 0.62]} />
            </mesh>
            <mesh position={[0, 0.27, 0]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.035, 0.035, 0.62]} />
            </mesh>

            {/* Glazed vintage glass pane */}
            <mesh material={windowGlassMaterial}>
              <boxGeometry args={[0.012, 1.55, 0.62]} />
            </mesh>
          </group>
        </group>

        {/* ── Right / Front Hinged Sash (pivots at local z = +0.70) ── */}
        <group ref={rightSashRef} position={[0, 0, 0.70]}>
          {/* Offset sash contents backward along Z by half-width (-0.3475) so hinge is at z = 0 */}
          <group position={[0, 0, -0.3475]}>
            {/* Outer sash frame stiles & rails */}
            {/* Top rail */}
            <mesh position={[0, 0.80, 0]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.045, 0.05, 0.695]} />
            </mesh>
            {/* Bottom rail */}
            <mesh position={[0, -0.80, 0]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.045, 0.05, 0.695]} />
            </mesh>
            {/* Hinge stile (at +0.325) */}
            <mesh position={[0, 0, 0.325]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.045, 1.64, 0.045]} />
            </mesh>
            {/* Center meeting stile (at -0.325) */}
            <mesh position={[0, 0, -0.325]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.045, 1.64, 0.045]} />
            </mesh>

            {/* Horizontal muntin bars */}
            <mesh position={[0, -0.27, 0]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.035, 0.035, 0.62]} />
            </mesh>
            <mesh position={[0, 0.27, 0]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[0.035, 0.035, 0.62]} />
            </mesh>

            {/* Glazed vintage glass pane */}
            <mesh material={windowGlassMaterial}>
              <boxGeometry args={[0.012, 1.55, 0.62]} />
            </mesh>

            {/* Brass astragal latch hardware on meeting rail */}
            <mesh position={[0.025, 0, -0.325]} material={brassMaterial} castShadow>
              <boxGeometry args={[0.02, 0.12, 0.02]} />
            </mesh>
            <mesh position={[0.038, 0, -0.325]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.03, 12]} />
            </mesh>
          </group>
        </group>

        {/* ── Interactive Window Hitbox (Active in 'wide' view) ── */}
        {cameraState === 'wide' && (
          <mesh
            position={[0.08, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              openWindow();
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
            visible={false}
          >
            <boxGeometry args={[0.35, 1.70, 1.45]} />
          </mesh>
        )}

        {/* Visible Moonlight SpotLight — positioned outside window at x = -1.2 to shine through sashes/muntins casting grill shadow patterns */}
        <primitive object={moonlightTarget} />
        <spotLight
          position={[-1.2, 0.8, -0.2]}
          target={moonlightTarget}
          color="#90bdf5"
          intensity={3.4}
          angle={Math.PI / 3.2}
          penumbra={0.25}
          distance={15}
          decay={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0005}
        />

        {/* Soft lunar fill light at window sill */}
        <pointLight
          position={[0.5, 0, 0]}
          color="#6ba0de"
          intensity={0.75}
          distance={5.0}
          decay={1.6}
        />
      </group>

      {/* ── Persistent Exterior Moonlit Landscape View ── */}
      <WindowView />

      {/* ══════════════════════════════════════════════════════
          4. PERSIAN RUG (on floor y = -0.785, 15mm above floor)
          ══════════════════════════════════════════════════════ */}
      <group position={[0, -0.785, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[4.4, 3.1]} />
          <meshStandardMaterial
            map={rugTexture}
            roughness={0.88}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          5. WALL-MOUNTED 3-ARM CANDELABRA SHELF (Right Wall)
          Inside right wall: x = 3.76, y = 1.05, z = -0.60
          Wall is at x = 4.00, so rosette mount connects flush at x = 3.99
          ══════════════════════════════════════════════════════ */}
      <group position={[3.76, 1.05, -0.60]}>
        {/* Wall Rosette Mounting Plate (flush against x = 4.00 wall) */}
        <mesh position={[0.23, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={brassMaterial}>
          <cylinderGeometry args={[0.10, 0.12, 0.025, 20]} />
        </mesh>

        {/* Horizontal solid brass support arm */}
        <mesh position={[0.115, -0.04, 0]} material={brassMaterial}>
          <boxGeometry args={[0.23, 0.028, 0.028]} />
        </mesh>

        {/* Under-arm diagonal structural support scroll */}
        <mesh position={[0.14, -0.12, 0]} rotation={[0, 0, -Math.PI / 5]} material={brassMaterial}>
          <boxGeometry args={[0.18, 0.018, 0.018]} />
        </mesh>

        {/* Central turned spindle hub */}
        <mesh position={[0, 0, 0]} material={brassMaterial}>
          <cylinderGeometry args={[0.025, 0.035, 0.16, 16]} />
        </mesh>

        {/* Center Candle & Bobeche */}
        <mesh position={[0, 0.08, 0]} material={brassMaterial} castShadow>
          <cylinderGeometry args={[0.055, 0.025, 0.025, 16]} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.16, 16]} />
          <meshStandardMaterial color="#f5eedc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.025, 8]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.29, 0]}>
          <coneGeometry args={[0.024, 0.07, 12]} />
          <meshBasicMaterial color="#ffaa33" />
        </mesh>
        <mesh position={[0, 0.29, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#ff7700" transparent opacity={0.35} />
        </mesh>

        {/* Left Arm & Candle (+Z) */}
        <mesh position={[0, 0.02, 0.09]} material={brassMaterial}>
          <boxGeometry args={[0.02, 0.02, 0.18]} />
        </mesh>
        <mesh position={[0, 0.04, 0.18]} material={brassMaterial} castShadow>
          <cylinderGeometry args={[0.05, 0.022, 0.022, 16]} />
        </mesh>
        <mesh position={[0, 0.12, 0.18]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 16]} />
          <meshStandardMaterial color="#f5eedc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.20, 0.18]}>
          <cylinderGeometry args={[0.004, 0.004, 0.025, 8]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.23, 0.18]}>
          <coneGeometry args={[0.022, 0.065, 12]} />
          <meshBasicMaterial color="#ffaa33" />
        </mesh>
        <mesh position={[0, 0.23, 0.18]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#ff7700" transparent opacity={0.35} />
        </mesh>

        {/* Right Arm & Candle (-Z) */}
        <mesh position={[0, 0.02, -0.09]} material={brassMaterial}>
          <boxGeometry args={[0.02, 0.02, 0.18]} />
        </mesh>
        <mesh position={[0, 0.04, -0.18]} material={brassMaterial} castShadow>
          <cylinderGeometry args={[0.05, 0.022, 0.022, 16]} />
        </mesh>
        <mesh position={[0, 0.12, -0.18]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 16]} />
          <meshStandardMaterial color="#f5eedc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.20, -0.18]}>
          <cylinderGeometry args={[0.004, 0.004, 0.025, 8]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.23, -0.18]}>
          <coneGeometry args={[0.022, 0.065, 12]} />
          <meshBasicMaterial color="#ffaa33" />
        </mesh>
        <mesh position={[0, 0.23, -0.18]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#ff7700" transparent opacity={0.35} />
        </mesh>

        {/* Single shared warm candelabra light with gentle flame flicker */}
        <pointLight
          ref={candelabraRef}
          position={[-0.05, 0.26, 0]}
          color="#ffaa44"
          intensity={0.45}
          distance={4.5}
          decay={1.6}
        />

        {/* Soft candelabra wall wash */}
        <pointLight
          ref={candelabraWallRef}
          position={[0.15, 0.10, 0]}
          color="#ff9933"
          intensity={0.35}
          distance={2.2}
          decay={2.0}
        />
      </group>



      {/* ══════════════════════════════════════════════════════
          7. VINTAGE BOX TV (Right wall, positioned under candelabra)
          Floor at y = -0.80. Stand bottom rests on floor.
          Inside right wall at x = 3.32, z = -0.60, angled slightly toward the room/desk
          ══════════════════════════════════════════════════════ */}
      <VintageTv
        position={[3.12, -0.10, -0.95]}
        rotation={[0, -0.28, 0]}
        scale={0.92}
      />
    </group>
  );
};
