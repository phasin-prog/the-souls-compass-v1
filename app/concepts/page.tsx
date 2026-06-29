import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { conceptRegistry } from "@/lib/content/concept-registry";
import { ConceptCard } from "@/components/concepts/concept-card";

export const metadata: Metadata = {
  title: "คลังแนวคิด — ARCHRON",
};

export default function ConceptsPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="คลังแนวคิด / Wiki"
        title="แผนที่ความรู้ของจิตใจมนุษย์"
        lead="ไม่ใช่หมวดบทความ แต่เป็นระบบความรู้แบบเชื่อมโยง ที่พาผู้อ่านเดินจากแนวคิดหนึ่งไปยังอีกแนวคิดอย่างมีเหตุผล"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        <p className="mb-4 text-xs text-muted">
          เคล็ดลับ: คลิกขวา (หรือกดค้างบนมือถือ) ที่การ์ดแนวคิด เพื่อเปิดเมนูลัด
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conceptRegistry.map((c) => (
            <ConceptCard key={c.slug} c={c} />
          ))}
        </div>
      </section>
      <PageNav current="/concepts" />
    </main>
  );
}
