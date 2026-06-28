import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "บทความ — The Soul's Compass",
};

export default function ArticlesPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="บทความ"
        title="บทความ"
        lead="งานอ่านที่อธิบาย วิเคราะห์ และตีความแนวคิดเกี่ยวกับจิตใจมนุษย์ โดยวางไว้ในบริบทเดิมและเชื่อมกลับไปยังแนวคิดและแหล่งอ้างอิง"
      />
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-md border border-white/10 bg-surface-1/50 p-10 text-center">
          <p className="text-soft-ivory">ยังไม่มีบทความเผยแพร่ — กำลังจัดเตรียมเนื้อหาชุดแรก</p>
          <p className="mt-2 text-sm text-muted">เนื้อหาเริ่มต้นจะถูกเพิ่มใน Phase 13 (Initial Content Seed)</p>
        </div>
      </section>
    </main>
  );
}
