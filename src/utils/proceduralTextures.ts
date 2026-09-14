import * as THREE from 'three';

export function toRoman(num: number): string {
  const romanMap: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let res = '';
  for (const [val, roman] of romanMap) {
    while (num >= val) {
      res += roman;
      num -= val;
    }
  }
  return res || 'I';
}

// Global cache for textures to prevent duplicate allocations
let deskWoodTexture: THREE.CanvasTexture | null = null;
let bookLeatherTexture: THREE.CanvasTexture | null = null;
let leatherNormalMap: THREE.CanvasTexture | null = null;
let letterTexture: THREE.CanvasTexture | null = null;
let pageTexturesCache: THREE.CanvasTexture[] = [];
let blankBackPageTexture: THREE.CanvasTexture | null = null;
let persianRugTexture: THREE.CanvasTexture | null = null;
let bookSpineTexture: THREE.CanvasTexture | null = null;

/**
 * Generates an antique wood texture with rich warm chestnut grain strokes and subtle knots
 */
export function getDeskWoodTexture(): THREE.CanvasTexture {
  if (deskWoodTexture) return deskWoodTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base warm chestnut/walnut brown (elevated from dark blackish-brown)
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#3d251a');
  grad.addColorStop(0.5, '#4e3020');
  grad.addColorStop(1, '#331d13');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Wood grain strokes
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 700; i++) {
    const x = Math.random() * 512;
    const w = 1 + Math.random() * 4;
    ctx.fillStyle = Math.random() > 0.45 ? '#6a422a' : '#1c0f08';
    ctx.fillRect(x, 0, w, 512);
  }

  // Wavy grain variations
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#5c3622';
  ctx.lineWidth = 3;
  for (let i = 0; i < 45; i++) {
    ctx.beginPath();
    let x = (i * 512) / 45;
    ctx.moveTo(x, 0);
    for (let y = 0; y < 512; y += 35) {
      x += (Math.random() - 0.5) * 12;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Noise overlay
  ctx.globalAlpha = 0.04;
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let p = 0; p < data.length; p += 4) {
    const noise = (Math.random() - 0.5) * 35;
    data[p] = Math.min(255, Math.max(0, data[p] + noise));
    data[p + 1] = Math.min(255, Math.max(0, data[p + 1] + noise));
    data[p + 2] = Math.min(255, Math.max(0, data[p + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  deskWoodTexture = new THREE.CanvasTexture(canvas);
  deskWoodTexture.wrapS = THREE.RepeatWrapping;
  deskWoodTexture.wrapT = THREE.RepeatWrapping;
  deskWoodTexture.repeat.set(2, 2);
  return deskWoodTexture;
}

/**
 * Generates a formal, dignified executive brown carpet with clean tailored
 * border bands, rich chocolate/cognac wool field, antique gold pinstripe inlays,
 * and classical corner corner-blocks. Formal and dignified, not overly ornate.
 */
export function getPersianRugTexture(): THREE.CanvasTexture {
  if (persianRugTexture) return persianRugTexture;

  const W = 1024;
  const H = 768;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Palette: Formal Warm Brown & Antique Gold Accents ──
  const edgeTrim = '#1c120b';         // Deep espresso edge binding
  const outerBand = '#2b1b11';        // Rich dark walnut outer border
  const goldAccent = '#b38d4a';       // Warm antique gold pinstripe
  const goldMuted = '#8f6f36';        // Muted antique gold secondary rule
  const creamTan = '#d5be94';         // Refined warm parchment line
  const midBand = '#422a1a';          // Mid chestnut/cognac border band
  const innerBand = '#2e1c12';        // Inner frame border
  const fieldBase = '#3a2517';        // Deep formal brown field base
  const fieldWarm = '#482f1e';        // Warm center field glow

  // 1. Edge binding / base fill
  ctx.fillStyle = edgeTrim;
  ctx.fillRect(0, 0, W, H);

  // 2. Outer Border (Dark Walnut Band)
  const b1 = 16;
  ctx.fillStyle = outerBand;
  ctx.fillRect(b1, b1, W - b1 * 2, H - b1 * 2);

  // 3. Crisp Gold Inlay Guard Stripe
  const b2 = 36;
  ctx.strokeStyle = goldAccent;
  ctx.lineWidth = 3;
  ctx.strokeRect(b2, b2, W - b2 * 2, H - b2 * 2);

  // Thin cream companion pinstripe
  const b2b = 41;
  ctx.strokeStyle = creamTan;
  ctx.lineWidth = 1;
  ctx.strokeRect(b2b, b2b, W - b2b * 2, H - b2b * 2);

  // 4. Broad Formal Mid Border (Cognac/Chestnut)
  const b3 = 46;
  ctx.fillStyle = midBand;
  ctx.fillRect(b3, b3, W - b3 * 2, H - b3 * 2);

  // Subtle repeating classical dentil / bar motif in mid border
  ctx.fillStyle = goldMuted;
  ctx.globalAlpha = 0.45;
  const dentilW = 12;
  const dentilH = 6;
  // Top & bottom dentil bars
  for (let x = b3 + 24; x < W - b3 - 24; x += 28) {
    ctx.fillRect(x, b3 + 12, dentilW, dentilH);
    ctx.fillRect(x, H - b3 - 18, dentilW, dentilH);
  }
  // Left & right dentil bars
  for (let y = b3 + 24; y < H - b3 - 24; y += 28) {
    ctx.fillRect(b3 + 12, y, dentilH, dentilW);
    ctx.fillRect(W - b3 - 18, y, dentilH, dentilW);
  }
  ctx.globalAlpha = 1.0;

  // 5. Inner Gold Framing Stripe
  const b4 = 78;
  ctx.strokeStyle = goldAccent;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(b4, b4, W - b4 * 2, H - b4 * 2);

  // 6. Inner Dark Walnut Border Band
  const b5 = 84;
  ctx.fillStyle = innerBand;
  ctx.fillRect(b5, b5, W - b5 * 2, H - b5 * 2);

  // Inner gold filet line
  const b6 = 104;
  ctx.strokeStyle = goldAccent;
  ctx.lineWidth = 2;
  ctx.strokeRect(b6, b6, W - b6 * 2, H - b6 * 2);

  // Secondary thin pinstripe
  const b7 = 110;
  ctx.strokeStyle = creamTan;
  ctx.lineWidth = 1;
  ctx.strokeRect(b7, b7, W - b7 * 2, H - b7 * 2);

  // 7. Formal Brown Field with subtle warm radial gradient
  const fX = 114;
  const fY = 114;
  const fW = W - fX * 2;
  const fH = H - fY * 2;
  const fieldGrad = ctx.createRadialGradient(W / 2, H / 2, fW * 0.1, W / 2, H / 2, fW * 0.55);
  fieldGrad.addColorStop(0, fieldWarm);
  fieldGrad.addColorStop(1, fieldBase);
  ctx.fillStyle = fieldGrad;
  ctx.fillRect(fX, fY, fW, fH);

  // 8. Classical Corner Rosettes / Miter Blocks in the Corners
  const cornerSize = 28;
  const corners = [
    [b3 + 6, b3 + 6],
    [W - b3 - 6 - cornerSize, b3 + 6],
    [b3 + 6, H - b3 - 6 - cornerSize],
    [W - b3 - 6 - cornerSize, H - b3 - 6 - cornerSize],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = outerBand;
    ctx.fillRect(cx, cy, cornerSize, cornerSize);
    ctx.strokeStyle = goldAccent;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx + 2, cy + 2, cornerSize - 4, cornerSize - 4);
    // Gold center diamond
    ctx.save();
    ctx.translate(cx + cornerSize / 2, cy + cornerSize / 2);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = goldAccent;
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();
  });

  // 9. Subtle Woven Wool Fabric Microtexture (adds authentic tactile depth)
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.035;
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1.5);
  }
  for (let x = 0; x < W; x += 4) {
    ctx.fillRect(x, 0, 1.5, H);
  }

  // 10. Subtle Soft Edge Vignette for depth
  ctx.globalAlpha = 0.18;
  const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.65);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, '#0e0804');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1.0;

  persianRugTexture = new THREE.CanvasTexture(canvas);
  persianRugTexture.colorSpace = THREE.SRGBColorSpace;
  persianRugTexture.generateMipmaps = true;
  return persianRugTexture;
}

