"use client";

import { useState } from "react";
import Link from "next/link";
import { CompassIcon, SearchIcon, MenuIcon } from "@/components/icons";

const NAV = [
  { label: "บทความ", href: "/articles" },
  { label: "คลังแนวคิด", href: "/concepts" },
  { label: "ซีรีส์", href: "/reading-sets" },
  { label: "แหล่งอ้างอิง", href: "/sources" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "สนับสนุน", href: "/support" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-antique-gold/15 bg-midnight/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="The Soul's Compass หน้าแรก">
          <CompassIcon className="h-9 w-9 text-antique-gold" />
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

        <div className="flex items-center gap-3">
          <Link
            href="/concepts"
            aria-label="สำรวจคลังแนวคิด"
            className="hidden text-soft-ivory transition-colors hover:text-soft-gold md:inline-flex"
          >
            <SearchIcon className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-ivory md:hidden"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
          >
            {open ? <span className="text-lg">✕</span> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
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
