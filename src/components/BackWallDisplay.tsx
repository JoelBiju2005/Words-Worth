import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useBookStore } from '../store/useBookStore';
import { getDeskWoodTexture } from '../utils/proceduralTextures';
import { drawDoodle, drawPushPin } from '../utils/scrapbookTextures';

// ── Cache for procedural textures generated on 2D canvas ────
let corkTextureCache: THREE.CanvasTexture | null = null;
let noticeboardCanvasTextureCache: THREE.CanvasTexture | null = null;
const plaqueTextureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural authentic porous warm cork texture
 */
function getCorkBoardTexture(): THREE.CanvasTexture {
  if (corkTextureCache) return corkTextureCache;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm sandy amber cork base
  ctx.fillStyle = '#b88b56';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle tonal clouding
  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 360);
  grad.addColorStop(0, 'rgba(215, 175, 125, 0.35)');
  grad.addColorStop(1, 'rgba(140, 95, 50, 0.45)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Granular cork pores & particles
  const rng = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  let s = 42;
  for (let i = 0; i < 3500; i++) {
    const px = rng(s++) * 512;
    const py = rng(s++) * 512;
    const rad = 0.8 + rng(s++) * 2.8;
    const alpha = 0.08 + rng(s++) * 0.22;
    const isDark = rng(s++) > 0.4;
    ctx.fillStyle = isDark
      ? `rgba(70, 42, 20, ${alpha})`
      : `rgba(240, 210, 160, ${alpha * 1.2})`;
    ctx.beginPath();
    ctx.ellipse(px, py, rad * (0.8 + rng(s++) * 0.8), rad, rng(s++) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  corkTextureCache = tex;
  return tex;
}

/**
 * Noticeboard overlay canvas rendering scrapbook photo slots,
 * EST. 2021 card, doodles, pins, and handwritten captions
 */
function getNoticeboardContentTexture(): THREE.CanvasTexture {
  if (noticeboardCanvasTextureCache) return noticeboardCanvasTextureCache;

  const canvas = document.createElement('canvas');
  // High resolution for clean text & crisp pin/doodle details
  canvas.width = 1600;
  canvas.height = 1300;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1600, 1300);

  // ── 1. EST. 2021 Card (Top-Left Corner) ────────────────────
  // Book's gold-on-dark card aesthetic
  const cardX = 130;
  const cardY = 120;
  const cardW = 240;
  const cardH = 150;

  ctx.save();
  ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
  ctx.rotate(-0.06);

  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 6;

  // Dark charcoal/leather card base
  ctx.fillStyle = '#1c1512';
  ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
  ctx.shadowColor = 'transparent';

  // Double gold pinstripe border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(-cardW / 2 + 8, -cardH / 2 + 8, cardW - 16, cardH - 16);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-cardW / 2 + 13, -cardH / 2 + 13, cardW - 26, cardH - 26);

  // EST. 2021 text in formal serif
  ctx.fillStyle = '#f5e4be';
  ctx.font = '700 24px "Playfair Display", "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EST. 2021', 0, -18);

  ctx.fillStyle = '#c5a059';
  ctx.font = 'italic 15px "Playfair Display", Georgia, serif';
  ctx.fillText('WORDS WORTH', 0, 14);

  // Corner flourish dots
  ctx.fillStyle = '#d4af37';
  for (const cx of [-cardW / 2 + 18, cardW / 2 - 18]) {
    for (const cy of [-cardH / 2 + 18, cardH / 2 - 18]) {
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Pushpin mounting the card at top center
  drawPushPin(ctx, 0, -cardH / 2 + 6, '#b83b28');
  ctx.restore();

  // ── 2. Three Pinned Photo Placeholder Slots (Loose diagonal scatter) ──
  // Each slot: width ~ 250px, height ~ 200px equivalent on the 1600x1300 canvas
  const photoSlots = [
    {
      x: 320,
      y: 440,
      w: 320,
      h: 270,
      rot: -0.07,
      caption: '📌 Add: Club group photo',
      pinColor: '#c0392b',
    },
    {
      x: 780,
      y: 220,
      w: 330,
      h: 280,
      rot: 0.05,
      caption: '📌 Add: De-Battle 2.0 highlight shot',
      pinColor: '#2574a9',
    },
    {
      x: 1060,
      y: 680,
      w: 340,
      h: 285,
      rot: -0.04,
      caption: '📌 Add: Pleiades 2025 — Literary Conclave',
      pinColor: '#d4af37',
    },
  ];

  photoSlots.forEach((slot) => {
    ctx.save();
    ctx.translate(slot.x + slot.w / 2, slot.y + slot.h / 2);
    ctx.rotate(slot.rot);

    const halfW = slot.w / 2;
    const halfH = slot.h / 2;

    // Drop shadow
    ctx.shadowColor = 'rgba(20, 10, 5, 0.35)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 8;

    // Polaroids vintage white frame rim
    ctx.fillStyle = '#fffdf7';
    ctx.fillRect(-halfW, -halfH, slot.w, slot.h);
    ctx.shadowColor = 'transparent';

    // Photo cutout inner box
    const margin = 12;
    const captionH = 46;
    const innerW = slot.w - margin * 2;
    const innerH = slot.h - margin * 2 - captionH;

    ctx.fillStyle = '#ece4d0';
    ctx.fillRect(-halfW + margin, -halfH + margin, innerW, innerH);

    // Subtle inner hairline border
    ctx.strokeStyle = 'rgba(160, 130, 90, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-halfW + margin, -halfH + margin, innerW, innerH);

    // Camera doodle inside photo slot
    drawDoodle(ctx, 'camera', 0, -halfH + margin + innerH / 2 - 12, 1.4, 0);

    // Caption strip below photo
    ctx.fillStyle = 'rgba(250, 242, 222, 0.95)';
    ctx.fillRect(-halfW + 6, halfH - captionH + 4, slot.w - 12, captionH - 8);
    ctx.strokeStyle = 'rgba(170, 140, 95, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-halfW + 6, halfH - captionH + 4, slot.w - 12, captionH - 8);

    // Caption text
    ctx.font = '600 15px "Patrick Hand", "Caveat", "Segoe UI", sans-serif';
    ctx.fillStyle = '#2d1c10';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(slot.caption, 0, halfH - captionH / 2 + 1, slot.w - 20);

    // Pushpin at top center of photo
    drawPushPin(ctx, 0, -halfH + 6, slot.pinColor);

    ctx.restore();
  });

  // ── 3. Hand-Drawn Literary Doodle Accents ──────────────────
  // Scattering quill, ribbon / star, and ink-blot accents in breathing room
  // 1) Quill in top right breathing zone
  drawDoodle(ctx, 'quill', 1420, 170, 2.2, 0.35);

  // 2) Ribbon / trophy-star in center-left lower empty area
  drawDoodle(ctx, 'sparkles', 220, 980, 2.0, -0.15);
  drawDoodle(ctx, 'star', 300, 1060, 1.8, 0.2);

  // 3) Ink droplet / book doodle at bottom right
  drawDoodle(ctx, 'book', 780, 1020, 2.2, 0.12);

  // 4) Small ink-blot flourish
  ctx.save();
  ctx.fillStyle = '#3e2a18';
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.arc(1380, 1120, 5, 0, Math.PI * 2);
  ctx.arc(1392, 1126, 3, 0, Math.PI * 2);
  ctx.arc(1374, 1114, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  noticeboardCanvasTextureCache = tex;
  return tex;
}

/**
 * Creates engraved dark plate texture with etched gold serif lettering
 * Two-line text: Fest name on top (larger), Venue on bottom (smaller)
 */
function getStandingNameplateTexture(title: string, subtitle: string): THREE.CanvasTexture {
  const cacheKey = `${title}__${subtitle}`;
  if (plaqueTextureCache.has(cacheKey)) {
    return plaqueTextureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 280;
  const ctx = canvas.getContext('2d')!;

  // Dark plate background (#141008)
  const grad = ctx.createLinearGradient(0, 0, 1024, 280);
  grad.addColorStop(0, '#16120a');
  grad.addColorStop(0.5, '#141008');
  grad.addColorStop(1, '#0e0b06');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 280);

  // Subtle metallic / slate grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 280;
    ctx.fillRect(0, y, 1024, 1.5);
  }

  // Refined double gold border pinstripe
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, 1024 - 28, 280 - 28);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(22, 22, 1024 - 44, 280 - 44);

  // Corner brass screw heads
  const screws = [
    [28, 28],
    [1024 - 28, 28],
    [28, 280 - 28],
    [1024 - 28, 280 - 28],
  ];
  for (const [sx, sy] of screws) {
    ctx.fillStyle = '#b38b2d';
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#181006';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(sx - 3, sy);
    ctx.lineTo(sx + 3, sy);
    ctx.stroke();
  }

  // Two-line typography hierarchy
  // Line 1: Fest name (large bold serif, gold #ffd975)
  ctx.fillStyle = '#ffd975';
  ctx.font = '700 46px "Playfair Display", "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillText(title.toUpperCase(), 512, 105, 940);

  // Line 2: Venue / subtitle (smaller refined serif, soft warm cream gold)
  ctx.fillStyle = '#dfcca0';
  ctx.font = '600 28px "Playfair Display", "Cinzel", Georgia, serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  ctx.fillText(subtitle, 512, 185, 940);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  plaqueTextureCache.set(cacheKey, tex);
  return tex;
}

// ── Cache for engraved medal face textures ──
const medalTextureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates engraved metallic medallion face texture with rank number ('1', '2', '3' or '1st', '2nd', '3rd')
 * with laurel wreath border, stars, and beveled embossed lettering.
 */
function getMedalFaceTexture(tier: 'gold' | 'silver' | 'bronze'): THREE.CanvasTexture {
  if (medalTextureCache.has(tier)) {
    return medalTextureCache.get(tier)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Color schemes per tier
  const colors = {
    gold: {
      baseLight: '#f3d36b',
      baseDark: '#b88b20',
      ring: '#926c14',
      numFill: '#fff3b8',
      numStroke: '#74540d',
      wreath: '#9a7318',
      rankText: '1st',
    },
    silver: {
      baseLight: '#f0f4f8',
      baseDark: '#a8b4c0',
      ring: '#788490',
      numFill: '#ffffff',
      numStroke: '#505c68',
      wreath: '#7a8694',
      rankText: '2nd',
    },
    bronze: {
      baseLight: '#d58c55',
      baseDark: '#8b4b1e',
      ring: '#6b3612',
      numFill: '#fce0cb',
      numStroke: '#54260a',
      wreath: '#6c3814',
      rankText: '3rd',
    },
  }[tier];

  // Radial metallic sheen background
  const grad = ctx.createRadialGradient(230, 220, 30, 256, 256, 250);
  grad.addColorStop(0, colors.baseLight);
  grad.addColorStop(0.7, colors.baseDark);
  grad.addColorStop(1, colors.ring);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  // Fine concentric engraved relief rings
  ctx.strokeStyle = colors.ring;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 256, 235, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(256, 256, 228, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.ring;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(256, 256, 175, 0, Math.PI * 2);
  ctx.stroke();

  // Embossed decorative dots around ring
  ctx.fillStyle = colors.ring;
  const numDots = 24;
  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * Math.PI * 2;
    const x = 256 + Math.cos(angle) * 206;
    const y = 256 + Math.sin(angle) * 206;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Laurel wreath leafy flourish at bottom arc
  ctx.save();
  ctx.fillStyle = colors.wreath;
  ctx.strokeStyle = colors.wreath;
  for (let a = 0.55; a <= 2.6; a += 0.28) {
    // Left leaf
    const lx = 256 - Math.cos(a) * 140;
    const ly = 256 + Math.sin(a) * 140;
    ctx.beginPath();
    ctx.ellipse(lx, ly, 14, 6, a + 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Right leaf
    const rx = 256 + Math.cos(a) * 140;
    const ry = 256 + Math.sin(a) * 140;
    ctx.beginPath();
    ctx.ellipse(rx, ry, 14, 6, -a - 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Engraved main Rank Number ("1", "2", "3")
  const mainDigit = tier === 'gold' ? '1' : tier === 'silver' ? '2' : '3';
  ctx.font = '900 190px "Playfair Display", "Cinzel", "Times New Roman", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Deep engraved drop-shadow
  ctx.fillStyle = colors.numStroke;
  ctx.fillText(mainDigit, 256 + 3, 230 + 4);

  // Subtle engraved highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(mainDigit, 256 - 2, 230 - 3);

  // Main bold face
  ctx.fillStyle = colors.numFill;
  ctx.fillText(mainDigit, 256, 230);

  // Suffix banner ribbon ("1ST", "2ND", "3RD") beneath the digit
  ctx.font = '700 40px "Playfair Display", "Cinzel", Georgia, serif';
  ctx.letterSpacing = '4px';

  // Text shadow & embossed stroke
  ctx.fillStyle = colors.numStroke;
  ctx.fillText(colors.rankText.toUpperCase(), 256 + 2, 332 + 2);
  ctx.fillStyle = colors.numFill;
  ctx.fillText(colors.rankText.toUpperCase(), 256, 332);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.generateMipmaps = true;
  medalTextureCache.set(tier, tex);
  return tex;
}

// ── Scaled Royal Championship Trophy 3D Component ──────
interface TrophyProps {
  position: [number, number, number];
  tier: 'gold' | 'silver' | 'bronze';
  heightScale?: number;
  profileVariation?: number;
  rotationY?: number;
}

const Trophy: React.FC<TrophyProps> = ({
  position,
  tier,
  heightScale = 1.0,
  profileVariation = 1.0,
  rotationY = 0,
}) => {
  // Lathe profile for a magnificent Royal Cup:
  // Trumpet base -> knop bead -> flared acanthus cup bowl -> stepped neck collar
  const cupLatheGeom = useMemo(() => {
    const pv = profileVariation;
    const points: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.065 * pv, 0),        // Base flange
      new THREE.Vector2(0.065 * pv, 0.012),
      new THREE.Vector2(0.048 * pv, 0.024),    // Stepped foot
      new THREE.Vector2(0.028 * pv, 0.055),    // Fluted stem taper
      new THREE.Vector2(0.018 * pv, 0.090),    // Central knop waist
      new THREE.Vector2(0.028 * pv, 0.115),    // Knop swell
      new THREE.Vector2(0.020 * pv, 0.135),    // Stem throat
      new THREE.Vector2(0.035 * pv, 0.160),    // Calyx / cup base flare
      new THREE.Vector2(0.062 * pv, 0.205),    // Lower amphora belly
      new THREE.Vector2(0.075 * pv, 0.260),    // Main bowl swell
      new THREE.Vector2(0.068 * pv, 0.295),    // Waist before rim
      new THREE.Vector2(0.076 * pv, 0.320),    // Classical flared rim lip
      new THREE.Vector2(0.072 * pv, 0.325),    // Rim top bevel
      new THREE.Vector2(0.064 * pv, 0.320),    // Rim interior edge
      new THREE.Vector2(0.012 * pv, 0.230),    // Inner bowl cavity
      new THREE.Vector2(0, 0.230),
    ];
    return new THREE.LatheGeometry(points, 32);
  }, [profileVariation]);

  // Stepped dark pedestal plinth (lower base slab)
  const basePlinthGeom = useMemo(() => new THREE.BoxGeometry(0.14, 0.035, 0.14), []);
  // Upper pedestal tier (polished wood/ebony riser)
  const plinthUpperGeom = useMemo(() => new THREE.BoxGeometry(0.115, 0.025, 0.115), []);
  // Brass trim spacer collar
  const brassSpacerGeom = useMemo(() => new THREE.CylinderGeometry(0.066, 0.066, 0.008, 32), []);

  // Domed trophy championship lid / crown
  const trophyLidGeom = useMemo(() => {
    const pv = profileVariation;
    const points: THREE.Vector2[] = [
      new THREE.Vector2(0, 0.322),
      new THREE.Vector2(0.063 * pv, 0.322),
      new THREE.Vector2(0.055 * pv, 0.340),    // Dome slope
      new THREE.Vector2(0.030 * pv, 0.365),    // Upper dome
      new THREE.Vector2(0.016 * pv, 0.380),    // Finial pedestal
      new THREE.Vector2(0.008 * pv, 0.395),    // Finial spike
      new THREE.Vector2(0, 0.405),
    ];
    return new THREE.LatheGeometry(points, 28);
  }, [profileVariation]);

  // Royal grand scrolled handles flanking the amphora body
  const upperHandleGeom = useMemo(() => {
    // Upper dramatic sweeping loop that rises above the rim
    return new THREE.TorusGeometry(0.045, 0.0065, 12, 28, Math.PI * 1.35);
  }, []);

  const lowerHandleScrollGeom = useMemo(() => {
    // Lower decorative reverse curl
    return new THREE.TorusGeometry(0.020, 0.005, 10, 20, Math.PI * 1.2);
  }, []);

  // Crowning star/globe finial at peak of lid
  const finialSphereGeom = useMemo(() => new THREE.SphereGeometry(0.012, 16, 16), []);
  // Plaque brass plate on front of pedestal
  const plinthPlateGeom = useMemo(() => new THREE.BoxGeometry(0.088, 0.018, 0.003), []);

  const metalMaterial = useMemo(() => {
    if (tier === 'gold') {
      return new THREE.MeshStandardMaterial({
        color: '#f0c345',
        metalness: 0.94,
        roughness: 0.18,
      });
    }
    if (tier === 'silver') {
      return new THREE.MeshStandardMaterial({
        color: '#dfe5ec',
        metalness: 0.92,
        roughness: 0.15,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#ba7740',
      metalness: 0.88,
      roughness: 0.24,
    });
  }, [tier]);

  const plinthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#140e0a',
      roughness: 0.45,
      metalness: 0.12,
    });
  }, []);

  const brassTrimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#d4af37',
      metalness: 0.90,
      roughness: 0.22,
    });
  }, []);

  const pv = profileVariation;

  return (
    <group
      position={position}
      scale={[heightScale, heightScale, heightScale]}
      rotation={[0, rotationY, 0]}
    >
      {/* 1. Heavy stepped two-tier pedestal plinth base */}
      {/* Lower base tier */}
      <mesh position={[0, 0.0175, 0]} geometry={basePlinthGeom} material={plinthMaterial} castShadow receiveShadow />
      {/* Brass accent divider plate */}
      <mesh position={[0, 0.035, 0]} material={brassTrimMaterial}>
        <boxGeometry args={[0.138, 0.004, 0.138]} />
      </mesh>
      {/* Upper pedestal block */}
      <mesh position={[0, 0.050, 0]} geometry={plinthUpperGeom} material={plinthMaterial} castShadow receiveShadow />
      {/* Mini engraved brass label plaque on front of base plinth */}
      <mesh position={[0, 0.050, 0.059]} geometry={plinthPlateGeom} material={brassTrimMaterial} castShadow />

      {/* Brass pedestal ring collar */}
      <mesh position={[0, 0.065, 0]} geometry={brassSpacerGeom} material={brassTrimMaterial} castShadow />

      {/* 2. Classical Royal Trophy Amphora Goblet Body */}
      <mesh position={[0, 0.069, 0]} geometry={cupLatheGeom} material={metalMaterial} castShadow receiveShadow />

      {/* 3. Domed Championship Lid & Crown */}
      <mesh position={[0, 0.069, 0]} geometry={trophyLidGeom} material={metalMaterial} castShadow receiveShadow />
      {/* Crown spherical finial */}
      <mesh position={[0, 0.069 + 0.412, 0]} geometry={finialSphereGeom} material={metalMaterial} castShadow />

      {/* 4. Left Sweeping Royal Handle (High arch above rim, curling into bowl) */}
      <group position={[-0.076 * pv, 0.069 + 0.265, 0]}>
        {/* Main upper soaring scroll */}
        <mesh
          position={[-0.018 * pv, 0.028, 0]}
          rotation={[0, 0, Math.PI * 0.48]}
          geometry={upperHandleGeom}
          material={metalMaterial}
          castShadow
        />
        {/* Lower counter-curl scroll anchoring to waist */}
        <mesh
          position={[0.014 * pv, -0.040, 0]}
          rotation={[0, 0, -Math.PI * 0.55]}
          geometry={lowerHandleScrollGeom}
          material={metalMaterial}
          castShadow
        />
      </group>

      {/* 5. Right Sweeping Royal Handle (Mirrored) */}
      <group position={[0.076 * pv, 0.069 + 0.265, 0]}>
        {/* Main upper soaring scroll */}
        <mesh
          position={[0.018 * pv, 0.028, 0]}
          rotation={[0, 0, -Math.PI * 0.48]}
          geometry={upperHandleGeom}
          material={metalMaterial}
          castShadow
        />
        {/* Lower counter-curl scroll anchoring to waist */}
        <mesh
          position={[-0.014 * pv, -0.040, 0]}
          rotation={[0, 0, Math.PI * 0.55]}
          geometry={lowerHandleScrollGeom}
          material={metalMaterial}
          castShadow
        />
      </group>
    </group>
  );
};