/**
 * Generates an authentic book spine texture for shelf books with vertical ambient
 * occlusion gradient, horizontal embossed gold rules, and lateral crevice shadows.
 */
export function getBookSpineTexture(): THREE.CanvasTexture {
  if (bookSpineTexture) return bookSpineTexture;

  const W = 256;
  const H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 1. Base aged leather tone (warm neutral parchment/tan so vertex color tints it)
  ctx.fillStyle = '#e8d8c0';
  ctx.fillRect(0, 0, W, H);

  // Mottled leather pores
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // 2. Lateral crevice shading (darkens left and right edges so adjacent books separate)
  const edgeGrad = ctx.createLinearGradient(0, 0, W, 0);
  edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.70)');
  edgeGrad.addColorStop(0.12, 'rgba(0, 0, 0, 0.0)');
  edgeGrad.addColorStop(0.88, 'rgba(0, 0, 0, 0.0)');
  edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.70)');
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, W, H);

  // 3. Vertical Ambient Occlusion (AO) gradient — darker near shelf base and shelf ceiling
  const aoGrad = ctx.createLinearGradient(0, 0, 0, H);
  aoGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');   // Top shelf shadow
  aoGrad.addColorStop(0.18, 'rgba(0, 0, 0, 0.0)');
  aoGrad.addColorStop(0.82, 'rgba(0, 0, 0, 0.0)');
  aoGrad.addColorStop(1, 'rgba(0, 0, 0, 0.75)');   // Bottom shelf contact shadow
  ctx.fillStyle = aoGrad;
  ctx.fillRect(0, 0, W, H);

  // 4. Horizontal embossed gold ribs/rules across the spine
  const goldLinesY = [70, 85, 180, 200, 310, 325, 420, 435];
  for (const gy of goldLinesY) {
    // Drop shadow under embossed band
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(16, gy + 3, W - 32, 2);
    // Gold highlight bar
    ctx.fillStyle = 'rgba(235, 205, 110, 0.85)';
    ctx.fillRect(16, gy, W - 32, 3);
  }

  // Tiny ornamental diamond in the upper title block
  ctx.save();
  ctx.translate(W / 2, 135);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = 'rgba(235, 205, 110, 0.75)';
  ctx.fillRect(-8, -8, 16, 16);
  ctx.restore();

  bookSpineTexture = new THREE.CanvasTexture(canvas);
  bookSpineTexture.generateMipmaps = true;
  return bookSpineTexture;
}

