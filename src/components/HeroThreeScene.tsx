'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroThreeSceneProps {
  className?: string;
}

export default function HeroThreeScene({ className }: HeroThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = container.clientWidth || 360;
    let height = container.clientHeight || 360;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    // WebGL Renderer with alpha transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Theme color helper
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    const getColors = () => {
      const dark = isDark();
      return {
        outer: dark ? 0x38bdf8 : 0x0284c7, // Cyan-400 / Sky-600
        inner: dark ? 0x60a5fa : 0x2563eb, // Blue-400 / Blue-600
        nodes: dark ? 0x34d399 : 0x059669, // Emerald-400 / Emerald-600
        particles: dark ? 0x93c5fd : 0x475569, // Light blue / Slate
        glow: dark ? 0x0284c7 : 0x93c5fd,
      };
    };

    let colors = getColors();

    // -------------------------------------------------------------------------
    // 1. 3D Architectural Blueprint Objects
    // -------------------------------------------------------------------------
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Outer Geodesic Icosahedron Wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const wireframeGeo = new THREE.WireframeGeometry(outerGeo);
    const outerLineMat = new THREE.LineBasicMaterial({
      color: colors.outer,
      transparent: true,
      opacity: 0.55,
      linewidth: 1,
    });
    const outerMesh = new THREE.LineSegments(wireframeGeo, outerLineMat);
    rootGroup.add(outerMesh);

    // Outer Vertex Nodes (Points)
    const nodeMat = new THREE.PointsMaterial({
      color: colors.nodes,
      size: 0.05,
      transparent: true,
      opacity: 0.85,
    });
    const outerNodes = new THREE.Points(outerGeo, nodeMat);
    rootGroup.add(outerNodes);

    // Inner Concentric Gyroscope Rings (Core Engine)
    const innerRingGeo1 = new THREE.TorusGeometry(0.95, 0.015, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: colors.inner,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    });
    const innerRing1 = new THREE.Mesh(innerRingGeo1, ringMat1);
    rootGroup.add(innerRing1);

    const innerRingGeo2 = new THREE.TorusGeometry(0.7, 0.015, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: colors.outer,
      transparent: true,
      opacity: 0.5,
      wireframe: true,
    });
    const innerRing2 = new THREE.Mesh(innerRingGeo2, ringMat2);
    innerRing2.rotation.x = Math.PI / 2;
    rootGroup.add(innerRing2);

    // Central Floating Tech Core (Octahedron)
    const coreGeo = new THREE.OctahedronGeometry(0.4, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: colors.nodes,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Ambient Orbiting Particles Cloud
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.9 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      particleSpeeds[i * 3] = (Math.random() - 0.5) * 0.003;
      particleSpeeds[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      particleSpeeds[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: colors.particles,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleCloud);

    // -------------------------------------------------------------------------
    // 2. Physics, Inertia & Mouse Tracking
    // -------------------------------------------------------------------------
    let targetRotX = 0.2;
    let targetRotY = 0.3;
    let currentRotX = 0.2;
    let currentRotY = 0.3;
    let mouseX = 0;
    let mouseY = 0;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    // Pulse wave physics on click
    let pulseScale = 1;
    let pulseVelocity = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      pulseVelocity = 0.08; // trigger spring pulse
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        dragVelocityX = deltaX * 0.006;
        dragVelocityY = deltaY * 0.006;
        targetRotY += dragVelocityX;
        targetRotX += dragVelocityY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        targetRotY = mouseX * 0.7;
        targetRotX = -mouseY * 0.7;
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
    // 3. Theme Mutation Observer
    // -------------------------------------------------------------------------
    const updateThemeColors = () => {
      colors = getColors();
      outerLineMat.color.setHex(colors.outer);
      nodeMat.color.setHex(colors.nodes);
      ringMat1.color.setHex(colors.inner);
      ringMat2.color.setHex(colors.outer);
      coreMat.color.setHex(colors.nodes);
      particleMat.color.setHex(colors.particles);
    };

    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          updateThemeColors();
        }
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    // -------------------------------------------------------------------------
    // 4. Resize Handling
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
    // 5. Visibility / Intersection Observer (Pause when offscreen)
    // -------------------------------------------------------------------------
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    // -------------------------------------------------------------------------
    // 6. Animation Loop
    // -------------------------------------------------------------------------
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Inertial spring for pulse
      if (pulseVelocity !== 0 || pulseScale !== 1) {
        const springForce = (1 - pulseScale) * 12;
        pulseVelocity += springForce * delta;
        pulseVelocity *= 0.9;
        pulseScale += pulseVelocity;
        rootGroup.scale.set(pulseScale, pulseScale, pulseScale);
      }

      // Smooth lerp rotation toward target
      const lerpFactor = prefersReducedMotion ? 0.01 : 0.05;
      currentRotX += (targetRotX - currentRotX) * lerpFactor;
      currentRotY += (targetRotY - currentRotY) * lerpFactor;

      // Base gentle continuous rotation if not dragging
      if (!isDragging && !prefersReducedMotion) {
        targetRotY += 0.003;
      }

      rootGroup.rotation.x = currentRotX;
      rootGroup.rotation.y = currentRotY;

      // Concentric rings differential rotation
      innerRing1.rotation.x += 0.01;
      innerRing1.rotation.y += 0.008;
      innerRing2.rotation.y += 0.012;
      innerRing2.rotation.z += 0.007;

      // Core pulsing rotation
      coreMesh.rotation.x = -elapsed * 0.5;
      coreMesh.rotation.y = elapsed * 0.8;

      // Particle subtle drifting
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleSpeeds[i * 3];
        positions[i * 3 + 1] += particleSpeeds[i * 3 + 1];
        positions[i * 3 + 2] += particleSpeeds[i * 3 + 2];

        // Boundary reflection
        const distSq =
          positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2;
        if (distSq > 9 || distSq < 2) {
          particleSpeeds[i * 3] *= -1;
          particleSpeeds[i * 3 + 1] *= -1;
          particleSpeeds[i * 3 + 2] *= -1;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

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

      // Geometries & Materials dispose
      outerGeo.dispose();
      wireframeGeo.dispose();
      outerLineMat.dispose();
      nodeMat.dispose();
      innerRingGeo1.dispose();
      ringMat1.dispose();
      innerRingGeo2.dispose();
      ringMat2.dispose();
      coreGeo.dispose();
      coreMat.dispose();
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
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="relative h-full w-full cursor-grab active:cursor-grabbing touch-none"
        title="Elemento 3D Interativo: arraste para rotacionar, clique para pulsar"
      />

      {/* Senior UI Blueprint Tag & Micro-controls */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-[0.625rem] font-mono tracking-wider text-[var(--ink-3)]">
        <div className="flex items-center gap-1.5 rounded-md bg-[var(--card)]/80 backdrop-blur-md px-2 py-1 border border-[var(--rule)]/60 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          <span className="uppercase font-semibold text-[var(--ink)]">3D Blueprint Core</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-md bg-[var(--card)]/80 backdrop-blur-md px-2 py-1 border border-[var(--rule)]/60 shadow-sm">
          <span>{isInteracting ? 'Rotacionando...' : 'Arraste para girar'}</span>
        </div>
      </div>
    </div>
  );
}

