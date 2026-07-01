"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

// Intro Preloader — ARCHRON
// เขียนลายมือ: Arche (ἀρχή) → Archon (ἄρχων) → Cronos (Χρόνος)
// → 2D scale pull-out → เห็นเป็นเล่ม → ปิดปก → "Archron"
// ฟอนต์ EB Garamond Italic (Greek + diacritics) · สี branding · sessionStorage gate
// GSAP single timeline · respect prefers-reduced-motion

const STORAGE_KEY = "archron-intro-played";

const WORDS = [
  { word: "Arche", greek: "ἀρχή", meaning: "the first principle" },
  { word: "Archon", greek: "ἄρχων", meaning: "the ruler" },
  { word: "Cronos", greek: "Χρόνος", meaning: "time" },
] as const;

export function IntroPreloader() {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const coverWordRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skipBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* */
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (alreadyPlayed || prefersReduced) {
      setVisible(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: finish,
        defaults: { ease: "power2.out" },
      });

      // ── Phase 1 (0–4s): เขียน 3 บรรทัดทีละบรรทัดด้วย clip-path reveal ──
      WORDS.forEach((_, i) => {
        const el = wordRefs.current[i];
        if (!el) return;
        // ตั้ง clip-path เริ่มต้น: ซ่อนทั้งหมด (ขวา→ซ้าย)
        gsap.set(el, { clipPath: "inset(0 100% 0 0)" });
        // reveal ทีละบรรทัด (stagger 1.1s)
        tl.to(
          el,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.9,
            ease: "power1.inOut",
          },
          i * 1.1,
        );
      });

      // ── Phase 2 (4–5.5s): 2D pull-out — scale down + ขอบเล่มโผล่ ──
      tl.to(
        pageRef.current,
        { scale: 0.55, duration: 1.2, ease: "power3.out" },
        4.0,
      )
        .to(spineRef.current, { opacity: 1, duration: 0.8 }, 4.0)
        .to(edgeRef.current, { opacity: 1, duration: 0.8 }, 4.2);

      // ── Phase 3 (5.5–6.5s): ปิดเล่ม — page fade + cover scale up ──
      tl.to(pageRef.current, { opacity: 0, scale: 0.5, duration: 0.5, ease: "power2.in" }, 5.5)
        .to(spineRef.current, { opacity: 0, duration: 0.3 }, 5.6)
        .to(edgeRef.current, { opacity: 0, duration: 0.3 }, 5.6)
        .fromTo(
          coverRef.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
          5.7,
        )
        .fromTo(
          coverWordRef.current,
          { opacity: 0, y: 8, letterSpacing: "0.6em" },
          { opacity: 1, y: 0, letterSpacing: "0.4em", duration: 1.0, ease: "power2.out" },
          5.9,
        );

      // ── Phase 4 (7.2–7.8s): fade out overlay ──
      tl.to(containerRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 7.2);
    }, containerRef);

    function finish() {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* */
      }
      document.body.style.overflow = prevOverflow;
      setVisible(false);
    }

    function skip() {
      ctx.kill();
      finish();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "var(--color-deep-navy)" }}
      aria-hidden="true"
      role="presentation"
    >
      {/* ปุ่มข้าม */}
      <button
        ref={skipBtnRef}
        type="button"
        onClick={() => {
          // trigger skip via keydown handler simulation not needed; call directly
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        }}
        className="absolute right-5 top-5 z-10 rounded border border-slate-boundary/40 bg-surface-container/40 px-4 py-2 text-xs font-medium tracking-wider text-on-surface-variant/70 backdrop-blur transition-colors hover:text-soft-gold hover:border-burnished-gold/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/50"
        aria-label="ข้ามการแนะนำ"
      >
        ข้าม <span className="ml-1 text-on-surface-variant/40">Esc</span>
      </button>

      {/* กล่องเนื้อหา: หน้ากระดาษ + ขอบเล่ม + ปก */}
      <div className="relative flex items-center justify-center">
        {/* ขอบเล่มซ้าย (สัน) — ซ่อนตอนเริ่ม */}
        <div
          ref={spineRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[20px] -translate-x-[calc(50%+170px)] -translate-y-1/2 rounded-l-sm opacity-0"
          style={{
            background: "linear-gradient(90deg, #2a2418, #1a1812)",
            boxShadow: "inset -2px 0 4px rgba(0,0,0,0.4)",
          }}
        />
        {/* ขอบเล่มขวา — ซ่อนตอนเริ่ม */}
        <div
          ref={edgeRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[344px] w-[8px] -translate-x-[calc(50%-176px)] -translate-y-1/2 rounded-r-sm opacity-0"
          style={{ background: "#2a2418" }}
        />

        {/* หน้ากระดาษ (เขียนลายมือ) */}
        <div
          ref={pageRef}
          className="relative w-[380px] max-w-[80vw] px-10 py-12"
          style={{
            backgroundColor: "#1a1812",
            border: "1px solid #3a3328",
            borderRadius: "2px",
            boxShadow: "0 24px 60px -20px rgba(0,0,0,0.6)",
          }}
        >
          {/* texture กระดาษเก่า: subtle noise overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, #C79A4A 0%, transparent 50%), radial-gradient(circle at 70% 80%, #8A857D 0%, transparent 50%)",
            }}
          />

          <div className="relative space-y-5">
            {WORDS.map((w, i) => (
              <div
                key={w.word}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="flex flex-col"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-2xl italic text-soft-gold"
                    style={{ fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif" }}
                  >
                    {w.word}
                  </span>
                  <span className="text-base text-soft-gold/50">—</span>
                  <span
                    className="text-xl italic text-soft-gold/80"
                    style={{ fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif" }}
                  >
                    {w.greek}
                  </span>
                </div>
                <span
                  className="mt-0.5 text-[10px] tracking-wide text-muted"
                  style={{ fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif" }}
                >
                  {w.meaning}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ปกหนังสือ "Archron" — ซ่อนตอนเริ่ม */}
        <div
          ref={coverRef}
          className="absolute inset-0 flex items-center justify-center opacity-0"
          style={{
            backgroundColor: "#15110a",
            border: "1px solid #3a3328",
            borderRadius: "3px",
            boxShadow:
              "0 24px 80px -20px rgba(0,0,0,0.8), inset 0 0 60px rgba(199,154,74,0.04)",
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* เส้นขอบบน-ล่างปก */}
            <div className="absolute -top-8 h-px w-32 bg-burnished-gold/30" />
            <div className="absolute -bottom-8 h-px w-32 bg-burnished-gold/30" />
            <div
              ref={coverWordRef}
              className="font-cinzel text-4xl font-semibold tracking-[0.4em] text-ivory md:text-5xl"
            >
              ARCHRON
            </div>
            <div className="mt-3 text-[10px] tracking-[0.5em] text-burnished-gold/50">
              คลังความรู้
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
