import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Manifesto — The Soul's Compass",
};

export default function ManifestoPage() {
  return (
    <main className="pb-24">
      <PageHeader kicker="Manifesto" title="เราไม่รีบทำให้ความซับซ้อนกลายเป็นคำตอบง่าย ๆ" />
      <section className="mx-auto max-w-2xl space-y-6 px-6 text-lg leading-loose text-soft-ivory">
        <p>
          ความรู้เกี่ยวกับจิตใจมนุษย์ไม่ควรถูกลดทอนเหลือเพียงป้ายกำกับ ประเภทบุคลิกภาพ
          หรือสูตรสำเร็จในการใช้ชีวิต
        </p>
        <p>
          The Soul&apos;s Compass จึงพยายามวางแนวคิดไว้ในบริบทเดิมของมัน พร้อมเปิดพื้นที่ให้การตีความ
          การเปรียบเทียบ และการตั้งคำถามเกิดขึ้นอย่างรับผิดชอบ
        </p>
        <p className="border-l-2 border-antique-gold/30 pl-5 text-base italic text-muted">
          เราไม่ได้ทำให้ความคิดซับซ้อนกลายเป็นคำตอบง่าย ๆ แต่ทำให้ความซับซ้อนนั้นอ่านได้
          ตรวจสอบได้ และเชื่อมโยงกันได้มากขึ้น
        </p>
      </section>
    </main>
  );
}
