"use client";

import { useState } from "react";
import type { ExternalCategory } from "@/lib/content/external-links";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function ExternalLinksBrowser({ categories }: { categories: ExternalCategory[] }) {
  const [active, setActive] = useState<string>("all");
  const visible = active === "all" ? categories : categories.filter((c) => c.id === active);

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200 ${
      on
        ? "border-burnished-gold/50 bg-burnished-gold/10 text-burnished-gold"
        : "border-ink/12 text-on-surface-variant hover:border-ink/25 hover:text-on-surface"
    }`;

  return (
    <div className="mt-8">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setActive("all")} className={chip(active === "all")}>
          ทั้งหมด
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className={chip(active === c.id)}
          >
            {c.thaiLabel}
          </button>
        ))}
      </div>

      {/* Grouped grid (key=active → fade-rise ใหม่ทุกครั้งที่สลับฟิลเตอร์) */}
      <div key={active} className="route-fade mt-10 space-y-14">
        {visible.map((cat) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
            <h2
              id={`cat-${cat.id}`}
              className="flex items-center gap-2.5 border-b border-slate-boundary/20 pb-3 font-serif text-2xl text-on-surface"
            >
              <span className="material-symbols-outlined text-burnished-gold">{cat.icon}</span>
              {cat.thaiLabel}
              <span className="text-base text-on-surface-variant/50">({cat.enLabel})</span>
              <span className="ml-auto text-sm font-normal text-on-surface-variant/40">
                {cat.items.length} แหล่ง
              </span>
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item) => {
                const host = hostOf(item.url);
                return (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="archron-card group relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45"
                  >
                    {/* host + external icon */}
                    <div className="flex items-center justify-between gap-3">
                      {host ? (
                        <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-on-surface-variant/55">
                          <span className="material-symbols-outlined text-[15px] text-burnished-gold/70">public</span>
                          <span className="truncate">{host}</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="material-symbols-outlined shrink-0 text-[18px] text-on-surface-variant/40 transition-colors group-hover:text-burnished-gold">
                        open_in_new
                      </span>
                    </div>

                    <h3 className="mt-3 font-serif text-lg leading-snug text-on-surface transition-colors group-hover:text-burnished-gold">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-soft-ivory/85">
                      {item.description}
                    </p>

                    {item.tags.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-ink/12 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-on-surface-variant/55"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <span className="mt-4 flex items-center gap-1.5 border-t border-ink/8 pt-3 text-xs font-semibold text-burnished-gold">
                      เปิดลิงก์ภายนอก
                      <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        arrow_outward
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
