"use client";

import { useEffect } from "react";

// เปิดเอฟเฟกต์ค่อย ๆ ปรากฏเมื่อเลื่อนถึง (.scroll-reveal → .visible)
// เป็น progressive enhancement: ถ้าไม่มี JS มี noscript fallback ใน layout ให้แสดงทันที
export function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-reveal:not(.visible)"),
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
