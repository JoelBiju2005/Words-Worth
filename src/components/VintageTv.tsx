import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useBookStore } from '../store/useBookStore';

/**
 * Creates the authentic dials & channel selector texture for the right control panel
 */
function createTvControlPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Brushed gold/champagne metal faceplate background
  const bgGrad = ctx.createLinearGradient(0, 0, 256, 512);
  bgGrad.addColorStop(0, '#d1ad6e');
  bgGrad.addColorStop(0.3, '#ebd49d');
  bgGrad.addColorStop(0.5, '#c79d57');
  bgGrad.addColorStop(0.8, '#ecd7a4');
  bgGrad.addColorStop(1, '#be944c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 256, 512);

  // Fine brushed horizontal metal grain
  ctx.fillStyle = 'rgba(0,0,0,0.035)';
  for (let y = 0; y < 512; y += 2) {
    ctx.fillRect(0, y, 256, 1);
  }

  // Upper section: Dark inset bezel for the two primary rotary tuners
  ctx.fillStyle = '#141414';
  ctx.fillRect(16, 20, 224, 215);

  // Thin gold border around upper tuner inset
  ctx.strokeStyle = '#cda968';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 20, 224, 215);

  // Top Tuner Dial (VHF Channels 2-13) markings
  const cx1 = 128;
  const cy1 = 80;
  const r1 = 44;

  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const xTickStart = cx1 + Math.cos(angle) * (r1 - 4);
    const yTickStart = cy1 + Math.sin(angle) * (r1 - 4);
    const xTickEnd = cx1 + Math.cos(angle) * (r1 + 2);
    const yTickEnd = cy1 + Math.sin(angle) * (r1 + 2);

    ctx.beginPath();
    ctx.moveTo(xTickStart, yTickStart);
    ctx.lineTo(xTickEnd, yTickEnd);
    ctx.stroke();

    const xNum = cx1 + Math.cos(angle) * (r1 + 10);
    const yNum = cy1 + Math.sin(angle) * (r1 + 10);
    const ch = (i + 2) <= 13 ? (i + 2) : (i + 2 - 12);
    ctx.fillText(`${ch}`, xNum, yNum);
  }

  // VHF label
  ctx.font = '8px sans-serif';
  ctx.fillStyle = '#c5a059';
  ctx.fillText('VHF TUNING', cx1, cy1 + 50);

  // Bottom Tuner Dial (UHF) markings
  const cx2 = 128;
  const cy2 = 175;
  const r2 = 34;
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const xTickStart = cx2 + Math.cos(angle) * (r2 - 3);
    const yTickStart = cy2 + Math.sin(angle) * (r2 - 3);
    const xTickEnd = cx2 + Math.cos(angle) * (r2 + 2);
    const yTickEnd = cy2 + Math.sin(angle) * (r2 + 2);

    ctx.beginPath();
    ctx.moveTo(xTickStart, yTickStart);
    ctx.lineTo(xTickEnd, yTickEnd);
    ctx.stroke();
  }
  ctx.font = '8px sans-serif';
  ctx.fillStyle = '#c5a059';
  ctx.fillText('UHF TUNING', cx2, cy2 + 42);

  // Mid divider with fine volume / power indicator
  ctx.fillStyle = '#222222';
  ctx.fillRect(16, 244, 224, 4);

  // Speaker grille horizontal slots section (lower half, lines 260 to 480)
  ctx.fillStyle = '#0f0e0d';
  ctx.fillRect(16, 258, 224, 234);

  // Grille louvers / slats with warm metallic beige contrast lines
  for (let y = 266; y < 482; y += 12) {
    const slotGrad = ctx.createLinearGradient(0, y, 0, y + 8);
    slotGrad.addColorStop(0, '#f2e8cf');
    slotGrad.addColorStop(0.3, '#d8c49e');
    slotGrad.addColorStop(0.7, '#8e7956');
    slotGrad.addColorStop(1, '#2c2217');
    ctx.fillStyle = slotGrad;
    ctx.fillRect(20, y, 216, 8);

    // Deep black acoustic recess shadow
    ctx.fillStyle = '#050403';
    ctx.fillRect(20, y + 8, 216, 4);
  }

  // Vintage manufacturer badge or power slider slot at bottom
  ctx.fillStyle = '#1c1b18';
  ctx.fillRect(36, 458, 80, 18);
  ctx.fillStyle = '#c9a55c';
  ctx.fillRect(38, 460, 76, 14);
  ctx.fillStyle = '#111111';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('SOLID STATE', 76, 467);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates dynamic glowing CRT TV screen texture with scanlines, phosphors, vignette & subtle test noise
 */