/**
 * Generates antique dark leather texture for book covers
 */
export function getBookLeatherTexture(): THREE.CanvasTexture {
  if (bookLeatherTexture) return bookLeatherTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep rich bookbinder leather
  const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 360);
  grad.addColorStop(0, '#361d15');
  grad.addColorStop(0.7, '#24130d');
  grad.addColorStop(1, '#150a06');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Mottled leather pores and creases
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 0.5 + Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.4 ? '#4a2b1f' : '#0d0503';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Creases
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#0f0604';
  ctx.lineWidth = 1;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.lineTo(Math.random() * 512, Math.random() * 512);
    ctx.stroke();
  }

  bookLeatherTexture = new THREE.CanvasTexture(canvas);
  return bookLeatherTexture;
}

/**
 * Draws aged parchment paper with fiber noise, warm vignette, and faint watermark
 */
function drawParchmentBase(ctx: CanvasRenderingContext2D, width = 512, height = 512) {
  // Rich aged parchment base
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
  grad.addColorStop(1, '#cbb483'); // Aged burnt edges

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle paper fibers
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#8d734a';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 14, y + (Math.random() - 0.5) * 8);
    ctx.stroke();
  }

  // Faint horizontal ruled guidelines (typical of vintage manuscripts)
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#9c8155';
  ctx.lineWidth = 1;
  const lineSpacing = 28;
  for (let y = 80; y < height - 70; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(45, y);
    ctx.lineTo(width - 45, y);
    ctx.stroke();
  }

  // Subtle inner decorative border
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#b89c68';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Tiny corner flourish marks
  ctx.globalAlpha = 0.18;
  const cornerFlourish = (cx: number, cy: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.stroke();
  };
  cornerFlourish(32, 32);
  cornerFlourish(width - 32, 32);
  cornerFlourish(32, height - 32);
  cornerFlourish(width - 32, height - 32);

  // Reset alpha
  ctx.globalAlpha = 1.0;
}

/**
 * Pre-caches all 9 page textures with Roman numerals baked into parchment
 */
export function initPageTextures(totalPages = 9): THREE.CanvasTexture[] {
  if (pageTexturesCache.length === totalPages) {
    return pageTexturesCache;
  }

  pageTexturesCache = [];
  const width = 512;
  const height = 512;

  for (let i = 0; i < totalPages; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // 1. Draw aged paper background
    drawParchmentBase(ctx, width, height);

    // Reset text alignment for any future content
    ctx.textAlign = 'center';

    // 3. Roman Numeral at bottom center (Raised so clearly visible above nav bar)
    const roman = toRoman(i + 1);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#5c3e1e';
    ctx.font = 'italic 700 26px "Cinzel", "Cormorant Garamond", serif';
    ctx.fillText(`—  ${roman}  —`, width / 2, height - 76);

    ctx.globalAlpha = 1.0;

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    pageTexturesCache.push(texture);
  }

  return pageTexturesCache;
}

/**
 * Blank back-face texture for pages turned to the left side
 */
export function getBlankBackPageTexture(): THREE.CanvasTexture {
  if (blankBackPageTexture) return blankBackPageTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  drawParchmentBase(ctx, 512, 512);

  blankBackPageTexture = new THREE.CanvasTexture(canvas);
  blankBackPageTexture.generateMipmaps = true;
  blankBackPageTexture.needsUpdate = true;
  return blankBackPageTexture;
}

/**
 * Generates a procedural leather normal map for book covers.
 * Creates grain noise that gives the flat leather material surface variation.
 */
