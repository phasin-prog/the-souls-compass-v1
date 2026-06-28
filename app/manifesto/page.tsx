import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "Manifesto — ARCHRON",
};

export default function ManifestoPage() {
  return (
    <main className="pb-24">
      <PageHeader kicker="Manifesto" title="เราไม่รีบทำให้ความซับซ้อนกลายเป็นคำตอบง่าย ๆ" />
      <section className="scroll-reveal stagger-1 mx-auto max-w-2xl space-y-6 px-6 text-lg leading-loose text-soft-ivory">
        <p>
          ความรู้เกี่ยวกับจิตใจมนุษย์ไม่ควรถูกลดทอนเหลือเพียงป้ายกำกับ ประเภทบุคลิกภาพ
          หรือสูตรสำเร็จในการใช้ชีวิต
        </p>
        <p>
          ARCHRON จึงพยายามวางแนวคิดไว้ในบริบทเดิมของมัน พร้อมเปิดพื้นที่ให้การตีความ
          การเปรียบเทียบ และการตั้งคำถามเกิดขึ้นอย่างรับผิดชอบ
        </p>
        <p className="border-l-2 border-antique-gold/30 pl-5 text-base italic text-muted">
          เราไม่ได้ทำให้ความคิดซับซ้อนกลายเป็นคำตอบง่าย ๆ แต่ทำให้ความซับซ้อนนั้นอ่านได้
          ตรวจสอบได้ และเชื่อมโยงกันได้มากขึ้น
        </p>
      </section>
      <PageNav current="/manifesto" />
    </main>
  );
}