function createCrtScreenTexture(powerOn: boolean, time: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (!powerOn) {
    // Powered off: dark vintage phosphor greenish-grey glass with slight curvature highlight reflection
    const grad = ctx.createRadialGradient(256, 220, 30, 256, 256, 280);
    grad.addColorStop(0, '#555850');
    grad.addColorStop(0.5, '#353832');
    grad.addColorStop(0.85, '#1e211d');
    grad.addColorStop(1, '#0e100e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle off-axis window reflection glint (seen in reference photo top-left!)
    const glint = ctx.createLinearGradient(120, 80, 220, 180);
    glint.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
    glint.addColorStop(0.4, 'rgba(255, 255, 255, 0.08)');
    glint.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = glint;
    ctx.beginPath();
    ctx.roundRect(140, 90, 85, 55, 12);
    ctx.fill();
  } else {
    // CRT Glowing: warm vintage luminous phosphor screen with scanlines and atmospheric broadcast glow
    const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 300);
    grad.addColorStop(0, '#eaf2f8');
    grad.addColorStop(0.4, '#c2dcf0');
    grad.addColorStop(0.8, '#6ea0ca');
    grad.addColorStop(1, '#1b3248');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Vintage monochrome test pattern / classic broadcast circle
    ctx.save();
    ctx.strokeStyle = 'rgba(40, 70, 95, 0.4)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(20, 45, 70, 0.65)';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N T S C', 256, 240);
    ctx.font = '14px monospace';
    ctx.fillText('CHANNEL 03', 256, 275);
    ctx.restore();

    // Scanlines
    ctx.fillStyle = 'rgba(0, 10, 25, 0.18)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 2);
    }

    // Dynamic scanline rolling bar
    const rollY = ((time * 60) % 512);
    const rollGrad = ctx.createLinearGradient(0, rollY - 30, 0, rollY + 30);
    rollGrad.addColorStop(0, 'rgba(255,255,255,0)');
    rollGrad.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    rollGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rollGrad;
    ctx.fillRect(0, rollY - 30, 512, 60);
  }

  return canvas;
}

