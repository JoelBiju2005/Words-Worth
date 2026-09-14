import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useBookStore } from '../store/useBookStore';

// ── Procedural texture for cobblestone walkway ──────────────────────
function createCobblestoneCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#15171c';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 16;
  const cols = 8;
  const rowHeight = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const y = r * rowHeight;
    const offset = (r % 2) * 32;
    for (let c = -1; c <= cols; c++) {
      const colWidth = 512 / cols;
      const x = c * colWidth + offset;
      const w = colWidth - 5 + Math.sin(r * 3 + c) * 3;
      const h = rowHeight - 4;

      const val = 30 + Math.floor((Math.sin(r * 7 + c * 13) * 0.5 + 0.5) * 16);
      ctx.fillStyle = `rgb(${val + 4}, ${val + 2}, ${val})`;

      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, Math.max(4, w), Math.max(4, h), 3);
      ctx.fill();

      ctx.strokeStyle = '#0a0c10';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = `rgba(${val + 20}, ${val + 16}, ${val + 12}, 0.25)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 3);
      ctx.lineTo(x + w - 2, y + 3);
      ctx.stroke();
    }
  }

  return canvas;
}

// ── Helper to create a crisp half moon shape ─────────────────────────
function createHalfMoonShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  // Outer circular arc for the illuminated half (from -PI/2 to PI/2)
  shape.absarc(0, 0, radius, -Math.PI * 0.5, Math.PI * 0.5, false);
  // Straight chord from top tip (0, radius) straight down to bottom tip (0, -radius)
  shape.lineTo(0, -radius);
  shape.closePath();
  return shape;
}

// ── Realistic Tall Tree Component with high crown & branched limbs ───
interface TallTreeProps {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
  woodMat: THREE.Material;
  foliageMat: THREE.Material;
}

const TallTree: React.FC<TallTreeProps> = ({
  position,
  scale = 1,
  rotationY = 0,
  woodMat,
  foliageMat,
}) => {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotationY, 0]}>
      {/* ── Tall Slender Trunk (Base to y = 5.0) ── */}
      <mesh position={[0, 2.6, 0]} rotation={[0.02, 0, -0.03]} material={woodMat}>
        <cylinderGeometry args={[0.2, 0.42, 5.2, 10]} />
      </mesh>
      {/* Trunk root flare */}
      <mesh position={[0, 0.35, 0]} material={woodMat}>
        <cylinderGeometry args={[0.42, 0.65, 0.7, 8]} />
      </mesh>

      {/* ── High Spreading Boughs (Starting high at y = 4.8+) ── */}
      {/* Lower Left Limb */}
      <group position={[-0.08, 4.5, 0]} rotation={[0.15, 0.2, 0.6]}>
        <mesh position={[0, 1.3, 0]} material={woodMat}>
          <cylinderGeometry args={[0.12, 0.18, 2.6, 7]} />
        </mesh>
        <mesh position={[-0.2, 2.3, 0.1]} rotation={[-0.1, 0.3, 0.4]} material={woodMat}>
          <cylinderGeometry args={[0.06, 0.11, 1.8, 6]} />
        </mesh>
      </group>

      {/* Upper Right Limb */}
      <group position={[0.1, 4.8, 0]} rotation={[-0.2, -0.25, -0.55]}>
        <mesh position={[0, 1.4, 0]} material={woodMat}>
          <cylinderGeometry args={[0.11, 0.17, 2.8, 7]} />
        </mesh>
        <mesh position={[0.25, 2.4, -0.1]} rotation={[0.2, -0.2, -0.35]} material={woodMat}>
          <cylinderGeometry args={[0.05, 0.1, 1.7, 6]} />
        </mesh>
      </group>

      {/* Central Upper Trunk Extension */}
      <mesh position={[-0.03, 5.8, 0]} rotation={[-0.04, 0.1, 0.05]} material={woodMat}>
        <cylinderGeometry args={[0.09, 0.16, 2.4, 7]} />
      </mesh>

      {/* ── High Leafy Canopies (Elevated: y = 5.8 to 8.8, never blocking eye-line) ── */}
      <mesh position={[-1.6, 6.2, 0.3]} scale={[1.8, 1.5, 1.7]} material={foliageMat}>
        <dodecahedronGeometry args={[1.3, 1]} />
      </mesh>
      <mesh position={[1.7, 6.6, -0.2]} scale={[1.7, 1.6, 1.8]} material={foliageMat}>
        <dodecahedronGeometry args={[1.35, 1]} />
      </mesh>
      <mesh position={[0.1, 7.6, 0.1]} scale={[2.0, 1.8, 1.9]} material={foliageMat}>
        <dodecahedronGeometry args={[1.45, 1]} />
      </mesh>
      <mesh position={[-0.4, 6.5, 1.2]} scale={[1.3, 1.2, 1.4]} material={foliageMat}>
        <dodecahedronGeometry args={[1.1, 1]} />
      </mesh>
      <mesh position={[0.3, 6.3, -1.3]} scale={[1.4, 1.3, 1.4]} material={foliageMat}>
        <dodecahedronGeometry args={[1.15, 1]} />
      </mesh>
      <mesh position={[-2.3, 5.8, 0.5]} scale={[1.2, 1.0, 1.2]} material={foliageMat}>
        <dodecahedronGeometry args={[0.9, 1]} />
      </mesh>
      <mesh position={[2.2, 6.0, -0.4]} scale={[1.2, 1.0, 1.2]} material={foliageMat}>
        <dodecahedronGeometry args={[0.9, 1]} />
      </mesh>
      <mesh position={[0.2, 8.6, 0.0]} scale={[1.3, 1.1, 1.3]} material={foliageMat}>
        <dodecahedronGeometry args={[0.85, 1]} />
      </mesh>
    </group>
  );
};

export const WindowView: React.FC = () => {
  const cameraState = useBookStore((s) => s.cameraState);
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const moonGleamRef = useRef<THREE.Mesh>(null);
  const mainLanternLightRef = useRef<THREE.PointLight>(null);
  const secondaryLanternLightRef = useRef<THREE.PointLight>(null);

  // ── 1. Omnidirectional 360° Starfield + Window Frustum Cluster ──
  const starPositions = useMemo(() => {
    const omniCount = 1000;
    const windowCount = 500;
    const count = omniCount + windowCount;
    const pos = new Float32Array(count * 3);
    const radius = 160;

    // Omnidirectional stars covering the entire sky
    for (let i = 0; i < omniCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.94);
      const r = radius + (Math.random() - 0.5) * 15;
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = 0.5 + r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    // Dense cluster of bright stars specifically staged in the window aperture sightline
    // Frustum from camera [0, 3.25, 4.45] through window [-3.92, 1.2, -0.6] -> x negative, y between 1 and 18, z between -10 and 6
    for (let i = 0; i < windowCount; i++) {
      const idx = omniCount + i;
      const dist = 35 + Math.random() * 55; // x in -35 to -90
      const theta = (Math.random() - 0.5) * 0.65; // spread in Z
      const y = 2.0 + Math.random() * 16.0;
      pos[idx * 3 + 0] = -dist * Math.cos(theta);
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = -dist * Math.sin(theta) * 0.45 - (Math.random() * 8.0 - 2.0);
    }

    return pos;
  }, []);

  // ── 2. Half Moon Geometry (Radius 3.2 for crisp framing) ──────────
  const halfMoonGeo = useMemo(() => {
    const shape = createHalfMoonShape(3.2);
    return new THREE.ShapeGeometry(shape);
  }, []);

  // ── 3. Cobblestone Pavement & Walkway ──────────────────────────────
  const cobblestoneTexture = useMemo(() => {
    const canvas = createCobblestoneCanvas();
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 20);
    return tex;
  }, []);

  const walkwayGeo = useMemo(() => {
    // Walkway outside the room: 50m long along X, 3.8m wide, strictly located at x <= -6.0
    // Centered at mesh position x = -30, pos.getX varies from -25 to +25 (world x from -55 to -5)
    // We clamp worldX to max -6.2 so it never penetrates the interior room wall at x = -4.0
    const geo = new THREE.PlaneGeometry(50, 3.8, 36, 10);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const localX = pos.getX(i);
      const worldX = Math.min(-6.2, localX - 30);
      pos.setX(i, worldX + 30);
      const curveZ = -0.05 * Math.abs(worldX) - Math.sin(worldX * 0.08) * 1.8 - 0.9;
      pos.setZ(i, pos.getZ(i) + curveZ);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const curbGeo = useMemo(() => {
    return new THREE.BoxGeometry(2.4, 0.18, 0.25);
  }, []);

  // ── 4. Materials ──────────────────────────────────────────────────
  const skyMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: new THREE.Color('#020611') },
          midColor: { value: new THREE.Color('#08152e') },
          bottomColor: { value: new THREE.Color('#0f2347') },
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 midColor;
          uniform vec3 bottomColor;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + vec3(0.0, 15.0, 0.0)).y;
            vec3 col = mix(bottomColor, midColor, clamp(h * 3.0, 0.0, 1.0));
            col = mix(col, topColor, clamp((h - 0.25) * 1.8, 0.0, 1.0));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    []
  );

  // Brilliant Half Moon
  const moonMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fffef5',
        fog: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  const moonHaloMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#cfe2ff',
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  const moonOuterGlowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#659ae8',
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Soft Moonlit Clouds
  const cloudMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#284674',
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Ground & Grass terrain
  const grassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#08120c',
        roughness: 0.88,
        metalness: 0.05,
        fog: false,
      }),
    []
  );

  // Pathway & Pavement
  const pathMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: cobblestoneTexture,
        roughness: 0.75,
        metalness: 0.12,
        color: '#b0b5be',
        fog: false,
      }),
    [cobblestoneTexture]
  );

  const curbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1c1f26',
        roughness: 0.8,
        metalness: 0.1,
        fog: false,
      }),
    []
  );

  const treeWoodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#110d0a',
        roughness: 0.9,
        metalness: 0.05,
        fog: false,
      }),
    []
  );

  const treeFoliageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#05120d',
        roughness: 0.7,
        metalness: 0.08,
        fog: false,
      }),
    []
  );

  // Water & Moonlight Reflection
  const waterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#050c18',
        roughness: 0.18,
        metalness: 0.88,
        fog: false,
      }),
    []
  );

  const moonReflectionMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffeab8',
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      }),
    []
  );

  // Victorian Streetlamps - Rich Vibrant Orange
  const lanternPostMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#0e1014',
        fog: false,
      }),
    []
  );

  const lanternFlameMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff7700',
        fog: false,
      }),
    []
  );

  const lanternHaloMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff6600',
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  const lanternOuterGlowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff4400',
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // ── 5. Pavement Curb Positions (x <= -6.0) ────────────────────────
  const curbPositions = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; rotY: number }> = [];
    for (let x = -6.2; x >= -48; x -= 2.2) {
      const z = -0.05 * Math.abs(x) - Math.sin(x * 0.08) * 1.8 - 0.9;
      const slope = -0.05 * Math.sign(x) - Math.cos(x * 0.08) * 0.144;
      const angle = Math.atan(slope);
      list.push({
        pos: [x, 0.12, z + 1.95],
        rotY: angle,
      });
      list.push({
        pos: [x, 0.12, z - 1.95],
        rotY: angle,
      });
    }
    return list;
  }, []);

  // ── 6. Animation Loop ─────────────────────────────────────────────
  const frameRef = useRef(0);

  useFrame(({ clock }) => {
    frameRef.current++;
    const isWindow = cameraState === 'window';
    if (!isWindow && frameRef.current % 3 !== 0) return;

    const t = clock.getElapsedTime();

    if (moonGleamRef.current) {
      const shimmer = 0.44 + Math.sin(t * 2.2) * 0.08 + Math.cos(t * 3.6) * 0.04;
      (moonGleamRef.current.material as THREE.MeshBasicMaterial).opacity = shimmer;
    }

    if (mainLanternLightRef.current) {
      mainLanternLightRef.current.intensity =
        3.4 + Math.sin(t * 7.5) * 0.25 + Math.cos(t * 11.2) * 0.15;
    }
    if (secondaryLanternLightRef.current) {
      secondaryLanternLightRef.current.intensity =
        1.8 + Math.sin(t * 6.2) * 0.15 + Math.cos(t * 9.8) * 0.10;
    }
  });

  return (
    <group>
      {/* ══════════════════════════════════════════════════════
          1. SKY DOME & 360° ALL-DIRECTION STARS
          ══════════════════════════════════════════════════════ */}
      <mesh position={[-50, 10, 0]} material={skyMat}>
        <sphereGeometry args={[220, 48, 32]} />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#dbeeff"
          size={0.68}
          transparent
          opacity={0.96}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </points>

      {/* ══════════════════════════════════════════════════════
          2. CRISP, UNCOVERED HALF MOON & CLOUDS
          Framed directly within the window view from inside the room
          Positioned at [-42, 5.2, -2.6]
          ══════════════════════════════════════════════════════ */}
      <group position={[-42, 5.2, -2.6]} rotation={[0, Math.PI / 2, -0.1]}>
        {/* Luminous Half Moon Disc */}
        <mesh geometry={halfMoonGeo} material={moonMat} />

        {/* Brilliant Inner Moon Halo */}
        <mesh position={[0, 0, -0.05]} material={moonHaloMat}>
          <circleGeometry args={[5.2, 36]} />
        </mesh>

        {/* Soft Outer Atmospheric Aura */}
        <mesh position={[0, 0, -0.12]} material={moonOuterGlowMat}>
          <circleGeometry args={[11.5, 36]} />
        </mesh>

        {/* Soft drifting moonlit clouds framing the moon */}
        <mesh position={[-5.8, -1.2, 0.2]} material={cloudMat}>
          <planeGeometry args={[16, 4.2]} />
        </mesh>
        <mesh position={[6.5, 1.8, 0.25]} material={cloudMat}>
          <planeGeometry args={[18, 5.0]} />
        </mesh>
        <mesh position={[1.2, -3.5, 0.15]} material={cloudMat}>
          <planeGeometry args={[22, 5.5]} />
        </mesh>

        {/* Crisp directional moonlight cast across the landscape */}
        <directionalLight
          position={[10, 12, -4]}
          color="#adc8f5"
          intensity={1.2}
        />
      </group>

      {/* Additional wispy moonlit clouds across the night sky */}
      <group position={[-55, 12, 5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[-12, 2, 0]} material={cloudMat}>
          <planeGeometry args={[28, 7.5]} />
        </mesh>
        <mesh position={[14, -1, 0]} material={cloudMat}>
          <planeGeometry args={[32, 8.0]} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          3. BEAUTIFULLY TEXTURED PATHWAY & PAVEMENTS
          ══════════════════════════════════════════════════════ */}
      <mesh position={[-30, 0.08, 0]} geometry={walkwayGeo} material={pathMat} />

      {/* Raised Stone Curbs */}
      <group>
        {curbPositions.map((c, idx) => (
          <mesh
            key={`curb-${idx}`}
            position={c.pos}
            rotation={[0, c.rotY, 0]}
            geometry={curbGeo}
            material={curbMat}
          />
        ))}
      </group>

      {/* ══════════════════════════════════════════════════════
          4. PARKLAND TERRAIN & WATER
          ══════════════════════════════════════════════════════ */}
      <mesh position={[-38, 0.02, -18]} rotation={[-Math.PI / 2, 0, 0]} material={grassMat}>
        <planeGeometry args={[65, 28]} />
      </mesh>

      {/* Lake Waters */}
      <mesh
        ref={waterMeshRef}
        position={[-50, 0.01, 18]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={waterMat}
      >
        <planeGeometry args={[90, 42]} />
      </mesh>

      {/* Moon Reflection on the water */}
      <mesh
        ref={moonGleamRef}
        position={[-30, 0.03, 16]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={moonReflectionMat}
      >
        <planeGeometry args={[7.5, 45]} />
      </mesh>

      {/* ══════════════════════════════════════════════════════
          5. TALL DETAILED TREES (Framing the window view)
          Trunks and elevated foliage visible through left & right panes
          ══════════════════════════════════════════════════════ */}
      {/* Tree 1: Left window frame tree (trunk visible in left pane) */}
      <TallTree
        position={[-7.8, 0, -3.8]}
        scale={1.1}
        rotationY={0.4}
        woodMat={treeWoodMat}
        foliageMat={treeFoliageMat}
      />

      {/* Tree 2: Stately tall tree along path */}
      <TallTree
        position={[-13.5, 0, -6.5]}
        scale={1.3}
        rotationY={-0.3}
        woodMat={treeWoodMat}
        foliageMat={treeFoliageMat}
      />

      {/* Tree 3: Mid-path tall elm */}
      <TallTree
        position={[-21.0, 0, -8.5]}
        scale={1.45}
        rotationY={1.1}
        woodMat={treeWoodMat}
        foliageMat={treeFoliageMat}
      />

      {/* Tree 4: Further park tree on left */}
      <TallTree
        position={[-28.5, 0, -7.2]}
        scale={1.6}
        rotationY={-0.8}
        woodMat={treeWoodMat}
        foliageMat={treeFoliageMat}
      />

      {/* Tree 5: Water-side tree on right */}
      <TallTree
        position={[-12.0, 0, 4.2]}
        scale={1.25}
        rotationY={2.2}
        woodMat={treeWoodMat}
        foliageMat={treeFoliageMat}
      />

      {/* Tree 6: Lake promenade companion tree */}
      <TallTree
        position={[-23.5, 0, 7.8]}
        scale={1.4}
        rotationY={0.6}
        woodMat={treeWoodMat}
        foliageMat={treeFoliageMat}
      />

      {/* Tree 7: Deep background park tree */}
      <TallTree
        position={[-36.0, 0, 3.5]}
        scale={1.75}
        rotationY={-1.4}
        woodMat={treeWoodMat}
        foliageMat={treeFoliageMat}
      />

      {/* Tree 8: Distant left park tree */}
      <TallTree
        position={[-36.0, 0, -9.5]}
        scale={1.7}
        rotationY={1.5}
        woodMat={treeWoodMat}
        foliageMat={treeFoliageMat}
      />

      {/* ══════════════════════════════════════════════════════
          6. VICTORIAN STREETLAMPS (LIT UP WITH VIBRANT ORANGE LIGHT)
          ══════════════════════════════════════════════════════ */}
      {/* Streetlamp 1 (Near window, framed in right window pane: x = -6.3, z = -1.4) */}
      <group position={[-6.3, 0, -1.4]}>
        {/* Lamp Base & Post */}
        <mesh position={[0, 0.15, 0]} material={lanternPostMat}>
          <cylinderGeometry args={[0.1, 0.16, 0.3, 10]} />
        </mesh>
        <mesh position={[0, 0.95, 0]} material={lanternPostMat}>
          <cylinderGeometry args={[0.035, 0.048, 1.4, 10]} />
        </mesh>
        <mesh position={[0, 1.68, 0]} material={lanternPostMat}>
          <cylinderGeometry args={[0.08, 0.04, 0.08, 8]} />
        </mesh>

        {/* Lantern Housing */}
        <mesh position={[0, 1.95, 0]} material={lanternPostMat}>
          <cylinderGeometry args={[0.16, 0.1, 0.38, 6]} />
        </mesh>

        {/* Glowing Orange Flame Core */}
        <mesh position={[0, 1.95, 0]} material={lanternFlameMat}>
          <cylinderGeometry args={[0.13, 0.08, 0.32, 6]} />
        </mesh>

        {/* Vibrant Orange Luminous Sprites / Halos */}
        <mesh position={[0, 1.95, 0]} material={lanternHaloMat} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.42, 16]} />
        </mesh>
        <mesh position={[0, 1.95, 0]} material={lanternOuterGlowMat} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.95, 16]} />
        </mesh>

        {/* Lantern Hood & Finial */}
        <mesh position={[0, 2.2, 0]} material={lanternPostMat}>
          <coneGeometry args={[0.18, 0.16, 6]} />
        </mesh>
        <mesh position={[0, 2.32, 0]} material={lanternPostMat}>
          <sphereGeometry args={[0.03, 8, 8]} />
        </mesh>

        {/* Warm Orange Light Emission */}
        <pointLight
          ref={mainLanternLightRef}
          position={[0, 1.95, 0]}
          color="#ff7711"
          intensity={3.8}
          distance={9.0}
          decay={1.6}
        />
      </group>

      {/* Streetlamp 2 (Further along path: x = -15.2, z = -3.2) */}
      <group position={[-15.2, 0, -3.2]}>
        <mesh position={[0, 0.85, 0]} material={lanternPostMat}>
          <cylinderGeometry args={[0.035, 0.045, 1.7, 8]} />
        </mesh>
        <mesh position={[0, 1.75, 0]} material={lanternPostMat}>
          <cylinderGeometry args={[0.14, 0.09, 0.32, 6]} />
        </mesh>
        <mesh position={[0, 1.75, 0]} material={lanternFlameMat}>
          <cylinderGeometry args={[0.11, 0.07, 0.28, 6]} />
        </mesh>
        <mesh position={[0, 1.75, 0]} material={lanternHaloMat} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.35, 16]} />
        </mesh>
        <pointLight
          ref={secondaryLanternLightRef}
          position={[0, 1.75, 0]}
          color="#ff6600"
          intensity={2.0}
          distance={7.0}
          decay={1.6}
        />
      </group>
    </group>
  );
};
