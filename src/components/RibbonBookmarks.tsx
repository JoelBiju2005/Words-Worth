import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { toRoman } from '../utils/proceduralTextures';
import { useBookStore } from '../store/useBookStore';
import type { RibbonTabInfo } from '../types';

interface RibbonBookmarksProps {
  visible: boolean;
  pageWidth: number;
  pageHeight: number;
}

// 9 Rich literary section colors
const TAB_COLORS = [
  '#c69214', // I: Title - Antique Gold
  '#872c1c', // II: About - Crimson
  '#1b4d3e', // III: Mission - Brunswick Green
  '#2a4b7c', // IV: Domains - Royal Navy
  '#782d65', // V: Team - Royal Plum
  '#8a4b16', // VI: Achievements I - Russet Amber
  '#4a2e7c', // VII: Achievements II - Deep Indigo
  '#305858', // VIII: Gallery - Deep Teal
  '#997328', // IX: Contact - Burnished Brass
];

export const RibbonBookmarks: React.FC<RibbonBookmarksProps> = ({
  visible,
  pageWidth,
  pageHeight,
}) => {
  const goToPage = useBookStore((s) => s.goToPage);
  const isFlipping = useBookStore((s) => s.isFlipping);
  const currentPage = useBookStore((s) => s.currentPage);

  // ExtrudeGeometry for ribbon tab:
  // Base at x = -0.015 (tucked under page edge), extends outward to +X = 0.138
  // Outer edge has a V-notch cut into the tip
  const ribbonGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const tabLength = 0.138; // How far it projects outside the page
    const tabHeight = 0.082; // Vertical height along Y
    const halfH = tabHeight / 2;
    const notchDepth = 0.025; // V-notch cut into the outer tip

    // Start at inner top (tucked under page)
    shape.moveTo(-0.015, halfH);
    // Outer top corner
    shape.lineTo(tabLength, halfH);
    // V-notch tip cut inward
    shape.lineTo(tabLength - notchDepth, 0);
    // Outer bottom corner
    shape.lineTo(tabLength, -halfH);
    // Inner bottom corner
    shape.lineTo(-0.015, -halfH);
    // Close back to inner top
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.005,
      bevelEnabled: true,
      bevelThickness: 0.001,
      bevelSize: 0.001,
      bevelSegments: 1,
    });
  }, []);

  const tabs: RibbonTabInfo[] = useMemo(() => {
    return TAB_COLORS.map((color, idx) => ({
      index: idx,
      numeral: toRoman(idx + 1),
      color,
      label: `Section ${toRoman(idx + 1)}`,
    }));
  }, []);

  if (!visible) return null;

  // Stagger along the right edge of page
  const startY = pageHeight * 0.40;
  const spacingY = (pageHeight * 0.80) / 8.5;

  return (
    // Attached precisely at the right edge of the page (x = pageWidth + 0.035)
    // Projecting OUTWARD into the space to the right!
    <group position={[pageWidth + 0.035, 0, 0.002]}>
      {tabs.map((tab, idx) => {
        const posY = startY - idx * spacingY;
        const isSelected = currentPage === idx;
        // When selected, extends slightly further out
        const tabX = isSelected ? 0.018 : 0.0;
        // Z-offset to prevent any z-fighting between adjacent ribbons
        const tabZ = (8 - idx) * 0.0012;

        return (
          <group
            key={idx}
            position={[tabX, posY, tabZ]}
            onClick={(e) => {
              e.stopPropagation();
              if (!isFlipping) {
                goToPage(idx);
              }
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Ribbon tab body protruding outside the page */}
            <mesh geometry={ribbonGeometry} castShadow>
              <meshStandardMaterial
                color={tab.color}
                roughness={0.42}
                metalness={0.18}
                emissive={isSelected ? tab.color : '#000000'}
                emissiveIntensity={isSelected ? 0.35 : 0.0}
              />
            </mesh>

            {/* Vertical gold stitched accent line along inner border */}
            <mesh position={[0.006, 0, 0.006]}>
              <planeGeometry args={[0.003, 0.076]} />
              <meshBasicMaterial color="#d4af37" />
            </mesh>

            {/* Roman numeral centered on the protruding ribbon tab */}
            <Text
              position={[0.052, 0, 0.007]}
              fontSize={0.030}
              color="#fff7db"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.02}
            >
              {tab.numeral}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
