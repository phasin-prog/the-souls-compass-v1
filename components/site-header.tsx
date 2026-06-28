"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [
  { label: "บทความ", href: "/articles" },
  { label: "คลังแนวคิด", href: "/concepts" },
  { label: "ซีรีส์", href: "/reading-sets" },
  { label: "แหล่งอ้างอิง", href: "/sources" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "สนับสนุน", href: "/support" },
];

function CompassMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="none" stroke="#C8A85A" strokeWidth="1" />
      <polygon points="20,4 22.5,20 17.5,20" fill="#D8C58A" />
      <polygon points="20,36 22.5,20 17.5,20" fill="#9B6B3D" />
      <circle cx="20" cy="20" r="2" fill="#C8A85A" />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-antique-gold/15 bg-midnight/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="The Soul's Compass หน้าแรก">
          <CompassMark />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl text-ivory">The Soul&apos;s Compass</span>
            <span className="mt-1 text-xs tracking-widest text-muted">คลังความรู้จิตใจมนุษย์</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="เมนูหลัก">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-soft-ivory transition-colors hover:text-soft-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-ivory md:hidden"
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={open}
        >
          <span className="text-lg">{open ? "\u2715" : "\u2630"}</span>
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-midnight px-6 py-3 md:hidden" aria-label="เมนูมือถือ">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-3 text-base text-soft-ivory last:border-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
