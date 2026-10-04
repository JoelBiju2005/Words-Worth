import * as THREE from 'three';
import {
  BOOK_PAGES_DATA,
  type PaperStyle,
  type DoodlePack,
  type MountStyle,
  type ImageSlot,
  type ContentCard,
} from '../data/pages';
import { toRoman } from './proceduralTextures';

/* ═══════════════════════════════════════════════════════════════════════════
 *  SCRAPBOOK CANVAS TEXTURE ENGINE
 *  Procedural rendering of 2-page scrapbook spreads directly onto Canvas2D.
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface ScrapbookPageOptions {
  title: string;
  subtitle?: string;
  pageNumber: number;
  isLeftPage: boolean;
  paperStyle: PaperStyle;
  doodlePack: DoodlePack;
  imageSlots?: ImageSlot[];
  contentCards?: ContentCard[];
  quote?: { text: string; attribution?: string };
  isIndexSpread?: boolean;
}

// Cache generated textures so we don't redraw unnecessarily
const scrapbookTextureCache = new Map<string, THREE.CanvasTexture>();

/** Clear all cached scrapbook textures (useful when page data changes) */
export function clearScrapbookTextureCache() {
  scrapbookTextureCache.clear();
}

/**
 * Draws paper backgrounds based on paperStyle:
 * - 'floral': delicate warm vintage floral vines and petal motifs
 * - 'grid': subtle engineer/architect notebook grid with header margin line
 * - 'kraft': fibrous, warm brown textured wrapping kraft paper
 * - 'parchment': classic manuscript parchment with aged vignette
 */
export function drawScrapbookPaper(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  style: PaperStyle,
  isLeftPage: boolean
) {
  ctx.save();

  if (style === 'kraft') {
    // Warm earthy kraft paper
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#dfcfb2');
    grad.addColorStop(0.5, '#d3be9c');
    grad.addColorStop(1, '#c5ab86');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Kraft paper pulpy specks & fibrous streaks
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const len = 3 + Math.random() * 8;
      ctx.strokeStyle = Math.random() > 0.4 ? '#4a3018' : '#8c6840';
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }
  } else if (style === 'grid') {
    // Technical notebook paper
    ctx.fillStyle = '#f8f4e8';
    ctx.fillRect(0, 0, width, height);

    // Notebook grid lines
    ctx.strokeStyle = '#b8cad6';
    ctx.lineWidth = 0.75;
    ctx.globalAlpha = 0.35;

    const gridSize = 24;
    for (let x = 32; x < width - 32; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, height - 40);
      ctx.stroke();
    }
    for (let y = 40; y < height - 40; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(32, y);
      ctx.lineTo(width - 32, y);
      ctx.stroke();
    }

    // Red vertical margin rule (classic notebook)
    ctx.strokeStyle = '#e07a7a';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.45;
    const marginX = isLeftPage ? width - 56 : 56;
    ctx.beginPath();
    ctx.moveTo(marginX, 32);
    ctx.lineTo(marginX, height - 32);
    ctx.stroke();
  } else if (style === 'floral') {
    // Romantic floral patterned paper
    ctx.fillStyle = '#fcf8ee';
    ctx.fillRect(0, 0, width, height);

    // Floral vine repeating damask watermark
    ctx.strokeStyle = '#c2a578';
    ctx.fillStyle = '#c2a578';
    ctx.globalAlpha = 0.08;

    const stepX = 84;
    const stepY = 84;
    for (let y = 40; y < height; y += stepY) {
      for (let x = 40; x < width; x += stepX) {
        // Draw tiny 4-petal flower
        ctx.beginPath();
        ctx.arc(x, y - 6, 4, 0, Math.PI * 2);
        ctx.arc(x, y + 6, 4, 0, Math.PI * 2);
        ctx.arc(x - 6, y, 4, 0, Math.PI * 2);
        ctx.arc(x + 6, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Tiny center dot
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#8c6b38';
        ctx.fill();
        ctx.fillStyle = '#c2a578';
      }
    }
  } else {
    // Default: Parchment base
    const grad = ctx.createRadialGradient(
      width * 0.48,
      height * 0.48,
      width * 0.15,
      width * 0.5,
      height * 0.5,
      width * 0.72
    );
    grad.addColorStop(0, '#f9f3e3');
    grad.addColorStop(0.5, '#f2e7cd');
    grad.addColorStop(0.85, '#e4d3aa');
    grad.addColorStop(1, '#cbba88');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Visible manuscript guidelines
    ctx.globalAlpha = 0.09;
    ctx.strokeStyle = '#9c8155';
    ctx.lineWidth = 0.8;
    for (let y = 80; y < height - 70; y += 28) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 40, y);
      ctx.stroke();
    }

    // Age spots and paper imperfections
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 80; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      ctx.fillStyle = Math.random() > 0.5 ? '#6a5030' : '#8c7048';
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + Math.random() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Common aged border vignette and spine shadow
  const spineGrad = ctx.createLinearGradient(
    isLeftPage ? width - 40 : 0,
    0,
    isLeftPage ? width : 40,
    0
  );
  if (isLeftPage) {
    spineGrad.addColorStop(0, 'rgba(40, 25, 15, 0)');
    spineGrad.addColorStop(1, 'rgba(40, 25, 15, 0.28)');
  } else {
    spineGrad.addColorStop(0, 'rgba(40, 25, 15, 0.28)');
    spineGrad.addColorStop(1, 'rgba(40, 25, 15, 0)');
  }
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = spineGrad;
  if (isLeftPage) {
    ctx.fillRect(width - 40, 0, 40, height);
  } else {
    ctx.fillRect(0, 0, 40, height);
  }

  // Delicate page perimeter boundary
  ctx.strokeStyle = 'rgba(140, 110, 70, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.restore();
}

