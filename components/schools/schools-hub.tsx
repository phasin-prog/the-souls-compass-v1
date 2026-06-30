"use client";

import { useEffect, useMemo, useState } from "react";
import {
  EN_LETTERS,
  THAI_LETTERS,
  type School,
  type Thinker,
} from "@/lib/content/schools";
import { disciplineMeta } from "@/components/discipline-meta";

import Link from "next/link";

export function SchoolsHub({ schools }: { schools: School[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const q = query.trim().toLowerCase();

  // ตัวอักษรที่ "มี" สำนักจริง (ใช้เปิด/หรี่ในแถบดัชนี)
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const s of schools) {
      if (s.nameTh[0]) set.add(s.nameTh[0]);
      if (s.nameEn[0]) set.add(s.nameEn[0].toUpperCase());
    }
    return set;
  }, [schools]);

  const matchSchool = (s: School): boolean => {
    if (!q) return true;
    if (s.nameTh.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q)) return true;
    return s.thinkers.some(
      (t) =>
        t.nameTh.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.masterpieces.some((m) => m.toLowerCase().includes(q)),
    );
  };
  const matchLetter = (s: School): boolean => {
    if (!letter) return true;
    return s.nameTh.startsWith(letter) || s.nameEn.toUpperCase().startsWith(letter);
  };

  const filtered = useMemo(
    () =>
      schools
        .filter((s) => matchLetter(s) && matchSchool(s))
        .sort((a, b) => a.nameTh.localeCompare(b.nameTh, "th")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schools, q, letter],
  );

  const toggle = (id: string) => {
    const next = new Set(open);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpen(next);
  };
  const isOpen = (id: string) => q !== "" || open.has(id);

  const letterBtn = (ch: string) => {
    const has = availableLetters.has(ch);
    const on = letter === ch;
    return (
      <button
        key={ch}
        type="button"
        disabled={!has}
        onClick={() => setLetter(on ? null : ch)}
        className={`flex h-7 min-w-7 items-center justify-center rounded px-1 text-xs transition-colors ${
          on
            ? "bg-burnished-gold/15 text-burnished-gold"
            : has
              ? "text-on-surface-variant hover:bg-ink/5 hover:text-burnished-gold"
              : "cursor-default text-on-surface-variant/20"
        }`}
      >
        {ch}
      </button>
    );
  };

  return (
    <div className="mt-8">
      {/* Search */}
      <div className="flex items-center gap-3 rounded-md border border-ink/12 bg-surface-container/60 px-4 py-3 focus-within:border-burnished-gold/40">
        <span className="material-symbols-outlined text-[22px] text-burnished-gold">search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาสำนักคิด นักปราชญ์ หรือชื่อผลงาน..."
          aria-label="ค้นหา"
          className="w-full bg-transparent text-base text-on-surface placeholder:text-on-surface-variant/55 focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="ล้างคำค้น"
            className="text-on-surface-variant/60 transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        ) : null}
      </div>

      {/* A-Z index */}
      <div className="mt-4 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => setLetter(null)}
          className={`mr-1 rounded px-2.5 py-1 text-xs transition-colors ${
            letter === null
              ? "bg-burnished-gold/15 text-burnished-gold"
              : "text-on-surface-variant hover:text-burnished-gold"
          }`}
        >
          ทั้งหมด
        </button>
        {THAI_LETTERS.map((ch) => letterBtn(ch))}
        <span className="mx-1 h-4 w-px bg-ink/8" />
        {EN_LETTERS.map((ch) => letterBtn(ch))}
      </div>

      {/* Accordion list */}
      <div className="mt-8 space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-md border border-ink/10 bg-surface-container/40 p-8 text-center text-sm text-on-surface-variant/60">
            ไม่พบสำนักคิดที่ตรงกับการค้นหา
          </p>
        ) : (
          filtered.map((s) => {
            const expanded = isOpen(s.id);
            const meta = disciplineMeta(s.field);
            const Icon = meta.Icon;
            return (
              <div
                key={s.id}
                className="relative overflow-hidden rounded-md border border-slate-boundary/50 bg-surface-container/40"
              >
                {/* แถบสีประจำศาสตร์ของสำนัก */}
                <span
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ backgroundColor: meta.accent }}
                />
                <div className="flex w-full items-center justify-between gap-3 p-5">
                  <button
                    type="button"
                    onClick={() => toggle(s.id)}
                    aria-expanded={expanded}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${meta.accent}14`, color: meta.accent }}
                      title={meta.label}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-serif text-xl text-on-surface hover:text-burnished-gold">{s.nameTh}</span>
                      <span className="text-sm text-on-surface-variant/50">/ {s.nameEn}</span>
                    </span>
                  </button>
                  <span className="flex shrink-0 items-center gap-3">
                    <Link
                      href={`/schools/${s.id}`}
                      className="hidden items-center gap-1 rounded bg-burnished-gold/10 px-3 py-1.5 text-xs font-semibold text-burnished-gold transition-colors hover:bg-burnished-gold/20 sm:flex"
                    >
                      หน้าสำนักเต็ม
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant/60 cursor-pointer transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                      onClick={() => toggle(s.id)}
                    >
                      expand_more
                    </span>
                  </span>
                </div>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 pt-0 border-t border-slate-boundary/20 bg-black/10">
                      {/* รายละเอียดสั้นๆ ของสำนักคิด */}
                      {s.description && (
                        <p className="mb-4 text-sm leading-relaxed text-on-surface-variant/75">
                          {s.description}
                          <Link href={`/schools/${s.id}`} className="ml-2 text-burnished-gold hover:underline inline-flex items-center gap-0.5">
                            อ่านประวัติเต็ม <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </Link>
                        </p>
                      )}
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        {s.thinkers.map((t) => {
                          const thinkerSlug = t.nameEn.toLowerCase().replace(/\s+/g, "-");
                          return (
                            <Link
                              key={t.nameEn}
                              href={`/thinkers/${thinkerSlug}`}
                              className="archron-card group p-5 text-left block transition-all duration-300 hover:border-burnished-gold/45"
                            >
                              <h4 className="font-serif text-lg text-on-surface group-hover:text-burnished-gold flex items-center justify-between">
                                {t.nameTh}
                                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-sm">arrow_forward</span>
                              </h4>
                              <p className="text-xs text-on-surface-variant/55">
                                {t.nameEn} · {t.era}
                              </p>
                              <ul className="mt-3 space-y-1.5 border-t border-ink/5 pt-2">
                                {t.masterpieces.slice(0, 2).map((m) => (
                                  <li
                                    key={m}
                                    className="flex items-start gap-1.5 text-xs leading-relaxed text-on-surface-variant/75"
                                  >
                                    <span className="material-symbols-outlined mt-0.5 text-[13px] text-burnished-gold/70">
                                      menu_book
                                    </span>
                                    {m}
                                  </li>
                                ))}
                              </ul>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
