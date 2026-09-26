import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useBookStore } from '../store/useBookStore';
import { WindowView } from './WindowView';
import {
  getDeskWoodTexture,
  getFloorPlanksTexture,
  getFramedPaintingTexture,
  getPersianRugTexture,
  getBookSpineTexture,
} from '../utils/proceduralTextures';
import { VintageTv } from './VintageTv';

// ── Rich, high-contrast antique book leather & cloth colors ─
const BOOK_COLORS = [
  new THREE.Color('#7a2228'), // Deep Crimson
  new THREE.Color('#1b4d32'), // Forest Green
  new THREE.Color('#1c3a63'), // Oxford Navy
  new THREE.Color('#8a5822'), // Warm Amber Ochre
  new THREE.Color('#4a2236'), // Burgundy Plum
  new THREE.Color('#28453d'), // Antique Jade
  new THREE.Color('#8c4224'), // Terracotta Rust
  new THREE.Color('#63381e'), // Cognac Leather
  new THREE.Color('#2e2840'), // Midnight Violet
  new THREE.Color('#7d6849'), // Aged Parchment Cloth
  new THREE.Color('#842a20'), // Ruby Morocco
  new THREE.Color('#1d4240'), // Deep Teal
];

export const Room: React.FC = () => {
  const woodTexture = useMemo(() => getDeskWoodTexture(), []);
  const floorTexture = useMemo(() => getFloorPlanksTexture(), []);
  const paintingTexture = useMemo(() => getFramedPaintingTexture(), []);
  const rugTexture = useMemo(() => getPersianRugTexture(), []);
  const spineTexture = useMemo(() => getBookSpineTexture(), []);

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

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#a6823c',
        roughness: 0.32,
        metalness: 0.75,
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

  // ── Instanced Shelf Books ─────────────────────────────────
  // 3 rows × 18 books = 54 books total
  const bookGeometry = useMemo(() => new THREE.BoxGeometry(0.18, 0.82, 0.30), []);
  const shelfBookRefs = useRef<(THREE.InstancedMesh | null)[]>([null, null, null]);

  const bookRowConfigs = useMemo(() => {
    const rows: Array<{
      matrices: THREE.Matrix4[];
      colors: THREE.Color[];
    }> = [];

    // Reconciled shelf board positions resting on floor at y = -0.80
    const shelfBoardYPositions = [-0.38, 0.45, 1.30];
    const booksPerRow = 18;

    for (let row = 0; row < 3; row++) {
      const matrices: THREE.Matrix4[] = [];
      const colors: THREE.Color[] = [];
      const baseY = shelfBoardYPositions[row] + 0.05; // 0.05 = half of 0.10 board thickness

      for (let b = 0; b < booksPerRow; b++) {
        const m = new THREE.Matrix4();
        const scaleY = 0.72 + (Math.sin(b * 3.7 + row) * 0.5 + 0.5) * 0.38; // Height variation
        const scaleX = 0.75 + (Math.cos(b * 2.1) * 0.5 + 0.5) * 0.55;       // Width variation
        const scaleZ = 0.88 + Math.random() * 0.20;

        // Spread across shelf width with slight organic spacing
        const x = -2.85 + b * 0.335 + (Math.sin(b * 4.3) * 0.02);
        const y = baseY + (scaleY * 0.82) / 2; // Sit firmly on shelf board
        const z = 0.17 + (Math.sin(b * 5.1) * 0.04); // Staggered depth
        const rotY = (Math.sin(b * 7.1) * 0.05);      // Slight tilt on shelf
        const rotZ = b % 5 === 4 ? 0.07 : (b % 7 === 6 ? -0.06 : 0); // Leaning book

        m.compose(
          new THREE.Vector3(x, y, z),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, rotZ)),
          new THREE.Vector3(scaleX, scaleY, scaleZ)
        );
        matrices.push(m);
        colors.push(BOOK_COLORS[(b * 3 + row * 4) % BOOK_COLORS.length]);
      }

      rows.push({ matrices, colors });
    }
    return rows;
  }, []);

  // Apply instance matrices and colors on mount
  React.useLayoutEffect(() => {
    bookRowConfigs.forEach((row, rowIdx) => {
      const mesh = shelfBookRefs.current[rowIdx];
      if (!mesh) return;
      row.matrices.forEach((mat, i) => {
        mesh.setMatrixAt(i, mat);
        mesh.setColorAt(i, row.colors[i]);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
  }, [bookRowConfigs]);

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
          2. BOOKSHELVES (back wall)
          ══════════════════════════════════════════════════════ */}
      <group position={[0, 0, -2.48]}>
        {/* Bookshelf Lighting: Twin balanced mid-height diffuse fill lights (no harsh blowout) */}
        <pointLight
          position={[-1.4, 0.90, 0.68]}
          color="#ffdba0"
          intensity={0.42}
          distance={4.5}
          decay={1.6}
        />
        <pointLight
          position={[1.4, 0.90, 0.68]}
          color="#ffdba0"
          intensity={0.42}
          distance={4.5}
          decay={1.6}
        />
        <pointLight
          position={[0, 0.6, 0.6]}
          color="#ffdba0"
          intensity={0.5}
          distance={4.0}
          decay={1.8}
        />

        {/* Outer frame — Left & Right sturdy upright posts */}
        <mesh position={[-3.15, 0.72, 0.16]} material={shelfWoodMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.12, 3.04, 0.46]} />
        </mesh>
        <mesh position={[3.15, 0.72, 0.16]} material={shelfWoodMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.12, 3.04, 0.46]} />
        </mesh>

        {/* Center vertical mullion divider */}
        <mesh position={[0, 0.72, 0.15]} material={shelfWoodMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.08, 2.96, 0.44]} />
        </mesh>

        {/* Top Cornice Crown Molding */}
        <mesh position={[0, 2.24, 0.18]} material={shelfWoodMaterial} castShadow>
          <boxGeometry args={[6.48, 0.16, 0.50]} />
        </mesh>

        {/* Bottom Base Plinth (rests solidly on hardwood floor at y = -0.80) */}
        <mesh position={[0, -0.72, 0.18]} material={shelfWoodMaterial} receiveShadow>
          <boxGeometry args={[6.48, 0.16, 0.50]} />
        </mesh>

        {/* Horizontal shelf boards — thick, visible, casting distinct shadows */}
        {[-0.38, 0.45, 1.30, 2.15].map((y, idx) => (
          <group key={`shelf-assembly-${idx}`} position={[0, y, 0]}>
            {/* Main shelf plank */}
            <mesh position={[0, 0, 0.15]} material={shelfWoodMaterial} receiveShadow castShadow>
              <boxGeometry args={[6.26, 0.10, 0.44]} />
            </mesh>
            {/* Front beveled nose molding strip catching highlights */}
            <mesh position={[0, 0, 0.375]} material={shelfWoodMaterial} castShadow>
              <boxGeometry args={[6.28, 0.11, 0.03]} />
            </mesh>
            {/* Under-shelf shadow recess strip */}
            <mesh position={[0, -0.055, 0.18]}>
              <boxGeometry args={[6.24, 0.015, 0.40]} />
              <meshBasicMaterial color="#120a06" />
            </mesh>
          </group>
        ))}

        {/* Instanced book rows with embossed gold ribs & vertical AO spine texture */}
        {bookRowConfigs.map((_, rowIdx) => (
          <instancedMesh
            key={`bookrow-${rowIdx}`}
            ref={(el) => { shelfBookRefs.current[rowIdx] = el; }}
            args={[bookGeometry, undefined, 18]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              map={spineTexture}
              roughness={0.48}
              metalness={0.08}
            />
          </instancedMesh>
        ))}

        {/* Decorative library accents on shelves */}
        {/* Bookend + bronze urn on middle shelf right */}
        <group position={[2.75, 0.65, 0.22]}>
          <mesh material={brassMaterial} castShadow>
            <boxGeometry args={[0.05, 0.28, 0.22]} />
          </mesh>
          <mesh position={[0.08, -0.02, 0]} material={brassMaterial} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
        </group>

        {/* Rolled parchment scroll on bottom shelf left */}
        <group position={[-2.75, -0.22, 0.24]} rotation={[0, 0.2, Math.PI / 2]}>
          <mesh material={baseboardMaterial} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.32, 16]} />
          </mesh>
        </group>
      </group>

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
          6. FRAMED PICTURE (Back wall, right of bookshelf)
          Positioned at eye level (y = 1.35)
          ══════════════════════════════════════════════════════ */}
      <group position={[3.56, 1.35, -2.55]}>
        {/* Canvas painting with Old Master artwork */}
        <mesh position={[0, 0, 0.006]}>
          <planeGeometry args={[0.72, 0.90]} />
          <meshStandardMaterial
            map={paintingTexture}
            roughness={0.55}
            metalness={0.04}
          />
        </mesh>

        {/* Inner gold fillet bevel */}
        <mesh position={[0, 0, 0.008]} material={brassMaterial}>
          <boxGeometry args={[0.75, 0.93, 0.008]} />
        </mesh>

        {/* Outer carved antique gold frame */}
        <mesh position={[0, 0.49, 0.02]} material={frameMaterial}>
          <boxGeometry args={[0.88, 0.08, 0.035]} />
        </mesh>
        <mesh position={[0, -0.49, 0.02]} material={frameMaterial}>
          <boxGeometry args={[0.88, 0.08, 0.035]} />
        </mesh>
        <mesh position={[-0.41, 0, 0.02]} material={frameMaterial}>
          <boxGeometry args={[0.08, 1.06, 0.035]} />
        </mesh>
        <mesh position={[0.41, 0, 0.02]} material={frameMaterial}>
          <boxGeometry args={[0.08, 1.06, 0.035]} />
        </mesh>

        {/* 4 ornate corner rosette bosses */}
        {[-0.41, 0.41].map((cx) =>
          [-0.49, 0.49].map((cy) => (
            <mesh key={`pframe-boss-${cx}-${cy}`} position={[cx, cy, 0.03]} material={brassMaterial}>
              <boxGeometry args={[0.085, 0.085, 0.015]} />
            </mesh>
          ))
        )}
      </group>

      {/* ══════════════════════════════════════════════════════
          7. VINTAGE BOX TV (Right wall, positioned under candelabra)
          Floor at y = -0.80. Stand bottom rests on floor.
          Inside right wall at x = 3.32, z = -0.60, angled slightly toward the room/desk
          ══════════════════════════════════════════════════════ */}
      <VintageTv
        position={[3.32, -0.10, -0.60]}
        rotation={[0, -Math.PI / 2 - 0.22, 0]}
        scale={0.92}
      />
    </group>
  );
};