interface VintageTvProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const VintageTv: React.FC<VintageTvProps> = ({
  position = [3.50, 0.12, 0.20],
  rotation = [0, -Math.PI / 2, 0],
  scale = 1.0,
}) => {
  const tvPower = useBookStore((s) => s.tvPower);
  const toggleTvPower = useBookStore((s) => s.toggleTvPower);
  const cameraState = useBookStore((s) => s.cameraState);
  const turnTvOnAndZoom = useBookStore((s) => s.turnTvOnAndZoom);
  const setIsTvHovered = useBookStore((s) => s.setIsTvHovered);
  const [knobRotation, setKnobRotation] = useState(0);
  const lightRef = useRef<THREE.PointLight>(null);

  // Video element and Texture setup for "TV video.mp4"
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [screenTexture, setScreenTexture] = useState<THREE.CanvasTexture | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = encodeURI('/TV video.mp4');
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    videoRef.current = video;

    // Create a 480x270 canvas downscaler (matching the CRT 16:9 proportion)
    // Downscaling from 1920x1080 to 480x270 cuts GPU upload bandwidth by 16x (~0.5MB/frame),
    // ensuring the video decoding thread is never throttled and maintains 100% sync with audio!
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 270;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 480, 270);
    }
    offscreenCanvasRef.current = canvas;
    offscreenCtxRef.current = ctx;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.format = THREE.RGBAFormat;
    texture.colorSpace = THREE.SRGBColorSpace;
    setScreenTexture(texture);

    const playVideo = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn('Playback attempt failed; retrying muted:', e);
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      }
    };

    const handleStalled = () => {
      // If network buffer stalls or drops, resume playback as soon as data arrives
      if (!video.paused && video.readyState < 2) {
        console.warn('Video stalled/buffering, awaiting data...');
      }
    };

    const handleWaiting = () => {
      // Browser is waiting for the next frame
    };

    const handlePlaying = () => {
      // Confirmed actively playing
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('playing', handlePlaying);

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', playVideo);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('playing', handlePlaying);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  // Sync video audio with cameraState:
  // When zoomed right in front of the TV (cameraState === 'tv'), unmute the video audio!
  // When looking at the room wide/seated/reading, keep it muted so it's a subtle background visual.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (cameraState === 'tv') {
      video.muted = false;
      video.volume = 1.0;
      if (video.paused && tvPower) {
        video.play().catch((e) => {
          console.warn('Unmute play error:', e);
        });
      }
    } else {
      video.muted = true;
    }
  }, [cameraState, tvPower]);

  // Sync video play/pause with TV power
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (tvPower) {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Playback prevented by browser policy; trying muted fallback:', err);
            video.muted = true;
            video.play().catch((e) => console.error('Video play error:', e));
          });
        }
      }
    } else {
      video.pause();
    }
  }, [tvPower]);

  // Materials matching reference image precisely:
  // 1. Warm walnut/teak wood cabinet with authentic grain and varnish finish
  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Rich warm golden honey teak / walnut base
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#9a5e2f');
    grad.addColorStop(0.3, '#b8753d');
    grad.addColorStop(0.7, '#8b4f26');
    grad.addColorStop(1, '#6f3c1b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Warm organic longitudinal wood grain stripes
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512;
      const w = 1 + Math.random() * 5;
      ctx.fillStyle = Math.random() > 0.4 ? '#4a230c' : '#c78446';
      ctx.fillRect(x, 0, w, 512);
    }
    // Subtle weathered edge patina
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#220f05';
    ctx.fillRect(0, 0, 512, 12);
    ctx.fillRect(0, 500, 512, 12);
    ctx.fillRect(0, 0, 12, 512);
    ctx.fillRect(500, 0, 12, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const cabinetMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        color: '#b06f3b',
        roughness: 0.38,
        metalness: 0.06,
      }),
    [woodTexture]
  );

  const darkWoodTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        color: '#6e3f1e',
        roughness: 0.45,
        metalness: 0.08,
      }),
    [woodTexture]
  );

  // 2. Beveled CRT Bezel in terracotta/mahogany rust-brown (exact color matching reference)
  const bezelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#733e2b', // Distinct warm reddish-terracotta bezel from photo
        roughness: 0.55,
        metalness: 0.05,
      }),
    []
  );

  // 3. Crisp chrome/silver trim ring surrounding the screen bezel
  const chromeRingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8edf0',
        roughness: 0.22,
        metalness: 0.92,
      }),
    []
  );

  // 4. Gold brass accent rings and control knobs
  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.30,
        metalness: 0.88,
      }),
    []
  );

  const knobPlasticMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#efe7d3', // Cream / ivory dial caps from photo
        roughness: 0.35,
        metalness: 0.05,
      }),
    []
  );

  // 5. Control Panel Texture
  const controlPanelTexture = useMemo(() => createTvControlPanelTexture(), []);

  // 6. Dynamic CRT Glass Screen with Video Playback
  const crtOffTexture = useMemo(() => {
    const canvas = createCrtScreenTexture(false, 0);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const crtMaterial = useMemo(() => {
    const activeMap = tvPower && screenTexture ? screenTexture : crtOffTexture;

    return new THREE.MeshStandardMaterial({
      map: activeMap,
      roughness: 0.15,
      metalness: 0.1,
      emissive: tvPower ? new THREE.Color('#ffffff') : new THREE.Color('#000000'),
      emissiveIntensity: tvPower ? 0.95 : 0.0,
      emissiveMap: tvPower ? activeMap : null,
    });
  }, [tvPower, screenTexture, crtOffTexture]);

  const lastTimeRef = useRef(-1);
  const lastUpdateRef = useRef(0);

  // Frame animation for light flicker & offscreen canvas frame blitting
  useFrame(({ clock }) => {
    if (tvPower) {
      if (lightRef.current) {
        const t = clock.getElapsedTime();
        lightRef.current.intensity = 1.15 + Math.sin(t * 18) * 0.06 + Math.sin(t * 31) * 0.04;
      }

      const video = videoRef.current;
      const ctx = offscreenCtxRef.current;
      const canvas = offscreenCanvasRef.current;
      const now = performance.now();

      // Only draw and upload if:
      // 1. The video is actively playing and has data
      // 2. The video's currentTime has actually advanced to a new frame
      // 3. At least 33ms have passed (~30 fps cap, matching 24-30fps video framerate)
      // This completely stops CPU/GPU bus flooding and lets the video decoder run at 100% full real-time speed in perfect sync with audio!
      if (
        video &&
        !video.paused &&
        video.readyState >= video.HAVE_CURRENT_DATA &&
        ctx &&
        canvas &&
        screenTexture &&
        video.currentTime !== lastTimeRef.current &&
        now - lastUpdateRef.current >= 33
      ) {
        lastTimeRef.current = video.currentTime;
        lastUpdateRef.current = now;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        screenTexture.needsUpdate = true;
      }
    }
  });

  const togglePower = (e: any) => {
    e.stopPropagation();
    toggleTvPower();
    setKnobRotation((prev) => prev + Math.PI / 6);
  };

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (cameraState !== 'tv') {
          setIsTvHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setIsTvHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        if (cameraState !== 'tv') {
          e.stopPropagation();
          turnTvOnAndZoom();
        }
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════════════
          1. MID-CENTURY WOODEN BASE STAND & TAPERED LEGS (matching reference photo)
          Floor level in Room is y = -0.80. Base stands sturdy on floor.
          ════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, -0.44, 0]}>
        {/* Under-cabinet horizontal apron / stretcher board */}
        <mesh position={[0, 0.08, 0]} material={darkWoodTrimMaterial} castShadow receiveShadow>
          <boxGeometry args={[1.04, 0.07, 0.62]} />
        </mesh>
        <mesh position={[0, 0.04, 0]} material={cabinetMaterial} castShadow>
          <boxGeometry args={[0.96, 0.04, 0.56]} />
        </mesh>

        {/* 4 Tapered Mid-Century Legs (canted outward slightly) */}
        {/* Front-Left Leg */}
        <group position={[-0.38, -0.22, 0.20]} rotation={[0.08, 0, 0.10]}>
          <mesh material={darkWoodTrimMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.028, 0.018, 0.52, 16]} />
          </mesh>
          {/* Brass tip ferrule */}
          <mesh position={[0, -0.24, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.019, 0.018, 0.04, 16]} />
          </mesh>
        </group>

        {/* Front-Right Leg */}
        <group position={[0.38, -0.22, 0.20]} rotation={[0.08, 0, -0.10]}>
          <mesh material={darkWoodTrimMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.028, 0.018, 0.52, 16]} />
          </mesh>
          <mesh position={[0, -0.24, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.019, 0.018, 0.04, 16]} />
          </mesh>
        </group>

        {/* Rear-Left Leg */}
        <group position={[-0.38, -0.22, -0.20]} rotation={[-0.08, 0, 0.10]}>
          <mesh material={darkWoodTrimMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.028, 0.018, 0.52, 16]} />
          </mesh>
          <mesh position={[0, -0.24, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.019, 0.018, 0.04, 16]} />
          </mesh>
        </group>

        {/* Rear-Right Leg */}
        <group position={[0.38, -0.22, -0.20]} rotation={[-0.08, 0, -0.10]}>
          <mesh material={darkWoodTrimMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.028, 0.018, 0.52, 16]} />
          </mesh>
          <mesh position={[0, -0.24, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.019, 0.018, 0.04, 16]} />
          </mesh>
        </group>
      </group>

      {/* ════════════════════════════════════════════════════════════════════════════
          2. MAIN CABINET BODY (Width 1.20m, Height 0.88m, Depth 0.66m)
          Classic heavy walnut wood console cabinet casing with stepped face framing
          ════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 0.16, 0]}>
        {/* Top panel */}
        <mesh position={[0, 0.44, 0]} material={cabinetMaterial} castShadow receiveShadow>
          <boxGeometry args={[1.22, 0.045, 0.68]} />
        </mesh>
        {/* Bottom panel */}
        <mesh position={[0, -0.44, 0]} material={cabinetMaterial} castShadow receiveShadow>
          <boxGeometry args={[1.22, 0.045, 0.68]} />
        </mesh>
        {/* Left side wall */}
        <mesh position={[-0.59, 0, 0]} material={cabinetMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.045, 0.84, 0.68]} />
        </mesh>
        {/* Right side wall */}
        <mesh position={[0.59, 0, 0]} material={cabinetMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.045, 0.84, 0.68]} />
        </mesh>
        {/* Deep rear casing enclosure with ventilation grates */}
        <mesh position={[0, 0, -0.32]} material={darkWoodTrimMaterial} castShadow>
          <boxGeometry args={[1.14, 0.84, 0.04]} />
        </mesh>
        {/* Vintage rear cathode tube hump enclosure */}
        <mesh position={[-0.14, 0, -0.42]} material={darkWoodTrimMaterial}>
          <boxGeometry args={[0.72, 0.58, 0.18]} />
        </mesh>

        {/* Front outer overhang molding trim */}
        <mesh position={[0, 0.435, 0.335]} material={cabinetMaterial} castShadow>
          <boxGeometry args={[1.22, 0.035, 0.03]} />
        </mesh>
        <mesh position={[0, -0.435, 0.335]} material={cabinetMaterial} castShadow>
          <boxGeometry args={[1.22, 0.035, 0.03]} />
        </mesh>
        <mesh position={[-0.595, 0, 0.335]} material={cabinetMaterial} castShadow>
          <boxGeometry args={[0.035, 0.84, 0.03]} />
        </mesh>
        <mesh position={[0.595, 0, 0.335]} material={cabinetMaterial} castShadow>
          <boxGeometry args={[0.035, 0.84, 0.03]} />
        </mesh>

        {/* Recessed front baffle faceboard (z = 0.28) */}
        <mesh position={[0, 0, 0.28]} material={darkWoodTrimMaterial}>
          <boxGeometry args={[1.14, 0.80, 0.03]} />
        </mesh>

        {/* ════════════════════════════════════════════════════════════════════════════
            3. CRT SCREEN MODULE (Left 75% of front face: Center x = -0.16)
            Curved convex bulbous glass tube, terracotta bevel surround, and chrome ring
            ════════════════════════════════════════════════════════════════════════════ */}
        <group position={[-0.16, 0.01, 0.29]}>
          {/* Terracotta / reddish-brown inner surround bevel (exactly as in photo) */}
          {/* Top bezel border */}
          <mesh position={[0, 0.335, 0.02]} material={bezelMaterial}>
            <boxGeometry args={[0.76, 0.05, 0.035]} />
          </mesh>
          {/* Bottom bezel border */}
          <mesh position={[0, -0.335, 0.02]} material={bezelMaterial}>
            <boxGeometry args={[0.76, 0.05, 0.035]} />
          </mesh>
          {/* Left bezel border */}
          <mesh position={[-0.365, 0, 0.02]} material={bezelMaterial}>
            <boxGeometry args={[0.05, 0.62, 0.035]} />
          </mesh>
          {/* Right bezel border (separates CRT from control panel) */}
          <mesh position={[0.365, 0, 0.02]} material={bezelMaterial}>
            <boxGeometry args={[0.05, 0.62, 0.035]} />
          </mesh>

          {/* Chrome / silver inner trim ring line bordering the CRT */}
          {/* Top chrome line */}
          <mesh position={[0, 0.308, 0.032]} material={chromeRingMaterial}>
            <boxGeometry args={[0.69, 0.008, 0.012]} />
          </mesh>
          {/* Bottom chrome line */}
          <mesh position={[0, -0.308, 0.032]} material={chromeRingMaterial}>
            <boxGeometry args={[0.69, 0.008, 0.012]} />
          </mesh>
          {/* Left chrome line */}
          <mesh position={[-0.342, 0, 0.032]} material={chromeRingMaterial}>
            <boxGeometry args={[0.008, 0.61, 0.012]} />
          </mesh>
          {/* Right chrome line */}
          <mesh position={[0.342, 0, 0.032]} material={chromeRingMaterial}>
            <boxGeometry args={[0.008, 0.61, 0.012]} />
          </mesh>

          {/* CRT Screen Tube Face - cleanly seated inside the bezel */}
          <mesh position={[0, 0, 0.024]} material={crtMaterial}>
            <boxGeometry args={[0.67, 0.58, 0.02]} />
          </mesh>

          {/* Screen Light Emitted when turned on */}
          {tvPower && (
            <>
              <pointLight
                ref={lightRef}
                position={[0, 0, 0.35]}
                color="#a3cbf5"
                intensity={1.25}
                distance={4.8}
                decay={1.8}
              />
              <spotLight
                position={[0, 0, 0.3]}
                target-position={[0, 0, 2.5]}
                color="#b8daf8"
                intensity={1.8}
                angle={Math.PI / 3}
                penumbra={0.6}
                distance={6}
              />
            </>
          )}
        </group>

        {/* ════════════════════════════════════════════════════════════════════════════
            4. RIGHT CONTROL PANEL & SPEAKER SECTION (Right side: Center x = 0.38)
            Gold-tone bezel, two rotary dials with ivory knobs, and horizontal slats
            ════════════════════════════════════════════════════════════════════════════ */}
        <group position={[0.38, 0.01, 0.30]}>
          {/* Gold / Brass outer frame for control module */}
          <mesh position={[0, 0, 0.008]} material={brassMaterial}>
            <boxGeometry args={[0.26, 0.72, 0.012]} />
          </mesh>

          {/* Faceplate with authentic dials & louvered slats texture */}
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[0.24, 0.70]} />
            <meshStandardMaterial
              map={controlPanelTexture}
              roughness={0.32}
              metalness={0.65}
            />
          </mesh>

          {/* 3D Physical Rotary Dial Knobs (Interactive Clickable to toggle TV!) */}
          {/* Top VHF Channel Selector Knob */}
          <group
            position={[0, 0.22, 0.024]}
            rotation={[0, 0, knobRotation]}
            onClick={togglePower}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Outer Fluted Gold Skirt */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={brassMaterial} castShadow>
              <cylinderGeometry args={[0.046, 0.052, 0.022, 24]} />
            </mesh>
            {/* Center Ivory Knob Cap */}
            <mesh position={[0, 0, 0.014]} rotation={[Math.PI / 2, 0, 0]} material={knobPlasticMaterial} castShadow>
              <cylinderGeometry args={[0.034, 0.038, 0.018, 20]} />
            </mesh>
            {/* Pointer notch indicator on knob */}
            <mesh position={[0, 0.026, 0.024]} material={darkWoodTrimMaterial}>
              <boxGeometry args={[0.006, 0.016, 0.006]} />
            </mesh>
          </group>

          {/* Bottom UHF Tuning Knob */}
          <group
            position={[0, 0.065, 0.024]}
            rotation={[0, 0, -knobRotation * 0.7]}
            onClick={togglePower}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]} material={brassMaterial} castShadow>
              <cylinderGeometry args={[0.038, 0.044, 0.020, 24]} />
            </mesh>
            <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]} material={knobPlasticMaterial} castShadow>
              <cylinderGeometry args={[0.028, 0.032, 0.016, 20]} />
            </mesh>
            <mesh position={[0, 0.020, 0.021]} material={darkWoodTrimMaterial}>
              <boxGeometry args={[0.005, 0.014, 0.005]} />
            </mesh>
          </group>

          {/* 3D Embossed Speaker Grille Horizontal Louvers for tactile depth */}
          {[-0.08, -0.115, -0.15, -0.185, -0.22, -0.255].map((yOffset, idx) => (
            <mesh key={`grille-fin-${idx}`} position={[0, yOffset, 0.020]} material={darkWoodTrimMaterial}>
              <boxGeometry args={[0.22, 0.014, 0.008]} />
            </mesh>
          ))}
        </group>

        {/* ════════════════════════════════════════════════════════════════════════════
            5. RETRACTABLE TELESCOPIC VINTAGE "RABBIT EARS" ANTENNA (Top of TV)
            ════════════════════════════════════════════════════════════════════════════ */}
        <group position={[0, 0.465, -0.05]}>
          {/* Central Swivel Base Plate */}
          <mesh material={brassMaterial} castShadow>
            <cylinderGeometry args={[0.045, 0.055, 0.016, 20]} />
          </mesh>
          <mesh position={[0, 0.015, 0]} material={darkWoodTrimMaterial}>
            <sphereGeometry args={[0.028, 16, 16]} />
          </mesh>

          {/* Left Antenna Mast (angled out and backward) */}
          <group position={[-0.02, 0.025, 0]} rotation={[0.22, 0, 0.48]}>
            <mesh position={[0, 0.28, 0]} material={chromeRingMaterial} castShadow>
              <cylinderGeometry args={[0.0035, 0.006, 0.56, 12]} />
            </mesh>
            <mesh position={[0, 0.57, 0]} material={chromeRingMaterial}>
              <sphereGeometry args={[0.009, 12, 12]} />
            </mesh>
          </group>

          {/* Right Antenna Mast (angled out and backward) */}
          <group position={[0.02, 0.025, 0]} rotation={[0.22, 0, -0.48]}>
            <mesh position={[0, 0.28, 0]} material={chromeRingMaterial} castShadow>
              <cylinderGeometry args={[0.0035, 0.006, 0.56, 12]} />
            </mesh>
            <mesh position={[0, 0.57, 0]} material={chromeRingMaterial}>
              <sphereGeometry args={[0.009, 12, 12]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
