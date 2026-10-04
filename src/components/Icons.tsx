import React from 'react';

/**
 * Hand-drawn vintage scrapbook line icons & doodles (Pure SVG).
 * Replaces all emoji symbols with authentic pen-and-ink / pencil sketches.
 */

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export const HomeIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" />
    <path d="M9 21v-6a1 1 0 011-1h4a1 1 0 011 1v6" />
    <path d="M17 6.5V4h-2" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="14" y2="10" />
  </svg>
);

export const QuillIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.24 3.76a4 4 0 00-5.65 0L3.5 14.85a1 1 0 00-.28.53l-1.2 5.4a.5.5 0 00.59.59l5.4-1.2a1 1 0 00.53-.28L19.65 8.78a4 4 0 00.59-5.02z" />
    <path d="M12.5 8.5l4 4" />
    <path d="M3.5 20.5l3-3" />
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <path d="M12 2v2m0 16v2m10-10h-2M4 12H2" />
  </svg>
);

export const MaskIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 10c0-3.3 2-6 10-6s10 2.7 10 6c0 6.6-4.5 10-10 10S2 16.6 2 10z" />
    <circle cx="8" cy="10" r="2" />
    <circle cx="16" cy="10" r="2" />
    <path d="M9 15c1.5 1 4.5 1 6 0" />
  </svg>
);

export const MicIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="8" y="2" width="8" height="12" rx="4" />
    <path d="M4 10a8 8 0 0016 0" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
);

export const TentIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L2 20h20L12 2z" />
    <path d="M12 2l4 18M12 2l-4 18" />
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 3h12v7a6 6 0 01-12 0V3z" />
    <path d="M6 5H3a2 2 0 00-2 2v1a4 4 0 004 4h1" />
    <path d="M18 5h3a2 2 0 012 2v1a4 4 0 01-4 4h-1" />
    <line x1="12" y1="16" x2="12" y2="20" />
    <line x1="7" y1="20" x2="17" y2="20" />
  </svg>
);

export const MedalIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="14" r="6" />
    <path d="M8 2l4 6 4-6" />
    <path d="M12 8v1" />
    <path d="M10 14l1.5 1.5L14 12" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
    <path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16z" />
    <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5L5 16z" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="7" r="4" />
    <path d="M2 19a7 7 0 0114 0" />
    <path d="M16 3.13a4 4 0 010 7.75" />
    <path d="M22 19a6.5 6.5 0 00-6-5" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="15" rx="2" />
    <path d="M2 6l10 7 10-7" />
    <path d="M2 17l6-5m14 5l-6-5" />
  </svg>
);

export const PhotoFrameIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, strokeWidth = 1.4 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

export const ButterflyDoodle: React.FC<{ size?: number; className?: string }> = ({ size = 48, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="#2b1a0e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Body */}
    <ellipse cx="32" cy="32" rx="2" ry="12" fill="#2b1a0e" />
    {/* Antennae */}
    <path d="M31 20c-3-6-7-7-10-6m12 6c3-6 7-7 10-6" />
    {/* Left wings */}
    <path d="M31 24C18 12 6 18 10 32c3 10 18 6 21 2" fill="rgba(60, 110, 150, 0.2)" />
    <path d="M31 34C20 36 12 44 16 52c4 7 14 0 15-10" fill="rgba(60, 110, 150, 0.15)" />
    {/* Right wings */}
    <path d="M33 24C46 12 58 18 54 32c-3 10-18 6-21 2" fill="rgba(60, 110, 150, 0.2)" />
    <path d="M33 34C44 36 52 44 48 52c-4 7-14 0-15-10" fill="rgba(60, 110, 150, 0.15)" />
    {/* Wing internal veins */}
    <path d="M30 26C22 22 16 26 18 30m12 0c-6-1-10 1-9 5" opacity="0.6" />
    <path d="M34 26C42 22 48 26 46 30m-12 0c6-1 10 1 9 5" opacity="0.6" />
  </svg>
);

export const ConstellationDoodle: React.FC<{ size?: number; className?: string }> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" stroke="#8a6914" strokeWidth="1.2" strokeDasharray="3 3" className={className}>
    {/* Lines connecting stars */}
    <line x1="15" y1="20" x2="35" y2="15" />
    <line x1="35" y1="15" x2="55" y2="28" />
    <line x1="55" y1="28" x2="68" y2="52" />
    <line x1="35" y1="15" x2="38" y2="48" />
    <line x1="38" y1="48" x2="22" y2="62" />
    {/* Stars */}
    {[[15, 20], [35, 15], [55, 28], [68, 52], [38, 48], [22, 62]].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="2.5" fill="#8a6914" />
        <circle cx={cx} cy={cy} r="4.5" stroke="#d4af37" strokeWidth="0.8" opacity="0.6" />
      </g>
    ))}
  </svg>
);

export const StarDoodle: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="rgba(212, 175, 55, 0.4)" stroke="#8a6914" strokeWidth="1.2" className={className}>
    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
  </svg>
);
