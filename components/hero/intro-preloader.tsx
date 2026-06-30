"use client";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";

// 3D Intro Preloader — ARCHRON
// Vesica Piscis · Magnetic Field · Bhava Cycle · Ahe+Chronos
// Three.js rendered in <canvas> · one-shot animation · sessionStorage gate

const STORAGE_KEY = "archron-intro-played";

export function IntroPreloader() {
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<{ cancel: () => void } | null>(null);

  useEffect(() => {
    let alreadyPlayed = false;
    try { alreadyPlayed = sessionStorage.getItem(STORAGE_KEY) === "1"; } catch { /* */ }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (alreadyPlayed || prefersReduced) { setVisible(false); return; }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ── Scene setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x080B16, 1);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Colors ──
    const GOLD = new THREE.Color(0xB58D4A);
    const GOLD_SOFT = new THREE.Color(0xE7D7A6);
    const IVORY = new THREE.Color(0xF3EEE5);
    const DEEP = new THREE.Color(0x1F2231);

    // ── Core light sphere (Ahe) ──
    const coreGeo = new THREE.SphereGeometry(0.35, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // ── Glow sphere ──
    const glowGeo = new THREE.SphereGeometry(0.55, 64, 64);
    const glowMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // ── Vesica Piscis — two wireframe spheres ──
    const vesicaGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const vesicaMatL = new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0 });
    const vesicaMatR = new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0 });
    const vesicaL = new THREE.Mesh(vesicaGeo, vesicaMatL);
    const vesicaR = new THREE.Mesh(vesicaGeo, vesicaMatR);
    vesicaL.position.x = -1.8;
    vesicaR.position.x = 1.8;
    scene.add(vesicaL, vesicaR);

    // ── Ring outlines (vesica intersection) ──
    const ringGeo = new THREE.TorusGeometry(0.6, 0.008, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: GOLD_SOFT, transparent: true, opacity: 0 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.y = Math.PI / 2;
    scene.add(ring);

    // ── Bhava Cycle — 3 orbit rings ──
    const bhavaRings: THREE.Mesh[] = [];
    const bhavaRadii = [2.0, 2.5, 3.0];
    const bhavaTilts = [0.3, -0.2, 0.5];
    bhavaRadii.forEach((r, i) => {
      const geo = new THREE.TorusGeometry(r, 0.005, 8, 128);
      const mat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = bhavaTilts[i];
      mesh.rotation.z = i * 0.4;
      scene.add(mesh);
      bhavaRings.push(mesh);
    });

    // ── Magnetic field lines — curves ──
    const fieldLines: THREE.Line[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const spread = 0.6 + (i % 3) * 0.3;
      const points: THREE.Vector3[] = [];
      for (let t = 0; t <= 1; t += 0.02) {
        const y = (t - 0.5) * 3;
        const x = Math.sin(t * Math.PI) * spread * Math.cos(angle);
        const z = Math.sin(t * Math.PI) * spread * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 });
      const line = new THREE.Line(curve, lineMat);
      scene.add(line);
      fieldLines.push(line);
    }

    // ── Orbiting particles ──
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.5 + Math.random() * 1.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      particleSizes[i] = 2 + Math.random() * 3;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));
    const particleMat = new THREE.PointsMaterial({ color: GOLD_SOFT, size: 0.04, transparent: true, opacity: 0, sizeAttenuation: true });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Animation timeline ──
    let startTime = performance.now();
    const TOTAL_DURATION = 5500; // ms
    let cancelled = false;

    function easeInOut(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function animate() {
      if (cancelled) return;
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = clamp01(elapsed / TOTAL_DURATION);
      const time = elapsed * 0.001;

      // Phase 1: Emergence (0 → 0.2)
      const p1 = clamp01(progress / 0.2);
      const e1 = easeInOut(p1);
      coreMat.opacity = e1 * 0.95;
      core.scale.setScalar(e1);
      glowMat.opacity = e1 * 0.4;
      glow.scale.setScalar(e1 * 1.3);

      // Phase 2: Vesica convergence (0.15 → 0.45)
      const p2 = clamp01((progress - 0.15) / 0.3);
      const e2 = easeInOut(p2);
      vesicaL.position.x = lerp(-1.8, -0.7, e2);
      vesicaR.position.x = lerp(1.8, 0.7, e2);
      vesicaMatL.opacity = e2 * 0.3;
      vesicaMatR.opacity = e2 * 0.3;
      ringMat.opacity = e2 * 0.5;

      // Phase 3: Magnetic field + particles (0.3 → 0.6)
      const p3 = clamp01((progress - 0.3) / 0.3);
      const e3 = easeInOut(p3);
      fieldLines.forEach((line) => { (line.material as THREE.LineBasicMaterial).opacity = e3 * 0.35; });
      particleMat.opacity = e3 * 0.7;

      // Phase 4: Bhava rotation (0.4 → 0.8)
      const p4 = clamp01((progress - 0.4) / 0.4);
      const e4 = easeInOut(p4);
      bhavaRings.forEach((ring, i) => {
        (ring.material as THREE.MeshBasicMaterial).opacity = e4 * (0.25 - i * 0.05);
        ring.rotation.z += 0.002 * (i + 1);
      });

      // Particle orbit
      const posArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const x = posArr[ix], y = posArr[ix + 1], z = posArr[ix + 2];
        const r = Math.sqrt(x * x + y * y + z * z);
        const theta = Math.atan2(z, x) + 0.008;
        const phi = Math.acos(y / r);
        posArr[ix] = r * Math.sin(phi) * Math.cos(theta);
        posArr[ix + 1] = y;
        posArr[ix + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Phase 5: Convergence (0.65 → 0.8)
      const p5 = clamp01((progress - 0.65) / 0.15);
      const e5 = easeInOut(p5);
      core.scale.setScalar(lerp(1, 1.4, e5));
      glow.scale.setScalar(lerp(1.3, 2.0, e5));
      fieldLines.forEach((line) => { (line.material as THREE.LineBasicMaterial).opacity = lerp(0.35, 0.05, e5); });
      vesicaMatL.opacity = lerp(0.3, 0.05, e5);
      vesicaMatR.opacity = lerp(0.3, 0.05, e5);

      // Phase 6: Expand + fade (0.8 → 1.0)
      const p6 = clamp01((progress - 0.8) / 0.2);
      const e6 = easeInOut(p6);
      core.scale.setScalar(lerp(1.4, 5, e6));
      coreMat.opacity = lerp(0.95, 0, e6);
      glow.scale.setScalar(lerp(2, 8, e6));
      glowMat.opacity = lerp(0.4, 0, e6);
      ringMat.opacity = lerp(0.5, 0, e6);
      particleMat.opacity = lerp(0.7, 0, e6);
      bhavaRings.forEach((r) => { (r.material as THREE.MeshBasicMaterial).opacity = lerp(0.2, 0, e6); });
      vesicaMatL.opacity = lerp(0.3, 0, e6);
      vesicaMatR.opacity = lerp(0.3, 0, e6);

      // Camera subtle drift
      camera.position.x = Math.sin(time * 0.3) * 0.15;
      camera.position.y = Math.cos(time * 0.2) * 0.1;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      if (progress >= 1) {
        finish();
        return;
      }
      requestAnimationFrame(animate);
    }

    function finish() {
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* */ }
      document.body.style.overflow = prevOverflow;
      setVisible(false);
    }

    function skip() {
      cancelled = true;
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* */ }
      document.body.style.overflow = prevOverflow;
      setVisible(false);
    }

    animRef.current = { cancel: skip };
    requestAnimationFrame(animate);

    const onKey = () => skip();
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("click", skip);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("click", skip);
      document.body.style.overflow = prevOverflow;
      renderer.dispose();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-deep-navy"
      aria-hidden="true"
      role="presentation"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-16">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-lg font-semibold tracking-[0.35em] text-ivory/80">Ahe</span>
          <span className="font-cinzel text-xs text-burnished-gold/60">+</span>
          <span className="font-cinzel text-lg font-semibold tracking-[0.35em] text-ivory/80">Chronos</span>
        </div>
        <span className="mt-1 font-cinzel text-[10px] tracking-[0.6em] text-burnished-gold/40">ARCHRON</span>
      </div>
    </div>
  );
}