export function getLeatherNormalMap(): THREE.CanvasTexture {
  if (leatherNormalMap) return leatherNormalMap;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Start with neutral normal (128, 128, 255) — pointing straight out
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // Generate grain bumps: randomly perturb the R and G channels
  // (which encode X and Y normal deviation in tangent space)
  for (let i = 0; i < data.length; i += 4) {
    // Large-scale leather grain
    const grainR = (Math.random() - 0.5) * 18;
    const grainG = (Math.random() - 0.5) * 18;
    data[i] = Math.min(255, Math.max(0, 128 + grainR));     // R (X normal)
    data[i + 1] = Math.min(255, Math.max(0, 128 + grainG)); // G (Y normal)
    // B stays ~255 (Z pointing out)
    data[i + 2] = Math.min(255, Math.max(0, 240 + (Math.random() - 0.5) * 12));
  }

  // Add a few larger crease lines for leather character
  ctx.putImageData(imgData, 0, 0);
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = 'rgb(110, 140, 255)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.lineTo(Math.random() * size, Math.random() * size);
    ctx.stroke();
  }

  leatherNormalMap = new THREE.CanvasTexture(canvas);
  leatherNormalMap.wrapS = THREE.RepeatWrapping;
  leatherNormalMap.wrapT = THREE.RepeatWrapping;
  leatherNormalMap.needsUpdate = true;
  return leatherNormalMap;
}

/**
 * Generates a parchment letter texture with faint script lines and aged look.
 */
export function getLetterTexture(): THREE.CanvasTexture {
  if (letterTexture) return letterTexture;

  const w = 512, h = 384;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Aged parchment base
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.6);
  grad.addColorStop(0, '#f5ead4');
  grad.addColorStop(0.7, '#e8d8b8');
  grad.addColorStop(1, '#cbb483');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Faint handwriting-style script lines
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#6b5535';
  ctx.lineWidth = 0.8;
  for (let y = 50; y < h - 40; y += 22) {
    ctx.beginPath();
    let x = 40;
    ctx.moveTo(x, y);
    // Simulate wavy handwriting baseline
    const lineEnd = 40 + Math.random() * (w - 120);
    while (x < lineEnd) {
      x += 3 + Math.random() * 5;
      ctx.lineTo(x, y + (Math.random() - 0.5) * 2.5);
    }
    ctx.stroke();
  }

  // Paper fiber noise
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.strokeStyle = '#8d734a';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;

  letterTexture = new THREE.CanvasTexture(canvas);
  letterTexture.needsUpdate = true;
  return letterTexture;
}

let floorPlanksTexture: THREE.CanvasTexture | null = null;
let framedPaintingTexture: THREE.CanvasTexture | null = null;

/**
 * Generates an antique hardwood plank floor texture with visible seams, grain, and varnish
 */
export function getFloorPlanksTexture(): THREE.CanvasTexture {
  if (floorPlanksTexture) return floorPlanksTexture;

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const plankCount = 8;
  const plankWidth = size / plankCount;

  // Base tones for individual planks
  const plankBaseColors = [
    '#3a2214', '#2c190d', '#422718', '#341d11',
    '#3e2516', '#2f1b0f', '#3c2315', '#321d10'
  ];

  for (let i = 0; i < plankCount; i++) {
    const x = i * plankWidth;
    const baseColor = plankBaseColors[i % plankBaseColors.length];

    // Plank base gradient
    const grad = ctx.createLinearGradient(x, 0, x + plankWidth, 0);
    grad.addColorStop(0, baseColor);
    grad.addColorStop(0.5, adjustColor(baseColor, 12));
    grad.addColorStop(1, adjustColor(baseColor, -10));
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, plankWidth, size);

    // Wood grain lines running vertically down each plank
    ctx.globalAlpha = 0.08;
    for (let g = 0; g < 120; g++) {
      const gx = x + Math.random() * plankWidth;
      const gw = 1 + Math.random() * 3;
      ctx.fillStyle = Math.random() > 0.5 ? '#5d3820' : '#140803';
      ctx.fillRect(gx, 0, gw, size);
    }

    // Wavy grain & growth rings
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#5a351d';
    ctx.lineWidth = 2;
    for (let w = 0; w < 8; w++) {
      ctx.beginPath();
      let cx = x + Math.random() * plankWidth;
      ctx.moveTo(cx, 0);
      for (let y = 0; y < size; y += 40) {
        cx += (Math.random() - 0.5) * 8;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();
    }

    // Plank seam bevels (dark groove + highlight edge)
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#0f0602';
    ctx.fillRect(x, 0, 3, size); // Deep groove

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#6a4227';
    ctx.fillRect(x + 3, 0, 2, size); // Highlight shoulder
  }

  // Global noise and subtle scratches across floor
  ctx.globalAlpha = 0.04;
  for (let s = 0; s < 150; s++) {
    ctx.strokeStyle = '#7c4d2d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const sx = Math.random() * size;
    const sy = Math.random() * size;
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + (Math.random() - 0.5) * 40, sy + Math.random() * 20);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;

  floorPlanksTexture = new THREE.CanvasTexture(canvas);
  floorPlanksTexture.wrapS = THREE.RepeatWrapping;
  floorPlanksTexture.wrapT = THREE.RepeatWrapping;
  floorPlanksTexture.repeat.set(3, 3);
  floorPlanksTexture.needsUpdate = true;
  return floorPlanksTexture;
}

