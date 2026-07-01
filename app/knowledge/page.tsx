import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  BookIcon,
  PsychologyIcon,
  SchoolIcon,
  ConceptIcon,
  PathIcon,
  SymbolismIcon,
  GridIcon,
  ArrowRightIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "เข้าสู่คลังความรู้ — ARCHRON",
  description:
    "สารบัญนำทางคลังความรู้ของ ARCHRON — งานเขียน คลังแนวคิด สำนักคิด แผนที่ความสัมพันธ์ เส้นทางการอ่าน แก่นเรื่อง และศาสตร์ที่เราศึกษา",
};

type KnowledgeCard = {
  title: string;
  engTitle: string;
  description: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
  accent: string; // Colour Cosmology
  isNew?: boolean;
};

const KNOWLEDGE_SECTIONS: KnowledgeCard[] = [
  {
    title: "อ่านงานเขียน",
    engTitle: "Articles",
    description: "บทความที่อธิบายและตีความแนวคิดสำคัญในบริบทของมัน",
    href: "/articles",
    Icon: BookIcon,
    accent: "#CBA45A", // sapientia
  },
  {
    title: "คลังแนวคิด",
    engTitle: "Concepts",
    description: "ระบบความรู้แบบเชื่อมโยง รวบรวมพื้นฐานของแต่ละศาสตร์",
    href: "/concepts",
    Icon: PsychologyIcon,
    accent: "#6E93A8", // psyche
  },
  {
    title: "สำนักคิดและนักปราชญ์",
    engTitle: "Schools & Thinkers",
    description: "ประวัติ แนวคิดสำคัญ และคุณูปการของนักคิดผู้บุกเบิก",
    href: "/schools",
    Icon: SchoolIcon,
    accent: "#8AA395", // mercurius
  },
  {
    title: "แผนที่ความสัมพันธ์",
    engTitle: "Constellation",
    description: "สำรวจปฏิสัมพันธ์ระหว่างแนวคิดในรูปโครงข่ายความรู้",
    href: "/constellation",
    Icon: ConceptIcon,
    accent: "#B9C2CE", // prima
  },
  {
    title: "เส้นทางการอ่าน",
    engTitle: "Reading Paths",
    description: "ลำดับการอ่านที่เรียงจากพื้นฐานสู่ความเข้าใจระดับลึก",
    href: "/reading-sets",
    Icon: PathIcon,
    accent: "#C9A24A", // sapientia เข้ม
  },
  {
    title: "แก่นเรื่อง",
    engTitle: "Themes",
    description: "แก่นความคิดข้ามศาสตร์ที่ปรากฏซ้ำ เช่น จิตไร้สำนึก เสรีภาพ ความหมาย",
    href: "/themes",
    Icon: SymbolismIcon,
    accent: "#B9C2CE", // prima
  },
  {
    title: "ศาสตร์ที่เราศึกษา",
    engTitle: "Disciplines",
    description: "สิบสองแขนงของการเข้าใจมนุษย์ — จิตวิทยา ปรัชญา ตำนาน วิทยาศาสตร์ และอื่น ๆ",
    href: "/disciplines",
    Icon: GridIcon,
    accent: "#C79A4A", // gold
    isNew: true,
  },
];

export default function KnowledgeHubPage() {
  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb
          items={[{ label: "หน้าแรก", href: "/" }, { label: "คลังความรู้" }]}
          className="mb-10"
        />

        {/* หัวข้อหน้าและบทนำ */}
        <header className="mb-14 space-y-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-burnished-gold/30 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-burnished-gold">
            <span className="h-[5px] w-[5px] rounded-full bg-burnished-gold" aria-hidden="true" />
            Knowledge Atlas
          </span>
          <h1 className="font-serif text-4xl tracking-tight text-ivory sm:text-5xl">
            เข้าสู่คลังความรู้
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-on-surface-variant/80">
            สารบัญนำทางสู่การทำความเข้าใจโลกภายในของมนุษย์ — เลือกเส้นทางที่อยากเริ่มต้น
            แต่ละส่วนมีสีประจำตาม Cosmology ของตัวเอง
          </p>
        </header>

        {/* การ์ดกลุ่มคลังความรู้ (ธีมมืด + accent cosmology) */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {KNOWLEDGE_SECTIONS.map((section) => {
            const Icon = section.Icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-boundary/25 bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-burnished-gold/40 hover:shadow-[0_28px_56px_-30px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
              >
                {/* แถบ accent บน — ขึ้นตอน hover */}
                <span
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ backgroundColor: section.accent }}
                  aria-hidden="true"
                />
                {/* แสงเรืองมุมบนขวา */}
                <span
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-90"
                  style={{ background: `radial-gradient(circle, color-mix(in srgb, ${section.accent} 18%, transparent), transparent 70%)` }}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl border"
                    style={{
                      color: section.accent,
                      borderColor: `color-mix(in srgb, ${section.accent} 30%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${section.accent} 10%, transparent)`,
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  {section.isNew ? (
                    <span className="rounded-md bg-soft-gold px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-prima">
                      ใหม่
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-on-surface-variant/45">
                      {section.engTitle}
                    </span>
                  )}
                </div>
                <h2 className="mt-5 font-serif text-xl text-ivory">{section.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-on-surface-variant/75">
                  {section.description}
                </p>
                <span
                  className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-all duration-300 group-hover:gap-2.5"
                  style={{ color: section.accent }}
                >
                  เข้าสู่ส่วนนี้
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* ท้ายหน้า — เชื่อมไปปฏิญญา */}
        <footer className="mt-16 border-t border-slate-boundary/40 pt-10 text-center">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 text-xs text-on-surface-variant/60 transition-colors duration-300 hover:text-burnished-gold"
          >
            อ่านปฏิญญาก่อตั้ง — เจตนารมณ์ของ ARCHRON
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
