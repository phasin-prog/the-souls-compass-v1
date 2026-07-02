import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "แหล่งอ้างอิง — ARCHRON",
};

/* ─────────────────────────────────────────────────────────────
   ชั้นของแหล่งความรู้ (epistemic tiers) — สีตาม Material Cosmology
   ต้นทาง = Sapientia (#CBA45A) · อธิบาย = Psyche (#6E93A8)
   ตีความ = Mercurius (#8AA395 · สะพาน/การแปร)
   ไอคอน line-art: stroke = currentColor รับสีจาก accent ของแต่ละชั้น
   ───────────────────────────────────────────────────────────── */
const svgProps = {
  className: "h-[22px] w-[22px]",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Tier = {
  num: string;
  title: string;
  en: string;
  desc: string;
  flow: string;
  accent: string;
  icon: React.ReactNode;
};

const TIERS: Tier[] = [
  {
    num: "01",
    title: "แหล่งต้นทาง",
    en: "Primary Sources",
    desc: "งานต้นฉบับของนักคิดโดยตรง — ตัวบท คำแปลจากต้นฉบับ จดหมาย บันทึก และงานเขียนชั้นต้น",
    flow: "หลักฐานชั้นต้น",
    accent: "#CBA45A",
    icon: (
      <svg {...svgProps}>
        <path d="M6 3h8l4 4v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v4h4" />
        <path d="M8.5 17.5c1.5-4 3.2-6 6-7.5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "งานอธิบาย",
    en: "Secondary Sources",
    desc: "งานศึกษา วิเคราะห์ และอธิบายต่อยอดจากแหล่งต้นทาง โดยนักวิชาการหรือผู้เชี่ยวชาญ",
    flow: "การศึกษาต่อยอด",
    accent: "#6E93A8",
    icon: (
      <svg {...svgProps}>
        <path d="M12 6.5C10.5 5 8 4.5 5.5 5v12c2.5-.5 5 0 6.5 1.5" />
        <path d="M12 6.5C13.5 5 16 4.5 18.5 5v12c-2.5-.5-5 0-6.5 1.5" />
        <path d="M12 6.5v12" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "การตีความ",
    en: "Interpretation · Editorial",
    desc: "การตีความและการเชื่อมโยงของเว็บเอง — แยกออกจากข้อเท็จจริงและแหล่งต้นทางอย่างชัดเจน",
    flow: "เสียงของ ARCHRON",
    accent: "#8AA395",
    icon: (
      <svg {...svgProps}>
        <circle cx="6" cy="8" r="2.2" />
        <circle cx="18" cy="8" r="2.2" />
        <path d="M6 10.2v3.8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-3.8" />
        <path d="M12 14v4" />
      </svg>
    ),
  },
];

type SampleEntry = { tier: string; accent: string; work: string; by: string; cite: string };

const SAMPLE_ENTRIES: SampleEntry[] = [
  {
    tier: "Primary",
    accent: "#CBA45A",
    work: "ชื่อผลงานต้นฉบับ / ตัวบทชั้นต้น",
    by: "ผู้เขียน · ปีที่พิมพ์ · สำนักพิมพ์ / ฉบับแปล",
    cite: "อ้างอิงใน: แนวคิด “เงา (Shadow)”, “อัตตา (Ego)”",
  },
  {
    tier: "Secondary",
    accent: "#6E93A8",
    work: "ชื่องานศึกษา / บทวิเคราะห์",
    by: "ผู้เขียน · ปี · วารสาร / สำนักพิมพ์",
    cite: "ต่อยอดจาก: แหล่งต้นทาง #01",
  },
  {
    tier: "Interpretation",
    accent: "#8AA395",
    work: "บันทึกการตีความของ ARCHRON",
    by: "กองบรรณาธิการ · ปรับปรุงล่าสุด",
    cite: "ตั้งอยู่บน: แหล่งต้นทาง + งานอธิบาย ข้างต้น",
  },
];

const METHOD = [
  { title: "เริ่มจากต้นฉบับ", desc: "อ้างอิงจากตัวบทชั้นต้นก่อนเสมอ และระบุฉบับ/คำแปลที่ใช้" },
  { title: "เคารพบริบท", desc: "ไม่ตัดข้อความออกจากบริบทเพื่อสนับสนุนข้อสรุปที่เตรียมไว้" },
  { title: "แยกข้อเท็จจริงจากการตีความ", desc: "ระบุชัดว่าส่วนใดคือหลักฐาน ส่วนใดคือการตีความของเรา" },
];

function SectionLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 mt-16 flex items-center gap-3.5">
      <span className="text-xs tabular-nums tracking-[0.15em] text-burnished-gold/70">{num}</span>
      <span className="whitespace-nowrap font-serif text-[15px] font-semibold text-ivory">{children}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-slate-boundary/40 to-transparent" />
    </div>
  );
}

export default function SourcesPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="แหล่งอ้างอิง"
        title="ฐานความรู้และการอ้างอิง"
        lead="ทุกแนวคิดควรมีฐานรองรับ ที่นี่เราแยกแหล่งต้นทาง งานอธิบาย และการตีความออกจากกันอย่างชัดเจน เพื่อให้ผู้อ่านตรวจสอบย้อนกลับได้เสมอว่าสิ่งใดคือหลักฐาน และสิ่งใดคือการตีความของเรา"
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* 01 · ชั้นของแหล่งความรู้ */}
        <section className="scroll-reveal stagger-1">
          <SectionLabel num="01">ชั้นของแหล่งความรู้</SectionLabel>
          <div className="grid gap-[18px] md:grid-cols-3">
            {TIERS.map((t) => (
              <article key={t.num} className="archron-card relative overflow-hidden p-6">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 opacity-80"
                  style={{ backgroundColor: t.accent }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{
                      color: t.accent,
                      borderColor: `${t.accent}55`,
                      backgroundColor: `${t.accent}1a`,
                    }}
                  >
                    {t.icon}
                  </span>
                  <span className="text-xs tabular-nums tracking-[0.1em] text-on-surface-variant/40">
                    {t.num}
                  </span>
                </div>
                <h2 className="mt-4 font-serif text-lg font-semibold" style={{ color: t.accent }}>
                  {t.title}
                </h2>
                <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.12em] text-on-surface-variant/45">
                  {t.en}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-soft-ivory">{t.desc}</p>
                <p className="mt-4 text-xs" style={{ color: t.accent }}>
                  ◦ {t.flow}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 02 · รูปแบบการแสดงผลรายการอ้างอิง */}
        <section className="scroll-reveal">
          <SectionLabel num="02">รูปแบบการแสดงผลรายการอ้างอิง</SectionLabel>
          <div className="flex flex-col gap-3">
            {SAMPLE_ENTRIES.map((e) => (
              <div
                key={e.tier}
                className="flex items-start gap-4 rounded-xl border border-ink/10 bg-surface-container px-5 py-4"
              >
                <span
                  className="mt-1 shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.08em]"
                  style={{ color: e.accent, borderColor: `${e.accent}55`, backgroundColor: `${e.accent}14` }}
                >
                  {e.tier}
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-base leading-snug text-ivory">{e.work}</p>
                  <p className="mt-1 text-sm text-soft-ivory">{e.by}</p>
                  <p className="mt-1.5 text-xs text-muted">{e.cite}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-center text-xs italic text-muted">
            — โครงร่างตัวอย่างเพื่อแสดงรูปแบบ ยังไม่ใช่ข้อมูลจริงที่เผยแพร่ —
          </p>
        </section>

        {/* 03 · หลักการอ้างอิงของเรา */}
        <section className="scroll-reveal">
          <SectionLabel num="03">หลักการอ้างอิงของเรา</SectionLabel>
          <div className="grid gap-4 md:grid-cols-3">
            {METHOD.map((m) => (
              <div key={m.title} className="border-l-2 border-burnished-gold/30 pl-4">
                <h3 className="font-serif text-[15px] font-semibold text-ivory">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-soft-ivory">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Coming soon */}
        <div className="mt-11 rounded-xl border border-dashed border-slate-boundary/30 bg-surface-container/40 px-6 py-9 text-center">
          <span className="material-symbols-outlined text-[34px] text-burnished-gold/60">menu_book</span>
          <p className="mt-3 font-serif text-[17px] text-ivory">กำลังรวบรวมและตรวจสอบแหล่งอ้างอิง</p>
          <p className="mt-1.5 text-sm text-muted">
            รายการแหล่งอ้างอิงจะทยอยเผยแพร่เมื่อผ่านการตรวจสอบต้นทางและบริบทครบถ้วน
          </p>
        </div>
      </div>

      <PageNav current="/sources" />
    </main>
  );
}
