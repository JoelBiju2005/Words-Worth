import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { RoundedBox, Html } from '@react-three/drei';
import { getDeskWoodTexture, getLetterTexture } from '../utils/proceduralTextures';
import { useBookStore } from '../store/useBookStore';

// ── Helper: create an authentic fountain pen nib shape ──────
function createNibShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.012, 0);
  s.lineTo(-0.012, 0.025);
  s.quadraticCurveTo(-0.013, 0.05, -0.002, 0.08);
  s.lineTo(0, 0.085);
  s.lineTo(0.002, 0.08);
  s.quadraticCurveTo(0.013, 0.05, 0.012, 0.025);
  s.lineTo(0.012, 0);
  s.closePath();
  return s;
}

export const DeskProps: React.FC = () => {
  const woodTexture = useMemo(() => getDeskWoodTexture(), []);
  const letterTex = useMemo(() => getLetterTexture(), []);
  const setCandleIntensity = useBookStore((state) => state.setCandleIntensity);
  const cameraState = useBookStore((state) => state.cameraState);
  const sitAtDesk = useBookStore((state) => state.sitAtDesk);
  const [chairHovered, setChairHovered] = useState(false);

  // Keep shader light uniform steady for the desk lamp
  React.useEffect(() => {
    setCandleIntensity(1.0);
  }, [setCandleIntensity]);

  // Lamp target aimed directly downward onto the tabletop beneath the shade
  const lampDeskTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    // Directly underneath the shade at desk surface (y = 0 in local lamp coords)
    obj.position.set(0, 0, 0);
    return obj;
  }, []);

  // Secondary soft target aimed across toward the bookstand
  const lampBookTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(1.15, 0.38, -0.34);
    return obj;
  }, []);

  // ── Materials ─────────────────────────────────────────────
  const deskMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        color: '#42291b',
        roughness: 0.48,
        metalness: 0.10,
      }),
    [woodTexture]
  );

  const mahoganyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        color: '#341a12',
        roughness: 0.42,
        metalness: 0.08,
      }),
    [woodTexture]
  );

  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.30,
        metalness: 0.88,
      }),
    []
  );

  const darkBronzeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3d2b1f',
        roughness: 0.40,
        metalness: 0.82,
      }),
    []
  );

  const ormoluGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e5b842',
        roughness: 0.24,
        metalness: 0.92,
      }),
    []
  );

  const flutedColumnMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c49a32',
        roughness: 0.32,
        metalness: 0.85,
      }),
    []
  );

  const lampSilkShadeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fff3db',
        emissive: '#ffe4b5',
        emissiveIntensity: 0.55,
        roughness: 0.60,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    []
  );

  const lampBulbMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffeedd',
        emissiveIntensity: 2.2,
        roughness: 0.1,
        metalness: 0.0,
      }),
    []
  );

  const chairFabricMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3a1f18',
        roughness: 0.52,
        metalness: 0.08,
      }),
    []
  );

  const recordMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#141414',
        roughness: 0.28,
        metalness: 0.65,
      }),
    []
  );

  const penGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f0c040',
        roughness: 0.20,
        metalness: 0.95,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.90,
        opacity: 1.0,
        transparent: true,
        roughness: 0.12,
        ior: 1.52,
        thickness: 0.05,
      }),
    []
  );

  const cutGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.94,
        opacity: 1.0,
        transparent: true,
        roughness: 0.06,
        ior: 1.54,
        thickness: 0.08,
      }),
    []
  );

  const darkVioletInkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#07040e',
        roughness: 0.12,
        metalness: 0.18,
      }),
    []
  );

  const rosewoodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#28110b',
        roughness: 0.35,
        metalness: 0.08,
      }),
    []
  );

  const boneGripMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f0ebd8',
        roughness: 0.40,
        metalness: 0.05,
      }),
    []
  );

  const sealingWaxMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#7a1414',
        roughness: 0.32,
        metalness: 0.12,
      }),
    []
  );

  const antiqueBookCoverMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2a3528',
        roughness: 0.78,
        metalness: 0.04,
      }),
    []
  );

  const antiqueBookPageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8dec2',
        roughness: 0.88,
        metalness: 0.0,
      }),
    []
  );

  const eyeglassLensMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.96,
        opacity: 0.95,
        transparent: true,
        roughness: 0.04,
        ior: 1.50,
        thickness: 0.012,
      }),
    []
  );

  const hornBrassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.28,
        metalness: 0.90,
        side: THREE.DoubleSide,
      }),
    []
  );

  const nibGeometry = useMemo(() => {
    const s = createNibShape();
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.003,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.001,
      bevelThickness: 0.001,
    });
  }, []);

  const letterGeometry = useMemo(() => {
    const width = 0.44;
    const height = 0.32;
    const geo = new THREE.PlaneGeometry(width, height, 32, 24);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) + width / 2) / width;
      const v = (pos.getY(i) + height / 2) / height;
      // Gentle surface wave strictly >= 0
      const wave = (Math.sin(u * Math.PI) * 0.5 + 0.5) * 0.003 + (Math.sin(v * Math.PI) * 0.5 + 0.5) * 0.002;
      // Lifted parchment corners strictly >= 0
      const cornerLift = Math.pow(Math.max(0, 1.0 - u), 2.5) * 0.016 + Math.pow(v, 2.5) * 0.012;
      pos.setZ(i, wave + cornerLift);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // ── Scalloped morning-glory gramophone horn (reference-matched) ──────
  // Creates a petal/flower-shaped bell with wavy lobes and seam ridges,
  // matching the classic decorative brass gramophone horn from the reference.
  const petalCount = 10; // Number of scalloped petals around the bell
  const morningGloryGeometry = useMemo(() => {
    const bodySegments = 56;
    const hornHeight = 0.28;
    const rThroat = 0.018;   // ~3.6cm diameter at throat
    const rMouth = 0.20;     // ~40cm diameter at bell mouth (wider than cabinet)
    const thetaSegments = 64; // Angular resolution for petal detail

    // Build base LatheGeometry profile
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= bodySegments; i++) {
      const t = i / bodySegments;
      // Classic morning-glory exponential flare
      const r = rThroat + (rMouth - rThroat) * Math.pow(t, 2.0);
      const y = t * hornHeight;
      points.push(new THREE.Vector2(r, y));
    }

    // Rolled lip at the rim for visible wall thickness
    const lipSteps = 6;
    const lipRadius = 0.008;
    for (let i = 1; i <= lipSteps; i++) {
      const angle = (i / lipSteps) * Math.PI * 0.7;
      const r = rMouth + Math.sin(angle) * lipRadius;
      const y = hornHeight + (1 - Math.cos(angle)) * lipRadius;
      points.push(new THREE.Vector2(r, y));
    }

    const geo = new THREE.LatheGeometry(points, thetaSegments);

    // ── Displace vertices to create scalloped petal shape ──
    // Push vertices outward/inward based on their angular position
    // to create the flower-petal lobes visible in the reference
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Compute the angle around the Y axis
      const theta = Math.atan2(z, x);
      // Compute how far along the flare we are (0=throat, 1=mouth)
      const heightFraction = Math.max(0, Math.min(1, y / hornHeight));
      // Current radius from center
      const currentR = Math.sqrt(x * x + z * z);

      if (currentR > rThroat * 1.5 && heightFraction > 0.15) {
        // Petal displacement: sinusoidal lobes that grow stronger toward the rim
        const petalPhase = Math.cos(theta * petalCount) * 0.5 + 0.5; // 0–1
        // Displacement grows with height fraction (stronger at bell mouth)
        const strength = Math.pow(heightFraction, 2.5) * 0.035;
        const displacement = petalPhase * strength;

        // Push vertex outward radially
        const scale = 1 + displacement / Math.max(currentR, 0.001);
        pos.setX(i, x * scale);
        pos.setZ(i, z * scale);

        // Also lift petal peaks slightly upward at the rim for the curled-petal look
        if (heightFraction > 0.7) {
          const rimLift = petalPhase * (heightFraction - 0.7) * 0.02;
          pos.setY(i, y + rimLift);
        }
      }
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  // ── Seam ridges running down the horn bell (decorative ribs) ──
  // Creates thin raised ridges at the boundary between each petal
  const hornSeamGeometry = useMemo(() => {
    const seamPoints: THREE.Vector3[] = [];
    const segments = 24;
    const hornHeight = 0.28;
    const rThroat = 0.018;
    const rMouth = 0.20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const r = rThroat + (rMouth - rThroat) * Math.pow(t, 2.0);
      // Add slight outward bump for the seam ridge
      const rBump = r + (t > 0.15 ? Math.pow(t, 2.5) * 0.004 : 0);
      const y = t * hornHeight;
      seamPoints.push(new THREE.Vector3(rBump, y, 0));
    }
    const curve = new THREE.CatmullRomCurve3(seamPoints, false);
    return new THREE.TubeGeometry(curve, 20, 0.0018, 6, false);
  }, []);

  // ── Thick curved goose-neck elbow with collar joints ──
  // Starts at the back centre of the cabinet/turntable base and curves up and forward towards the camera
  const hornElbowGeometry = useMemo(() => {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),              // Base connection at back center
      new THREE.Vector3(0, 0.08, 0.04),        // Rising up and gently forward
      new THREE.Vector3(-0.02, 0.18, 0.12),    // Arcing forward over the turntable
      new THREE.Vector3(-0.03, 0.25, 0.20),    // Upper curve terminating at horn throat
    ], false, 'catmullrom', 0.5);
    return new THREE.TubeGeometry(path, 32, 0.016, 14, false);
  }, []);

  // ── Authentic vintage S-curved tonearm pipe (matching reference image) ──
  // Rises vertically from base pivot, arcs up and forward, then dips down toward the reproducer soundbox
  const vintageTonearmGeometry = useMemo(() => {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.025, 0),
      new THREE.Vector3(-0.015, 0.045, 0.02),
      new THREE.Vector3(-0.045, 0.048, 0.06),
      new THREE.Vector3(-0.075, 0.038, 0.095),
      new THREE.Vector3(-0.095, 0.022, 0.11),
    ], false, 'catmullrom', 0.5);
    return new THREE.TubeGeometry(path, 28, 0.007, 12, false);
  }, []);

  return (
    <group>
      {/* ══════════════════════════════════════════════════════
          1. EXPANDED WRITING DESK (+23% footprint: 3.20m wide × 1.60m deep)
          Tabletop surface at y = 0.20, floor at y = -0.80.
          Provides ample room for completely separated, non-overlapping props.
          ══════════════════════════════════════════════════════ */}
      <group position={[0, 0.20, 0]}>
        {/* Main tabletop: 3.20m wide × 1.60m deep, thickness 0.06m */}
        <mesh position={[0, -0.03, 0.05]} receiveShadow castShadow material={deskMaterial}>
          <boxGeometry args={[3.20, 0.06, 1.60]} />
        </mesh>
        {/* Beveled edge molding along perimeter */}
        <mesh position={[0, -0.025, 0.855]} material={deskMaterial} castShadow>
          <boxGeometry args={[3.24, 0.07, 0.03]} />
        </mesh>

        {/* Front apron/drawer section */}
        <mesh position={[0, -0.115, 0.80]} material={deskMaterial} castShadow>
          <boxGeometry args={[3.04, 0.11, 0.05]} />
        </mesh>
        {/* Side apron panels (left & right) */}
        <mesh position={[-1.50, -0.115, 0.05]} material={deskMaterial} castShadow>
          <boxGeometry args={[0.05, 0.11, 1.50]} />
        </mesh>
        <mesh position={[1.50, -0.115, 0.05]} material={deskMaterial} castShadow>
          <boxGeometry args={[0.05, 0.11, 1.50]} />
        </mesh>
        {/* Back apron rail */}
        <mesh position={[0, -0.115, -0.70]} material={deskMaterial}>
          <boxGeometry args={[3.04, 0.11, 0.04]} />
        </mesh>

        {/* 3 Drawer panel bevels across expanded front */}
        {[-0.92, 0, 0.92].map((dx, i) => (
          <group key={`drawer-panel-${i}`} position={[dx, -0.115, 0.83]}>
            <mesh material={deskMaterial}>
              <boxGeometry args={[0.78, 0.085, 0.015]} />
            </mesh>
            {/* Antique brass drop pull handle */}
            <mesh position={[0, 0, 0.014]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
              <torusGeometry args={[0.022, 0.0035, 12, 24, Math.PI]} />
            </mesh>
            <mesh position={[0, 0.012, 0.010]} material={brassMaterial}>
              <cylinderGeometry args={[0.006, 0.006, 0.010, 16]} />
            </mesh>
            {/* Small lock escutcheon */}
            <mesh position={[0, -0.024, 0.012]} material={brassMaterial}>
              <cylinderGeometry args={[0.006, 0.008, 0.004, 12]} />
            </mesh>
          </group>
        ))}

        {/* 4 Turned Baluster Legs — widened to lx=±1.42, lz=[0.68, -0.58] */}
        {[
          [-1.42, 0.68],
          [1.42, 0.68],
          [-1.42, -0.58],
          [1.42, -0.58],
        ].map(([lx, lz], idx) => (
          <group key={`desk-leg-${idx}`} position={[lx, 0, lz]}>
            {/* Upper square block transitioning from apron */}
            <mesh position={[0, -0.22, 0]} material={deskMaterial} castShadow>
              <boxGeometry args={[0.14, 0.10, 0.14]} />
            </mesh>
            {/* Upper decorative turned ring */}
            <mesh position={[0, -0.30, 0]} material={deskMaterial}>
              <torusGeometry args={[0.070, 0.015, 12, 24]} />
            </mesh>
            {/* Upper baluster shaft — graceful taper */}
            <mesh position={[0, -0.46, 0]} material={deskMaterial} castShadow receiveShadow>
              <cylinderGeometry args={[0.052, 0.066, 0.28, 16]} />
            </mesh>
            {/* Mid decorative bulb (baluster swell) */}
            <mesh position={[0, -0.58, 0]} material={deskMaterial}>
              <sphereGeometry args={[0.072, 16, 16]} />
            </mesh>
            {/* Lower long taper shaft */}
            <mesh position={[0, -0.74, 0]} material={deskMaterial} castShadow receiveShadow>
              <cylinderGeometry args={[0.044, 0.058, 0.28, 16]} />
            </mesh>
            {/* Lower decorative turned ring near foot */}
            <mesh position={[0, -0.88, 0]} material={deskMaterial}>
              <torusGeometry args={[0.054, 0.011, 12, 24]} />
            </mesh>
            {/* Short foot taper reaching the floor */}
            <mesh position={[0, -0.93, 0]} material={deskMaterial} castShadow>
              <cylinderGeometry args={[0.040, 0.048, 0.08, 16]} />
            </mesh>
            {/* Brass ferrule foot touching floor at local y = -1.0 (world y = -0.80) */}
            <mesh position={[0, -0.975, 0]} material={brassMaterial}>
              <cylinderGeometry args={[0.044, 0.050, 0.05, 16]} />
            </mesh>
          </group>
        ))}

        {/* Low perimeter stretchers tucked near floor */}
        <mesh position={[0, -0.90, -0.58]} material={deskMaterial}>
          <boxGeometry args={[2.80, 0.045, 0.045]} />
        </mesh>
        <mesh position={[-1.42, -0.90, 0.05]} material={deskMaterial}>
          <boxGeometry args={[0.045, 0.045, 1.26]} />
        </mesh>
        <mesh position={[1.42, -0.90, 0.05]} material={deskMaterial}>
          <boxGeometry args={[0.045, 0.045, 1.26]} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          2. VINTAGE WOODEN DESK CHAIR (Front of Desk)
          Ground at y = -0.80, position z = 1.25 gives proper clearance
          in front of the deepened desk.
          ══════════════════════════════════════════════════════ */}
      <group
        position={[0.0, -0.80, 1.25]}
        rotation={[0, Math.PI, 0]}
        onPointerOver={(e) => {
          if (cameraState === 'wide') {
            e.stopPropagation();
            setChairHovered(true);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          setChairHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          if (cameraState === 'wide') {
            e.stopPropagation();
            setChairHovered(false);
            document.body.style.cursor = 'default';
            sitAtDesk();
          }
        }}
      >
        {/* "Take a Seat" Pop-Up Tooltip on Hover */}
        {chairHovered && cameraState === 'wide' && (
          <Html position={[0, 0.95, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
            <div className="chair-seat-popup">
              <span className="chair-seat-text">Take a Seat</span>
            </div>
          </Html>
        )}

        {/* 4 Turned Chair Legs with taper and decorative swell */}
        {[
          [-0.30, 0.22, 0.24],
          [0.30, 0.22, 0.24],
          [-0.27, 0.22, -0.26],
          [0.27, 0.22, -0.26],
        ].map(([cx, cy, cz], cidx) => (
          <group key={`chair-leg-${cidx}`} position={[cx, cy, cz]}>
            {/* Tapered turned leg cylinder */}
            <mesh material={deskMaterial} castShadow>
              <cylinderGeometry args={[0.024, 0.032, 0.44, 16]} />
            </mesh>
            {/* Turned decorative ring */}
            <mesh position={[0, 0.10, 0]} material={deskMaterial}>
              <torusGeometry args={[0.033, 0.008, 8, 16]} />
            </mesh>
            {/* Brass foot ferrule cap */}
            <mesh position={[0, -0.20, 0]} material={brassMaterial}>
              <cylinderGeometry args={[0.024, 0.026, 0.04, 16]} />
            </mesh>
          </group>
        ))}

        {/* Chair Leg Stretchers for structural realism */}
        <mesh position={[-0.285, 0.12, -0.01]} material={deskMaterial}>
          <boxGeometry args={[0.030, 0.030, 0.48]} />
        </mesh>
        <mesh position={[0.285, 0.12, -0.01]} material={deskMaterial}>
          <boxGeometry args={[0.030, 0.030, 0.48]} />
        </mesh>
        <mesh position={[0, 0.12, -0.01]} material={deskMaterial}>
          <boxGeometry args={[0.56, 0.028, 0.028]} />
        </mesh>

        {/* Chair Seat Wooden Frame */}
        <RoundedBox args={[0.68, 0.045, 0.60]} radius={0.014} smoothness={2}
          position={[0, 0.44, 0]} material={deskMaterial} castShadow>
        </RoundedBox>

        {/* Tufted Padded Cushion (Soft oatmeal linen, plush depth) */}
        <RoundedBox args={[0.63, 0.065, 0.55]} radius={0.025} smoothness={3}
          position={[0, 0.48, 0]} material={chairFabricMaterial} receiveShadow castShadow>
        </RoundedBox>
        {/* Cushion tufting button accents (Diamond layout) */}
        {[
          [-0.14, 0.515, -0.08],
          [0.14, 0.515, -0.08],
          [-0.14, 0.515, 0.08],
          [0.14, 0.515, 0.08],
        ].map(([bx, by, bz], bidx) => (
          <mesh key={`cushion-button-${bidx}`} position={[bx, by, bz]} material={chairFabricMaterial}>
            <sphereGeometry args={[0.014, 12, 12]} />
          </mesh>
        ))}

        {/* Rear Upright Posts extending to high backrest (finials at y = +0.21 above desk surface) */}
        {[-0.27, 0.27].map((px, pidx) => (
          <group key={`chair-post-${pidx}`} position={[px, 0.72, -0.27]}>
            <mesh material={deskMaterial} castShadow>
              <cylinderGeometry args={[0.022, 0.026, 0.54, 16]} />
            </mesh>
            {/* Decorative brass top ball finial */}
            <mesh position={[0, 0.29, 0]} material={brassMaterial}>
              <sphereGeometry args={[0.026, 16, 16]} />
            </mesh>
          </group>
        ))}

        {/* Curved Top Crest Rail */}
        <mesh position={[0, 0.96, -0.27]} material={deskMaterial} castShadow>
          <boxGeometry args={[0.62, 0.075, 0.034]} />
        </mesh>
        {/* Mid horizontal lumbar support rail */}
        <mesh position={[0, 0.58, -0.27]} material={deskMaterial}>
          <boxGeometry args={[0.56, 0.040, 0.024]} />
        </mesh>

        {/* 5 Turned Spindles in Backrest */}
        {[-0.18, -0.09, 0, 0.09, 0.18].map((sx, sidx) => (
          <mesh key={`chair-spindle-${sidx}`} position={[sx, 0.76, -0.27]} material={deskMaterial}>
            <cylinderGeometry args={[0.010, 0.014, 0.32, 12]} />
          </mesh>
        ))}
      </group>

      {/* ══════════════════════════════════════════════════════
          3. TALL VINTAGE TABLE LAMP (Left Desk Wing)
          Taller than the book (height ~1.34m) so light cascades down
          directly onto the open book. Completely clean shade (no hoops).
          Resting flush on the raised tabletop surface at y = 0.20
          ══════════════════════════════════════════════════════ */}
      <group position={[-1.15, 0.20, -0.12]}>
        {/* ── Weighted Stepped Circular Brass Base ── */}
        <mesh position={[0, 0.012, 0]} castShadow receiveShadow material={ormoluGoldMaterial}>
          <cylinderGeometry args={[0.14, 0.16, 0.024, 32]} />
        </mesh>
        <mesh position={[0, 0.032, 0]} castShadow material={ormoluGoldMaterial}>
          <cylinderGeometry args={[0.10, 0.13, 0.018, 32]} />
        </mesh>
        <mesh position={[0, 0.050, 0]} material={ormoluGoldMaterial}>
          <cylinderGeometry args={[0.055, 0.09, 0.020, 32]} />
        </mesh>

        {/* ── Tall Turned Brass & Bronze Column ── */}
        {/* Lower urn knop swell */}
        <mesh position={[0, 0.085, 0]} castShadow material={ormoluGoldMaterial}>
          <sphereGeometry args={[0.045, 24, 20]} />
        </mesh>
        {/* Lower column transition collar */}
        <mesh position={[0, 0.125, 0]} material={ormoluGoldMaterial}>
          <cylinderGeometry args={[0.032, 0.042, 0.030, 24]} />
        </mesh>
        {/* Main lower column shaft */}
        <mesh position={[0, 0.34, 0]} material={flutedColumnMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.024, 0.030, 0.40, 32]} />
        </mesh>
        {/* Mid ornamental brass swell knop */}
        <mesh position={[0, 0.56, 0]} material={ormoluGoldMaterial} castShadow>
          <sphereGeometry args={[0.036, 24, 20]} />
        </mesh>
        {/* Upper column shaft */}
        <mesh position={[0, 0.73, 0]} material={flutedColumnMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.022, 0.026, 0.30, 32]} />
        </mesh>
        {/* Upper capital / crown */}
        <mesh position={[0, 0.90, 0]} material={ormoluGoldMaterial} castShadow>
          <cylinderGeometry args={[0.038, 0.024, 0.040, 24]} />
        </mesh>
        {/* Brass socket riser cup */}
        <mesh position={[0, 0.94, 0]} material={ormoluGoldMaterial} castShadow>
          <cylinderGeometry args={[0.026, 0.032, 0.050, 24]} />
        </mesh>

        {/* ── Clean Smooth Flared Fabric Lampshade (Taller Than Book) ── */}
        {/* Perfectly clean conical shade: NO hoops, NO wire rings, NO distortions */}
        <mesh position={[0, 1.10, 0]} material={lampSilkShadeMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.30, 0.36, 48, 1, true]} />
        </mesh>

        {/* Top Brass Spider Cap & Finial Spire */}
        <mesh position={[0, 1.288, 0]} material={ormoluGoldMaterial}>
          <cylinderGeometry args={[0.018, 0.028, 0.016, 20]} />
        </mesh>
        <mesh position={[0, 1.31, 0]} material={ormoluGoldMaterial} castShadow>
          <sphereGeometry args={[0.016, 16, 16]} />
        </mesh>
        <mesh position={[0, 1.34, 0]} material={ormoluGoldMaterial} castShadow>
          <coneGeometry args={[0.010, 0.035, 16]} />
        </mesh>

        {/* ── Interior Glowing Bulb inside Shade ── */}
        <mesh position={[0, 1.04, 0]} material={lampBulbMaterial}>
          <sphereGeometry args={[0.040, 16, 16]} />
        </mesh>

        {/* ── 1. Expansive Downward Key Spotlight onto Desk Surface ── */}
        {/* Maximum spread circular pool covering the entire left desk wing and adjacent props */}
        <primitive object={lampDeskTarget} />
        <spotLight
          position={[0, 0.90, 0]}
          target={lampDeskTarget}
          color="#ffdca6"
          intensity={6.5}
          angle={Math.PI / 2.1}
          penumbra={0.75}
          distance={4.0}
          decay={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0008}
          shadow-radius={2}
        />

        {/* ── 2. Wide Secondary Point Light for Ambient Desktop Radiance ── */}
        {/* Spreads warm ambient glow outward across the desk */}
        <pointLight
          position={[0, 0.88, 0]}
          color="#ffc776"
          intensity={2.0}
          distance={1.8}
          decay={1.5}
        />

        {/* ── 3. Subtle Translucent Fabric Glow through Shade ── */}
        <pointLight
          position={[0, 1.05, 0]}
          color="#ffddaa"
          intensity={0.65}
          distance={2.0}
          decay={1.8}
        />

        {/* ── 4. Subtle Cross-Desk Fill onto Bookstand ── */}
        <primitive object={lampBookTarget} />
        <spotLight
          position={[0, 0.96, 0]}
          target={lampBookTarget}
          color="#ffe6ca"
          intensity={1.2}
          angle={Math.PI / 3.4}
          penumbra={0.85}
          distance={4.5}
          decay={1.6}
        />

        {/* Upper ceiling wash bounce (gentle atmospheric lift above lamp) */}
        <pointLight
          position={[0, 1.36, 0]}
          color="#ffd8a4"
          intensity={0.35}
          distance={2.5}
          decay={2.0}
        />
      </group>

      {/* ══════════════════════════════════════════════════════
          ANTIQUE BOOK WITH RESTING WIRE-FRAME GLASSES (Left Desk Wing)
          An antique leatherbound volume with 5x enlarged, clean wireframe
          reading spectacles resting on top of its cover near the lamp.
          ══════════════════════════════════════════════════════ */}
      <group position={[-0.74, 0.20, 0.32]} rotation={[0, 0.20, 0]}>
        {/* ── Antique Hardcover Leatherbound Book Underneath ── */}
        {/* Book cover (dark olive/brown aged leather) */}
        <RoundedBox args={[0.34, 0.056, 0.44]} radius={0.008} smoothness={2}
          position={[0, 0.028, 0]} material={antiqueBookCoverMaterial} castShadow receiveShadow>
        </RoundedBox>

        {/* Textured antique deckle page block */}
        <mesh position={[0.012, 0.028, 0]} material={antiqueBookPageMaterial}>
          <boxGeometry args={[0.31, 0.046, 0.41]} />
        </mesh>

        {/* Gold Embossed Spine Ribs */}
        {[-0.15, -0.075, 0, 0.075, 0.15].map((sz, sidx) => (
          <mesh key={`left-book-gold-rib-${sidx}`} position={[-0.171, 0.028, sz]} material={penGoldMaterial}>
            <boxGeometry args={[0.002, 0.050, 0.008]} />
          </mesh>
        ))}

        {/* ── 5x Enlarged Clean Wire-Frame Reading Glasses ── */}
        {/* Resting flush on top of the book cover at y = 0.056 */}
        <group position={[0.0, 0.056, 0.0]} scale={5.0} rotation={[0, 0.10, 0]}>
          {/* ── Left Circular Wire Lens & Rim ── */}
          <mesh position={[-0.024, 0.001, 0]} rotation={[Math.PI / 2, 0, 0]} material={flutedColumnMaterial} castShadow>
            <torusGeometry args={[0.016, 0.0008, 8, 32]} />
          </mesh>
          <mesh position={[-0.024, 0.001, 0]} material={eyeglassLensMaterial}>
            <cylinderGeometry args={[0.0155, 0.0155, 0.0008, 24]} />
          </mesh>

          {/* ── Right Circular Wire Lens & Rim (Identical & Mirrored) ── */}
          <mesh position={[0.024, 0.001, 0]} rotation={[Math.PI / 2, 0, 0]} material={flutedColumnMaterial} castShadow>
            <torusGeometry args={[0.016, 0.0008, 8, 32]} />
          </mesh>
          <mesh position={[0.024, 0.001, 0]} material={eyeglassLensMaterial}>
            <cylinderGeometry args={[0.0155, 0.0155, 0.0008, 24]} />
          </mesh>

          {/* ── Central Arched Wire Nose Bridge ── */}
          <mesh position={[0, 0.0035, 0.001]} rotation={[Math.PI / 2, 0, 0]} material={flutedColumnMaterial}>
            <torusGeometry args={[0.008, 0.0008, 8, 16, Math.PI]} />
          </mesh>

          {/* ── Outer Hinge Lugs ── */}
          <mesh position={[-0.041, 0.001, 0]} rotation={[0, 0, Math.PI / 2]} material={flutedColumnMaterial}>
            <cylinderGeometry args={[0.0012, 0.0012, 0.003, 8]} />
          </mesh>
          <mesh position={[0.041, 0.001, 0]} rotation={[0, 0, Math.PI / 2]} material={flutedColumnMaterial}>
            <cylinderGeometry args={[0.0012, 0.0012, 0.003, 8]} />
          </mesh>

          {/* ── First Folded Temple Arm (Hinged at left lug X = -0.041, folds rightward across frame) ── */}
          <group position={[-0.041, 0.002, 0]} rotation={[0, 0.16, 0]}>
            {/* Straight arm section spanning toward right lens */}
            <mesh position={[0.036, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={flutedColumnMaterial} castShadow>
              <cylinderGeometry args={[0.0007, 0.0007, 0.072, 8]} />
            </mesh>
            {/* Ear hook curved at the far end (lying flat in horizontal plane) */}
            <mesh position={[0.074, 0, -0.004]} rotation={[Math.PI / 2, 0, -Math.PI * 0.35]} material={flutedColumnMaterial}>
              <torusGeometry args={[0.006, 0.0007, 8, 16, Math.PI * 0.65]} />
            </mesh>
          </group>

          {/* ── Second Folded Temple Arm (Hinged at right lug X = +0.041, folds leftward slightly above first) ── */}
          <group position={[0.041, 0.0035, 0]} rotation={[0, -0.16, 0]}>
            {/* Straight arm section spanning toward left lens */}
            <mesh position={[-0.036, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={flutedColumnMaterial} castShadow>
              <cylinderGeometry args={[0.0007, 0.0007, 0.072, 8]} />
            </mesh>
            {/* Ear hook curved at the far end (lying flat in horizontal plane) */}
            <mesh position={[-0.074, 0, -0.004]} rotation={[Math.PI / 2, 0, Math.PI * 0.35]} material={flutedColumnMaterial}>
              <torusGeometry args={[0.006, 0.0007, 8, 16, Math.PI * 0.65]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════
          4. VINTAGE GRAMOPHONE / PHONOGRAPH (Reference-matched)
          Classic mahogany cabinet with turned corner pilasters,
          large scalloped brass morning-glory horn, thick goose-neck
          ══════════════════════════════════════════════════════ */}
      <group position={[1.18, 0.20, -0.28]}>

        {/* ── Ornate Mahogany Cabinet Base ── */}
        {/* Main cabinet body */}
        <RoundedBox args={[0.36, 0.16, 0.36]} radius={0.008} smoothness={2}
          position={[0, 0.08, 0]} material={mahoganyMaterial} castShadow receiveShadow>
        </RoundedBox>

        {/* Stepped base plinth molding (bottom) */}
        <mesh position={[0, 0.006, 0]} material={mahoganyMaterial} castShadow>
          <boxGeometry args={[0.40, 0.012, 0.40]} />
        </mesh>
        <mesh position={[0, 0.016, 0]} material={mahoganyMaterial} castShadow>
          <boxGeometry args={[0.395, 0.010, 0.395]} />
        </mesh>

        {/* Top rim molding around cabinet edge */}
        <mesh position={[0, 0.145, 0]} material={mahoganyMaterial}>
          <boxGeometry args={[0.37, 0.014, 0.37]} />
        </mesh>

        {/* ── 4 Turned Corner Pilasters (decorative columns at cabinet corners) ── */}
        {[
          [-0.17, -0.17],
          [0.17, -0.17],
          [-0.17, 0.17],
          [0.17, 0.17],
        ].map(([cx, cz], cidx) => (
          <group key={`pilaster-${cidx}`} position={[cx, 0, cz]}>
            {/* Main turned column shaft */}
            <mesh position={[0, 0.08, 0]} material={mahoganyMaterial} castShadow>
              <cylinderGeometry args={[0.016, 0.018, 0.14, 14]} />
            </mesh>
            {/* Upper decorative ring */}
            <mesh position={[0, 0.14, 0]} material={mahoganyMaterial}>
              <torusGeometry args={[0.019, 0.004, 8, 14]} />
            </mesh>
            {/* Mid decorative bulb swell */}
            <mesh position={[0, 0.07, 0]} material={mahoganyMaterial}>
              <sphereGeometry args={[0.020, 12, 10]} />
            </mesh>
            {/* Lower decorative ring */}
            <mesh position={[0, 0.018, 0]} material={mahoganyMaterial}>
              <torusGeometry args={[0.019, 0.004, 8, 14]} />
            </mesh>
            {/* Brass base cap */}
            <mesh position={[0, 0.005, 0]} material={brassMaterial}>
              <cylinderGeometry args={[0.014, 0.016, 0.010, 12]} />
            </mesh>
          </group>
        ))}

        {/* ── Winding Crank (right side, with gear hub) ── */}
        <group position={[0.19, 0.085, 0]} rotation={[0, 0, -Math.PI / 7]}>
          {/* Crank shaft */}
          <mesh material={brassMaterial}>
            <cylinderGeometry args={[0.006, 0.006, 0.06, 12]} />
          </mesh>
          {/* Gear hub wheel */}
          <mesh position={[0, -0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.008, 20]} />
            <meshStandardMaterial color="#b8b8b8" roughness={0.35} metalness={0.75} />
          </mesh>
          {/* Crank handle (wooden knob) */}
          <mesh position={[0, 0.035, 0.04]} rotation={[Math.PI / 2, 0, 0]} material={mahoganyMaterial}>
            <cylinderGeometry args={[0.008, 0.010, 0.055, 12]} />
          </mesh>
          {/* Handle end cap */}
          <mesh position={[0, 0.035, 0.07]} material={brassMaterial}>
            <sphereGeometry args={[0.008, 10, 10]} />
          </mesh>
        </group>

        {/* ── Circular Brass Turntable Platter ── */}
        <mesh position={[0, 0.155, 0]} castShadow material={brassMaterial}>
          <cylinderGeometry args={[0.14, 0.14, 0.012, 32]} />
        </mesh>
        {/* Platter felt surface */}
        <mesh position={[0, 0.162, 0]} material={darkBronzeMaterial}>
          <cylinderGeometry args={[0.135, 0.135, 0.004, 32]} />
        </mesh>

        {/* ── Black Vinyl Phonograph Record ── */}
        <mesh position={[0, 0.166, 0]} material={recordMaterial}>
          <cylinderGeometry args={[0.128, 0.128, 0.004, 32]} />
        </mesh>
        {/* Red center label */}
        <mesh position={[0, 0.169, 0]}>
          <cylinderGeometry args={[0.044, 0.044, 0.005, 24]} />
          <meshStandardMaterial color="#881a1a" roughness={0.5} />
        </mesh>
        {/* Center spindle */}
        <mesh position={[0, 0.175, 0]} material={brassMaterial}>
          <cylinderGeometry args={[0.003, 0.003, 0.012, 12]} />
        </mesh>

        {/* ── Authentic Vintage Phonograph Tonearm & Stylus Pin (Reference Replicated) ── */}
        <group position={[0.11, 0.16, -0.06]}>
          {/* Stepped brass/nickel flange base screwed to deck */}
          <mesh castShadow material={flutedColumnMaterial}>
            <cylinderGeometry args={[0.018, 0.024, 0.008, 20]} />
          </mesh>
          <mesh position={[0, 0.006, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.013, 0.015, 0.012, 16]} />
          </mesh>
          <mesh position={[0, 0.014, 0]} material={flutedColumnMaterial}>
            <torusGeometry args={[0.012, 0.003, 8, 20]} />
          </mesh>

          {/* S-curved hollow tonearm pipe */}
          <mesh geometry={vintageTonearmGeometry} castShadow>
            <meshStandardMaterial color="#c8b078" roughness={0.32} metalness={0.85} />
          </mesh>

          {/* Sleeve joint collar along the arm */}
          <mesh position={[-0.045, 0.048, 0.06]} rotation={[0, 0.7, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.0085, 0.0085, 0.010, 14]} />
          </mesh>

          {/* Black rubber / metal acoustic coupler ring at soundbox connector */}
          <mesh position={[-0.095, 0.022, 0.11]} rotation={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.008, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* ── SOUNDBOX / REPRODUCER HEAD (Classic "Exhibition" Style) ── */}
          {/* Sits vertically oriented perpendicular to the record surface */}
          <group position={[-0.10, 0.018, 0.12]} rotation={[0, 0.65, 0]}>
            {/* Outer circular housing rim / bezel (Nickel/Gold finish) */}
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow material={ormoluGoldMaterial}>
              <cylinderGeometry args={[0.026, 0.026, 0.007, 24]} />
            </mesh>

            {/* Domed protective rim ring */}
            <mesh position={[0, 0, 0.004]} rotation={[Math.PI / 2, 0, 0]} material={flutedColumnMaterial}>
              <torusGeometry args={[0.024, 0.0022, 8, 24]} />
            </mesh>

            {/* Thin mica / aluminum diaphragm disc beneath the grille */}
            <mesh position={[0, 0, 0.002]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.022, 24]} />
              <meshStandardMaterial color="#ebd7a0" roughness={0.25} metalness={0.88} side={THREE.DoubleSide} />
            </mesh>

            {/* Decorative pierced "Spider" protective front grille (3-arm radiating scrollwork) */}
            {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((rad, gi) => (
              <mesh key={`grille-${gi}`} position={[0, 0, 0.0045]} rotation={[0, 0, rad]}>
                <boxGeometry args={[0.0025, 0.022, 0.002]} />
                <meshStandardMaterial color="#ffd24d" metalness={0.92} roughness={0.22} />
              </mesh>
            ))}

            {/* Center connector button linking diaphragm to needle bar */}
            <mesh position={[0, 0, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
              <sphereGeometry args={[0.0035, 12, 10]} />
              <meshStandardMaterial color="#ffd24d" metalness={0.95} roughness={0.2} />
            </mesh>

            {/* ── PIVOTING NEEDLE CARRIER & STYLUS PIN (Matching Reference) ── */}
            {/* Lower pivot bar at bottom edge of soundbox */}
            <mesh position={[0, -0.022, 0.005]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
              <cylinderGeometry args={[0.0025, 0.0025, 0.012, 10]} />
            </mesh>

            {/* Needle chuck block */}
            <mesh position={[0, -0.026, 0.006]} material={flutedColumnMaterial}>
              <boxGeometry args={[0.0045, 0.008, 0.0055]} />
            </mesh>

            {/* Tiny knurled thumbscrew on side of needle chuck (for clamping needle) */}
            <mesh position={[0.004, -0.026, 0.006]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.002, 0.002, 0.005, 10]} />
              <meshStandardMaterial color="#e5b842" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[0.0065, -0.026, 0.006]} rotation={[0, 0, Math.PI / 2]}>
              <sphereGeometry args={[0.0022, 8, 8]} />
              <meshStandardMaterial color="#ffd24d" metalness={0.95} roughness={0.2} />
            </mesh>

            {/* Authentic Steel/Gold Phonograph Needle Pin */}
            {/* Fine pointed pin protruding downward onto the vinyl record */}
            <mesh position={[0, -0.035, 0.006]} rotation={[0.08, 0, 0]} castShadow>
              <cylinderGeometry args={[0.0009, 0.0009, 0.012, 8]} />
              <meshStandardMaterial color="#f0d060" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Sharp tapered tip touching record groove */}
            <mesh position={[0, -0.042, 0.0055]} rotation={[0.08, 0, 0]} castShadow>
              <coneGeometry args={[0.0009, 0.005, 8]} />
              <meshStandardMaterial color="#ffe580" metalness={0.98} roughness={0.1} />
            </mesh>
          </group>
        </group>

        {/* ══════════════════════════════════════════════════════
            SCALLOPED MORNING-GLORY BRASS HORN ASSEMBLY
            Large petal-shaped bell with seam ridges, thick goose-neck
            with collar joints. Horn mouth wider than cabinet.
            Angled ~45° upward and to the left/forward (matching reference).
            ══════════════════════════════════════════════════════ */}
        <group position={[0, 0.16, -0.15]}>

          {/* ── Thick Curved Goose-Neck Elbow with Collar Joints ── */}
          <mesh geometry={hornElbowGeometry} material={brassMaterial} castShadow />

          {/* Collar joint at bottom of goose-neck (back center of cabinet) */}
          <mesh position={[0, 0.0, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.022, 0.024, 0.016, 16]} />
          </mesh>

          {/* Mid collar joint on the goose-neck bend */}
          <mesh position={[-0.01, 0.13, 0.08]} material={brassMaterial}>
            <cylinderGeometry args={[0.020, 0.022, 0.012, 16]} />
          </mesh>

          {/* Upper collar joint where goose-neck meets horn throat */}
          <mesh position={[-0.03, 0.23, 0.18]} material={brassMaterial}>
            <cylinderGeometry args={[0.022, 0.024, 0.014, 16]} />
          </mesh>

          {/* ── Large Scalloped Morning-Glory Horn Bell ── */}
          {/* Facing forward (+Z towards camera) and angled slightly upward */}
          <group position={[-0.03, 0.25, 0.20]} rotation={[1.15, 0, 0.08]}>
            <mesh geometry={morningGloryGeometry} material={hornBrassMaterial} castShadow receiveShadow />

            {/* ── Decorative Seam Ridges (ribs between each petal) ── */}
            {Array.from({ length: petalCount }).map((_, si) => {
              const angle = (si / petalCount) * Math.PI * 2;
              return (
                <mesh
                  key={`seam-${si}`}
                  geometry={hornSeamGeometry}
                  material={ormoluGoldMaterial}
                  rotation={[0, angle, 0]}
                  castShadow
                />
              );
            })}
          </group>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════
          5. SUPPORTING ANTIQUE DESK PROPS
          Harmoniously scaled Book Stack + Magnifying Glass resting cleanly on top
          ══════════════════════════════════════════════════════ */}
      <group position={[1.12, 0.20, 0.28]} rotation={[0, 0.08, 0]}>
        {/* Bottom book - Rich Burgundy (Realistic desktop proportions) */}
        <RoundedBox args={[0.26, 0.048, 0.36]} radius={0.005} smoothness={2}
          position={[0, 0.024, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#58161c" roughness={0.55} />
        </RoundedBox>
        <mesh position={[0.012, 0.024, 0]}>
          <boxGeometry args={[0.24, 0.040, 0.34]} />
          <meshStandardMaterial color="#d8c59f" roughness={0.9} />
        </mesh>

        {/* Top book - Dark Hunter Green (offset angle) */}
        <group position={[0.01, 0.068, 0.01]} rotation={[0, -0.12, 0]}>
          <RoundedBox args={[0.23, 0.042, 0.32]} radius={0.005} smoothness={2}
            castShadow receiveShadow>
            <meshStandardMaterial color="#1a3525" roughness={0.55} />
          </RoundedBox>
          <mesh position={[0.010, 0, 0]}>
            <boxGeometry args={[0.21, 0.036, 0.30]} />
            <meshStandardMaterial color="#d8c59f" roughness={0.9} />
          </mesh>

          {/* Antique Brass Magnifying Glass resting flat on top of the book cover */}
          <group position={[0.01, 0.026, 0]} rotation={[0, 0.25, 0]}>
            {/* Turned wooden handle */}
            <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mahoganyMaterial} castShadow>
              <cylinderGeometry args={[0.007, 0.008, 0.11, 16]} />
            </mesh>
            <mesh position={[-0.14, 0, 0]} material={brassMaterial}>
              <sphereGeometry args={[0.009, 12, 12]} />
            </mesh>
            {/* Brass collar ferrule */}
            <mesh position={[-0.022, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
              <cylinderGeometry args={[0.007, 0.007, 0.016, 16]} />
            </mesh>
            {/* Circular brass lens rim */}
            <mesh position={[0.04, 0, 0]} material={brassMaterial} castShadow>
              <torusGeometry args={[0.042, 0.0035, 12, 28]} />
            </mesh>
            {/* Glass magnifying lens */}
            <mesh position={[0.04, 0, 0]} material={glassMaterial}>
              <cylinderGeometry args={[0.041, 0.041, 0.002, 24]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════
          6. FACETED CUT-GLASS INKWELL & SEALING WAX STICKS
          Positioned behind letter opener & pen tray at [0.84, 0.20, 0.28]
          Clearance to bookstand (>0.36m), clear from neighboring props.
          ══════════════════════════════════════════════════════ */}
      <group position={[0.84, 0.20, 0.28]} rotation={[0, 0.22, 0]}>
        {/* Cut-Glass Octagonal Prism Inkwell Body */}
        {/* Heavy faceted clear crystal reservoir catching specular reflections */}
        <mesh position={[0, 0.040, 0]} castShadow receiveShadow material={cutGlassMaterial}>
          <cylinderGeometry args={[0.044, 0.048, 0.076, 8]} />
        </mesh>
        {/* Beveled corner facets on base */}
        <mesh position={[0, 0.008, 0]} material={cutGlassMaterial}>
          <cylinderGeometry args={[0.048, 0.052, 0.016, 8]} />
        </mesh>
        {/* Deep violet-black ink reservoir visible through clear cut-glass walls */}
        <mesh position={[0, 0.030, 0]} material={darkVioletInkMaterial}>
          <cylinderGeometry args={[0.034, 0.038, 0.050, 8]} />
        </mesh>

        {/* Ormolu Brass Neck Collar */}
        <mesh position={[0, 0.082, 0]} material={ormoluGoldMaterial} castShadow>
          <cylinderGeometry args={[0.026, 0.030, 0.014, 20]} />
        </mesh>
        <mesh position={[0, 0.091, 0]} material={flutedColumnMaterial}>
          <torusGeometry args={[0.027, 0.003, 8, 20]} />
        </mesh>

        {/* Hinged Brass Domed Cap / Lid */}
        <group position={[0, 0.092, 0]}>
          {/* Domed lid body */}
          <mesh position={[0, 0.012, 0]} material={ormoluGoldMaterial} castShadow>
            <sphereGeometry args={[0.026, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {/* Top turned finial knop */}
          <mesh position={[0, 0.038, 0]} material={ormoluGoldMaterial}>
            <sphereGeometry args={[0.006, 12, 12]} />
          </mesh>
          {/* Rear hinge knuckle */}
          <mesh position={[0, 0.004, -0.027]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.014, 10]} />
          </mesh>
          {/* Front thumb latch tab */}
          <mesh position={[0, 0.006, 0.028]} rotation={[0.2, 0, 0]} material={ormoluGoldMaterial}>
            <boxGeometry args={[0.010, 0.003, 0.008]} />
          </mesh>
        </group>

        {/* Pair of Carmine Sealing Wax Sticks resting beside inkwell */}
        <group position={[-0.08, 0.008, 0.04]} rotation={[0, 0.35, 0]}>
          {/* Stick 1 (Carmine Red) */}
          <mesh position={[0, 0.006, 0]} rotation={[0, 0, Math.PI / 2]} material={sealingWaxMaterial} castShadow>
            <cylinderGeometry args={[0.006, 0.006, 0.095, 12]} />
          </mesh>
          {/* Exposed wick tip on stick 1 */}
          <mesh position={[-0.051, 0.006, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0012, 0.0012, 0.008, 8]} />
            <meshStandardMaterial color="#dedede" roughness={0.7} />
          </mesh>

          {/* Stick 2 (Carmine Red, resting angled against stick 1) */}
          <mesh position={[0.008, 0.015, -0.010]} rotation={[0.1, 0.25, Math.PI / 2 - 0.08]} material={sealingWaxMaterial} castShadow>
            <cylinderGeometry args={[0.006, 0.006, 0.090, 12]} />
          </mesh>
          {/* Exposed wick tip on stick 2 */}
          <mesh position={[-0.042, 0.018, -0.020]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0012, 0.0012, 0.008, 8]} />
            <meshStandardMaterial color="#dedede" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════
          7. ORNAMENTAL BRASS LETTER OPENER
          Resting cleanly to the right of the manuscript at [0.76, 0.205, 0.44]
          Maintains strict 0.10m clear air gap from paper edge (x=0.66).
          ══════════════════════════════════════════════════════ */}
      <group position={[0.76, 0.205, 0.44]} rotation={[0, -0.28, 0]}>
        {/* Tapered double-edged dagger blade */}
        <mesh position={[0, 0.003, 0.075]} rotation={[-Math.PI / 2, 0, 0]} material={flutedColumnMaterial} castShadow>
          <coneGeometry args={[0.012, 0.18, 4]} />
        </mesh>
        {/* Central blade fuller ridge */}
        <mesh position={[0, 0.004, 0.065]} rotation={[-Math.PI / 2, 0, 0]} material={ormoluGoldMaterial}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.14, 8]} />
        </mesh>

        {/* Sculpted antique crossguard */}
        <mesh position={[0, 0.004, -0.015]} rotation={[0, 0, Math.PI / 2]} material={ormoluGoldMaterial} castShadow>
          <cylinderGeometry args={[0.0045, 0.006, 0.042, 12]} />
        </mesh>
        {/* Guard finials */}
        <mesh position={[-0.022, 0.004, -0.015]} material={ormoluGoldMaterial}>
          <sphereGeometry args={[0.0045, 10, 10]} />
        </mesh>
        <mesh position={[0.022, 0.004, -0.015]} material={ormoluGoldMaterial}>
          <sphereGeometry args={[0.0045, 10, 10]} />
        </mesh>

        {/* Turned grip handle */}
        <mesh position={[0, 0.004, -0.055]} rotation={[Math.PI / 2, 0, 0]} material={rosewoodMaterial} castShadow>
          <cylinderGeometry args={[0.0055, 0.007, 0.070, 14]} />
        </mesh>
        {/* Handle gold ferrule bands */}
        <mesh position={[0, 0.004, -0.024]} rotation={[Math.PI / 2, 0, 0]} material={ormoluGoldMaterial}>
          <torusGeometry args={[0.007, 0.0015, 8, 16]} />
        </mesh>
        <mesh position={[0, 0.004, -0.086]} rotation={[Math.PI / 2, 0, 0]} material={ormoluGoldMaterial}>
          <torusGeometry args={[0.006, 0.0015, 8, 16]} />
        </mesh>

        {/* Antique pommel crest */}
        <mesh position={[0, 0.004, -0.096]} material={ormoluGoldMaterial}>
          <sphereGeometry args={[0.008, 12, 12]} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          8. SCULPTED BRASS PEN TRAY & TURNED DIP PEN
          Positioned at [0.98, 0.20, 0.52] with 0.14m buffer from letter opener.
          Curved concave brass tray with elevated cradles + diagonal dip pen.
          ══════════════════════════════════════════════════════ */}
      <group position={[0.98, 0.20, 0.52]} rotation={[0, -0.18, 0]}>
        {/* Sculpted Concave Brass Pen Tray Body */}
        {/* Base tray plinth with rounded ends */}
        <RoundedBox args={[0.088, 0.012, 0.30]} radius={0.006} smoothness={2}
          position={[0, 0.006, 0]} material={ormoluGoldMaterial} castShadow receiveShadow>
        </RoundedBox>
        {/* Concave pen resting trough / groove */}
        <mesh position={[0, 0.010, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 0.27, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#aa8328" roughness={0.35} metalness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Raised decorative rim molding around the perimeter */}
        <mesh position={[0, 0.012, 0.145]} material={flutedColumnMaterial}>
          <cylinderGeometry args={[0.003, 0.003, 0.080, 10]} />
        </mesh>
        <mesh position={[0, 0.012, -0.145]} material={flutedColumnMaterial}>
          <cylinderGeometry args={[0.003, 0.003, 0.080, 10]} />
        </mesh>

        {/* Twin Elevated Sculpted Rest Saddles */}
        {/* Front cradle rest */}
        <group position={[0, 0.016, 0.07]}>
          <mesh material={flutedColumnMaterial} castShadow>
            <cylinderGeometry args={[0.008, 0.010, 0.018, 12]} />
          </mesh>
          <mesh position={[0, 0.010, 0]} rotation={[0, 0, Math.PI / 2]} material={ormoluGoldMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.016, 12, 1, false, 0, Math.PI]} />
          </mesh>
        </group>
        {/* Rear cradle rest */}
        <group position={[0, 0.016, -0.07]}>
          <mesh material={flutedColumnMaterial} castShadow>
            <cylinderGeometry args={[0.008, 0.010, 0.022, 12]} />
          </mesh>
          <mesh position={[0, 0.012, 0]} rotation={[0, 0, Math.PI / 2]} material={ormoluGoldMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.016, 12, 1, false, 0, Math.PI]} />
          </mesh>
        </group>

        {/* ── Handcrafted Antique Dip Pen ── */}
        {/* Resting at an authentic diagonal slant (~22°) elevated across the cradles */}
        <group position={[0, 0.034, 0]} rotation={[-0.10, 0.22, 0.04]}>
          {/* Split Steel/Gold Writing Nib */}
          <group position={[0, 0, 0.14]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={nibGeometry} material={penGoldMaterial} castShadow />
            {/* Breather hole */}
            <mesh position={[0, 0.032, 0.002]}>
              <circleGeometry args={[0.0018, 10]} />
              <meshBasicMaterial color="#1a1205" />
            </mesh>
            {/* Ink slit */}
            <mesh position={[0, 0.046, 0.002]}>
              <planeGeometry args={[0.0006, 0.028]} />
              <meshBasicMaterial color="#08040e" />
            </mesh>
          </group>

          {/* Carved Bone / Ivory Grip Ferrule */}
          <mesh position={[0, 0, 0.105]} rotation={[Math.PI / 2, 0, 0]} material={boneGripMaterial} castShadow>
            <cylinderGeometry args={[0.006, 0.0075, 0.040, 16]} />
          </mesh>
          {/* Gold collar rings between bone and wood */}
          <mesh position={[0, 0, 0.084]} rotation={[Math.PI / 2, 0, 0]} material={penGoldMaterial}>
            <torusGeometry args={[0.0075, 0.0014, 8, 16]} />
          </mesh>

          {/* Slender Turned Rosewood / Ebony Handle with Tapered Tail */}
          <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={rosewoodMaterial} castShadow>
            <cylinderGeometry args={[0.0072, 0.008, 0.090, 16]} />
          </mesh>
          <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]} material={rosewoodMaterial} castShadow>
            <cylinderGeometry args={[0.0045, 0.0072, 0.075, 16]} />
          </mesh>
          <mesh position={[0, 0, -0.11]} rotation={[Math.PI / 2, 0, 0]} material={rosewoodMaterial}>
            <cylinderGeometry args={[0.0025, 0.0045, 0.035, 12]} />
          </mesh>
          {/* Rounded finial end */}
          <mesh position={[0, 0, -0.128]} material={penGoldMaterial}>
            <sphereGeometry args={[0.0032, 10, 10]} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════
          9. OLD LETTER / PARCHMENT WITH AUTHENTIC PRESSED WAX SEAL
          Positioned at [0.44, 0.203, 0.50]
          Wax seal has explicit +0.006m elevation offset eliminating z-fighting.
          ══════════════════════════════════════════════════════ */}
      <group position={[0.44, 0.203, 0.50]} rotation={[-Math.PI / 2, 0, 0.12]}>
        {/* Curled manuscript sheet */}
        <mesh geometry={letterGeometry} receiveShadow castShadow>
          <meshStandardMaterial
            map={letterTex}
            color="#edd8b1"
            roughness={0.82}
            metalness={0.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Authentic Stamped Wax Seal (Flattened irregular disc with intaglio crest) */}
        {/* Safe +0.006m normal offset conforming firmly over wavy parchment fibers */}
        <group position={[0.13, -0.09, 0.006]}>
          {/* Main squeezed flattened wax puddle disc */}
          <mesh position={[0, 0, 0.002]} castShadow material={sealingWaxMaterial}>
            <cylinderGeometry args={[0.036, 0.042, 0.004, 24]} />
          </mesh>

          {/* Organic flattened irregular squeeze lobes (where wax oozed under the signet) */}
          <mesh position={[0.024, 0.008, 0.0018]} material={sealingWaxMaterial}>
            <cylinderGeometry args={[0.015, 0.020, 0.0035, 14]} />
          </mesh>
          <mesh position={[-0.022, -0.012, 0.0018]} material={sealingWaxMaterial}>
            <cylinderGeometry args={[0.016, 0.022, 0.0035, 14]} />
          </mesh>
          <mesh position={[-0.010, 0.022, 0.0016]} material={sealingWaxMaterial}>
            <cylinderGeometry args={[0.014, 0.018, 0.0032, 12]} />
          </mesh>
          <mesh position={[0.012, -0.024, 0.0016]} material={sealingWaxMaterial}>
            <cylinderGeometry args={[0.015, 0.019, 0.0032, 12]} />
          </mesh>

          {/* Raised outer rim ring forced up by the matrix edge */}
          <mesh position={[0, 0, 0.0045]} material={sealingWaxMaterial}>
            <torusGeometry args={[0.026, 0.0035, 10, 28]} />
          </mesh>

          {/* Central intaglio stamped floor (indented basin where seal ring pressed) */}
          <mesh position={[0, 0, 0.0032]}>
            <cylinderGeometry args={[0.023, 0.023, 0.002, 24]} />
            <meshStandardMaterial color="#550b0b" roughness={0.42} metalness={0.10} />
          </mesh>

          {/* Embossed Intaglio Signet Crest / Monogram detail */}
          {/* Inner heraldic shield / seal ring outline */}
          <mesh position={[0, 0, 0.0044]} material={sealingWaxMaterial}>
            <torusGeometry args={[0.015, 0.0018, 8, 20]} />
          </mesh>
          {/* Victorian Monogram flourishes raised in the indented center */}
          <mesh position={[0, 0.002, 0.0048]} rotation={[0, 0, -0.15]} material={sealingWaxMaterial}>
            <boxGeometry args={[0.014, 0.0030, 0.0016]} />
          </mesh>
          <mesh position={[-0.004, -0.002, 0.0048]} rotation={[0, 0, Math.PI / 4]} material={sealingWaxMaterial}>
            <boxGeometry args={[0.011, 0.0025, 0.0016]} />
          </mesh>
          <mesh position={[0.004, -0.002, 0.0048]} rotation={[0, 0, -Math.PI / 4]} material={sealingWaxMaterial}>
            <boxGeometry args={[0.011, 0.0025, 0.0016]} />
          </mesh>
          {/* Micro signet dots */}
          <mesh position={[0, 0.008, 0.0048]} material={sealingWaxMaterial}>
            <sphereGeometry args={[0.0016, 8, 8]} />
          </mesh>
          <mesh position={[0, -0.008, 0.0048]} material={sealingWaxMaterial}>
            <sphereGeometry args={[0.0016, 8, 8]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
