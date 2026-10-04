import React from 'react';
import { useBookStore } from '../store/useBookStore';
import {
  BOOK_PAGES_DATA,
  type ScrapbookPageSpread,
  type ImageSlot,
  type ContentCard,
  type MountStyle,
} from '../data/pages';
import {
  HomeIcon,
  BookIcon,
  TargetIcon,
  MaskIcon,
  TentIcon,
  TrophyIcon,
  MedalIcon,
  SparklesIcon,
  UsersIcon,
  QuillIcon,
  PhotoFrameIcon,
} from './Icons';
import '../styles/scrapbook.css';

/* ═══════════════════════════════════════════════════════════════════════════
 *  BookPageContent — Modular Scrapbook Two-Page Spread Template Engine
 *  ─────────────────────────────────────────────────────────────────────────
 *  Every content spread is driven by BOOK_PAGES_DATA with:
 *  • Left Page: Visual scrapbook side with hand-lettered wobbled title,
 *    variable photo slots (1-4) with realistic mounting (tape/pin/corners),
 *    caption labels, and swappable doodle packs.
 *  • Right Page: Clean, readable modular cards (bullet, stat, paragraph) with
 *    subtly textured card backgrounds and margin accents.
 *  • Swappable Paper Styles: 'parchment' | 'kraft' | 'grid' | 'floral'
 *
 *  ANIMATION: Each element fades in with a staggered "ink-bleed" effect,
 *  appearing as if written/pressed onto the page surface itself.
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ── Icon mapping for index entries (replaces emoji icons) ─────────────── */
const INDEX_ICONS: Record<number, React.ReactNode> = {
  0: <HomeIcon size={16} color="var(--ink-mid)" />,
  1: <BookIcon size={16} color="var(--ink-mid)" />,
  2: <TargetIcon size={16} color="var(--ink-mid)" />,
  3: <MaskIcon size={16} color="var(--ink-mid)" />,
  4: <TentIcon size={16} color="var(--ink-mid)" />,
  5: <TrophyIcon size={16} color="var(--ink-mid)" />,
  6: <SparklesIcon size={16} color="var(--ink-mid)" />,
  7: <MedalIcon size={16} color="var(--ink-mid)" />,
  8: <UsersIcon size={16} color="var(--ink-mid)" />,
};