// ── Multi-Medal Peg Rack Component (MUN: 8 medals, GIT AURA: 11 medals) ──
interface MedalItemConfig {
  tier: 'gold' | 'silver' | 'bronze';
  ribbonColor: 'navy' | 'maroon' | 'gold';
}

interface MedalPegRackProps {
  position: [number, number, number];
  width: number;
  medals: MedalItemConfig[];
  arcElevation?: number;
}

const MedalPegRack: React.FC<MedalPegRackProps> = ({
  position,
  width,
  medals,
  arcElevation = 0,
}) => {
  const numMedals = medals.length;
  const spacing = width / (numMedals + 1);

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e6ba38',
        metalness: 0.92,
        roughness: 0.22,
      }),
    []
  );

  const silverMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d6dde4',
        metalness: 0.90,
        roughness: 0.18,
      }),
    []
  );

  const bronzeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b66f36',
        metalness: 0.88,
        roughness: 0.28,
      }),
    []
  );

  const rackBrassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4af37',
        metalness: 0.85,
        roughness: 0.30,
      }),
    []
  );

  const ribbonMaterials = useMemo(() => {
    return {
      navy: new THREE.MeshStandardMaterial({ color: '#10223f', roughness: 0.82 }),
      maroon: new THREE.MeshStandardMaterial({ color: '#681320', roughness: 0.82 }),
      gold: new THREE.MeshStandardMaterial({ color: '#c49725', roughness: 0.75 }),
    };
  }, []);

  const goldFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: getMedalFaceTexture('gold'),
        metalness: 0.88,
        roughness: 0.25,
      }),
    []
  );

  const silverFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: getMedalFaceTexture('silver'),
        metalness: 0.86,
        roughness: 0.22,
      }),
    []
  );

  const bronzeFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: getMedalFaceTexture('bronze'),
        metalness: 0.84,
        roughness: 0.30,
      }),
    []
  );

  // Shared geometries for performance & crisp, perfectly circular rendering
  // Medal cylinder: radius 0.038m, thickness 0.006m
  const medalDiscGeom = useMemo(() => new THREE.CylinderGeometry(0.038, 0.038, 0.006, 48), []);
  // Torus rim in XY plane: radius 0.038m, tube 0.0028m (native TorusGeometry lies in XY plane)
  const medalRimGeom = useMemo(() => new THREE.TorusGeometry(0.038, 0.0028, 16, 48), []);
  // Medal engraved face circular disc (radius 0.036m)
  const medalFaceGeom = useMemo(() => new THREE.CircleGeometry(0.036, 48), []);
  // Top suspension ring in XY plane
  const topLoopGeom = useMemo(() => new THREE.TorusGeometry(0.0075, 0.0020, 12, 24), []);
  // Ribbon strip
  const ribbonGeom = useMemo(() => new THREE.BoxGeometry(0.044, 0.16, 0.003), []);
  // Ribbon bottom clasp
  const ribbonClaspGeom = useMemo(() => new THREE.BoxGeometry(0.048, 0.008, 0.006), []);

  return (
    <group position={position}>
      {/* Horizontal mounting rail bar */}
      <mesh position={[width / 2, 0, 0]} material={rackBrassMaterial} castShadow>
        <boxGeometry args={[width, 0.018, 0.014]} />
      </mesh>

      {/* Wall standoff brackets */}
      <mesh position={[0.02, 0, -0.015]} material={rackBrassMaterial}>
        <cylinderGeometry args={[0.007, 0.007, 0.030, 12]} />
      </mesh>
      <mesh position={[width - 0.02, 0, -0.015]} material={rackBrassMaterial}>
        <cylinderGeometry args={[0.007, 0.007, 0.030, 12]} />
      </mesh>

      {/* Peg hooks + Hanging circular medals with engraved rank numbers */}
      {medals.map((medal, idx) => {
        const hx = spacing * (idx + 1);
        const normIdx = numMedals > 1 ? (idx / (numMedals - 1)) * 2 - 1 : 0;
        // Subtle upward parabolic arc drape effect
        const drapeOffset = arcElevation ? (1 - normIdx * normIdx) * arcElevation : 0;
        // Slight alternating Z stagger to prevent lateral mesh intersecting between neighboring medals
        const zStagger = (idx % 2) * 0.006;

        const metalMat =
          medal.tier === 'gold' ? goldMaterial : medal.tier === 'silver' ? silverMaterial : bronzeMaterial;
        const faceMat =
          medal.tier === 'gold' ? goldFaceMaterial : medal.tier === 'silver' ? silverFaceMaterial : bronzeFaceMaterial;
        const ribbonMat = ribbonMaterials[medal.ribbonColor] || ribbonMaterials.gold;

        return (
          <group key={`medal-${idx}`} position={[hx, drapeOffset, 0.008 + zStagger]}>
            {/* Brass hook peg protruding forward */}
            <mesh position={[0, -0.004, 0.016]} rotation={[Math.PI / 2, 0, 0]} material={rackBrassMaterial} castShadow>
              <cylinderGeometry args={[0.0035, 0.0035, 0.032, 12]} />
            </mesh>
            {/* Hook end upward lip */}
            <mesh position={[0, 0.006, 0.030]} material={rackBrassMaterial}>
              <cylinderGeometry args={[0.004, 0.004, 0.016, 12]} />
            </mesh>

            {/* Silk ribbon drape hanging straight down from peg */}
            <mesh position={[0, -0.085, 0.022]} geometry={ribbonGeom} material={ribbonMat} castShadow receiveShadow />

            {/* Metallic clasp bracket binding ribbon to suspension loop */}
            <mesh position={[0, -0.165, 0.023]} geometry={ribbonClaspGeom} material={metalMat} castShadow />

            {/* Substantial, perfectly circular Medal medallion disc */}
            <group position={[0, -0.215, 0.023]}>
              {/* Top suspension loop (Torus natively lies in XY plane) */}
              <mesh position={[0, 0.043, 0]} geometry={topLoopGeom} material={metalMat} castShadow />

              {/* Main circular medal cylinder body (cylinder rotated by 90° on X to face viewer along +Z) */}
              <mesh rotation={[Math.PI / 2, 0, 0]} geometry={medalDiscGeom} material={metalMat} castShadow receiveShadow />

              {/* Raised outer rim (Torus natively lies in XY plane, centered at Z=0) */}
              <mesh geometry={medalRimGeom} material={metalMat} castShadow />

              {/* Engraved front face with bold rank number (1ST, 2ND, 3RD) and laurel wreath */}
              <mesh position={[0, 0, 0.0032]} geometry={medalFaceGeom} material={faceMat} receiveShadow />

              {/* Engraved rear face (rotated 180° on Y) */}
              <mesh position={[0, 0, -0.0032]} rotation={[0, Math.PI, 0]} geometry={medalFaceGeom} material={faceMat} />
            </group>
          </group>
        );
      })}
    </group>
  );
};