/**
 * Generates an evocative Old Master oil painting for the framed picture
 */
export function getFramedPaintingTexture(): THREE.CanvasTexture {
  if (framedPaintingTexture) return framedPaintingTexture;

  const w = 512;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // 1. Dramatic golden-hour / romantic dusk sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  skyGrad.addColorStop(0, '#1c171e');    // Deep twilight violet-indigo
  skyGrad.addColorStop(0.35, '#3b2520'); // Burnt umber
  skyGrad.addColorStop(0.65, '#8c5828'); // Glowing amber gold
  skyGrad.addColorStop(0.85, '#b87c38'); // Horizon golden radiance
  skyGrad.addColorStop(1, '#633d18');    // Rich sienna ground transition
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Romantic landscape hills and classical ruins/arch
  // Distant misty mountains
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#2d1e18';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.62);
  ctx.bezierCurveTo(w * 0.25, h * 0.55, w * 0.45, h * 0.65, w * 0.7, h * 0.58);
  ctx.bezierCurveTo(w * 0.85, h * 0.54, w * 0.95, h * 0.60, w, h * 0.63);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Foreground rolling meadow & riverbank
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#1e130c';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.70);
  ctx.bezierCurveTo(w * 0.3, h * 0.68, w * 0.6, h * 0.74, w, h * 0.72);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // River reflection of the golden sky
  const riverGrad = ctx.createLinearGradient(0, h * 0.72, 0, h * 0.85);
  riverGrad.addColorStop(0, '#8c5828');
  riverGrad.addColorStop(1, '#1e130c');
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = riverGrad;
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.71);
  ctx.quadraticCurveTo(w * 0.5, h * 0.76, w * 0.75, h * 0.82);
  ctx.lineTo(w * 0.62, h * 0.85);
  ctx.quadraticCurveTo(w * 0.42, h * 0.78, w * 0.30, h * 0.72);
  ctx.closePath();
  ctx.fill();

  // Classical archway / ancient library colonnade silhouette (left side)
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = '#140c07';
  // Column 1
  ctx.fillRect(w * 0.10, h * 0.30, 24, h * 0.45);
  // Column 2
  ctx.fillRect(w * 0.22, h * 0.34, 22, h * 0.41);
  // Arch curve spanning columns
  ctx.beginPath();
  ctx.moveTo(w * 0.08, h * 0.32);
  ctx.quadraticCurveTo(w * 0.17, h * 0.22, w * 0.26, h * 0.32);
  ctx.lineTo(w * 0.26, h * 0.27);
  ctx.quadraticCurveTo(w * 0.17, h * 0.18, w * 0.08, h * 0.27);
  ctx.closePath();
  ctx.fill();

  // Atmospheric clouds and impasto strokes
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#e5a556';
  for (let c = 0; c < 25; c++) {
    const cx = Math.random() * w;
    const cy = h * 0.2 + Math.random() * (h * 0.4);
    const cr = 20 + Math.random() * 60;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Aged craquelure (fine antique cracked varnish lines)
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#0a0502';
  ctx.lineWidth = 0.7;
  for (let k = 0; k < 60; k++) {
    ctx.beginPath();
    let kx = Math.random() * w;
    let ky = Math.random() * h;
    ctx.moveTo(kx, ky);
    for (let seg = 0; seg < 4; seg++) {
      kx += (Math.random() - 0.5) * 35;
      ky += (Math.random() - 0.5) * 35;
      ctx.lineTo(kx, ky);
    }
    ctx.stroke();
  }

  // 4. Subtle dark perimeter vignette (oil painting age)
  const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(0.8, 'rgba(15,8,4,0.4)');
  vig.addColorStop(1, 'rgba(8,3,1,0.85)');
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  framedPaintingTexture = new THREE.CanvasTexture(canvas);
  framedPaintingTexture.needsUpdate = true;
  return framedPaintingTexture;
}

// Helper to slightly adjust hex color brightness
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  UNIFIED BOOK COVER TEXTURE
 *  Bakes leather, gold borders, corner ornaments, text, dividers,
 *  and the club logo into ONE canvas so the whole cover is a single
 *  MeshStandardMaterial surface reacting to scene lighting uniformly.
 * ═══════════════════════════════════════════════════════════════════════ */
let mainBookSpineTexture: THREE.CanvasTexture | null = null;
let mainBookSpineSideTexture: THREE.CanvasTexture | null = null;

/**
 * Generates the front/back face texture for the main book's spine.
 * Decorative gold bands, ornamental diamonds, and leather base — NO text.
 * Canvas: 128 W × 1024 H
 */
