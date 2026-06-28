"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NavItem = { label: string; href: string; icon: string };
type NavGroup = { label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: "เกี่ยวกับ",
    items: [
      { label: "Manifesto", href: "/manifesto", icon: "description" },
      { label: "แหล่งอ้างอิง", href: "/sources", icon: "format_quote" },
      { label: "ทรัพยากรภายนอก", href: "/external-links", icon: "link" },
      { label: "คำถามที่พบบ่อย", href: "/faq", icon: "help" },
      { label: "สนับสนุนโครงการ", href: "/support", icon: "favorite" },
    ],
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 glass-nav ${scrolled ? "is-scrolled" : ""}`}>
      <nav
        className={`mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href="/"
          className="font-serif text-[22px] tracking-tight text-burnished-gold"
          aria-label="The Soul's Compass หน้าแรก"
        >
          The Soul&apos;s Compass
        </Link>

        {/* Desktop: dropdown groups */}
        <div className="hidden items-center gap-2 md:flex" aria-label="เมนูหลัก">
          <Link
            href="/knowledge"
            className="rounded-md px-3 py-2 text-sm uppercase tracking-[0.12em] text-on-surface-variant transition-colors hover:text-burnished-gold"
          >
            เข้าสู่คลังความรู้
          </Link>
          {GROUPS.map((g) => (
            <div key={g.label} className="group/d relative">
              <button
                type="button"
                aria-haspopup="true"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm uppercase tracking-[0.12em] text-on-surface-variant transition-colors group-hover/d:text-burnished-gold"
              >
                {g.label}
                <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/d:rotate-180">
                  expand_more
                </span>
              </button>
              <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover/d:visible group-hover/d:opacity-100 group-focus-within/d:visible group-focus-within/d:opacity-100">
                <div className="min-w-[240px] rounded-md border border-slate-boundary/50 bg-deep-navy/95 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
                  {g.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-white/5 hover:text-burnished-gold"
                    >
                      <span className="material-symbols-outlined text-[18px] text-burnished-gold/70">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="ค้นหา"
            className="flex h-10 w-10 items-center justify-center text-on-surface-variant transition-colors hover:text-burnished-gold"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </Link>
          <Link
            href="/studio/editor"
            className="hidden border border-burnished-gold/30 bg-burnished-gold/10 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-burnished-gold transition-all duration-500 hover:bg-burnished-gold hover:text-deep-navy md:block"
          >
            Studio
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-on-surface md:hidden"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
          >
            <span className="material-symbols-outlined text-2xl">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile: grouped menu */}
      {open ? (
        <nav
          className="menu-in border-t border-slate-boundary/40 bg-deep-navy px-6 py-4 md:hidden"
          aria-label="เมนูมือถือ"
        >
          <div className="mb-4 space-y-1.5 border-b border-white/5 pb-3.5">
            <Link
              href="/knowledge"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded px-1.5 py-2.5 text-base text-on-surface-variant hover:text-burnished-gold transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-burnished-gold/70">
                menu_book
              </span>
              เข้าสู่คลังความรู้
            </Link>
            <Link
              href="/studio/editor"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded px-1.5 py-2.5 text-base text-on-surface-variant hover:text-burnished-gold transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-burnished-gold/70">
                admin_panel_settings
              </span>
              Studio
            </Link>
          </div>

          {GROUPS.map((g) => (
            <div key={g.label} className="mb-3 last:mb-0">
              <p className="px-1 py-1 text-[11px] uppercase tracking-wide text-on-surface-variant/40">
                {g.label}
              </p>
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded px-1 py-2.5 text-base text-on-surface-variant hover:text-burnished-gold"
                >
                  <span className="material-symbols-outlined text-[20px] text-burnished-gold/70">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
