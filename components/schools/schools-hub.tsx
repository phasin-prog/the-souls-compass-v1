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

  // สถิติรวม — คำนวณจากข้อมูลจริงที่ส่งเข้ามา (ไม่ hardcode)
  const totalThinkers = useMemo(
    () => schools.reduce((n, s) => n + s.thinkers.length, 0),
    [schools],
  );
  const totalFields = useMemo(
    () => new Set(schools.map((s) => s.field).filter(Boolean)).size,
    [schools],
  );

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
      {/* สถิติรวม */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { n: schools.length, l: "สำนักคิด" },
          { n: totalThinkers, l: "นักปราชญ์" },
          { n: totalFields, l: "ศาสตร์" },
        ].map((st) => (
          <div
            key={st.l}
            className="flex items-baseline gap-2 rounded-lg border border-ink/12 bg-surface-container/40 px-4 py-2.5"
          >
            <span className="font-serif text-2xl font-bold text-burnished-gold">{st.n}</span>
            <span className="text-xs text-on-surface-variant/60">{st.l}</span>
          </div>
        ))}
      </div>

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
                    className="flex flex-1 items-center gap-3.5 text-left"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
                      style={{
                        backgroundColor: `${meta.accent}14`,
                        color: meta.accent,
                        borderColor: `${meta.accent}40`,
                      }}
                      title={meta.label}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-2">
                        <span className="font-serif text-xl text-on-surface hover:text-burnished-gold">{s.nameTh}</span>
                        <span className="text-sm text-on-surface-variant/50">/ {s.nameEn}</span>
                      </span>
                      <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.08em] text-on-surface-variant/45">
                        {meta.label} · สำนักคิด
                      </span>
                    </span>
                  </button>
                  <span className="flex shrink-0 items-center gap-3">
                    <span
                      className="hidden rounded-full border px-2.5 py-0.5 text-[11px] sm:inline-flex"
                      style={{
                        color: meta.accent,
                        borderColor: `${meta.accent}44`,
                        backgroundColor: `${meta.accent}12`,
                      }}
                    >
                      {s.thinkers.length} นักคิดหลัก
                    </span>
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
                        <p className="mb-4 pt-4 text-sm leading-relaxed text-on-surface-variant/75">
                          {s.description}
                          <Link href={`/schools/${s.id}`} className="ml-2 text-burnished-gold hover:underline inline-flex items-center gap-0.5">
                            อ่านประวัติเต็ม <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </Link>
                        </p>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {s.thinkers.map((t) => {
                          const thinkerSlug = t.nameEn.toLowerCase().replace(/\s+/g, "-");
                          const extra = t.masterpieces.length - 2;
                          const initial = t.nameTh.trim().charAt(0);
                          return (
                            <Link
                              key={t.nameEn}
                              href={`/thinkers/${thinkerSlug}`}
                              className="archron-card group flex flex-col p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45"
                            >
                              {/* หัวการ์ด: monogram + ชื่อ + ยุค */}
                              <div className="flex items-center gap-3">
                                <span
                                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-serif text-lg"
                                  style={{
                                    color: meta.accent,
                                    borderColor: `${meta.accent}66`,
                                    backgroundColor: `${meta.accent}1a`,
                                  }}
                                  aria-hidden
                                >
                                  {initial}
                                </span>
                                <span className="min-w-0">
                                  <span className="flex items-center gap-1.5 font-serif text-lg text-on-surface group-hover:text-burnished-gold">
                                    {t.nameTh}
                                    <span className="material-symbols-outlined text-[16px] opacity-0 transition-opacity group-hover:opacity-100">
                                      arrow_forward
                                    </span>
                                  </span>
                                  <span className="block text-xs text-on-surface-variant/55">
                                    {t.nameEn} · {t.era}
                                  </span>
                                </span>
                              </div>

                              {/* ป้ายศาสตร์ */}
                              <span
                                className="mt-3 inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px]"
                                style={{
                                  color: meta.accent,
                                  borderColor: `${meta.accent}44`,
                                  backgroundColor: `${meta.accent}12`,
                                }}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {meta.label}
                              </span>

                              {/* คำคม (ถ้ามี) */}
                              {t.quote ? (
                                <p
                                  className="mt-3 overflow-hidden border-l-2 pl-3 font-serif text-sm italic leading-relaxed text-on-surface-variant/70 [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box]"
                                  style={{ borderColor: `${meta.accent}55` }}
                                >
                                  “{t.quote}”
                                </p>
                              ) : null}

                              {/* ผลงานเด่น */}
                              {t.masterpieces.length > 0 ? (
                                <ul className="mt-4 space-y-1.5 border-t border-ink/5 pt-3">
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
                              ) : null}
                              {extra > 0 ? (
                                <span className="mt-2 text-[11px] text-on-surface-variant/50">+{extra} ผลงาน</span>
                              ) : null}
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
