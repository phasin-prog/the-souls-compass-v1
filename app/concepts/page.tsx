import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "คลังแนวคิด — The Soul's Compass",
};

const NODE_TYPES = [
  "แนวคิด (Concept)",
  "นักคิด (Person)",
  "หนังสือ/งานเขียน (Book)",
  "สำนักคิด (School)",
  "สัญลักษณ์ (Symbol)",
  "คำศัพท์ (Term)",
];

export default function ConceptsPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="คลังแนวคิด / Wiki"
        title="แผนที่ความรู้ของจิตใจมนุษย์"
        lead="ไม่ใช่หมวดบทความ แต่เป็นระบบความรู้แบบเชื่อมโยง ที่พาผู้อ่านเดินจากแนวคิดหนึ่งไปยังอีกแนวคิดอย่างมีเหตุผล"
      />
      <section className="mx-auto max-w-6xl px-6">
        <p className="text-sm tracking-widest text-antique-gold">ชนิดของ node</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {NODE_TYPES.map((t) => (
            <li key={t} className="rounded-md border border-white/10 bg-charcoal/40 px-5 py-4 text-soft-ivory">{t}</li>
          ))}
        </ul>
        <div className="mt-8 rounded-md border border-white/10 bg-surface-1/50 p-10 text-center">
          <p className="text-soft-ivory">ยังไม่มี node เผยแพร่ — โครงสร้าง Wiki จะถูกวางใน Phase 7</p>
          <p className="mt-2 text-sm text-muted">Concept Registry, backlinks และ Constellation Map จะตามมา</p>
        </div>
      </section>
      <PageNav current="/concepts" />
    </main>
  );
}