export function getMainBookSpineTexture(): THREE.CanvasTexture {
  if (mainBookSpineTexture) return mainBookSpineTexture;

  const W = 128;
  const H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── 1. Rich Leather Base (matches front cover) ─────────────────────
  const baseGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, H * 0.55);
  baseGrad.addColorStop(0, '#361d15');
  baseGrad.addColorStop(0.5, '#2a150e');
  baseGrad.addColorStop(0.8, '#1f0e08');
  baseGrad.addColorStop(1, '#150a06');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, W, H);

  // Mottled leather pores
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 0.5 + Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.4 ? '#4a2b1f' : '#0d0503';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // ── 2. Lateral Crevice Shading (darkens spine edges) ──────────────
  const edgeGrad = ctx.createLinearGradient(0, 0, W, 0);
  edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  edgeGrad.addColorStop(0.15, 'rgba(0, 0, 0, 0.0)');
  edgeGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.0)');
  edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, W, H);

  // ── 3. Decorative Gold Bands ──────────────────────────────────────
  const gold = '#d4af37';
  const goldShadow = 'rgba(0, 0, 0, 0.45)';
  const bandPositions = [
    80, 95,           // Top pair
    280, 295,         // Upper-mid pair
    500, 515,         // Center pair
    710, 725,         // Lower-mid pair
    910, 925,         // Bottom pair
  ];

  for (const by of bandPositions) {
    ctx.fillStyle = goldShadow;
    ctx.fillRect(10, by + 2, W - 20, 3);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = gold;
    ctx.fillRect(10, by, W - 20, 3);
  }
  ctx.globalAlpha = 1.0;

  // ── 4. Ornamental Diamonds (top cluster) ──────────────────────────
  ctx.save();
  ctx.translate(W / 2, 186);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = gold;
  ctx.fillRect(-8, -8, 16, 16);
  ctx.restore();

  ctx.save();
  ctx.translate(W / 2, 160);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = gold;
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  ctx.save();
  ctx.translate(W / 2, 212);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = gold;
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  // ── 5. Ornamental Diamonds (bottom cluster) ───────────────────────
  ctx.save();
  ctx.translate(W / 2, 820);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = gold;
  ctx.fillRect(-8, -8, 16, 16);
  ctx.restore();

  ctx.save();
  ctx.translate(W / 2, 794);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = gold;
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  ctx.save();
  ctx.translate(W / 2, 846);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = gold;
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  // ── 6. Thin Gold Fillet Border ─────────────────────────────────────
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  ctx.strokeRect(4, 40, W - 8, H - 80);
  ctx.globalAlpha = 1.0;

  mainBookSpineTexture = new THREE.CanvasTexture(canvas);
  mainBookSpineTexture.colorSpace = THREE.SRGBColorSpace;
  mainBookSpineTexture.generateMipmaps = true;
  mainBookSpineTexture.minFilter = THREE.LinearMipmapLinearFilter;
  mainBookSpineTexture.magFilter = THREE.LinearFilter;
  mainBookSpineTexture.needsUpdate = true;
  return mainBookSpineTexture;
}

/**
 * Generates the side face texture for the main book's spine.
 * "Word's Worth" title reading top-to-bottom, decorative gold bands,
 * and leather base. Canvas aspect ratio (128×1728) matches the side face
 * dimensions (0.12 × 1.62) to prevent font distortion.
 */
export function getMainBookSpineSideTexture(): THREE.CanvasTexture {
  if (mainBookSpineSideTexture) return mainBookSpineSideTexture;

  // Aspect matches face: 0.12 / 1.62 ≈ 0.074
  const W = 128;
  const H = 1728;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── 1. Rich Leather Base ───────────────────────────────────────────
  const baseGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, H * 0.55);
  baseGrad.addColorStop(0, '#361d15');
  baseGrad.addColorStop(0.5, '#2a150e');
  baseGrad.addColorStop(0.8, '#1f0e08');
  baseGrad.addColorStop(1, '#150a06');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, W, H);

  // Mottled leather pores
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 0.5 + Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.4 ? '#4a2b1f' : '#0d0503';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // ── 2. Lateral Crevice Shading ─────────────────────────────────────
  const edgeGrad = ctx.createLinearGradient(0, 0, W, 0);
  edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
  edgeGrad.addColorStop(0.18, 'rgba(0, 0, 0, 0.0)');
  edgeGrad.addColorStop(0.82, 'rgba(0, 0, 0, 0.0)');
  edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, W, H);

  // ── 3. Decorative Gold Bands ───────────────────────────────────────
  const gold = '#d4af37';
  const goldShadow = 'rgba(0, 0, 0, 0.45)';
  const sideBandPositions = [
    120, 138,         // Top pair
    420, 438,         // Above title
    1290, 1308,       // Below title
    1570, 1588,       // Bottom pair
  ];

  for (const by of sideBandPositions) {
    ctx.fillStyle = goldShadow;
    ctx.fillRect(12, by + 2, W - 24, 3);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = gold;
    ctx.fillRect(12, by, W - 24, 3);
  }
  ctx.globalAlpha = 1.0;

  // ── 4. Top Ornamental Diamond ──────────────────────────────────────
  ctx.save();
  ctx.translate(W / 2, 280);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = gold;
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  // ── 5. Bottom Ornamental Diamond ───────────────────────────────────
  ctx.save();
  ctx.translate(W / 2, 1440);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = gold;
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  // ── 6. "Word's Worth" Text — Top to Bottom (rotated +90°) ─────────
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(Math.PI / 2);  // +90° clockwise = reads top → bottom

  // Text shadow for emboss effect
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#000000';
  ctx.font = '700 48px "Cinzel", "Cormorant Garamond", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '6px';
  ctx.fillText("Word's Worth", 2, 2);

  // Gold highlight pass
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#fff8e0';
  ctx.fillText("Word's Worth", -1, -1);

  // Main gold text
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = '#dfbe5d';
  ctx.fillText("Word's Worth", 0, 0);

  ctx.restore();
  ctx.globalAlpha = 1.0;

  // ── 7. Thin Gold Fillet Border ─────────────────────────────────────
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  ctx.strokeRect(4, 60, W - 8, H - 120);
  ctx.globalAlpha = 1.0;

  mainBookSpineSideTexture = new THREE.CanvasTexture(canvas);
  mainBookSpineSideTexture.colorSpace = THREE.SRGBColorSpace;
  mainBookSpineSideTexture.generateMipmaps = true;
  mainBookSpineSideTexture.minFilter = THREE.LinearMipmapLinearFilter;
  mainBookSpineSideTexture.magFilter = THREE.LinearFilter;
  mainBookSpineSideTexture.needsUpdate = true;
  return mainBookSpineSideTexture;
}

