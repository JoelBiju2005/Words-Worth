import React, { useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { WebGLFallback, isWebGLAvailable } from './components/WebGLFallback';
import './App.css';

export const App: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      setShowLoader(false);
      return;
    }
    // Reliable timer to ensure loading overlay fades out smoothly
    const timer = setTimeout(() => {
      setSceneReady(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 700);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCanvasCreated = () => {
    setSceneReady(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 700);
  };

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  return (
    <main className="app-container">
      {/* ── Antique Loading Screen ──────────────────────── */}
      {showLoader && (
        <div className={`loading-screen ${sceneReady ? 'fade-out' : ''}`}>
          <div className="loading-content">
            <div className="loading-logo-wrapper">
              <img
                src="/logo-white.png"
                alt="Word's Worth Logo"
                className="loading-logo"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <p className="loading-sub">ENGLISH LITERARY CLUB • KLE TECH</p>
            <div className="loading-bar-track">
              <div className="loading-bar-fill"></div>
            </div>
            <span className="loading-status">Preparing the Study...</span>
          </div>
        </div>
      )}

      {/* ── 3D Scene Viewport ───────────────────────────── */}
      <div className="canvas-wrapper">
        <Canvas
          shadows
          camera={{ position: [0, 2.9, 4.2], fov: 48, near: 0.1, far: 500 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            powerPreference: 'high-performance',
          }}
          onCreated={handleCanvasCreated}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Interactive UI Overlay ──────────────────────── */}
      <UIOverlay />
    </main>
  );
};

export default App;