// ── Standing Nameplate Component (Freestanding on Shelf) ────
// Dark plate: 0.50m × 0.14m × 0.01m, tilted ~15° back
// Honey-oak wood wedge base: 0.50m × 0.08m × 0.06m
interface StandingNameplateProps {
  position: [number, number, number];
  title: string;
  subtitle: string;
  shelfWoodMaterial: THREE.Material;
}

const StandingNameplate: React.FC<StandingNameplateProps> = ({
  position,
  title,
  subtitle,
  shelfWoodMaterial,
}) => {
  const texture = useMemo(() => getStandingNameplateTexture(title, subtitle), [title, subtitle]);
  const plateMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.35,
        metalness: 0.25,
      }),
    [texture]
  );

  return (
    <group position={position}>
      {/* Honey-oak wood base wedge sitting flush on shelf surface */}
      <mesh position={[0, 0.03, 0]} material={shelfWoodMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.50, 0.06, 0.08]} />
      </mesh>

      {/* Dark engraved plate tilted back ~15° (-0.26 rad) */}
      <mesh
        position={[0, 0.03 + 0.065, 0.005]}
        rotation={[-0.26, 0, 0]}
        material={plateMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.50, 0.14, 0.012]} />
      </mesh>
    </group>
  );
};

// ── Vintage Brass Gallery / Picture Light Fixture Component ──
interface PictureLightFixtureProps {
  position: [number, number, number];
  target: THREE.Object3D;
  armLength?: number;
  shadeLength?: number;
  shadeRadius?: number;
  lightIntensity?: number;
  lightColor?: string;
  lightAngle?: number;
  lightDistance?: number;
  brassMaterial: THREE.Material;
}

