import React from 'react';

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const WebGLFallback: React.FC = () => {
  return (
    <div className="webgl-fallback-container">
      <div className="fallback-card">
        <div className="fallback-logo-wrapper">
          <img
            src="/logo-white.png"
            alt="Word's Worth Logo"
            className="fallback-logo"
          />
        </div>
        <h2 className="fallback-subtitle">
          English Literary Club • KLE Technological University
        </h2>
        <div className="fallback-divider"></div>
        <p className="fallback-message">
          This experience requires WebGL 3D graphics hardware acceleration to render the
          interactive 3D magic book and candlelight study scene.
        </p>
        <p className="fallback-hint">
          Please open this page in a modern WebGL-supported browser such as Google Chrome,
          Mozilla Firefox, Microsoft Edge, or Apple Safari.
        </p>
        <div className="fallback-links">
          <a
            href="https://www.instagram.com/wordsworth_kletech"
            target="_blank"
            rel="noreferrer"
            className="fallback-btn"
          >
            Visit Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/wordsworth-englishclub/"
            target="_blank"
            rel="noreferrer"
            className="fallback-btn"
          >
            Visit LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};
