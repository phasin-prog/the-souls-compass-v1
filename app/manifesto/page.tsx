import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "ปฏิญญาก่อตั้ง ARCHRON — The Founding Manifesto | ARCHRON",
  description:
    "ปฏิญญาก่อตั้งของ ARCHRON สำนักศึกษามนุษย์ — เจตนารมณ์ว่าด้วยการเชื่อมศาสตร์ที่ถูกแยกขาด การปกป้องความซื่อสัตย์ทางปัญญา และการแสวงหาความเข้าใจที่ไม่สิ้นสุด",
};

function Movement({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-reveal">
      <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-burnished-gold/70">
        {kicker}
      </span>
      <h2 className="mb-7 font-serif text-[25px] font-medium leading-snug text-on-surface md:text-[29px]">
        {title}
      </h2>
      <div className="space-y-5 text-lg leading-loose text-soft-ivory">{children}</div>
    </section>
  );
}

export default function ManifestoPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="ARCHRON · เจตนารมณ์"
        title="ปฏิญญาก่อตั้ง ARCHRON"
      />

      <div className="mx-auto max-w-2xl px-6">
        <p className="mb-16 text-center font-serif text-base tracking-[0.05em] text-burnished-gold/80">
          สำนักศึกษามนุษย์ · The School of Human Inquiry
        </p>

        <div className="space-y-20">
          {/* Preamble */}
          <Movement kicker="Preamble" title="อารัมภบท">
            <p>มนุษย์ได้สร้างอารยธรรมขึ้นจากคำถาม</p>
            <div className="border-l-2 border-antique-gold/30 pl-6 font-serif text-[1.18rem] leading-loose text-on-surface">
              <p>ก่อนที่เราจะมีวิทยาศาสตร์ เรามีตำนาน</p>
              <p>ก่อนที่เราจะมีปรัชญา เรามีสัญลักษณ์</p>
              <p>ก่อนที่เราจะมีจิตวิทยา เรามีความฝัน</p>
              <p>ก่อนที่เราจะมีภาษา เรามีความหมายที่พยายามจะถูกเอ่ยออกมา</p>
            </div>
            <p>
              ประวัติศาสตร์ของมนุษย์ จึงไม่ใช่เพียงประวัติศาสตร์ของเหตุการณ์
              แต่คือประวัติศาสตร์ของการแสวงหาความเข้าใจ
            </p>
            <p>
              ARCHRON ถือกำเนิดขึ้นจากความเชื่อว่า ศาสตร์ทั้งหลายไม่เคยเป็นศัตรูกัน
              มนุษย์ต่างหากที่แบ่งแยกมันออกจากกัน
            </p>
          </Movement>

          {/* Why We Exist */}
          <Movement kicker="Why We Exist" title="เหตุที่เราดำรงอยู่">
            <p>เราไม่ได้ก่อตั้ง ARCHRON เพราะโลกขาดข้อมูล โลกมีข้อมูลมากกว่าที่มนุษย์จะอ่านได้หมด</p>
            <p>สิ่งที่โลกขาด คือ ความสามารถในการเชื่อมโยง การเปรียบเทียบ การตีความ และการสร้างความหมายจากองค์ความรู้ที่กระจัดกระจาย</p>
            <p>
              ARCHRON จึงไม่ได้เกิดขึ้นเพื่อเพิ่มข้อมูลอีกหนึ่งกอง
              แต่เพื่อสร้างภาษาที่ทำให้ความรู้ต่างแขนงสามารถสนทนากันได้อีกครั้ง
            </p>
          </Movement>

          {/* What We Study */}
          <Movement kicker="What We Study" title="เราศึกษาอะไร">
            <p className="text-on-surface-variant/80">
              ARCHRON ไม่ได้ศึกษาจิตวิทยาเพียงอย่างเดียว ไม่ได้ศึกษาปรัชญาเพียงอย่างเดียว
              ไม่ได้ศึกษาศาสนา ประวัติศาสตร์ ภาษาศาสตร์ หรือมานุษยวิทยาเพียงอย่างเดียว
            </p>
            <p className="font-serif text-2xl leading-snug text-on-surface">
              เราศึกษา <span className="text-burnished-gold">มนุษย์</span>
            </p>
            <p>และทุกศาสตร์ที่เกิดจากความพยายามของมนุษย์ในการเข้าใจตนเอง</p>
          </Movement>

          {/* What We Believe */}
          <Movement kicker="What We Believe" title="สิ่งที่เราเชื่อ">
            <p>เราไม่เชื่อในผู้เผยความจริงเพียงหนึ่งเดียว เราไม่เชื่อในตำราที่สมบูรณ์ที่สุด และเราไม่เชื่อว่ามีทฤษฎีใดอธิบายมนุษย์ได้ทั้งหมด</p>
            <p>
              เรามองทุกระบบความคิด ทุกศาสนา ทุกอารยธรรม ทุกภาษา ทุกตำนาน ทุกทฤษฎี
              ในฐานะความพยายามของมนุษย์ที่จะเข้าใจความเป็นมนุษย์
            </p>
            <blockquote className="border-l-2 border-antique-gold/40 bg-surface-container py-5 pl-6 pr-5 font-serif text-xl leading-relaxed text-on-surface">
              ไม่มีระบบใดสมบูรณ์ แต่ไม่มีระบบใดไร้คุณค่า
            </blockquote>
          </Movement>

          {/* Our Method */}
          <Movement kicker="Our Method" title="วิธีของเรา">
            <p>เราเริ่มต้นจากต้นฉบับ เราเคารพบริบท เราเปรียบเทียบอย่างซื่อสัตย์</p>
            <p>เราแยกข้อเท็จจริงออกจากการตีความ และเปิดเผยข้อจำกัดของทุกแนวคิด รวมถึงของเราเอง</p>
            <p>เราเชื่อมโยงศาสตร์ เราสังเคราะห์กรอบใหม่เมื่อหลักฐานรองรับ</p>
            <p>และเราพร้อมแก้ไขสิ่งที่เราเคยเชื่อ หากเหตุผลและหลักฐานชี้ไปในทิศทางที่ดีกว่า</p>
          </Movement>

          {/* What We Reject */}
          <Movement kicker="What We Reject" title="สิ่งที่เราปฏิเสธ">
            <ul className="space-y-3">
              {[
                "ลัทธิบูชาบุคคล",
                "การเลือกอุดมการณ์มาก่อนข้อเท็จจริง",
                "การตัดข้อความออกจากบริบทเพื่อสนับสนุนข้อสรุปที่เตรียมไว้แล้ว",
                "การแบ่งโลกออกเป็นคู่ตรงข้ามอย่างง่ายดาย",
                "การลดทอนมนุษย์ให้เหลือเพียงสูตรเดียว",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="select-none text-burnished-gold">—</span>
                  <span>เราปฏิเสธ{x}</span>
                </li>
              ))}
            </ul>
          </Movement>

          {/* What We Offer */}
          <Movement kicker="What We Offer" title="สิ่งที่เรามอบ">
            <p>ARCHRON ไม่ได้มอบคำตอบสุดท้าย เรามอบเครื่องมือในการตั้งคำถามที่ดีขึ้น</p>
            <p>เรามอบ แผนที่ · ภาษา · แนวคิด · โครงสร้าง · และบทสนทนา</p>
            <p>เพื่อให้แต่ละคนสร้างความเข้าใจของตนเองอย่างมีเหตุผลและมีความรับผิดชอบ</p>
          </Movement>

          {/* Our Responsibility */}
          <Movement kicker="Our Responsibility" title="ความรับผิดชอบของเรา">
            <p>เราไม่ใช่เจ้าของความจริง เราเป็นเพียงผู้ดูแลบทสนทนาของมนุษยชาติ</p>
            <p>หน้าที่ของเราไม่ใช่การปกป้องทฤษฎี แต่คือการปกป้องความซื่อสัตย์ทางปัญญา</p>
            <p>
              เพราะความรู้ที่ไม่ยอมรับการตรวจสอบ ย่อมกลายเป็นความเชื่อ
              และความเชื่อที่ไม่ยอมรับการวิพากษ์ ย่อมกลายเป็นลัทธิ
            </p>
            <blockquote className="border-l-2 border-antique-gold/40 bg-surface-container py-5 pl-6 pr-5 font-serif text-xl leading-relaxed text-on-surface">
              ARCHRON จะไม่กลายเป็นลัทธิ แม้แต่ลัทธิของตัวเอง
            </blockquote>
          </Movement>

          {/* Our Legacy */}
          <Movement kicker="Our Legacy" title="มรดกของเรา">
            <p>เราไม่ได้หวังให้ทุกคนเห็นด้วยกับเรา เราไม่ได้หวังให้ ARCHRON เป็นคำตอบสุดท้าย</p>
            <p>
              สิ่งที่เราปรารถนา คือการทำให้มนุษย์รุ่นต่อไปมีภาษาที่ดีกว่าเดิม
              ในการเข้าใจตนเอง เข้าใจผู้อื่น และเข้าใจโลก
            </p>
            <p>
              หากวันหนึ่ง มีผู้สร้างกรอบความคิดที่ดีกว่า ARCHRON และสามารถอธิบายมนุษย์ได้อย่างซื่อสัตย์
              รอบด้าน และลึกซึ้งกว่า เราหวังว่าเขาจะทำได้
            </p>
            <p>
              เพราะเป้าหมายของ ARCHRON ไม่ใช่การคงอยู่ของชื่อ
              แต่คือความก้าวหน้าของความเข้าใจเกี่ยวกับมนุษย์
            </p>
          </Movement>

          {/* Closing Declaration */}
          <section className="scroll-reveal text-center">
            <div className="mx-auto mb-10 h-px w-16 bg-burnished-gold/30" />
            <span className="mb-6 block text-[11px] font-semibold uppercase tracking-[0.2em] text-burnished-gold/70">
              Closing Declaration
            </span>
            <div className="space-y-2 font-serif text-2xl leading-relaxed text-on-surface md:text-[28px]">
              <p>ARCHRON is not a destination.</p>
              <p>It is an invitation.</p>
              <p className="text-on-surface-variant/80">Not to believe. But to inquire.</p>
              <p className="text-on-surface-variant/80">
                Not to inherit certainty. But to cultivate understanding.
              </p>
            </div>
            <p className="mt-10 font-serif text-lg italic tracking-[0.04em] text-burnished-gold">
              The inquiry continues.
            </p>
            <div className="mx-auto mt-10 h-px w-16 bg-burnished-gold/30" />
          </section>
        </div>
      </div>

      <PageNav current="/manifesto" />
    </main>
  );
}