let bookCoverTexture: THREE.CanvasTexture | null = null;

/**
 * Creates the full front-cover artwork at high resolution.
 * Returns a CanvasTexture immediately (leather + ornaments + text).
 * The logo is loaded asynchronously and composited when ready.
 */
export function getBookCoverTexture(): THREE.CanvasTexture {
  if (bookCoverTexture) return bookCoverTexture;

  // Canvas matches cover aspect ratio (coverWidth:coverHeight = 1.34:1.62 ≈ 0.827)
  const W = 1024;
  const H = 1240;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── 1. Leather Background ─────────────────────────────────────────
  drawLeatherBase(ctx, W, H);

  // ── 2. Double Gold Fillet Outer Frame ──────────────────────────────
  drawGoldBorders(ctx, W, H);

  // ── 3. Corner Ornaments ───────────────────────────────────────────
  drawCornerOrnaments(ctx, W, H);

  // ── 4. Top Decorative Divider (diamond + lines) ───────────────────
  drawDivider(ctx, W, H * 0.115, W * 0.40);

  // ── 5. Club Title (two lines) ─────────────────────────────────────
  drawCoverText(ctx, W, H);

  // ── 6. Divider below title, above logo ────────────────────────────
  drawDivider(ctx, W, H * 0.265, W * 0.36);

  // ── 7. "SINCE 2021" subtitle ──────────────────────────────────────
  drawSubtitle(ctx, W, H);

  // ── 8. Divider above "CLICK TO OPEN" ──────────────────────────────
  drawDivider(ctx, W, H * 0.815, W * 0.30);

  // ── 9. "CLICK TO OPEN" prompt ─────────────────────────────────────
  drawClickPrompt(ctx, W, H);

  // ── Create texture (logo placeholder zone is leather for now) ─────
  bookCoverTexture = new THREE.CanvasTexture(canvas);
  bookCoverTexture.colorSpace = THREE.SRGBColorSpace;
  bookCoverTexture.generateMipmaps = true;
  bookCoverTexture.minFilter = THREE.LinearMipmapLinearFilter;
  bookCoverTexture.magFilter = THREE.LinearFilter;
  bookCoverTexture.needsUpdate = true;

  // ── 10. Async Logo Load & Composite ───────────────────────────────
  const logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  logoImg.onload = () => {
    // Draw the logo centred in the cover (between top title and subtitle)
    const logoAspect = logoImg.width / logoImg.height;
    const logoDrawW = W * 0.72;
    const logoDrawH = logoDrawW / logoAspect;
    const logoX = (W - logoDrawW) / 2;
    const logoY = H * 0.32; // centred vertically between title and SINCE 2021

    // Subtle emboss: shadow pass (offset down-right)
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.filter = 'brightness(0) blur(2px)';
    ctx.drawImage(logoImg, logoX + 2, logoY + 3, logoDrawW, logoDrawH);
    ctx.restore();

    // Highlight pass (offset up-left, warm)
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.filter = 'brightness(2) blur(1px)';
    ctx.drawImage(logoImg, logoX - 1, logoY - 1, logoDrawW, logoDrawH);
    ctx.restore();

    // Main logo pass
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.drawImage(logoImg, logoX, logoY, logoDrawW, logoDrawH);
    ctx.restore();

    // Update the texture
    bookCoverTexture!.needsUpdate = true;
  };
  logoImg.src = '/logo-white.png';

  return bookCoverTexture;
}

