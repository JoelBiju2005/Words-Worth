import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import { useBookStore } from '../store/useBookStore';

import type { CameraState } from '../types';

export const CameraRig: React.FC = () => {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraState = useBookStore((s) => s.cameraState);
  const setIsNearTv = useBookStore((s) => s.setIsNearTv);

  // Targets tracked for lookAt interpolation
  const lookTargetRef = useRef(new THREE.Vector3(0, 0.6, 0));
  const tweenRef = useRef<gsap.core.Timeline | null>(null);

  const getPreset = (state: CameraState) => {
    const aspect = size.width / Math.max(size.height, 1);

    if (state === 'wide') {
      return {
        position: new THREE.Vector3(0, 3.25, 4.45),
        target: new THREE.Vector3(0, 0.85, 0.05),
        duration: 1.2,
      };
    }
    if (state === 'seated') {
      // Perspective of a person sitting in the chair at the desk, looking right across the desktop at the bookstand
      return {
        position: new THREE.Vector3(0, 0.95, 2.15),
        target: new THREE.Vector3(0, 0.72, -0.15),
        duration: 1.2,
      };
    }
    if (state === 'zooming') {
      return {
        position: new THREE.Vector3(0, 2.15, 1.68),
        target: new THREE.Vector3(0, 1.06, -0.45),
        duration: 1.1,
      };
    }
    if (state === 'window') {
      // Peep-out position right at the window opening looking outward
      return {
        position: new THREE.Vector3(-3.85, 1.28, -0.60),
        target: new THREE.Vector3(-8.00, 1.28, -0.60),
        duration: 1.3,
      };
    }
    if (state === 'tv') {
      // Direct front-facing zoom to the TV screen face, like sitting right in front of the TV
      // TV position in Room is [3.12, -0.10, -0.95], rotation around Y is -0.28 rad (-16°)
      // Screen world center is [2.90, 0.05, -0.71]
      // Camera is stationed 1.15m directly along the screen normal
      return {
        position: new THREE.Vector3(2.58, 0.06, 0.40),
        target: new THREE.Vector3(2.90, 0.05, -0.71),
        duration: 1.2,
      };
    }

    // Reading preset:
    // Centered across both pages of the open book spread (left + right page)
    // Book pos [0, 0.70, -0.63], Book center is at x=0, y≈0.58, z≈-0.46
    let x = 0.0;
    let y = 1.08;
    let z = 0.22;

    if (aspect < 1.6) {
      const factor = Math.min(1.6 / aspect, 1.45);
      y = 0.58 + (1.08 - 0.58) * factor;
      z = -0.46 + (0.22 - (-0.46)) * factor;
      x = 0.0;
    }

    return {
      position: new THREE.Vector3(x, y, z),
      target: new THREE.Vector3(0.0, 0.58, -0.46),
      duration: 1.0,
    };
  };

  // 180-degree look angles for window mode
  const targetYawRef = useRef(0); // [-PI/2, PI/2]
  const targetPitchRef = useRef(0); // [-0.35, 0.42]
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);
  const isDraggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Kill existing active tween if state changes
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    const preset = getPreset(cameraState);
    const controls = controlsRef.current;

    if (camera.far < 500) {
      camera.far = 500;
      camera.updateProjectionMatrix();
    }

    if (cameraState === 'wide' || cameraState === 'seated') {
      // Transitioning to wide or seated
      if (controls) {
        controls.enabled = false;
      }

      // Reset window look angles
      targetYawRef.current = 0;
      targetPitchRef.current = 0;
      currentYawRef.current = 0;
      currentPitchRef.current = 0;

      const tl = gsap.timeline({
        onUpdate: () => {
          camera.lookAt(lookTargetRef.current);
          if (controls) {
            controls.target.copy(lookTargetRef.current);
          }
        },
        onComplete: () => {
          if (controls) {
            controls.enabled = true;
            controls.target.copy(preset.target);
          }
        },
      });

      tl.to(
        camera.position,
        {
          x: preset.position.x,
          y: preset.position.y,
          z: preset.position.z,
          duration: preset.duration,
          ease: 'power2.inOut',
        },
        0
      );

      tl.to(
        lookTargetRef.current,
        {
          x: preset.target.x,
          y: preset.target.y,
          z: preset.target.z,
          duration: preset.duration,
          ease: 'power2.inOut',
        },
        0
      );

      tweenRef.current = tl;
    } else {
      // In zooming, reading, or window states, disable free orbit controls
      if (controls) {
        controls.enabled = false;
      }

      const tl = gsap.timeline({
        onUpdate: () => {
          camera.lookAt(lookTargetRef.current);
        },
      });

      tl.to(
        camera.position,
        {
          x: preset.position.x,
          y: preset.position.y,
          z: preset.position.z,
          duration: preset.duration,
          ease: 'power2.inOut',
        },
        0
      );

      tl.to(
        lookTargetRef.current,
        {
          x: preset.target.x,
          y: preset.target.y,
          z: preset.target.z,
          duration: preset.duration,
          ease: 'power2.inOut',
        },
        0
      );

      tweenRef.current = tl;
    }

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [cameraState, camera, size.width, size.height]);

  // Pointer drag listeners for 180° look-around when in window mode
  useEffect(() => {
    if (cameraState !== 'window') return;

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore clicks on UI elements (e.g. close window button)
      if ((e.target as HTMLElement)?.closest('button, a, input')) return;
      isDraggingRef.current = true;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };

      // Dragging right rotates view right (+yaw, towards +Z); dragging left rotates left (-yaw, towards -Z)
      const sensitivity = 0.0028;
      targetYawRef.current = THREE.MathUtils.clamp(
        targetYawRef.current + dx * sensitivity,
        -Math.PI / 2, // 90° left
        Math.PI / 2   // 90° right -> total 180° span
      );

      // Dragging up looks up (+pitch); dragging down looks down (-pitch)
      targetPitchRef.current = THREE.MathUtils.clamp(
        targetPitchRef.current - dy * sensitivity,
        -0.35, // down towards water/path
        0.42   // up towards moon/stars
      );
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [cameraState]);

  // Per-frame camera orientation update
  useFrame(({ clock }) => {
    if (cameraState === 'wide' && controlsRef.current && controlsRef.current.enabled) {
      const t = clock.getElapsedTime();
      // Very gentle organic sway
      const swayX = Math.sin(t * 0.35) * 0.03;
      const swayY = Math.cos(t * 0.4) * 0.02;
      controlsRef.current.target.set(swayX, 0.8 + swayY, 0);
      controlsRef.current.update();
    } else if (cameraState === 'window') {
      // Smoothly interpolate current yaw and pitch toward target with damping
      currentYawRef.current += (targetYawRef.current - currentYawRef.current) * 0.08;
      currentPitchRef.current += (targetPitchRef.current - currentPitchRef.current) * 0.08;

      const yaw = currentYawRef.current;
      const pitch = currentPitchRef.current;

      // Camera is stationed at window opening [-3.85, 1.28, -0.60]
      // Normal outward direction is -X.
      // yaw = 0 -> look [-1, 0, 0]
      // yaw = +PI/2 (+90°) -> look [0, 0, 1] (right along +Z)
      // yaw = -PI/2 (-90°) -> look [0, 0, -1] (left along -Z)
      const lookDist = 5.0;
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      const dirX = -cosPitch * Math.cos(yaw);
      const dirY = sinPitch;
      const dirZ = cosPitch * Math.sin(yaw);

      const lookX = camera.position.x + dirX * lookDist;
      const lookY = camera.position.y + dirY * lookDist;
      const lookZ = camera.position.z + dirZ * lookDist;

      camera.lookAt(lookX, lookY, lookZ);
    }

    // Proximity check to the TV (TV position is roughly [3.12, -0.10, -0.95])
    if (cameraState === 'wide' || cameraState === 'seated') {
      const tvPos = new THREE.Vector3(3.12, 0.0, -0.95);
      const dist = camera.position.distanceTo(tvPos);
      // If camera is within 3.6 units of TV, trigger prompt
      setIsNearTv(dist < 3.6);
    } else {
      setIsNearTv(false);
    }
  });

  const canOrbit = cameraState === 'wide' || cameraState === 'seated';

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableRotate={canOrbit}
      enableZoom={canOrbit}
      minAzimuthAngle={cameraState === 'seated' ? -Math.PI / 2.8 : -Math.PI / 3.4}
      maxAzimuthAngle={cameraState === 'seated' ? Math.PI / 2.8 : Math.PI / 4.5}
      minPolarAngle={cameraState === 'seated' ? Math.PI / 4.5 : Math.PI / 4.2}
      maxPolarAngle={cameraState === 'seated' ? Math.PI / 1.7 : Math.PI / 2.3}
      minDistance={cameraState === 'seated' ? 0.65 : 2.4}
      maxDistance={cameraState === 'seated' ? 3.2 : 5.5}
      dampingFactor={0.06}
      enableDamping
    />
  );
};
