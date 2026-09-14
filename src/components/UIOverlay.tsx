import React, { useEffect, useRef } from 'react';
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
  const soundOn = useBookStore((s) => s.soundOn);
  const toggleSound = useBookStore((s) => s.toggleSound);
  const cameraState = useBookStore((s) => s.cameraState);
  const standUp = useBookStore((s) => s.standUp);
  const sitAtDesk = useBookStore((s) => s.sitAtDesk);
  const closeWindow = useBookStore((s) => s.closeWindow);

  // Audio Context for ambient library fireplace crackle / chime
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

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
          if (e.key === 'Enter') {
            e.preventDefault();
            sitAtDesk();
          }
        } else if (cameraState === 'window') {
          if (e.key === 'Escape') {
            e.preventDefault();
            closeWindow();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookState, cameraState, nextPage, prevPage, closeBook, openBook, standUp, sitAtDesk, closeWindow]);

  // Ambient sound synthesis toggle
  useEffect(() => {
    if (soundOn) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Generate gentle warm noise (fireplace / breeze murmur)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise filter
          lastOut = output[i];
          output[i] *= 0.15; // Soft volume
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Warm muffled sound

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
      } catch (err) {
        console.warn('Audio synthesis note:', err);
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
        } catch {
          // ignore
        }
        noiseNodeRef.current = null;
      }
    }

    return () => {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
        } catch {
          // ignore
        }
      }
    };
  }, [soundOn]);

  const isOpen = bookState === 'open';

  return (
    <div className="ui-overlay-container">
      {/* ── Bottom Control Bar (Visible when book is open) ─ */}
      <nav className={`bottom-nav-bar ${isOpen ? 'visible' : ''}`}>
        {/* Sound Toggle */}
        <button
          className={`nav-btn sound-btn ${soundOn ? 'active' : ''}`}
          onClick={toggleSound}
          title={soundOn ? 'Mute ambient sound' : 'Enable ambient sound'}
        >
          <span className="btn-icon">{soundOn ? '🔊' : '🔈'}</span>
          <span className="btn-label">SOUND: {soundOn ? 'ON' : 'OFF'}</span>
        </button>

        <div className="nav-divider"></div>

        {/* Previous Page Button */}
        <button
          className="nav-btn prev-btn"
          onClick={prevPage}
          disabled={!isOpen || currentPage === 0 || isFlipping}
          title="Previous Page (←)"
        >
          <span className="btn-icon">‹</span>
          <span className="btn-label">PREVIOUS</span>
        </button>

        {/* Page Indicator */}
        <div className="page-indicator">
          <span className="page-roman">PAGE {toRoman(currentPage + 1)}</span>
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

        <div className="nav-divider"></div>

        {/* Close Book Button */}
        <button
          className="nav-btn close-btn"
          onClick={closeBook}
          disabled={!isOpen || isFlipping}
          title="Close Book (Esc)"
        >
          <span className="btn-icon">✕</span>
          <span className="btn-label">CLOSE BOOK</span>
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
    </div>
  );
};