export const BookPageContent: React.FC = () => {
  const bookState = useBookStore((s) => s.bookState);
  const currentPage = useBookStore((s) => s.currentPage);
  const goToPage = useBookStore((s) => s.goToPage);

  const isOpen = bookState === 'open';
  if (!isOpen) return null;

  const currentSpread: ScrapbookPageSpread =
    BOOK_PAGES_DATA[currentPage] || BOOK_PAGES_DATA[0];

  const leftPaperClass = `paper-${currentSpread.leftPage.paperStyle || 'parchment'}`;
  const rightPaperClass = `paper-${currentSpread.rightPage.paperStyle || 'parchment'}`;

  return (
    <div className="book-page-overlay" key={`spread-${currentPage}`}>
      <div className="book-spread">
        {/* ── Left Page (Visual / Scrapbook Side) ── */}
        <div className="book-page left-page">
          <div className={`page-parchment ${leftPaperClass}`}>
            {currentPage === 0
              ? renderIndexPage(goToPage)
              : renderScrapbookLeftPage(currentSpread)}
          </div>
        </div>

        {/* ── Spine Gutter ── */}
        <div className="book-gutter" />

        {/* ── Right Page (Text / Content Cards Side) ── */}
        <div className="book-page right-page">
          <div className={`page-parchment ${rightPaperClass}`}>
            {currentPage === 0
              ? renderHomePage(currentSpread)
              : renderScrapbookRightPage(currentSpread)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── INDEX / TABLE OF CONTENTS (Left page of Page 0) ────────────────── */
function renderIndexPage(goToPage: (page: number) => void) {
  /* Section color palette — each entry gets a unique accent tint */
  const sectionColors = [
    '#8c6b38', // Home — warm sepia
    '#3a6b8c', // About — teal blue
    '#6b5b3a', // Objectives — earthy olive
    '#8c3a3a', // Events I — muted crimson
    '#3a6b4a', // Events II — forest green
    '#5a3a8c', // Events III — plum
    '#c4782a', // Pleiades — burnt orange
    '#8a6914', // Achievements — antique gold
    '#4a5568', // Team — slate
  ];

  const sections = [
    { page: 0, label: 'About Us', sub: 'Who We Are, Vision & Mission' },
    { page: 1, label: 'The Club', sub: 'Our Essence & Literary Crucible' },
    { page: 2, label: 'Objectives & Clusters', sub: 'Four Pillars of Execution' },
    { page: 3, label: 'Events Archive I', sub: 'Open Mic, De-Battle, WordWhizzle' },
    { page: 4, label: 'Craft & Masterclass', sub: 'Penelope, Workshops, Bootcamps' },
    { page: 5, label: 'Events Archive III', sub: 'WordWhizzle 2.0, De-Battle 2.0' },
    { page: 6, label: 'Pleiades 2025', sub: 'The Annual Literary Conclave' },
    { page: 7, label: 'Achievements', sub: 'National & State Triumphs' },
    { page: 8, label: 'Team & Contact', sub: 'Leadership & Get Involved' },
  ];

  return (
    <div className="index-page">
      {/* Decorative tape accents */}
      <div className="scrap-tape tape-top-left" />
      <div className="scrap-tape tape-bottom-right" style={{ width: 55 }} />

      {/* Header cluster */}
      <div className="index-header-cluster ink-appear" style={{ animationDelay: '0.25s' }}>
        <h2 className="index-title">Table of Contents</h2>
        <div className="index-subtitle-row">
          <span className="index-subtitle-line" />
          <span className="index-subtitle-text">Word's Worth — Vol. I</span>
          <span className="index-subtitle-line" />
        </div>
      </div>

      {/* Ornamental diamond divider */}
      <div
        className="index-ornament ink-appear"
        style={{ animationDelay: '0.4s' }}
      >
        <OrnamentDivider />
      </div>

      {/* Navigation entries */}
      <nav className="index-nav">
        {sections.map((s, idx) => (
          <button
            key={s.page}
            className="index-entry ink-appear"
            style={{
              animationDelay: `${0.5 + idx * 0.07}s`,
              '--entry-accent': sectionColors[idx],
            } as React.CSSProperties}
            onClick={() => goToPage(s.page)}
          >
            <span className="index-numeral">{toRoman(s.page + 1)}</span>
            <div className="index-entry-text">
              <span className="index-label">{s.label}</span>
              {s.sub && <span className="index-sub">{s.sub}</span>}
            </div>
            <span className="index-dot-leader" />
            <span className="index-icon">
              {INDEX_ICONS[s.page] || <QuillIcon size={14} color="var(--ink-light)" />}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom decorative doodle accents */}
      <div className="index-bottom-deco ink-appear" style={{ animationDelay: '1.3s' }}>
        <QuillIcon size={22} color="var(--ink-light)" className="index-doodle-quill" />
        <span className="index-bottom-text">turn the pages</span>
        <BookIcon size={18} color="var(--ink-light)" className="index-doodle-book" />
      </div>

      <div className="scrap-doodle doodle-quill" />
    </div>
  );
}

/* ── ABOUT US PAGE (Right side of Page 0) ─────────────────────────────── */
function renderHomePage(spread: ScrapbookPageSpread) {
  return (
    <div className="section-right about-page">
      <div className="scrap-tape tape-top-right" />
      <div className="scrap-pin pin-top-left" />

      {/* Hero Title Block */}
      <div className="about-hero ink-appear" style={{ animationDelay: '0.35s' }}>
        <h1 className="about-title">Word's Worth</h1>
        <div className="about-divider-row">
          <span className="about-rule" />
          <OrnamentDivider />
          <span className="about-rule" />
        </div>
        <p className="about-tagline">The English Literary Club</p>
        <p className="about-institution">KLE Technological University, Hubballi</p>
      </div>

      {/* Quote Banner */}
      {spread.rightPage.quote && (
        <div className="about-quote ink-appear" style={{ animationDelay: '0.6s' }}>
          <span className="about-quote-mark">"</span>
          <p className="about-quote-text">{spread.rightPage.quote.text}</p>
          <span className="about-quote-mark closing">"</span>
          {spread.rightPage.quote.attribution && (
            <span className="about-quote-attr">{spread.rightPage.quote.attribution}</span>
          )}
        </div>
      )}

      {/* Modular Content Cards */}
      <div className="about-cards-stack">
        {spread.rightPage.cards.map((card, idx) => (
          <div
            key={idx}
            className="ink-appear"
            style={{ animationDelay: `${0.8 + idx * 0.15}s` }}
          >
            <ContentCardComponent card={card} />
          </div>
        ))}
      </div>

      {/* Bottom flourish */}
      <div className="about-footer ink-appear" style={{ animationDelay: '1.4s' }}>
        <span className="about-rule short" />
        <span className="about-est">Est. 2021</span>
        <span className="about-rule short" />
      </div>

      <div className="scrap-doodle doodle-feather" />
    </div>
  );
}

/* ── REUSABLE LEFT PAGE (Visual Scrapbook Side) ──────────────────────── */
function renderScrapbookLeftPage(spread: ScrapbookPageSpread) {
  const { title, subtitle, doodlePack, imageSlots, extraNotes } = spread.leftPage;

  return (
    <div className="section-left">
      {/* Decorative Washi Tape & Pushpins */}
      <div className="scrap-tape tape-top-left" />
      <div className="scrap-pin pin-top-right" />

      {/* Hand-lettered Section Title with Crayon Accent */}
      <h2
        className="section-title crayon-underline ink-appear"
        style={{ animationDelay: '0.3s' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="section-subtitle ink-appear"
          style={{ animationDelay: '0.45s' }}
        >
          {subtitle}
        </p>
      )}

      {/* Doodle Pack Accent */}
      <DoodlePackIcon pack={doodlePack} />

      {/* Flexible Grid of Photo Slots (1 to 4 slots) */}
      <div className={`slots-container slots-count-${imageSlots.length}`}>
        {imageSlots.map((slot, idx) => (
          <div
            key={slot.id || idx}
            className="ink-appear"
            style={{ animationDelay: `${0.55 + idx * 0.12}s` }}
          >
            <ImageSlotComponent slot={slot} index={idx} />
          </div>
        ))}
      </div>

      {/* Extra handwritten notes or tags if defined */}
      {extraNotes && extraNotes.length > 0 && (
        <div className="extra-notes-row ink-appear" style={{ animationDelay: '0.9s' }}>
          {extraNotes.map((note, idx) => (
            <span key={idx} className="event-mini-badge">
              <StarBullet /> {note}
            </span>
          ))}
        </div>
      )}

      {/* Crayon scribble accent */}
      <div className="scrap-scribble scribble-star" />
    </div>
  );
}

/* ── REUSABLE RIGHT PAGE (Clean Modular Cards Side) ──────────────────── */
function renderScrapbookRightPage(spread: ScrapbookPageSpread) {
  const { title, cards, doodlePack } = spread.rightPage;

  return (
    <div className="section-right">
      <div className="scrap-pin pin-top" />

      {/* Clean section heading */}
      {title && (
        <>
          <h3
            className="content-heading ink-appear"
            style={{ animationDelay: '0.35s' }}
          >
            {title}
          </h3>
          <div
            className="content-divider ink-appear"
            style={{ animationDelay: '0.45s' }}
          />
        </>
      )}

      {/* Modular Content Cards */}
      <div className="modular-cards-stack">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="ink-appear"
            style={{ animationDelay: `${0.5 + idx * 0.15}s` }}
          >
            <ContentCardComponent card={card} />
          </div>
        ))}
      </div>

      {/* Minimal corner doodle accent (never overlapping text) */}
      <div className={`scrap-doodle ${getCornerDoodleClass(doodlePack)}`} />
    </div>
  );
}

/* ── PHOTO SLOT COMPONENT ────────────────────────────────────────────── */
const ImageSlotComponent: React.FC<{ slot: ImageSlot; index: number }> = ({
  slot,
  index,
}) => {
  const mountStyle: MountStyle =
    slot.mountStyle || (index % 3 === 0 ? 'tape' : index % 3 === 1 ? 'corner' : 'pin');

  // Varied subtle rotation between -4deg and +4deg
  const defaultRotation = index % 2 === 0 ? -2.5 : 2.5;
  const rotationDeg = slot.rotation !== undefined ? slot.rotation : defaultRotation;

  const sizeClass =
    slot.aspectRatio === 'wide'
      ? 'placeholder-wide'
      : slot.aspectRatio === 'portrait'
      ? 'placeholder-portrait'
      : slot.aspectRatio === 'square'
      ? 'placeholder-small'
      : 'placeholder-main';

  return (
    <div
      className={`image-placeholder ${sizeClass} mount-${mountStyle}`}
      style={{ transform: `rotate(${rotationDeg}deg)` }}
    >
      {/* Mount Accessories */}
      {mountStyle === 'tape' && (
        <>
          <div className="scrap-tape tape-top-left" style={{ top: -6, left: 10, width: 50 }} />
          <div className="scrap-tape tape-bottom-right" style={{ bottom: -6, right: 10, width: 50 }} />
        </>
      )}
      {mountStyle === 'pin' && (
        <div className="scrap-pin pin-top" style={{ top: -8, left: '50%' }} />
      )}
      {mountStyle === 'corner' && (
        <>
          <div className="photo-corner corner-tl" />
          <div className="photo-corner corner-tr" />
          <div className="photo-corner corner-bl" />
          <div className="photo-corner corner-br" />
        </>
      )}

      {/* Inner Polaroid/Print Frame */}
      <div className="placeholder-inner">
        <PhotoFrameIcon size={28} color="var(--ink-light)" className="placeholder-icon-svg" />
        <span className="placeholder-hint">{slot.caption}</span>
        <span className="placeholder-size">Slot ID: {slot.id}</span>
      </div>

      {/* Angled Sticky-Note Caption Label */}
      <span className="slot-caption-label">{slot.caption}</span>
    </div>
  );
};

/* ── MODULAR CONTENT CARD COMPONENT ──────────────────────────────────── */
const ContentCardComponent: React.FC<{ card: ContentCard }> = ({ card }) => {
  return (
    <div className={`scrap-modular-card card-type-${card.type}`}>
      {card.title && (
        <div className="card-header-row">
          <h4 className="card-title">{card.title}</h4>
          {card.badge && <span className="card-badge">{card.badge}</span>}
        </div>
      )}

      {/* Render based on card type: bullet, stat, or paragraph */}
      {card.type === 'bullet' && Array.isArray(card.text) ? (
        <ul className="card-bullet-list">
          {card.text.map((item, idx) => (
            <li key={idx} className="card-bullet-item">
              {item}
            </li>
          ))}
        </ul>
      ) : card.type === 'stat' && Array.isArray(card.text) ? (
        <div className="stat-card-body">
          <ul className="card-bullet-list">
            {card.text.map((statLine, idx) => (
              <li key={idx} className="card-bullet-item">
                {statLine}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="card-prose">
          {Array.isArray(card.text) ? card.text.join(' ') : card.text}
        </p>
      )}
    </div>
  );
};

/* ── DOODLE PACK RENDERER ────────────────────────────────────────────── */
function DoodlePackIcon({ pack }: { pack: string }) {
  switch (pack) {
    case 'events':
      return <div className="scrap-doodle doodle-mic" />;
    case 'achievements':
      return <div className="scrap-doodle doodle-trophy" />;
    case 'people':
      return <div className="scrap-doodle doodle-people" />;
    case 'contact':
      return <div className="scrap-doodle doodle-envelope" />;
    default:
      return <div className="scrap-doodle doodle-book" />;
  }
}

function getCornerDoodleClass(pack: string): string {
  switch (pack) {
    case 'events':
      return 'doodle-stars';
    case 'achievements':
      return 'doodle-medal';
    case 'contact':
      return 'doodle-handshake';
    default:
      return 'doodle-quill';
  }
}

/* ── Small decorative inline components (replace emojis) ─────────────── */
const OrnamentDivider: React.FC = () => (
  <svg width="80" height="10" viewBox="0 0 80 10" fill="none" stroke="var(--ink-light)" strokeWidth="1" strokeLinecap="round" className="ornament-svg">
    <line x1="4" y1="5" x2="30" y2="5" />
    <polygon points="38,1 42,5 38,9 34,5" fill="var(--ink-light)" stroke="none" />
    <line x1="46" y1="5" x2="76" y2="5" />
  </svg>
);

const StarBullet: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="var(--crayon-orange)" stroke="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }}>
    <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9 3,11 3.5,7.5 1,5 4.5,4.5" />
  </svg>
);

/* Roman numeral helper */
function toRoman(num: number): string {
  const map: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let res = '';
  for (const [val, roman] of map) {
    while (num >= val) {
      res += roman;
      num -= val;
    }
  }
  return res || 'I';
}