const PictureLightFixture: React.FC<PictureLightFixtureProps> = ({
  position,
  target,
  armLength = 0.20,
  shadeLength = 0.28,
  shadeRadius = 0.024,
  lightIntensity = 1.3,
  lightColor = '#ffd9a0',
  lightAngle = Math.PI / 2.8,
  lightDistance = 5.0,
  brassMaterial,
}) => {
  // Graceful continuous swan-neck / library sconce curved arm from wall plate to shade
  const armGeometry = useMemo(() => {
    // Wall mount point at (0, 0, 0), curving outward in +Z and arching downward to shade attachment point
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0.005),
      new THREE.Vector3(0, 0.04, armLength * 0.40),
      new THREE.Vector3(0, 0.02, armLength * 0.85),
      new THREE.Vector3(0, -0.06, armLength)
    );
    return new THREE.TubeGeometry(curve, 24, 0.0055, 12, false);
  }, [armLength]);

  // Cylindrical gallery shade hood (open on bottom, capped on sides)
  const shadeGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(shadeRadius, shadeRadius, shadeLength, 24);
  }, [shadeRadius, shadeLength]);

  // Round wall mounting backplate
  const mountPlateGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.032, 0.034, 0.010, 24);
  }, []);

  // Soft warm glow bulb/aperture strip on the underside
  const bulbGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.008, 0.008, shadeLength * 0.72, 16);
  }, [shadeLength]);

  const bulbMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#fff3db',
      emissive: '#ffbe55',
      emissiveIntensity: 2.4,
      roughness: 0.2,
    });
  }, []);

  // Soft luminous glow aperture disk covering the underside mouth
  const glowMeshGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(shadeLength * 0.88, shadeRadius * 1.6);
  }, [shadeLength, shadeRadius]);

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#ffe5ad',
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
  }, []);

  // Shade center position relative to fixture base
  const shadeY = -0.06;
  const shadeZ = armLength;

  return (
    <group position={position}>
      {/* 1. Flat Brass Wall Mount Backplate (flush against wall plane) */}
      <mesh
        position={[0, 0, 0.005]}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={mountPlateGeometry}
        material={brassMaterial}
        castShadow
      />

      {/* Decorative center mounting nut */}
      <mesh position={[0, 0, 0.012]} material={brassMaterial}>
        <sphereGeometry args={[0.006, 12, 12]} />
      </mesh>

      {/* 2. Single Continuous Gently Curved Brass Arm Tube */}
      <mesh geometry={armGeometry} material={brassMaterial} castShadow />

      {/* 3. Horizontal Cylindrical Gallery Shade Hood at the end of the arm */}
      <group position={[0, shadeY, shadeZ]}>
        {/* Swivel collar joint connecting arm to shade */}
        <mesh position={[0, 0.016, 0]} material={brassMaterial} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.016, 16]} />
        </mesh>

        {/* Horizontal shade hood angled downward at ~38° */}
        <group rotation={[0.66, 0, 0]}>
          {/* Main cylindrical brass shade hood */}
          <mesh rotation={[0, 0, Math.PI / 2]} geometry={shadeGeometry} material={brassMaterial} castShadow />

          {/* Capped decorative brass finials on left & right ends */}
          <mesh position={[-shadeLength / 2 - 0.004, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
            <sphereGeometry args={[shadeRadius * 0.85, 12, 12]} />
          </mesh>
          <mesh position={[shadeLength / 2 + 0.004, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
            <sphereGeometry args={[shadeRadius * 0.85, 12, 12]} />
          </mesh>

          {/* Luminous warm emissive bulb filament visible inside the shade */}
          <mesh position={[0, -shadeRadius * 0.40, 0]} rotation={[0, 0, Math.PI / 2]} geometry={bulbGeometry} material={bulbMaterial} />

          {/* Glowing aperture opening at the bottom of the shade */}
          <mesh position={[0, -shadeRadius * 0.75, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={glowMeshGeometry} material={glowMaterial} />
        </group>

        {/* 4. Localized downward warm PointLight (emits immediate brilliant glow right under fixture) */}
        <pointLight
          position={[0, -0.06, 0.04]}
          color="#ffc870"
          intensity={2.2}
          distance={1.8}
          decay={1.6}
        />

        {/* 5. Directional SpotLight projecting warm gallery illumination onto shelf below */}
        <spotLight
          position={[0, -0.04, 0.04]}
          target={target}
          color={lightColor}
          intensity={lightIntensity * 2.2}
          angle={lightAngle}
          penumbra={0.55}
          distance={lightDistance}
          decay={1.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-bias={-0.0005}
        />
      </group>
    </group>
  );
};

// ── Main BackWallDisplay Component ──────────────────────────
export const BackWallDisplay: React.FC = () => {
  const woodTexture = useMemo(() => getDeskWoodTexture(), []);
  const corkTexture = useMemo(() => getCorkBoardTexture(), []);
  const noticeboardContentTexture = useMemo(() => getNoticeboardContentTexture(), []);

  // Honey-oak wood tone for shelves and plaque wedge bases (#8a5a32, satin sheen)
  const honeyOakWoodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        color: '#8a5a32',
        roughness: 0.50,
        metalness: 0.05,
      }),
    [woodTexture]
  );

  // Thin brass edge-trim strip material (#c9a84c metallic)
  const brassTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c9a84c',
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  );

  // Dark walnut frame material for noticeboard border
  const darkWalnutMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2b1810',
        roughness: 0.65,
        metalness: 0.08,
      }),
    []
  );

  // Cork and noticeboard materials
  const corkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: corkTexture,
        roughness: 0.90,
        metalness: 0.02,
      }),
    [corkTexture]
  );

  const noticeboardContentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: noticeboardContentTexture,
        transparent: true,
        roughness: 0.75,
        metalness: 0.05,
      }),
    [noticeboardContentTexture]
  );

  // Authentic antique brass finish matching scene brass elements (metalness 0.85, roughness 0.30)
  const brassPictureLightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.30,
        metalness: 0.85,
      }),
    []
  );

  // Coordinated multi-fixture spotlight targets
  const tier1LightTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-2.20, 2.55, -2.55);
    return obj;
  }, []);

  const tier2LightTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-2.20, 1.85, -2.55);
    return obj;
  }, []);

  const tier3LightTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-2.30, 1.15, -2.55);
    return obj;
  }, []);

  const noticeboardLightTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-0.60, 2.05, -2.55);
    return obj;
  }, []);

  const cameraState = useBookStore((s) => s.cameraState);
  const bookState = useBookStore((s) => s.bookState);
  const viewTrophyShelf = useBookStore((s) => s.viewTrophyShelf);
  const setIsTrophyShelfHovered = useBookStore((s) => s.setIsTrophyShelfHovered);

  return (
    <group>
      {/* ── Interactive Hitbox for Trophy Shelf (Active when camera is wide and book closed) ── */}
      {cameraState === 'wide' && bookState === 'closed' && (
        <mesh
          position={[-2.25, 1.85, -2.40]}
          onClick={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
            setIsTrophyShelfHovered(false);
            viewTrophyShelf();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setIsTrophyShelfHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setIsTrophyShelfHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          {/* Cover the entire shelf zone: width 3.10m, height 1.80m, depth 0.45m */}
          <boxGeometry args={[3.10, 1.80, 0.45]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* Target points registered in scene graph for accurate spotlight matrix calculation */}
      <primitive object={tier1LightTarget} />
      <primitive object={tier2LightTarget} />
      <primitive object={tier3LightTarget} />
      <primitive object={noticeboardLightTarget} />

      {/* ══════════════════════════════════════════════════════
          1. REBUILT VINTAGE BRASS GALLERY PICTURE LIGHTS — 4 FIXTURES
          - Wall mount plate: flush disc on the wall plane (z: -2.55)
          - Arm: curved continuous brass tube extending outward ~0.20m
          - Shade: horizontal cylindrical brass hood angled down at shelf
          - Spotlight: anchored inside shade mouth, casting down onto trophies/medals
          ══════════════════════════════════════════════════════ */}
      {/* Tier 1 Picture Light (above top shelf) */}
      <PictureLightFixture
        position={[-2.20, 2.85, -2.55]}
        target={tier1LightTarget}
        armLength={0.22}
        shadeLength={0.34}
        lightIntensity={1.3}
        lightColor="#ffd9a0"
        brassMaterial={brassPictureLightMaterial}
      />

      {/* Tier 2 Picture Light (above middle shelf) */}
      <PictureLightFixture
        position={[-2.20, 2.15, -2.55]}
        target={tier2LightTarget}
        armLength={0.22}
        shadeLength={0.34}
        lightIntensity={1.3}
        lightColor="#ffd9a0"
        brassMaterial={brassPictureLightMaterial}
      />

      {/* Tier 3 Picture Light (above bottom shelf) */}
      <PictureLightFixture
        position={[-2.30, 1.45, -2.55]}
        target={tier3LightTarget}
        armLength={0.24}
        shadeLength={0.36}
        lightIntensity={1.3}
        lightColor="#ffd9a0"
        brassMaterial={brassPictureLightMaterial}
      />

      {/* Noticeboard Fill Light (above scrapbook noticeboard) */}
      <PictureLightFixture
        position={[-0.30, 2.95, -2.55]}
        target={noticeboardLightTarget}
        armLength={0.26}
        shadeLength={0.38}
        shadeRadius={0.026}
        lightIntensity={1.0}
        lightColor="#ffd9a0"
        lightAngle={Math.PI / 3.0}
        lightDistance={6.0}
        brassMaterial={brassPictureLightMaterial}
      />

      {/* ══════════════════════════════════════════════════════
          2. REVISED AWARDS SHELF UNIT
          - Material: Warm Honey-Oak (#8a5a32, satin sheen)
          - Brass Edge-Trim Strip (0.01m, #c9a84c metallic) along front lip
          - Tier 1: y=2.55, width 2.55m, depth 0.26m
          - Tier 2: y=1.85, width 2.55m, depth 0.26m
          - Tier 3: y=1.15, width 2.95m, depth 0.28m
          ══════════════════════════════════════════════════════ */}

      {/* ── Tier 1 (Top): y=2.55, x: [-3.50, -0.95], center x=-2.225, width=2.55m, depth=0.26m, z=-2.55 ── */}
      <group position={[-2.225, 2.55, -2.55]}>
        {/* Honey-Oak Shelf Board */}
        <mesh position={[0, 0, 0.13]} material={honeyOakWoodMaterial} castShadow receiveShadow>
          <boxGeometry args={[2.55, 0.045, 0.26]} />
        </mesh>
        {/* Brass Edge-Trim Strip along front lip */}
        <mesh position={[0, 0, 0.265]} material={brassTrimMaterial} castShadow>
          <boxGeometry args={[2.55, 0.012, 0.010]} />
        </mesh>

        {/* Freestanding Standing Nameplates */}
        <StandingNameplate
          position={[-0.65, 0.0225, 0.18]}
          title="Mood Indigo 2023"
          subtitle="IIT Bombay"
          shelfWoodMaterial={honeyOakWoodMaterial}
        />
        <StandingNameplate
          position={[0.60, 0.0225, 0.18]}
          title="Mood Indigo 2025"
          subtitle="IIT Bombay"
          shelfWoodMaterial={honeyOakWoodMaterial}
        />

        {/* Mood Indigo 2023: 1 Silver, 1 Bronze */}
        <Trophy position={[-0.88, 0.0225, 0.07]} tier="silver" heightScale={1.12} profileVariation={1.02} rotationY={0.12} />
        <Trophy position={[-0.42, 0.0225, 0.07]} tier="bronze" heightScale={1.04} profileVariation={1.06} rotationY={-0.15} />

        {/* Mood Indigo 2025: 1 Gold, 2 Silver (Added 1 more Silver Trophy) */}
        <Trophy position={[0.36, 0.0225, 0.07]} tier="gold" heightScale={1.18} profileVariation={1.04} rotationY={-0.10} />
        <Trophy position={[0.65, 0.0225, 0.07]} tier="silver" heightScale={1.08} profileVariation={0.96} rotationY={0.14} />
        <Trophy position={[0.92, 0.0225, 0.07]} tier="silver" heightScale={1.04} profileVariation={1.02} rotationY={-0.12} />

        {/* MUN Surathkal 8-Medal Peg Rack: Hooked to the underside of Tier 1 (top shelf), hanging down into the space above Tier 2 */}
        <MedalPegRack
          position={[0.30, -0.025, 0.18]}
          width={0.62}
          medals={[
            { tier: 'gold', ribbonColor: 'gold' },
            { tier: 'silver', ribbonColor: 'navy' },
            { tier: 'gold', ribbonColor: 'maroon' },
            { tier: 'silver', ribbonColor: 'gold' },
            { tier: 'gold', ribbonColor: 'navy' },
            { tier: 'silver', ribbonColor: 'maroon' },
            { tier: 'bronze', ribbonColor: 'gold' },
            { tier: 'bronze', ribbonColor: 'navy' },
          ]}
        />
      </group>

      {/* ── Tier 2 (Middle): y=1.85, x: [-3.50, -0.95], center x=-2.225, width=2.55m, depth=0.26m, z=-2.55 ── */}
      <group position={[-2.225, 1.85, -2.55]}>
        {/* Honey-Oak Shelf Board */}
        <mesh position={[0, 0, 0.13]} material={honeyOakWoodMaterial} castShadow receiveShadow>
          <boxGeometry args={[2.55, 0.045, 0.26]} />
        </mesh>
        {/* Brass Edge-Trim Strip */}
        <mesh position={[0, 0, 0.265]} material={brassTrimMaterial} castShadow>
          <boxGeometry args={[2.55, 0.012, 0.010]} />
        </mesh>

        {/* Freestanding Standing Nameplates */}
        <StandingNameplate
          position={[-0.65, 0.0225, 0.18]}
          title="MIT Revels"
          subtitle="Manipal"
          shelfWoodMaterial={honeyOakWoodMaterial}
        />
        {/* MUN Surathkal Nameboard sitting directly below the medals hung from the shelf above */}
        <StandingNameplate
          position={[0.60, 0.0225, 0.18]}
          title="MUN Surathkal"
          subtitle="NITK Surathkal"
          shelfWoodMaterial={honeyOakWoodMaterial}
        />

        {/* MIT Revels Group: 2 Gold, 1 Silver, 1 Bronze (4 trophies) */}
        <Trophy position={[-1.05, 0.0225, 0.07]} tier="gold" heightScale={1.16} profileVariation={1.05} rotationY={0.08} />
        <Trophy position={[-0.78, 0.0225, 0.07]} tier="gold" heightScale={1.10} profileVariation={0.96} rotationY={-0.12} />
        <Trophy position={[-0.52, 0.0225, 0.07]} tier="silver" heightScale={1.05} profileVariation={1.08} rotationY={0.14} />
        <Trophy position={[-0.26, 0.0225, 0.07]} tier="bronze" heightScale={0.96} profileVariation={0.92} rotationY={-0.08} />

        {/* GIT AURA 2026 11-Medal Rack: Hooked to underside of Tier 2 (middle shelf), hanging down into the space above Tier 3 */}
        <MedalPegRack
          position={[0.18, -0.025, 0.19]}
          width={0.78}
          arcElevation={0.035}
          medals={[
            { tier: 'bronze', ribbonColor: 'maroon' },
            { tier: 'bronze', ribbonColor: 'navy' },
            { tier: 'silver', ribbonColor: 'gold' },
            { tier: 'gold', ribbonColor: 'gold' },
            { tier: 'gold', ribbonColor: 'navy' },
            { tier: 'gold', ribbonColor: 'gold' },
            { tier: 'gold', ribbonColor: 'maroon' },
            { tier: 'silver', ribbonColor: 'gold' },
            { tier: 'bronze', ribbonColor: 'navy' },
            { tier: 'bronze', ribbonColor: 'maroon' },
            { tier: 'bronze', ribbonColor: 'gold' },
          ]}
        />
      </group>

      {/* ── Tier 3 (Bottom): y=1.15, x: [-3.70, -0.75], center x=-2.225, width=2.95m, depth=0.28m, z=-2.55 ── */}
      <group position={[-2.225, 1.15, -2.55]}>
        {/* Honey-Oak Shelf Board */}
        <mesh position={[0, 0, 0.14]} material={honeyOakWoodMaterial} castShadow receiveShadow>
          <boxGeometry args={[2.95, 0.048, 0.28]} />
        </mesh>
        {/* Brass Edge-Trim Strip */}
        <mesh position={[0, 0, 0.285]} material={brassTrimMaterial} castShadow>
          <boxGeometry args={[2.95, 0.012, 0.010]} />
        </mesh>

        {/* Freestanding Standing Nameplates */}
        <StandingNameplate
          position={[-0.85, 0.024, 0.20]}
          title="MIT Revels 2026"
          subtitle="Manipal"
          shelfWoodMaterial={honeyOakWoodMaterial}
        />
        {/* GIT AURA 2026 Nameboard sitting directly below the 11 medals hanging from the shelf above */}
        <StandingNameplate
          position={[0.55, 0.024, 0.20]}
          title="GIT AURA 2026"
          subtitle="Belagavi"
          shelfWoodMaterial={honeyOakWoodMaterial}
        />

        {/* MIT Revels 2026: 1 Gold, 1 Bronze */}
        <Trophy position={[-1.12, 0.024, 0.08]} tier="gold" heightScale={1.15} profileVariation={1.02} rotationY={0.10} />
        <Trophy position={[-0.58, 0.024, 0.08]} tier="bronze" heightScale={1.02} profileVariation={0.95} rotationY={-0.12} />
      </group>

      {/* ══════════════════════════════════════════════════════
          3. NOTICEBOARD (Scrapbook Corkboard)
          Centered at x=0.45, y=2.05, z=-2.55
          Dimensions: 1.60m wide × 1.30m tall
          Frame border: 0.05m dark walnut
          ══════════════════════════════════════════════════════ */}
      <group position={[0.45, 2.05, -2.55]}>
        {/* Recessed cork backing board */}
        <mesh position={[0, 0, 0.01]} material={corkMaterial} receiveShadow>
          <planeGeometry args={[1.50, 1.20]} />
        </mesh>

        {/* Scrapbook content overlay plane (photos, EST. 2021 card, doodles, pins) */}
        <mesh position={[0, 0, 0.015]} material={noticeboardContentMaterial} receiveShadow>
          <planeGeometry args={[1.50, 1.20]} />
        </mesh>

        {/* ── Dark Walnut Wood Frame Border (0.05m width, 0.035m depth) ── */}
        {/* Top rail */}
        <mesh position={[0, 0.625, 0.02]} material={darkWalnutMaterial} castShadow>
          <boxGeometry args={[1.60, 0.05, 0.035]} />
        </mesh>
        {/* Bottom rail */}
        <mesh position={[0, -0.625, 0.02]} material={darkWalnutMaterial} castShadow>
          <boxGeometry args={[1.60, 0.05, 0.035]} />
        </mesh>
        {/* Left stile */}
        <mesh position={[-0.775, 0, 0.02]} material={darkWalnutMaterial} castShadow>
          <boxGeometry args={[0.05, 1.30, 0.035]} />
        </mesh>
        {/* Right stile */}
        <mesh position={[0.775, 0, 0.02]} material={darkWalnutMaterial} castShadow>
          <boxGeometry args={[0.05, 1.30, 0.035]} />
        </mesh>
      </group>
    </group>
  );
};
