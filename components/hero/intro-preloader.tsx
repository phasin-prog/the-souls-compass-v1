"use client";

import { useState, useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/use-isomorphic-layout-effect";
import { gsap } from "gsap";

// วงกลมแสงแห่งธรรมชาติ — ARCHRON intro preloader
//
// วงกลมแสงเกิดขึ้นกลางจอ → เส้นสนามแม่เหล็ก (dipole) ลากตัวเอง → อนุภาคโคจรเข้าหาศูนย์กลาง
// → แสงขยาย + ละลาย → เผยหน้าเว็บ
//
// เล่นครั้งเดียวต่อ session (sessionStorage) · เคารพ prefers-reduced-motion · กด/คลิกเพื่อข้าม
// Type-safe · SSR-safe · Cleanup: gsap.context() + revert (กัน memory leak)

const STORAGE_KEY = "archron-intro-played";
const CX = 200;
const CY = 200;

export function IntroPreloader() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* private mode — ปล่อยให้เล่น */
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadyPlayed || prefersReduced) {
      setVisible(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // เตรียมเส้นสนามแม่เหล็ก: ซ่อนด้วย dash ยาวเกิน path (self-drawing technique)
      gsap.set(".intro-line", { strokeDasharray: 600, strokeDashoffset: 600 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            /* noop */
          }
          document.body.style.overflow = prevOverflow;
          setVisible(false);
        },
      });
      tlRef.current = tl;
      const O = `${CX}px ${CY}px`;

      // ── Phase 1: Emergence — วงกลมแสงเกิดขึ้นจากความมืด ──
      tl.fromTo(
        ".intro-halo",
        { opacity: 0, scale: 0.4 },
        { opacity: 0.7, scale: 1, duration: 1.0, transformOrigin: O },
      )
        .fromTo(
          ".intro-core",
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.7, transformOrigin: O },
          "-=0.5",
        )
        .fromTo(
          ".intro-ring",
          { opacity: 0, scale: 0 },
          { opacity: 0.9, scale: 1, duration: 0.7, transformOrigin: O },
          "<",
        )
        // ── Phase 2: Magnetic Field — เส้นสนามลากตัวเอง ──
        .to(".intro-field", { opacity: 1, duration: 0.3 }, "-=0.2")
        .to(
          ".intro-line",
          {
            strokeDashoffset: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "power2.inOut",
          },
                    "-=0.1",
        )

        // ── Phase 3: Orbit — อนุภาคโคจรรอบวงกลมแสง ──
        .fromTo(
          ".intro-particle",
          { opacity: 0 },
          { opacity: 1, duration: 0.3, stagger: 0.06 },
          "-=1.0",
        )
        .fromTo(
          ".intro-orbit-1",
          { rotation: 0 },
          { rotation: 90, duration: 2.0, ease: "none", transformOrigin: O },
          "-=1.8",
        )
        .fromTo(
          ".intro-orbit-2",
          { rotation: 0 },
          { rotation: -90, duration: 2.0, ease: "none", transformOrigin: O },
          "<",
        )

        // ── Phase 3b: Convergence — อนุภาคถูกดึงเข้าศูนย์ + แสงเข้มขึ้น ──
        .to(
          ".intro-orbit-1, .intro-orbit-2",
          { scale: 0.25, duration: 0.9, ease: "power2.in", transformOrigin: O },
          "-=0.5",
        )
        .to(".intro-line", { opacity: 0.3, duration: 0.6 }, "<")
        .to(
          ".intro-core",
          { scale: 1.25, duration: 0.5, transformOrigin: O },
          "<",
        )
        .to(
          ".intro-ring",
          { scale: 1.35, opacity: 0.7, duration: 0.5, transformOrigin: O },
          "<",
        )

        // ── Phase 3c: Wordmark — ชื่อแบรนด์ปรากฏ ──
        .fromTo(
          ".intro-wordmark",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3",
        )

        // ── Phase 4: Reveal — วงกลมแสงขยาย + ละลาย → เผยหน้าเว็บ ──
        .to({}, { duration: 0.5 })
        .to(
          ".intro-core",
          { scale: 3.5, opacity: 0, duration: 0.7, ease: "power2.inOut", transformOrigin: O },
        )
        .to(
          ".intro-ring",
          { scale: 3.5, opacity: 0, duration: 0.7, ease: "power2.inOut", transformOrigin: O },
          "<",
        )
        .to(
          ".intro-halo",
          { scale: 2, opacity: 0, duration: 0.7, ease: "power2.inOut", transformOrigin: O },
          "<",
        )
        .to(
          ".intro-field, .intro-orbit-1, .intro-orbit-2, .intro-wordmark",
          { opacity: 0, duration: 0.4 },
          "<",
        )
        .to(root, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.2");
    }, rootRef);

    // ข้าม intro ได้ด้วยการคลิกหรือกดปุ่มใด ๆ
    const skip = () => {
      if (tlRef.current) tlRef.current.kill();
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* noop */
      }
      document.body.style.overflow = prevOverflow;
      setVisible(false);
    };
    root.addEventListener("click", skip);
    window.addEventListener("keydown", skip);

    return () => {
      ctx.revert();
      root.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = prevOverflow;
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-deep-navy"
      aria-hidden="true"
      role="presentation"
    >
      <svg
        viewBox="0 0 400 400"
        className="h-[min(50vh,360px)] w-[min(50vh,360px)]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="intro-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E7D7A6" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#B58D4A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#B58D4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="intro-halo-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B58D4A" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#B58D4A" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#B58D4A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo — เรืองแสงรอบวงกลม */}
        <circle className="intro-halo" cx={CX} cy={CY} r="170" fill="url(#intro-halo-grad)" opacity="0" />

        {/* เส้นสนามแม่เหล็ก (dipole) — ขั้วบน/ล่าง โค้งออกข้าง */}
        <g className="intro-field" style={{ stroke: "var(--color-antique-gold)", opacity: 0 }} fill="none" strokeWidth="1" strokeLinecap="round">
          <path className="intro-line" d="M 200,164 C 255,164 255,236 200,236" />
          <path className="intro-line" d="M 200,164 C 310,164 310,236 200,236" />
          <path className="intro-line" d="M 200,164 C 365,164 365,236 200,236" />
          <path className="intro-line" d="M 200,164 C 145,164 145,236 200,236" />
          <path className="intro-line" d="M 200,164 C 90,164 90,236 200,236" />
          <path className="intro-line" d="M 200,164 C 35,164 35,236 200,236" />
        </g>

        {/* วงกลมแสง — แกนกลาง */}
        <circle className="intro-core" cx={CX} cy={CY} r="42" fill="url(#intro-core-grad)" opacity="0" />
        <circle className="intro-ring" cx={CX} cy={CY} r="36" style={{ stroke: "var(--color-soft-gold)" }} strokeWidth="1.5" fill="none" opacity="0" />

        {/* อนุภาคโคจร — วงใกล้ (หมุนตามเข็ม) */}
        <g className="intro-orbit-1">
          <circle className="intro-particle" cx="255" cy="200" r="2.5" style={{ fill: "var(--color-soft-gold)" }} opacity="0" />
          <circle className="intro-particle" cx="172.5" cy="247.6" r="2.5" style={{ fill: "var(--color-soft-gold)" }} opacity="0" />
          <circle className="intro-particle" cx="172.5" cy="152.4" r="2.5" style={{ fill: "var(--color-soft-gold)" }} opacity="0" />
        </g>

        {/* อนุภาคโคจร — วงไกล (หมุนทวนเข็ม) */}
        <g className="intro-orbit-2">
          <circle className="intro-particle" cx="250" cy="286.6" r="2" style={{ fill: "var(--color-soft-gold)" }} opacity="0" />
          <circle className="intro-particle" cx="100" cy="200" r="2" style={{ fill: "var(--color-soft-gold)" }} opacity="0" />
          <circle className="intro-particle" cx="250" cy="113.4" r="2" style={{ fill: "var(--color-soft-gold)" }} opacity="0" />
        </g>
      </svg>

      {/* ชื่อแบรนด์ — ปรากฏหลังวงกลมแสงเกิด */}
      <span className="intro-wordmark font-wordmark text-sm tracking-[0.45em] text-burnished-gold/70 opacity-0">
        ARCHRON
      </span>
    </div>
  );
}

