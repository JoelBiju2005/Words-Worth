import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import gsap from 'gsap';
import { useBookStore } from '../store/useBookStore';
import {
  getBookLeatherTexture,
  getLeatherNormalMap,
  getBookCoverTexture,
  getMainBookSpineTexture,
  getMainBookSpineSideTexture,
  getBlankBackPageTexture,
} from '../utils/proceduralTextures';
import {
  initScrapbookPageTextures,
  getScrapbookLeftPageTexture,
} from '../utils/scrapbookTextures';
import { createPageCurlMaterial } from '../shaders/pageCurl';
import { RibbonBookmarks } from './RibbonBookmarks';

interface BookProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const Book: React.FC<BookProps> = ({
  position = [0, 0.44, 0.05],
  rotation = [-Math.PI / 5.2, 0, 0], // Matches the bookstand tilt
}) => {
  const bookGroupRef = useRef<THREE.Group>(null);
  const frontCoverPivotRef = useRef<THREE.Group>(null);
  const leftPageRef = useRef<THREE.Mesh>(null);
  const rightPageRef = useRef<THREE.Mesh>(null);
  const flipPageRef = useRef<THREE.Mesh>(null);

  // Store bindings
  const bookState = useBookStore((s) => s.bookState);
  const setBookState = useBookStore((s) => s.setBookState);
  const setCameraState = useBookStore((s) => s.setCameraState);
  const openBook = useBookStore((s) => s.openBook);
  const currentPage = useBookStore((s) => s.currentPage);
  const totalPages = useBookStore((s) => s.totalPages);
  const isFlipping = useBookStore((s) => s.isFlipping);
  const flipDirection = useBookStore((s) => s.flipDirection);
  const setIsFlipping = useBookStore((s) => s.setIsFlipping);
  const candleIntensity = useBookStore((s) => s.candleIntensity);

  // Geometry dimensions
  const coverWidth = 1.34;
  const coverHeight = 1.62;
  const coverThickness = 0.038;
  const pageWidth = 1.25;
  const pageHeight = 1.54;
  const spineThickness = 0.12;

  // Cached textures
  const leatherTexture = useMemo(() => getBookLeatherTexture(), []);
  const leatherNormalMap = useMemo(() => getLeatherNormalMap(), []);
  const spineFrontTexture = useMemo(() => getMainBookSpineTexture(), []);
  const spineSideTexture = useMemo(() => getMainBookSpineSideTexture(), []);
  const pageTextures = useMemo(() => initScrapbookPageTextures(), []);
  const blankBackTexture = useMemo(() => getBlankBackPageTexture(), []);
  const coverTexture = useMemo(() => getBookCoverTexture(), []);

  // Materials
  const leatherMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: leatherTexture,
        normalMap: leatherNormalMap,
        normalScale: new THREE.Vector2(0.3, 0.3),
        color: '#2b160f',
        roughness: 0.48,
        metalness: 0.15,
      }),
    [leatherTexture, leatherNormalMap]
  );

  // Spine front/back material — decorative bands only, no text
  const spineFrontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: spineFrontTexture,
        normalMap: leatherNormalMap,
        normalScale: new THREE.Vector2(0.2, 0.2),
        roughness: 0.45,
        metalness: 0.18,
      }),
    [spineFrontTexture, leatherNormalMap]
  );

  // Spine side material — "Word's Worth" text reading top to bottom
  const spineSideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: spineSideTexture,
        normalMap: leatherNormalMap,
        normalScale: new THREE.Vector2(0.2, 0.2),
        roughness: 0.45,
        metalness: 0.18,
      }),
    [spineSideTexture, leatherNormalMap]
  );

  // BoxGeometry material order: [+X, -X, +Y, -Y, +Z, -Z]
  const spineMaterials = useMemo(
    () => [
      spineSideMaterial,    // +X (right side face)
      spineSideMaterial,    // -X (left side face)
      leatherMaterial,      // +Y (top edge)
      leatherMaterial,      // -Y (bottom edge)
      spineFrontMaterial,   // +Z (front face — bands only)
      spineFrontMaterial,   // -Z (back face — bands only)
    ],
    [spineSideMaterial, leatherMaterial, spineFrontMaterial]
  );

  // Front cover material — unified baked texture with leather normal map
  const coverFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: coverTexture,
        normalMap: leatherNormalMap,
        normalScale: new THREE.Vector2(0.25, 0.25),
        roughness: 0.45,
        metalness: 0.18,
      }),
    [coverTexture, leatherNormalMap]
  );


  const pageRimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e4d2aa',
        roughness: 0.9,
      }),
    []
  );

  // Right page material
  const rightPageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: pageTextures[0],
        roughness: 0.75,
        metalness: 0.02,
        side: THREE.FrontSide,
      }),
    [pageTextures]
  );

  // Left page material
  const leftPageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: blankBackTexture,
        roughness: 0.75,
        metalness: 0.02,
        side: THREE.FrontSide,
      }),
    [blankBackTexture]
  );

  // Dedicated inside front cover endpaper material
  const insideCoverMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: blankBackTexture,
        roughness: 0.75,
        metalness: 0.02,
        side: THREE.FrontSide,
      }),
    [blankBackTexture]
  );

  // Dynamic page-curl material for flip animation
  const curlMaterial = useMemo(
    () =>
      createPageCurlMaterial(
        pageTextures[0],
        blankBackTexture,
        pageWidth,
        new THREE.Vector3(-1.85, 1.33, 0.35)
      ),
    [pageTextures, blankBackTexture, pageWidth]
  );

  // Single subdivided plane for curl vertex deformation
  // Pivot is offset so x = 0 is at the spine edge
  const curlPageGeometry = useMemo(() => {
    // 64 segments along X for ultra-smooth cylinder curl bending
    const geo = new THREE.PlaneGeometry(pageWidth, pageHeight, 64, 16);
    // Translate geometry so origin is at spine hinge (left edge)
    geo.translate(pageWidth / 2, 0, 0);
    return geo;
  }, [pageWidth, pageHeight]);

  // Standard flat page geometry (for left & right resting pages)
  const flatPageGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(pageWidth, pageHeight, 2, 2);
    geo.translate(pageWidth / 2, 0, 0);
    return geo;
  }, [pageWidth, pageHeight]);

  // Left page geometry pivoted at spine edge and mirrored
  const leftPageGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(pageWidth, pageHeight, 2, 2);
    // Left page sits on the left side of spine (x from -pageWidth to 0)
    geo.translate(-pageWidth / 2, 0, 0);
    return geo;
  }, [pageWidth, pageHeight]);

  // ── Sync Candle Flicker to Curl Shader ─────────────────
  useFrame(() => {
    if (curlMaterial && curlMaterial.uniforms) {
      curlMaterial.uniforms.uCandleIntensity.value = candleIntensity;
    }
  });

  // ── Handle Book Open / Close Animations ─────────────────
  useEffect(() => {
    if (!frontCoverPivotRef.current) return;

    if (bookState === 'opening') {
      // Rotate cover open around spine edge: 0 -> -Math.PI * 0.965 (~174 deg)
      gsap.to(frontCoverPivotRef.current.rotation, {
        y: -Math.PI * 0.965,
        duration: 1.1,
        ease: 'power2.inOut',
        onComplete: () => {
          setBookState('open');
          setCameraState('reading');
        },
      });
    } else if (bookState === 'closing') {
      // Close cover back to 0
      gsap.to(frontCoverPivotRef.current.rotation, {
        y: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => {
          setBookState('closed');
          setCameraState('wide');
          useBookStore.setState({ currentPage: 0 });
        },
      });
    }
  }, [bookState, setBookState, setCameraState]);

  // ── Handle Page Flip Animations (Next / Prev) ───────────
  useEffect(() => {
    if (!isFlipping || !flipPageRef.current) return;

    const flipMesh = flipPageRef.current;
    flipMesh.visible = true;

    if (flipDirection === 'next') {
      const targetPage = currentPage + 1;
      if (targetPage >= totalPages) {
        setIsFlipping(false);
        return;
      }

      // 1. Flip material uniforms
      curlMaterial.uniforms.uFrontTexture.value = pageTextures[currentPage];
      curlMaterial.uniforms.uBackTexture.value = pageTextures[targetPage] || blankBackTexture;
      curlMaterial.uniforms.uCurlPosition.value = pageWidth * 1.5; // Start flat on right

      // 2. Next page is already revealed underneath on rightPage
      rightPageMaterial.map = pageTextures[targetPage];
      rightPageMaterial.needsUpdate = true;

      // 3. Animate curl sweep from right to left
      gsap.to(curlMaterial.uniforms.uCurlPosition, {
        value: -pageWidth * 0.35,
        duration: 0.75,
        ease: 'power2.inOut',
        onComplete: () => {
          // Update store
          useBookStore.setState({ currentPage: targetPage });

          // Update left page
          leftPageMaterial.map = pageTextures[currentPage];
          leftPageMaterial.needsUpdate = true;

          // Hide flip mesh
          flipMesh.visible = false;
          setIsFlipping(false);
        },
      });
    } else if (flipDirection === 'prev') {
      const targetPage = currentPage - 1;
      if (targetPage < 0) {
        setIsFlipping(false);
        return;
      }

      // Reverse curl: start rolled on left and sweep back to right
      curlMaterial.uniforms.uFrontTexture.value = pageTextures[targetPage];
      curlMaterial.uniforms.uBackTexture.value = pageTextures[currentPage];
      curlMaterial.uniforms.uCurlPosition.value = -pageWidth * 0.35;

      // Immediately prepare right page
      rightPageMaterial.map = pageTextures[targetPage];
      rightPageMaterial.needsUpdate = true;

      gsap.to(curlMaterial.uniforms.uCurlPosition, {
        value: pageWidth * 1.5,
        duration: 0.75,
        ease: 'power2.inOut',
        onComplete: () => {
          useBookStore.setState({ currentPage: targetPage });

          leftPageMaterial.map =
            targetPage > 0 ? pageTextures[targetPage - 1] : blankBackTexture;
          leftPageMaterial.needsUpdate = true;

          flipMesh.visible = false;
          setIsFlipping(false);
        },
      });
    }
  }, [
    isFlipping,
    flipDirection,
    currentPage,
    totalPages,
    curlMaterial,
    pageTextures,
    blankBackTexture,
    pageWidth,
    setIsFlipping,
    leftPageMaterial,
    rightPageMaterial,
  ]);

  // ── Handle Direct Bookmark Jumps (Rapid Jump) ───────────
  useEffect(() => {
    if (isFlipping) return;

    // Update left & right resting pages
    rightPageMaterial.map = pageTextures[currentPage] || pageTextures[0];
    rightPageMaterial.needsUpdate = true;

    // Left page renders the visual scrapbook page corresponding to the current spread
    const leftTex = getScrapbookLeftPageTexture(currentPage);
    leftPageMaterial.map = leftTex;
    leftPageMaterial.needsUpdate = true;

    // Also update inside cover so when first opened on spread 0, inside cover shows spread 0 left page
    insideCoverMaterial.map = getScrapbookLeftPageTexture(0);
    insideCoverMaterial.needsUpdate = true;
  }, [currentPage, isFlipping, pageTextures, leftPageMaterial, rightPageMaterial, insideCoverMaterial]);

  // Click handler for closed book
  const handleBookClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (bookState === 'closed') {
      openBook();
    }
  };

  return (
    <group ref={bookGroupRef} position={position} rotation={rotation}>
      {/* ── Invisible Enlarged Hitbox for Mobile / Desktop Clicks ── */}
      <mesh
        position={[0, 0, 0.05]}
        onClick={handleBookClick}
        onPointerOver={() => {
          if (bookState === 'closed') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
        visible={false}
      >
        <boxGeometry args={[coverWidth * 2.2, coverHeight * 1.1, 0.4]} />
      </mesh>

      {/* ── 1. Spine (Static, acts as center hinge) ── */}
      <mesh position={[0, 0, -spineThickness / 2]} material={spineMaterials} castShadow>
        <boxGeometry args={[0.07, coverHeight, spineThickness]} />
      </mesh>

      {/* ── 2. Back Cover (Static, flat on stand) ── */}
      <RoundedBox
        args={[coverWidth, coverHeight, coverThickness]}
        radius={0.008}
        smoothness={2}
        position={[coverWidth / 2 + 0.035, 0, -spineThickness]}
        material={leatherMaterial}
        receiveShadow
      />

      {/* ── 3. Page Stack Rim (Gives physical depth of pages on right) ── */}
      <group position={[0, 0, -spineThickness + 0.03]}>
        <mesh position={[pageWidth / 2 + 0.02, 0, 0.03]} material={pageRimMaterial}>
          <boxGeometry args={[pageWidth - 0.04, pageHeight - 0.04, 0.06]} />
        </mesh>
      </group>

      {/* ── 4. Left Side Page Block Rim (only when open and pages turned past Page 1) ── */}
      {bookState === 'open' && currentPage > 0 && (
        <group position={[-pageWidth / 2 - 0.03, 0, -spineThickness + 0.06]}>
          <mesh material={pageRimMaterial}>
            <boxGeometry args={[pageWidth - 0.02, pageHeight - 0.04, 0.04]} />
          </mesh>
        </group>
      )}

      {/* ── 5. Active Page Pool (Left, Right, Flipping) ── */}
      {bookState !== 'closed' && (
        <group position={[0, 0, -0.015]}>
          {/* Left Resting Page (only visible when turned past Page 1; on Page 1 the inside cover is shown) */}
          <mesh
            ref={leftPageRef}
            position={[-0.035, 0, 0.002]} // Z-offset: +0.002
            geometry={leftPageGeometry}
            material={leftPageMaterial}
            visible={bookState === 'open' && currentPage > 0}
            receiveShadow
          />

          {/* Right Resting Page (shows current active page) */}
          <mesh
            ref={rightPageRef}
            position={[0.035, 0, 0.004]} // Z-offset: +0.004
            geometry={flatPageGeometry}
            material={rightPageMaterial}
            receiveShadow
          />

          {/* Flipping Page (vertex-deformation page curl plane) */}
          <mesh
            ref={flipPageRef}
            position={[0.035, 0, 0.006]} // Z-offset: +0.006
            geometry={curlPageGeometry}
            material={curlMaterial}
            visible={false}
            castShadow
          />

          {/* Roman Numeral Ribbon Bookmark Tabs along right edge */}
          <RibbonBookmarks
            visible={bookState === 'open'}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
          />
        </group>
      )}

      {/* ── 6. Front Cover (Hinged at spine left edge) ── */}
      <group ref={frontCoverPivotRef} position={[0.035, 0, 0]}>
        {/* Cover Board (back leather) */}
        <RoundedBox
          args={[coverWidth, coverHeight, coverThickness]}
          radius={0.008}
          smoothness={2}
          position={[coverWidth / 2, 0, coverThickness / 2]}
          material={leatherMaterial}
          castShadow
          receiveShadow
        />

        {/* ── Front Cover Face — Single Unified Baked Texture ── */}
        {/* All borders, ornaments, text, and logo are baked into one canvas
            so the entire surface reacts to scene lighting uniformly */}
        <mesh
          position={[coverWidth / 2, 0, coverThickness + 0.003]}
          material={coverFaceMaterial}
          receiveShadow
        >
          <planeGeometry args={[coverWidth - 0.02, coverHeight - 0.02]} />
        </mesh>

        {/* ── Inside Cover Endpaper (Parchment lining inside face) ── */}
        {/* Swings seamlessly with the front cover as it opens */}
        <mesh
          position={[coverWidth / 2, 0, -0.002]}
          rotation={[0, Math.PI, 0]}
          material={insideCoverMaterial}
          receiveShadow
        >
          <planeGeometry args={[coverWidth - 0.04, coverHeight - 0.04]} />
        </mesh>
      </group>
    </group>
  );
};