/* ── Sub-drawing helpers ───────────────────────────────────────────── */

function drawLeatherBase(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Deep rich bookbinder leather
  const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.1, W / 2, H / 2, W * 0.75);
  grad.addColorStop(0, '#361d15');
  grad.addColorStop(0.5, '#2a150e');
  grad.addColorStop(0.8, '#1f0e08');
  grad.addColorStop(1, '#150a06');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Mottled leather pores
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 0.5 + Math.random() * 2.5;
    ctx.fillStyle = Math.random() > 0.4 ? '#4a2b1f' : '#0d0503';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Creases
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#0f0604';
  ctx.lineWidth = 1;
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * W, Math.random() * H);
    ctx.lineTo(Math.random() * W, Math.random() * H);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
}

function drawGoldBorders(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const gold = '#d4af37';
  const goldDark = '#b89c2e';

  // Outer frame
  ctx.strokeStyle = gold;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.9;
  const outerM = W * 0.044; // outer margin
  ctx.strokeRect(outerM, outerM, W - outerM * 2, H - outerM * 2);

  // Inner frame
  ctx.strokeStyle = goldDark;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = 0.85;
  const innerM = W * 0.075; // inner margin
  ctx.strokeRect(innerM, innerM, W - innerM * 2, H - innerM * 2);

  ctx.globalAlpha = 1.0;
}

function drawCornerOrnaments(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const gold = '#d4af37';
  const outerM = W * 0.044;
  const innerM = W * 0.075;

  const corners: [number, number][] = [
    [outerM, outerM],
    [W - outerM, outerM],
    [outerM, H - outerM],
    [W - outerM, H - outerM],
  ];

  const innerCorners: [number, number][] = [
    [innerM, innerM],
    [W - innerM, innerM],
    [innerM, H - innerM],
    [W - innerM, H - innerM],
  ];

  ctx.globalAlpha = 0.9;

  // Outer corner square accents
  for (const [cx, cy] of corners) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = gold;
    ctx.fillRect(-5, -5, 10, 10);
    ctx.restore();
  }

  // Inner corner diamond rosettes
  for (const [cx, cy] of innerCorners) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = gold;
    ctx.fillRect(-7, -7, 14, 14);
    ctx.restore();

    // Smaller floret further inside
    const dx = cx < W / 2 ? 22 : -22;
    const dy = cy < H / 2 ? 22 : -22;
    ctx.save();
    ctx.translate(cx + dx, cy + dy);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = gold;
    ctx.globalAlpha = 0.75;
    ctx.fillRect(-5, -5, 10, 10);
    ctx.restore();
  }

  // Diagonal lines connecting outer to inner corners
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(corners[i][0], corners[i][1]);
    ctx.lineTo(innerCorners[i][0], innerCorners[i][1]);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
}

function drawDivider(ctx: CanvasRenderingContext2D, W: number, y: number, lineW: number) {
  const gold = '#d4af37';
  const cx = W / 2;

  ctx.globalAlpha = 0.85;
  ctx.fillStyle = gold;

  // Center diamond
  ctx.save();
  ctx.translate(cx, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  // Flanking smaller diamonds
  ctx.save();
  ctx.translate(cx - 24, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  ctx.save();
  ctx.translate(cx + 24, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  // Horizontal lines extending from diamonds
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 32, y);
  ctx.lineTo(cx - lineW / 2, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 32, y);
  ctx.lineTo(cx + lineW / 2, y);
  ctx.stroke();

  ctx.globalAlpha = 1.0;
}

function drawCoverText(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const cx = W / 2;

  // Line 1: "THE ENGLISH CLUB OF"
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = '#dfbe5d';
  ctx.font = '600 26px "Cinzel", "Cormorant Garamond", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '5px';
  ctx.fillText('THE ENGLISH CLUB OF', cx, H * 0.155);

  // Line 2: "KLE TECHNOLOGICAL UNIVERSITY"
  ctx.font = '600 24px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillText('KLE TECHNOLOGICAL UNIVERSITY', cx, H * 0.195);

  ctx.globalAlpha = 1.0;
}

function drawSubtitle(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const cx = W / 2;

  // Divider above subtitle
  drawDivider(ctx, W, H * 0.72, W * 0.36);

  ctx.globalAlpha = 0.88;
  ctx.fillStyle = '#baa052';
  ctx.font = '600 22px "Cinzel", "Cormorant Garamond", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '7px';
  ctx.fillText('— SINCE 2021 —', cx, H * 0.76);

  ctx.globalAlpha = 1.0;
}

function drawClickPrompt(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const cx = W / 2;

  ctx.globalAlpha = 0.82;
  ctx.fillStyle = '#edd485';
  ctx.font = '600 21px "Cinzel", "Cormorant Garamond", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '5px';
  ctx.fillText('— ✦ CLICK TO OPEN ✦ —', cx, H * 0.87);

  ctx.globalAlpha = 1.0;
}

