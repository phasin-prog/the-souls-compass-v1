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
} from "@/components/icons";

export const metadata: Metadata = {
  title: "เข้าสู่คลังความรู้ — ARCHRON",
  description:
    "สารบัญนำทางคลังความรู้ของ ARCHRON — บทความ คลังแนวคิด สำนักคิด แผนที่ความสัมพันธ์ และเส้นทางการอ่าน",
};

type KnowledgeCard = {
  title: string;
  engTitle: string;
  description: string;
  href: string;
  Icon: ComponentType<{ className?: string }>; // ภาษาไอคอน ARCHRON (line icon)
  accent: string; // Material Cosmology hex
};

const KNOWLEDGE_SECTIONS: KnowledgeCard[] = [
  {
    title: "บทความ",
    engTitle: "Articles",
    description: "งานอ่านที่อธิบายและตีความแนวคิดสำคัญในบริบทของมัน",
    href: "/articles",
    Icon: BookIcon,
    accent: "#CBA45A", // Sapientia
  },
  {
    title: "คลังแนวคิด",
    engTitle: "Concepts",
    description: "ระบบความรู้แบบเชื่อมโยง รวบรวมพื้นฐานของแต่ละศาสตร์",
    href: "/concepts",
    Icon: PsychologyIcon, // ICON LANGUAGE — จิตวิทยา/จิต
    accent: "#6E93A8", // Psyche
  },
  {
    title: "สำนักคิดและนักปราชญ์",
    engTitle: "Schools & Thinkers",
    description: "ประวัติ แนวคิดสำคัญ และคุณูปการของนักคิดผู้บุกเบิก",
    href: "/schools",
    Icon: SchoolIcon,
    accent: "#8AA395", // Mercurius
  },
  {
    title: "แผนที่ความสัมพันธ์",
    engTitle: "Constellation",
    description: "สำรวจปฏิสัมพันธ์ระหว่างแนวคิดในรูปโครงข่ายความรู้",
    href: "/constellation",
    Icon: ConceptIcon, // โครงข่ายโหนด
    accent: "#B9C2CE", // Prima Materia
  },
  {
    title: "เส้นทางการอ่าน",
    engTitle: "Reading Paths",
    description: "ลำดับการอ่านที่เรียงจากพื้นฐานสู่ความเข้าใจระดับลึก",
    href: "/reading-sets",
    Icon: PathIcon,
    accent: "#C9A24A", // Sapientia เข้ม
  },
  {
    title: "แก่นเรื่อง",
    engTitle: "Themes",
    description: "แก่นความคิดข้ามศาสตร์ที่ปรากฏซ้ำในหลายสาขา เช่น จิตไร้สำนึก เสรีภาพ ความหมาย",
    href: "/themes",
    Icon: SymbolismIcon,
    accent: "#B9C2CE", // Prima Materia — จุดตัดของความหมาย
  },
];

export default function KnowledgeHubPage() {
  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* เส้นทางนำทางกลับหน้าแรก */}
        <Breadcrumb
          items={[{ label: "หน้าแรก", href: "/" }, { label: "คลังความรู้" }]}
          className="mb-10"
        />
        {/* หัวข้อหน้าและบทนำ */}
        <header className="mb-16 space-y-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-burnished-gold/30 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-burnished-gold">
            <span className="material-symbols-outlined text-[14px]">explore</span>
            Knowledge Atlas
          </span>
          <h1 className="font-serif text-4xl tracking-tight text-on-surface sm:text-5xl">
            เข้าสู่คลังความรู้
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-on-surface-variant/80">
            สารบัญนำทางสู่การทำความเข้าใจโลกภายในของมนุษย์ ผ่านจิตวิทยา จิตวิเคราะห์
            ปรัชญา และศาสตร์ว่าด้วยมนุษย์ — เลือกเส้นทางที่อยากเริ่มต้น
          </p>
        </header>

        {/* ตารางกลุ่มคลังความรู้ */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KNOWLEDGE_SECTIONS.map((section) => {
            const Icon = section.Icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-ink/10 bg-paper-raised p-6 shadow-[0_12px_30px_-20px_rgba(24,27,36,0.3)] transition-all duration-500 hover:-translate-y-1 hover:border-burnished-gold/40 hover:shadow-[0_20px_44px_-22px_rgba(24,27,36,0.35)]"
              >
                {/* แถบ accent บน — สีตาม Material Cosmology */}
                <span
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ backgroundColor: section.accent }}
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${section.accent}14`, color: section.accent }}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant/55">
                      {section.engTitle}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-serif text-xl text-on-surface transition-colors duration-300 group-hover:text-burnished-gold">
                      {section.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-on-surface-variant/70">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-burnished-gold opacity-80 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  เข้าสู่ส่วนนี้
                  <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ท้ายหน้า — เชื่อมไปปฏิญญา */}
        <footer className="mt-20 border-t border-slate-boundary/40 pt-10 text-center">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 text-xs text-on-surface-variant/60 transition-colors duration-300 hover:text-burnished-gold"
          >
            อ่านปฏิญญาก่อตั้ง — เจตนารมณ์ของ ARCHRON
            <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