/**
 * Draws realistic washi tape strip at a specified coordinate with random or given angle
 */
export function drawWashiTape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleRad: number,
  color: string = 'rgba(215, 195, 140, 0.72)',
  length: number = 72,
  breadth: number = 22
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);

  // Drop shadow
  ctx.shadowColor = 'rgba(30, 20, 10, 0.15)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;

  // Tape body
  ctx.fillStyle = color;
  ctx.fillRect(-length / 2, -breadth / 2, length, breadth);

  // Jagged serrated edges at left & right tips
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(-length / 2, -breadth / 2, length, 2);

  // Subtle translucent pattern / stripe on tape
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1.5;
  for (let sx = -length / 2 + 6; sx < length / 2; sx += 10) {
    ctx.beginPath();
    ctx.moveTo(sx, -breadth / 2);
    ctx.lineTo(sx + 6, breadth / 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws 3D round pushpin / thumbtack with metallic rim and highlight
 */
export function drawPushPin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pinColor: string = '#c0392b'
) {
  ctx.save();
  ctx.translate(x, y);

  // Pin shadow
  ctx.beginPath();
  ctx.arc(3, 4, 7, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.fill();

  // Pin base rim
  ctx.beginPath();
  ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
  ctx.fillStyle = '#d4af37'; // Antique gold rim
  ctx.fill();

  // Pin colored head
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = pinColor;
  ctx.fill();

  // Pin light shine specular dot
  ctx.beginPath();
  ctx.arc(-2, -2, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fill();

  ctx.restore();
}

/**
 * Draws photo corner mount (triangular vintage album slot)
 */
export function drawPhotoCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  corner: 'tl' | 'tr' | 'bl' | 'br',
  size: number = 18
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#3a2818'; // Dark vintage leatherette or card
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1;

  ctx.beginPath();
  if (corner === 'tl') {
    ctx.moveTo(-size, 0);
    ctx.lineTo(0, -size);
    ctx.lineTo(-size, -size);
  } else if (corner === 'tr') {
    ctx.moveTo(size, 0);
    ctx.lineTo(0, -size);
    ctx.lineTo(size, -size);
  } else if (corner === 'bl') {
    ctx.moveTo(-size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, size);
  } else {
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(size, size);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws crayon style squiggly underline / flourish beneath titles
 */
export function drawCrayonUnderline(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  color: string = '#c48b28'
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.85;

  ctx.beginPath();
  ctx.moveTo(x, y);
  const segments = Math.max(6, Math.floor(length / 14));
  const dx = length / segments;
  for (let i = 1; i <= segments; i++) {
    const cx = x + (i - 0.5) * dx;
    const cy = y + (i % 2 === 0 ? 3.5 : -3.5);
    const ex = x + i * dx;
    const ey = y;
    ctx.quadraticCurveTo(cx, cy, ex, ey);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Thematic doodle icons per pack
 */
export function drawDoodle(
  ctx: CanvasRenderingContext2D,
  type: string,
  x: number,
  y: number,
  scale: number = 1.0,
  rotationRad: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotationRad);
  ctx.scale(scale, scale);

  ctx.strokeStyle = '#4a321a';
  ctx.fillStyle = '#4a321a';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.72;

  switch (type) {
    case 'quill': {
      // Feather quill
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.quadraticCurveTo(12, 0, 10, -18);
      ctx.quadraticCurveTo(0, -14, -6, -2);
      ctx.quadraticCurveTo(-8, 8, 0, 18);
      ctx.stroke();
      // Center spine
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(6, -16);
      ctx.stroke();
      // Ink droplet
      ctx.beginPath();
      ctx.arc(2, 23, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'book': {
      // Open mini book
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-14, -12);
      ctx.lineTo(0, -8);
      ctx.lineTo(14, -12);
      ctx.lineTo(14, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(0, -8);
      ctx.stroke();
      break;
    }
    case 'star': {
      // 5-point hand-drawn star
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r1 = 10;
        const px = Math.cos(a1) * r1;
        const py = Math.sin(a1) * r1;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 'mic': {
      // Stage microphone
      ctx.beginPath();
      ctx.arc(0, -6, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-2, 14);
      ctx.lineTo(2, 14);
      ctx.lineTo(4, 0);
      ctx.stroke();
      break;
    }
    case 'trophy': {
      // Trophy cup
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(10, -10);
      ctx.lineTo(8, 2);
      ctx.quadraticCurveTo(0, 8, -8, 2);
      ctx.closePath();
      ctx.stroke();
      // Stem & base
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.lineTo(0, 14);
      ctx.moveTo(-7, 14);
      ctx.lineTo(7, 14);
      ctx.stroke();
      // Handles
      ctx.beginPath();
      ctx.arc(-11, -4, 4, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.arc(11, -4, 4, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      break;
    }
    case 'swords': {
      // Crossed swords
      ctx.beginPath();
      ctx.moveTo(-12, -12);
      ctx.lineTo(12, 12);
      ctx.moveTo(12, -12);
      ctx.lineTo(-12, 12);
      ctx.stroke();
      break;
    }
    case 'sparkles': {
      // Sparkle cluster
      for (const offset of [-8, 8]) {
        ctx.beginPath();
        ctx.moveTo(offset, -4);
        ctx.lineTo(offset, 4);
        ctx.moveTo(offset - 4, 0);
        ctx.lineTo(offset + 4, 0);
        ctx.stroke();
      }
      break;
    }
    case 'envelope': {
      // Mail stamp / envelope
      ctx.strokeRect(-12, -8, 24, 16);
      ctx.beginPath();
      ctx.moveTo(-12, -8);
      ctx.lineTo(0, 2);
      ctx.lineTo(12, -8);
      ctx.stroke();
      break;
    }
    case 'lightbulb': {
      // Lightbulb idea
      ctx.beginPath();
      ctx.arc(0, -4, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, 5);
      ctx.lineTo(4, 5);
      ctx.moveTo(-3, 8);
      ctx.lineTo(3, 8);
      ctx.stroke();
      break;
    }
    case 'camera': {
      // Hand-drawn vintage rangefinder camera doodle
      ctx.strokeRect(-12, -7, 24, 15);
      // Lens circle
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.stroke();
      // Inner lens pupil
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.stroke();
      // Shutter button bump
      ctx.beginPath();
      ctx.moveTo(-8, -7);
      ctx.lineTo(-8, -10);
      ctx.lineTo(-4, -10);
      ctx.lineTo(-4, -7);
      ctx.stroke();
      // Flash / viewfinder window
      ctx.strokeRect(5, -5, 4, 3);
      break;
    }
    default: {
      // Default ornament
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Draws scattered doodles around the margins according to the chosen doodle pack
 */
export function drawDoodlePackDecorations(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pack: DoodlePack
) {
  const doodleIcons: Record<DoodlePack, string[]> = {
    literary: ['quill', 'book', 'star', 'sparkles', 'lightbulb'],
    events: ['mic', 'swords', 'sparkles', 'star', 'book'],
    achievements: ['trophy', 'star', 'sparkles', 'star', 'trophy'],
    people: ['star', 'book', 'quill', 'sparkles'],
    contact: ['envelope', 'star', 'quill', 'sparkles'],
  };

  const icons = doodleIcons[pack] || doodleIcons.literary;

  // Margin positions (corners & safe peripheral areas)
  const marginPositions = [
    { x: 52, y: 60, rot: -0.2, scale: 2.0 },
    { x: width - 60, y: 62, rot: 0.25, scale: 2.2 },
    { x: 56, y: height - 68, rot: 0.15, scale: 1.8 },
    { x: width - 62, y: height - 66, rot: -0.3, scale: 2.0 },
    { x: width * 0.86, y: height * 0.44, rot: 0.1, scale: 1.6 },
  ];

  for (let i = 0; i < marginPositions.length; i++) {
    const pos = marginPositions[i];
    const iconName = icons[i % icons.length];
    drawDoodle(ctx, iconName, pos.x, pos.y, pos.scale, pos.rot);
  }
}

/**
 * Draws empty photo placeholder slots with varied mounting styles (tape, pins, photo corners)
 * and handwritten captions styled like sticky notes
 */
export function drawImageSlot(
  ctx: CanvasRenderingContext2D,
  slot: ImageSlot,
  x: number,
  y: number,
  width: number,
  height: number,
  mountStyle: MountStyle = 'tape',
  rotationDeg: number = 0
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  const rotRad = (rotationDeg * Math.PI) / 180;
  ctx.rotate(rotRad);

  const halfW = width / 2;
  const halfH = height / 2;

  // 1. Polaroid / Photo print drop shadow
  ctx.shadowColor = 'rgba(25, 15, 5, 0.22)';
  ctx.shadowBlur = 9;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 4;

  // 2. White Polaroid paper rim
  ctx.fillStyle = '#fffdf7';
  ctx.fillRect(-halfW, -halfH, width, height);

  // Reset shadow for inner elements
  ctx.shadowColor = 'transparent';

  // 3. Inner empty photo cutout area
  const photoMargin = 8;
  const captionH = 34;
  const innerW = width - photoMargin * 2;
  const innerH = height - photoMargin * 2 - captionH;

  ctx.fillStyle = '#efe9d8';
  ctx.fillRect(-halfW + photoMargin, -halfH + photoMargin, innerW, innerH);

  // Subtle crosshatch or border inside photo frame
  ctx.strokeStyle = 'rgba(180, 150, 110, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-halfW + photoMargin, -halfH + photoMargin, innerW, innerH);

  // Camera icon indicator (hand-drawn doodle)
  drawDoodle(ctx, 'camera', 0, -halfH + photoMargin + innerH / 2 - 8, 1.1, 0);

  // Subtitle hint inside slot
  ctx.font = 'italic 11px "Patrick Hand", "Caveat", cursive, sans-serif';
  ctx.fillStyle = '#7a6042';
  ctx.fillText('Photo Slot', 0, -halfH + photoMargin + innerH / 2 + 14);

  // 4. Sticky-note / Washi tape style caption below photo
  ctx.fillStyle = 'rgba(245, 235, 205, 0.95)';
  ctx.fillRect(-halfW + 4, halfH - captionH + 2, width - 8, captionH - 6);

  ctx.strokeStyle = 'rgba(160, 130, 90, 0.3)';
  ctx.strokeRect(-halfW + 4, halfH - captionH + 2, width - 8, captionH - 6);

  // Caption text
  ctx.font = '600 11px "Patrick Hand", "Caveat", cursive, sans-serif';
  ctx.fillStyle = '#3a2414';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Wrap caption if long
  const captionY = halfH - captionH / 2 - 1;
  ctx.fillText(slot.caption, 0, captionY, width - 16);

  // 5. Physical mounting accessories (tapes, pins, or photo corners)
  if (mountStyle === 'tape') {
    // Tape strip on top-left or top-center
    drawWashiTape(ctx, -halfW + 16, -halfH + 2, -0.22, 'rgba(215, 195, 140, 0.75)', 48, 16);
    // Optional second tape strip bottom-right
    drawWashiTape(ctx, halfW - 16, halfH - 2, 0.18, 'rgba(195, 175, 130, 0.75)', 48, 16);
  } else if (mountStyle === 'pin') {
    // Pushpin at top center
    drawPushPin(ctx, 0, -halfH + 4, '#c0392b');
  } else if (mountStyle === 'corner') {
    // 4 Photo corners
    drawPhotoCorner(ctx, -halfW + 3, -halfH + 3, 'tl', 12);
    drawPhotoCorner(ctx, halfW - 3, -halfH + 3, 'tr', 12);
    drawPhotoCorner(ctx, -halfW + 3, halfH - 3, 'bl', 12);
    drawPhotoCorner(ctx, halfW - 3, halfH - 3, 'br', 12);
  }

  ctx.restore();
}

/**
 * Draws modular cards on the right page:
 * - 'paragraph': Prose card
 * - 'bullet': List of torn-paper sticky items
 * - 'stat': Scoreboard or milestone sticker
 */
export function drawContentCard(
  ctx: CanvasRenderingContext2D,
  card: ContentCard,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.save();

  // -- Proportional font sizing based on card height for readability at 1024×1024 --
  const titleSize = Math.max(20, Math.min(36, Math.floor(height * 0.055)));
  const bodySize = Math.max(16, Math.min(32, Math.floor(height * 0.05)));
  const bodyLineH = Math.floor(bodySize * 1.5);
  const bulletSize = Math.max(14, Math.min(22, Math.floor(height * 0.038)));
  const bulletLineH = Math.floor(bulletSize * 1.4);
  const badgeSize = Math.max(12, Math.min(18, Math.floor(height * 0.028)));
  const padX = Math.max(20, Math.floor(width * 0.035));
  const padTop = Math.max(34, Math.floor(height * 0.065));

  // Prominent layered drop shadow — pasted-note feel
  ctx.shadowColor = 'rgba(20, 10, 5, 0.22)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 5;

  // Card background — slightly different paper tone from the base page
  ctx.fillStyle = card.type === 'stat' ? '#f0e8d4' : '#faf4e6';
  ctx.beginPath();
  const r = 8;
  ctx.roundRect(x, y, width, height, r);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Paper grain texture overlay on the card surface
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 100; i++) {
    const gx = x + Math.random() * width;
    const gy = y + Math.random() * height;
    const glen = 2 + Math.random() * 5;
    ctx.strokeStyle = Math.random() > 0.5 ? '#3a2010' : '#6a5030';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + glen, gy + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }
  ctx.restore();

  // Double-line organic border for handcrafted feel
  ctx.strokeStyle = card.accentColor || 'rgba(160, 130, 85, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 3, y + 3, width - 6, height - 6, r - 1);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(180, 150, 110, 0.2)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.roundRect(x + 6, y + 6, width - 12, height - 12, r - 2);
  ctx.stroke();

  // Washi tape accent on top edge of card
  const tapeLen = Math.min(80, width * 0.1);
  drawWashiTape(ctx, x + width / 2, y, 0.04, 'rgba(215, 195, 140, 0.72)', tapeLen, 16);

  // Card Title & Badge
  let textStartY = y + padTop;
  if (card.title) {
    ctx.font = `700 ${titleSize}px "Playfair Display", "Cinzel", Georgia, serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.title, x + padX, textStartY, width - padX * 2 - 60);

    if (card.badge) {
      ctx.font = `600 ${badgeSize}px "Patrick Hand", "Caveat", cursive, sans-serif`;
      const badgeW = ctx.measureText(card.badge).width + 14;
      const badgeH = badgeSize + 10;
      ctx.fillStyle = 'rgba(196, 120, 42, 0.18)';
      ctx.beginPath();
      ctx.roundRect(x + width - badgeW - padX, textStartY - badgeH / 2, badgeW, badgeH, 4);
      ctx.fill();
      ctx.fillStyle = '#8c4b18';
      ctx.textAlign = 'center';
      ctx.fillText(card.badge, x + width - badgeW / 2 - padX, textStartY);
    }

    textStartY += titleSize;
    // Crayon-style scribble divider under title
    drawCrayonUnderline(ctx, x + padX, textStartY - titleSize * 0.2, width * 0.35, card.accentColor || '#c48b28');
    textStartY += titleSize * 0.4;
  }

  // Card body text / bullets
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#000000';

  if (Array.isArray(card.text)) {
    // Render list with diamond bullets
    ctx.font = `${bulletSize}px "Cormorant Garamond", Georgia, serif`;
    let currentY = textStartY;
    for (const item of card.text) {
      // Diamond bullet mark
      const bSz = Math.max(4, bulletSize * 0.35);
      ctx.fillStyle = '#c4782a';
      ctx.beginPath();
      ctx.moveTo(x + padX + 4, currentY + bSz);
      ctx.lineTo(x + padX + 4 + bSz, currentY + bSz * 2);
      ctx.lineTo(x + padX + 4, currentY + bSz * 3);
      ctx.lineTo(x + padX + 4 - bSz, currentY + bSz * 2);
      ctx.closePath();
      ctx.fill();

      // Bullet text
      ctx.fillStyle = '#000000';
      ctx.font = `${bulletSize}px "Cormorant Garamond", Georgia, serif`;
      const bulletX = x + padX + bSz * 2 + 12;
      const bulletMaxW = width - padX * 2 - bSz * 2 - 16;
      const endY = wrapText(ctx, item, bulletX, currentY, bulletMaxW, bulletLineH);
      currentY = endY + 6;
      if (currentY > y + height - 20) break;
    }
  } else {
    // Single prose paragraph — large, dark, page-filling
    ctx.font = `600 ${bodySize}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillStyle = '#000000';
    wrapText(ctx, card.text, x + padX, textStartY, width - padX * 2, bodyLineH);
  }

  ctx.restore();
}

/**
 * Simple text wrapping helper for Canvas2D
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
  return curY + lineHeight;
}

/**
 * Hand-drawn section title with slight baseline jitter/wobble per character or word
 */
export function drawHandletteredTitle(
  ctx: CanvasRenderingContext2D,
  title: string,
  x: number,
  y: number,
  color: string = '#24140a',
  fontSize: number = 28
) {
  ctx.save();
  ctx.font = `700 ${fontSize}px "Cinzel", "Playfair Display", Georgia, serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Measure full title for underline
  const metrics = ctx.measureText(title);
  const totalW = metrics.width;

  // Draw title with subtle artistic character wobble
  const words = title.split(' ');
  let startX = x - totalW / 2;

  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    const wordW = ctx.measureText(word + ' ').width;

    ctx.save();
    // Slight random tilt per word (-1.5 to +1.5 deg)
    const wobble = Math.sin(w * 1.7) * 0.025;
    ctx.translate(startX + wordW / 2, y);
    ctx.rotate(wobble);
    ctx.fillText(word, 0, 0);
    ctx.restore();

    startX += wordW;
  }

  // Golden crayon squiggly underline
  drawCrayonUnderline(ctx, x - totalW / 2, y + fontSize * 0.65, totalW, '#c48b28');

  ctx.restore();
}

/**
 * Main procedural scrapbook texture generator for an entire spread (left or right page).
 * Produces a high-resolution CanvasTexture (1024x1024) with all elements composited.
 */
export function generateScrapbookPageTexture(
  options: ScrapbookPageOptions
): THREE.CanvasTexture {
  const cacheKey = `spread_${options.pageNumber}_${options.isLeftPage ? 'L' : 'R'}_${options.paperStyle}`;
  if (scrapbookTextureCache.has(cacheKey)) {
    return scrapbookTextureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const width = canvas.width;
  const height = canvas.height;

  // 1. Draw Paper Background
  drawScrapbookPaper(ctx, width, height, options.paperStyle, options.isLeftPage);

  // 2. Draw Doodle Pack margin accents
  drawDoodlePackDecorations(ctx, width, height, options.doodlePack);

  if (options.isLeftPage) {
    // ── LEFT PAGE: VISUAL & SCRAPBOOK SIDE ──
    // Section Title
    const titleY = 110;
    drawHandletteredTitle(ctx, options.title, width / 2, titleY);

    if (options.subtitle) {
      ctx.font = 'italic 16px "Caveat", "Patrick Hand", cursive, Georgia, serif';
      ctx.fillStyle = '#3a6b8c';
      ctx.textAlign = 'center';
      ctx.fillText(options.subtitle, width / 2, titleY + 38);
    }

    // Image slots layout (1 to 4 slots)
    const slots = options.imageSlots || [];
    if (slots.length === 1) {
      // 1 Large centered slot
      const slot = slots[0];
      drawImageSlot(
        ctx,
        slot,
        width * 0.16,
        220,
        width * 0.68,
        520,
        slot.mountStyle || 'tape',
        slot.rotation || -2.5
      );
    } else if (slots.length === 2) {
      // 2 Stacked slightly staggered slots
      const slot1 = slots[0];
      const slot2 = slots[1];
      drawImageSlot(
        ctx,
        slot1,
        width * 0.14,
        210,
        width * 0.72,
        310,
        slot1.mountStyle || 'tape',
        slot1.rotation || -3.2
      );
      drawImageSlot(
        ctx,
        slot2,
        width * 0.18,
        560,
        width * 0.64,
        290,
        slot2.mountStyle || 'pin',
        slot2.rotation || 3.5
      );
    } else if (slots.length >= 3) {
      // 3 or 4 slots grid / collage
      const positions = [
        { x: width * 0.08, y: 200, w: width * 0.40, h: 290, defRot: -3 },
        { x: width * 0.52, y: 200, w: width * 0.40, h: 290, defRot: 3 },
        { x: width * 0.08, y: 530, w: width * 0.40, h: 290, defRot: 2 },
        { x: width * 0.52, y: 530, w: width * 0.40, h: 290, defRot: -2 },
      ];
      for (let i = 0; i < Math.min(slots.length, 4); i++) {
        const slot = slots[i];
        const p = positions[i];
        drawImageSlot(
          ctx,
          slot,
          p.x,
          p.y,
          p.w,
          p.h,
          slot.mountStyle || (i % 2 === 0 ? 'tape' : 'corner'),
          slot.rotation !== undefined ? slot.rotation : p.defRot
        );
      }
    }
  } else {
    // ── RIGHT PAGE: READABLE CONTENT SIDE ──

    // Hand-lettered title with artistic wobble and crayon underline
    const rightHeaderY = 88;
    if (options.title) {
      drawHandletteredTitle(
        ctx,
        options.title.toUpperCase(),
        width / 2,
        rightHeaderY,
        '#000000',
        44
      );
    }

    let cardStartY = rightHeaderY + 72;

    // Optional Quote Banner — prominent pull-quote with pasted-note styling
    if (options.quote) {
      const qH = 170;

      // Quote note background with layered shadow
      ctx.save();
      ctx.shadowColor = 'rgba(20, 10, 5, 0.18)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = 'rgba(248, 240, 220, 0.92)';
      ctx.beginPath();
      ctx.roundRect(width * 0.07, cardStartY, width * 0.86, qH, 8);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.restore();

      // Organic double border
      ctx.strokeStyle = 'rgba(196, 160, 90, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width * 0.07 + 3, cardStartY + 3, width * 0.86 - 6, qH - 6, 6);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(196, 160, 90, 0.15)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.roundRect(width * 0.07 + 6, cardStartY + 6, width * 0.86 - 12, qH - 12, 5);
      ctx.stroke();

      // Large decorative opening quotation mark
      ctx.save();
      ctx.font = '700 80px "Cinzel", Georgia, serif';
      ctx.fillStyle = 'rgba(196, 139, 40, 0.22)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('\u201C', width * 0.09, cardStartY + 8);
      ctx.restore();

      // Quote text — prominent italic
      ctx.save();
      ctx.font = 'italic 26px "Caveat", "Patrick Hand", Georgia, serif';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      wrapText(ctx, options.quote.text, width / 2, cardStartY + 32, width * 0.70, 36);
      ctx.restore();

      if (options.quote.attribution) {
        ctx.save();
        ctx.font = '600 18px "Cinzel", Georgia, serif';
        ctx.fillStyle = '#3a2a08';
        ctx.textAlign = 'center';
        ctx.fillText(options.quote.attribution, width / 2, cardStartY + qH - 34);
        ctx.restore();
      }

      // Washi tape at top-left of quote box
      drawWashiTape(ctx, width * 0.07 + 38, cardStartY - 2, -0.12, 'rgba(195, 175, 130, 0.7)', 62, 14);

      cardStartY += qH + 30;
    }

    // Render modular content cards — fill remaining vertical space
    const cards = options.contentCards || [];
    if (cards.length > 0) {
      const availableH = height - cardStartY - 80;
      const cardSpacing = 20;
      const totalCardH = availableH - (cards.length - 1) * cardSpacing;
      const eachCardH = Math.floor(totalCardH / cards.length);

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardY = cardStartY + i * (eachCardH + cardSpacing);
        drawContentCard(ctx, card, width * 0.06, cardY, width * 0.88, eachCardH);
      }
    }

    // Right-page decorative accents (bottom corners)
    drawDoodle(ctx, 'sparkles', width - 78, height - 108, 1.5, 0.2);
    drawDoodle(ctx, 'quill', 68, height - 104, 1.4, -0.15);
  }

  // Bottom Roman Numeral
  const roman = toRoman(options.pageNumber + 1);
  ctx.font = 'italic 700 22px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillStyle = '#5c3e1e';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.85;
  ctx.fillText(`—  ${roman}  —`, width / 2, height - 52);
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  scrapbookTextureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Initializes and returns all composite scrapbook textures matching BOOK_PAGES_DATA
 */
export function initScrapbookPageTextures(): THREE.CanvasTexture[] {
  const textures: THREE.CanvasTexture[] = [];

  for (const spread of BOOK_PAGES_DATA) {
    // Generate Right page texture for active spread
    const rightTex = generateScrapbookPageTexture({
      title: spread.rightPage.title || spread.leftPage.title,
      pageNumber: spread.spreadIndex,
      isLeftPage: false,
      paperStyle: spread.rightPage.paperStyle,
      doodlePack: spread.rightPage.doodlePack,
      contentCards: spread.rightPage.cards,
      quote: spread.rightPage.quote,
    });
    textures.push(rightTex);
  }

  return textures;
}

/**
 * Generates left page texture for a given spread index
 */
export function getScrapbookLeftPageTexture(spreadIndex: number): THREE.CanvasTexture {
  const spread = BOOK_PAGES_DATA[spreadIndex] || BOOK_PAGES_DATA[0];
  return generateScrapbookPageTexture({
    title: spread.leftPage.title,
    subtitle: spread.leftPage.subtitle,
    pageNumber: spreadIndex,
    isLeftPage: true,
    paperStyle: spread.leftPage.paperStyle,
    doodlePack: spread.leftPage.doodlePack,
    imageSlots: spread.leftPage.imageSlots,
  });
}
