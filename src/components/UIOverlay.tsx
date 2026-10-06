import React, { useEffect } from 'react';
import { useBookStore } from '../store/useBookStore';
import { toRoman } from '../utils/proceduralTextures';

export const UIOverlay: React.FC = () => {
  const bookState = useBookStore((s) => s.bookState);
  const currentPage = useBookStore((s) => s.currentPage);
  const totalPages = useBookStore((s) => s.totalPages);
  const isFlipping = useBookStore((s) => s.isFlipping);
  const nextPage = useBookStore((s) => s.nextPage);
  const prevPage = useBookStore((s) => s.prevPage);
  const closeBook = useBookStore((s) => s.closeBook);
  const openBook = useBookStore((s) => s.openBook);

  const cameraState = useBookStore((s) => s.cameraState);
  const standUp = useBookStore((s) => s.standUp);
  const sitAtDesk = useBookStore((s) => s.sitAtDesk);
  const closeWindow = useBookStore((s) => s.closeWindow);
  const isNearTv = useBookStore((s) => s.isNearTv);
  const isTvHovered = useBookStore((s) => s.isTvHovered);
  const tvPower = useBookStore((s) => s.tvPower);
  const toggleTvPower = useBookStore((s) => s.toggleTvPower);
  const turnTvOnAndZoom = useBookStore((s) => s.turnTvOnAndZoom);
  const leaveTv = useBookStore((s) => s.leaveTv);
  const isTrophyShelfHovered = useBookStore((s) => s.isTrophyShelfHovered);
  const viewTrophyShelf = useBookStore((s) => s.viewTrophyShelf);
  const leaveTrophyShelf = useBookStore((s) => s.leaveTrophyShelf);


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (bookState === 'open') {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          prevPage();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeBook();
        }
      } else if (bookState === 'closed') {
        if (cameraState === 'seated') {
          if (e.key === 'Escape') {
            e.preventDefault();
            standUp();
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openBook();
          }
        } else if (cameraState === 'wide') {
          if ((e.key === 'e' || e.key === 'E') && isNearTv) {
            e.preventDefault();
            turnTvOnAndZoom();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            sitAtDesk();
          }
        } else if (cameraState === 'window') {
          if (e.key === 'Escape') {
            e.preventDefault();
            closeWindow();
          }
        } else if (cameraState === 'tv') {
          if (e.key === 'Escape') {
            e.preventDefault();
            leaveTv();
          } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleTvPower();
          }
        } else if (cameraState === 'trophyShelf') {
          if (e.key === 'Escape') {
            e.preventDefault();
            leaveTrophyShelf();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookState, cameraState, nextPage, prevPage, closeBook, openBook, standUp, sitAtDesk, closeWindow, isNearTv, turnTvOnAndZoom, leaveTv, toggleTvPower, leaveTrophyShelf]);



  const isOpen = bookState === 'open';

  return (
    <div className="ui-overlay-container">
      {/* ── Bottom Control Bar (Visible when book is open) ─ */}
      <nav className={`bottom-nav-bar ${isOpen ? 'visible' : ''}`}>
        {/* Previous Page Button */}
        <button
          className="nav-btn prev-btn"
          onClick={prevPage}
          disabled={!isOpen || currentPage === 0 || isFlipping}
          title="Previous Page (←)"
        >
          <span className="btn-icon">‹</span>
          <span className="btn-label">PREV</span>
        </button>

        {/* Page Indicator */}
        <div className="page-indicator">
          <span className="page-roman">{toRoman(currentPage + 1)}</span>
          <span className="page-count">
            {currentPage + 1} / {totalPages}
          </span>
        </div>

        {/* Next Page Button */}
        <button
          className="nav-btn next-btn"
          onClick={nextPage}
          disabled={!isOpen || currentPage >= totalPages - 1 || isFlipping}
          title="Next Page (→)"
        >
          <span className="btn-label">NEXT</span>
          <span className="btn-icon">›</span>
        </button>

        {/* Close Book Button */}
        <button
          className="nav-btn close-btn"
          onClick={closeBook}
          disabled={!isOpen || isFlipping}
          title="Close Book (Esc)"
        >
          <span className="btn-icon">✕</span>
        </button>
      </nav>

      {/* ── Seated Action Controls (When sitting at the desk with book closed) ── */}
      {cameraState === 'seated' && bookState === 'closed' && (
        <div className="seated-nav-group">
          <button className="stand-up-btn" onClick={standUp} title="Stand up and view the room (Esc)">
            <span className="btn-icon">↖</span>
            <span className="btn-label">STAND UP</span>
          </button>
          <button className="open-volume-btn" onClick={openBook} title="Open Word's Worth Book (Space / Enter)">
            <span className="btn-label">OPEN THE BOOK</span>
          </button>
        </div>
      )}

      {/* ── Window View Controls (When looking through the open window) ── */}
      {cameraState === 'window' && (
        <div className="window-view-controls">
          <div className="window-look-hint">
            <span>Drag horizontally to look 180° outside the window</span>
          </div>
          <button className="close-window-pill-btn" onClick={closeWindow} title="Close window and return to study (Esc)">
            <span className="btn-icon">✕</span>
            <span className="btn-label">CLOSE WINDOW</span>
          </button>
        </div>
      )}

      {/* ── TV Hover / Proximity Prompt (Shown when hovering over the TV or getting close to it) ── */}
      {cameraState !== 'tv' && (isTvHovered || (cameraState === 'wide' && isNearTv)) && (
        <div className="tv-proximity-prompt">
          <button
            className="turn-on-tv-btn watch-tv-btn"
            onClick={turnTvOnAndZoom}
            title="Sit in front of the TV and watch with full audio (Click or press E)"
          >
            <span className="tv-icon">📺</span>
            <span className="tv-prompt-text">WATCH TV</span>
            <span className="tv-badge">Click or [E]</span>
          </button>
        </div>
      )}

      {/* ── TV Screen Zoomed View Controls ── */}
      {cameraState === 'tv' && (
        <div className="tv-view-controls">
          <div className="tv-controls-card">
            <button
              className={`tv-toggle-power-btn ${tvPower ? 'is-on' : 'is-off'}`}
              onClick={toggleTvPower}
              title={tvPower ? 'Turn TV off' : 'Turn TV on'}
            >
              <span className="btn-icon">{tvPower ? '⏸' : '▶'}</span>
              <span className="btn-label">{tvPower ? 'PAUSE / POWER OFF' : 'POWER ON'}</span>
            </button>

            <button
              className="tv-step-back-btn"
              onClick={leaveTv}
              title="Step back from the TV (Esc)"
            >
              <span className="btn-icon">✕</span>
              <span className="btn-label">STEP BACK</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Trophy Shelf Hover Prompt (Shown when hovering over the trophy shelf in wide view) ── */}
      {cameraState === 'wide' && bookState === 'closed' && isTrophyShelfHovered && (
        <div className="trophy-shelf-proximity-prompt">
          <button
            className="view-trophies-btn"
            onClick={viewTrophyShelf}
            title="Inspect literary awards and trophies up close (Click)"
          >
            <span className="shelf-prompt-icon">🏆</span>
            <span className="shelf-prompt-text">EXAMINE AWARDS</span>
            <span className="shelf-prompt-badge">Click</span>
          </button>
        </div>
      )}

      {/* ── Trophy Shelf Zoomed View Controls ── */}
      {cameraState === 'trophyShelf' && (
        <div className="trophy-shelf-view-controls">
          <div className="trophy-shelf-header-card">
            <span className="trophy-shelf-title">AWARDS & RECOGNITION</span>
            <span className="trophy-shelf-subtitle">Word's Worth Literary Society · KLE Technological University</span>
          </div>
          <button
            className="close-shelf-pill-btn"
            onClick={leaveTrophyShelf}
            title="Step back and return to study (Esc)"
          >
            <span className="btn-icon">✕</span>
            <span className="btn-label">STEP BACK</span>
          </button>
        </div>
      )}
    </div>
  );
};
