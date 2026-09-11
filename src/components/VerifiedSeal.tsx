'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VerifiedSealProps {
  size?: number;
  className?: string;
}

/**
 * A small rotating 3D seal — a ring, an inner diamond core and a check mark —
 * stamped over the diploma preview. Purely decorative and ambient: it never
 * asks for interaction, pauses off-screen, and freezes under
 * prefers-reduced-motion instead of just slowing down.
 */
export default function VerifiedSeal({ size = 88, className }: VerifiedSealProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
    const getColors = () => {
      const dark = isDark();
      return {
        ring: dark ? 0x60a5fa : 0x2563eb,
        core: dark ? 0x34d399 : 0x059669,
        check: dark ? 0xf8fafc : 0xffffff,
      };
    };
    let colors = getColors();

    const group = new THREE.Group();
    scene.add(group);

    // Outer ring — the seal's rim
    const ringGeo = new THREE.TorusGeometry(1.3, 0.09, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: colors.ring });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    // Notched inner rim, evenly spaced — reads as a coin/medal edge
    const notchGeo = new THREE.BoxGeometry(0.06, 0.16, 0.16);
    const notchMat = new THREE.MeshBasicMaterial({ color: colors.ring, transparent: true, opacity: 0.55 });
    const notches = new THREE.Group();
    const notchCount = 16;
    for (let i = 0; i < notchCount; i++) {
      const notch = new THREE.Mesh(notchGeo, notchMat);
      const angle = (i / notchCount) * Math.PI * 2;
      notch.position.set(Math.cos(angle) * 1.55, Math.sin(angle) * 1.55, 0);
      notch.rotation.z = angle;
      notches.add(notch);
    }
    group.add(notches);

    // Inner diamond core
    const coreGeo = new THREE.OctahedronGeometry(0.6, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: colors.core, wireframe: true });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Checkmark, built from two short bars
    const checkMat = new THREE.MeshBasicMaterial({ color: colors.check });
    const checkGroup = new THREE.Group();
    const barShort = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.09, 0.09), checkMat);
    barShort.position.set(-0.16, -0.06, 0.62);
    barShort.rotation.z = Math.PI / 4;
    const barLong = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.09, 0.09), checkMat);
    barLong.position.set(0.14, 0.1, 0.62);
    barLong.rotation.z = -Math.PI / 4;
    checkGroup.add(barShort, barLong);
    group.add(checkGroup);

    const updateThemeColors = () => {
      colors = getColors();
      ringMat.color.setHex(colors.ring);
      notchMat.color.setHex(colors.ring);
      coreMat.color.setHex(colors.core);
      checkMat.color.setHex(colors.check);
    };
    const themeObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') updateThemeColors();
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible || prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      const elapsed = clock.getElapsedTime();
      group.rotation.z = elapsed * 0.15;
      core.rotation.x = elapsed * 0.6;
      core.rotation.y = elapsed * 0.8;
      checkGroup.rotation.z = -elapsed * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      ringGeo.dispose();
      ringMat.dispose();
      notchGeo.dispose();
      notchMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      checkMat.dispose();
      barShort.geometry.dispose();
      barLong.geometry.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className ?? ''}`}
      style={{ width: size, height: size }}
    />
  );
}
