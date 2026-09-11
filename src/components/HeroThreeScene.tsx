'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroThreeSceneProps {
  className?: string;
}

/**
 * A blueprint-wireframe laptop that assembles itself on mount — the base pops
 * in, then the screen swings open — before settling into the same drag/pulse
 * interaction the rest of the hero has always had.
 */
export default function HeroThreeScene({ className }: HeroThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = container.clientWidth || 360;
    let height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.35, 6.4);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
    const getColors = () => {
      const dark = isDark();
      return {
        chassis: dark ? 0x38bdf8 : 0x0284c7,
        screenFrame: dark ? 0x60a5fa : 0x2563eb,
        glass: dark ? 0x3b82f6 : 0x2563eb,
        ui: dark ? 0x34d399 : 0x059669,
        particles: dark ? 0x93c5fd : 0x475569,
      };
    };
    let colors = getColors();

    // -------------------------------------------------------------------------
    // 1. The laptop — base, hinge and screen, built from primitives.
    // -------------------------------------------------------------------------
    const laptop = new THREE.Group();
    scene.add(laptop);

    // Base (keyboard deck)
    const baseGroup = new THREE.Group();
    baseGroup.position.y = -0.42;
    laptop.add(baseGroup);

    const baseW = 2.7;
    const baseD = 1.7;
    const baseGeo = new THREE.BoxGeometry(baseW, 0.12, baseD);
    const baseEdges = new THREE.EdgesGeometry(baseGeo);
    const chassisMat = new THREE.LineBasicMaterial({ color: colors.chassis, transparent: true, opacity: 0.8 });
    const baseMesh = new THREE.LineSegments(baseEdges, chassisMat);
    baseGroup.add(baseMesh);

    // Keyboard grid, inset on the deck's top face
    const kbGrid = new THREE.GridHelper(baseW * 0.72, 8, colors.ui, colors.chassis);
    (kbGrid.material as THREE.Material).transparent = true;
    (kbGrid.material as THREE.Material).opacity = 0.35;
    kbGrid.scale.z = (baseD * 0.6) / (baseW * 0.72);
    kbGrid.position.set(0, 0.065, 0.08);
    baseGroup.add(kbGrid);

    // Trackpad outline
    const padShape: THREE.Vector3[] = [
      new THREE.Vector3(-0.42, 0.065, 0.58),
      new THREE.Vector3(0.42, 0.065, 0.58),
      new THREE.Vector3(0.42, 0.065, 0.78),
      new THREE.Vector3(-0.42, 0.065, 0.78),
      new THREE.Vector3(-0.42, 0.065, 0.58),
    ];
    const padGeo = new THREE.BufferGeometry().setFromPoints(padShape);
    const padMat = new THREE.LineBasicMaterial({ color: colors.ui, transparent: true, opacity: 0.55 });
    baseGroup.add(new THREE.Line(padGeo, padMat));

    // Screen, pivoting from the hinge edge at the back of the base
    const screenPivot = new THREE.Group();
    screenPivot.position.set(0, -0.36, -baseD / 2);
    laptop.add(screenPivot);

    const screenW = 2.7;
    const screenH = 1.68;
    const screenGeo = new THREE.BoxGeometry(screenW, screenH, 0.08).translate(0, screenH / 2, 0);
    const screenEdges = new THREE.EdgesGeometry(screenGeo);
    const screenFrameMat = new THREE.LineBasicMaterial({ color: colors.screenFrame, transparent: true, opacity: 0.85 });
    const screenFrame = new THREE.LineSegments(screenEdges, screenFrameMat);
    screenPivot.add(screenFrame);

    // Glowing "glass" panel, inset within the frame
    const glassGeo = new THREE.PlaneGeometry(screenW * 0.88, screenH * 0.85).translate(0, screenH * 0.52, 0.045);
    const glassMat = new THREE.MeshBasicMaterial({
      color: colors.glass,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    screenPivot.add(glass);

    // A handful of "interface" lines on the glass — reads as an editor/dashboard
    const uiLines: THREE.Line[] = [];
    const uiLineWidths = [0.78, 0.56, 0.68, 0.4, 0.6];
    uiLineWidths.forEach((w, i) => {
      const yLocal = screenH * 0.88 - i * 0.2;
      const pts = [
        new THREE.Vector3(-screenW * 0.36, yLocal, 0.05),
        new THREE.Vector3(-screenW * 0.36 + w, yLocal, 0.05),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: i === 0 ? colors.ui : colors.screenFrame,
        transparent: true,
        opacity: 0.7,
      });
      const line = new THREE.Line(geo, mat);
      screenPivot.add(line);
      uiLines.push(line);
    });

    // Webcam dot
    const camDotGeo = new THREE.CircleGeometry(0.02, 16).translate(0, screenH - 0.08, 0.05);
    const camDotMat = new THREE.MeshBasicMaterial({ color: colors.ui, transparent: true, opacity: 0.9 });
    screenPivot.add(new THREE.Mesh(camDotGeo, camDotMat));

    // Hinge angles: closed = screen lying flat over the keyboard; open = tilted back.
    const CLOSED_ANGLE = Math.PI / 2;
    const OPEN_ANGLE = -0.12 * Math.PI;
    screenPivot.rotation.x = CLOSED_ANGLE;

    // Ambient orbiting particle cloud, echoing the rest of the hero's blueprint motif
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.1 + Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleSpeeds[i * 3] = (Math.random() - 0.5) * 0.003;
      particleSpeeds[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      particleSpeeds[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: colors.particles,
      size: 0.032,
      transparent: true,
      opacity: 0,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // -------------------------------------------------------------------------
    // 2. Assemble-on-mount animation state
    // -------------------------------------------------------------------------
    laptop.scale.setScalar(prefersReducedMotion ? 1 : 0.001);
    laptop.position.y = prefersReducedMotion ? 0 : -0.5;
    let assembleT = prefersReducedMotion ? 1 : 0;
    const ASSEMBLE_DURATION = 1.9; // seconds
    const easeOutBack = (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    if (prefersReducedMotion) {
      screenPivot.rotation.x = OPEN_ANGLE;
      particleMat.opacity = 0.6;
    }

    // -------------------------------------------------------------------------
    // 3. Physics, inertia & pointer tracking (drag to rotate, click to pulse)
    // -------------------------------------------------------------------------
    let targetRotX = 0.15;
    let targetRotY = 0.35;
    let currentRotX = 0.15;
    let currentRotY = 0.35;
    let mouseX = 0;
    let mouseY = 0;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    let pulseScale = 1;
    let pulseVelocity = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      pulseVelocity = 1.1;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.006;
        targetRotX += deltaY * 0.006;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        targetRotY = 0.35 + mouseX * 0.5;
        targetRotX = 0.15 - mouseY * 0.3;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // -------------------------------------------------------------------------
    // 4. Theme mutation observer
    // -------------------------------------------------------------------------
    const updateThemeColors = () => {
      colors = getColors();
      chassisMat.color.setHex(colors.chassis);
      screenFrameMat.color.setHex(colors.screenFrame);
      glassMat.color.setHex(colors.glass);
      padMat.color.setHex(colors.ui);
      camDotMat.color.setHex(colors.ui);
      particleMat.color.setHex(colors.particles);
      uiLines.forEach((line, i) => {
        (line.material as THREE.LineBasicMaterial).color.setHex(i === 0 ? colors.ui : colors.screenFrame);
      });
    };
    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') updateThemeColors();
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    // -------------------------------------------------------------------------
    // 5. Resize handling
    // -------------------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // -------------------------------------------------------------------------
    // 6. Visibility — pause when off-screen
    // -------------------------------------------------------------------------
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);

    // -------------------------------------------------------------------------
    // 7. Animation loop
    // -------------------------------------------------------------------------
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      // Clamp delta: a backgrounded/throttled tab (e.g. mid-screenshot in a
      // headless harness) can hand back a multi-second gap, which would
      // otherwise spike the spring below into a single-frame runaway.
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Assemble-on-mount: pop the chassis in, then swing the screen open.
      if (assembleT < 1) {
        assembleT = Math.min(1, assembleT + delta / ASSEMBLE_DURATION);
        const popT = Math.min(1, assembleT / 0.6);
        laptop.scale.setScalar(Math.max(0.001, easeOutBack(popT)));
        laptop.position.y = THREE.MathUtils.lerp(-0.5, 0, easeOutCubic(popT));

        const openT = Math.max(0, Math.min(1, (assembleT - 0.35) / 0.65));
        screenPivot.rotation.x = THREE.MathUtils.lerp(CLOSED_ANGLE, OPEN_ANGLE, easeOutCubic(openT));

        particleMat.opacity = 0.6 * easeOutCubic(Math.max(0, (assembleT - 0.5) / 0.5));
      }

      if (Math.abs(pulseVelocity) > 0.0005 || Math.abs(pulseScale - 1) > 0.0005) {
        const springForce = (1 - pulseScale) * 90;
        const damping = 12;
        pulseVelocity += (springForce - damping * pulseVelocity) * delta;
        pulseScale += pulseVelocity * delta;
        pulseScale = THREE.MathUtils.clamp(pulseScale, 0.7, 1.3);
      } else {
        pulseScale = 1;
        pulseVelocity = 0;
      }

      const lerpFactor = prefersReducedMotion ? 0.01 : 0.06;
      currentRotX += (targetRotX - currentRotX) * lerpFactor;
      currentRotY += (targetRotY - currentRotY) * lerpFactor;

      if (!isDragging && !prefersReducedMotion) {
        targetRotY += 0.0015;
      }

      laptop.rotation.x = currentRotX;
      laptop.rotation.y = currentRotY;
      const finalScale = (assembleT < 1 ? laptop.scale.x : 1) * pulseScale;
      laptop.scale.setScalar(Math.max(0.001, finalScale));

      // Gentle drift on the ambient particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleSpeeds[i * 3];
        positions[i * 3 + 1] += particleSpeeds[i * 3 + 1];
        positions[i * 3 + 2] += particleSpeeds[i * 3 + 2];
        const distSq =
          positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2;
        if (distSq > 12 || distSq < 3) {
          particleSpeeds[i * 3] *= -1;
          particleSpeeds[i * 3 + 1] *= -1;
          particleSpeeds[i * 3 + 2] *= -1;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // The UI lines on screen breathe gently once the laptop has opened
      if (assembleT >= 1 && !prefersReducedMotion) {
        uiLines.forEach((line, i) => {
          const mat = line.material as THREE.LineBasicMaterial;
          mat.opacity = 0.55 + Math.sin(elapsed * 1.4 + i) * 0.15;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      baseGeo.dispose();
      baseEdges.dispose();
      chassisMat.dispose();
      (kbGrid.geometry as THREE.BufferGeometry).dispose();
      (kbGrid.material as THREE.Material).dispose();
      padGeo.dispose();
      padMat.dispose();
      screenGeo.dispose();
      screenEdges.dispose();
      screenFrameMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      uiLines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      camDotGeo.dispose();
      camDotMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className ?? ''}`}>
      <div
        ref={mountRef}
        className="relative h-full w-full cursor-grab active:cursor-grabbing touch-none"
        title="Elemento 3D Interativo: arraste para rotacionar, clique para pulsar"
      />

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-[0.625rem] font-mono tracking-wider text-[var(--ink-3)]">
        <div className="flex items-center gap-1.5 rounded-md bg-[var(--card)]/80 backdrop-blur-md px-2 py-1 border border-[var(--rule)]/60 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          <span className="uppercase font-semibold text-[var(--ink)]">Blueprint Workstation</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-md bg-[var(--card)]/80 backdrop-blur-md px-2 py-1 border border-[var(--rule)]/60 shadow-sm">
          <span>{isInteracting ? 'Rotacionando...' : 'Arraste para girar'}</span>
        </div>
      </div>
    </div>
  );
}
