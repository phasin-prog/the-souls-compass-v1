import type { Metadata } from "next";
import Link from "next/link";
import { getPublicEntries } from "@/lib/content/public-source";
import {
  buildGraph,
  NODE_TYPE_LABEL,
  NODE_TYPE_ORDER,
  type GraphNode,
} from "@/lib/content/graph";
import { ConstellationGraph } from "@/components/constellation/constellation-graph";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "แผนที่ความสัมพันธ์ — The Soul's Compass",
  description:
    "กราฟความสัมพันธ์ระหว่างแนวคิด นักคิด หนังสือ และสำนักคิด ในคลังความรู้จิตใจมนุษย์ — สำรวจว่าแต่ละแนวคิดเชื่อมโยงกันอย่างไร",
};

export default async function ConstellationPage() {
  const graph = buildGraph(await getPublicEntries());

  const grouped = NODE_TYPE_ORDER.map((nt) => ({
    nt,
    items: graph.nodes
      .filter((n) => n.nodeType === nt)
      .sort((a: GraphNode, b: GraphNode) => b.degree - a.degree),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-soft-gold">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <Link href="/concepts" className="transition-colors hover:text-soft-gold">คลังแนวคิด</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <span className="text-soft-ivory">แผนที่ความสัมพันธ์</span>
        </nav>

        <header className="mt-6 mb-6">
          <h1 className="font-serif text-4xl font-bold text-ivory">แผนที่ความสัมพันธ์</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-soft-ivory">
            กราฟแสดงความเชื่อมโยงระหว่างแนวคิด นักคิด หนังสือ และสำนักคิดทั้งระบบ —
            ชี้ที่ node เพื่อดูความสัมพันธ์ คลิกเพื่อเปิดหน้าเต็ม node ที่ถูกอ้างถึงมากจะเด่นเป็นพิเศษ
          </p>
        </header>

        <ConstellationGraph data={graph} />

        {/* Fallback (no-JS / a11y): รายการ node จัดกลุ่มตามชนิด เป็นลิงก์ */}
        <noscript>
          <section className="mt-10">
            <p className="text-sm text-muted">
              กราฟต้องใช้ JavaScript — ด้านล่างคือรายการแนวคิดทั้งหมดแบบลิงก์
            </p>
            {grouped.map((g) => (
              <div key={g.nt} className="mt-6">
                <h2 className="font-serif text-xl text-ivory">{NODE_TYPE_LABEL[g.nt]}</h2>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {g.items.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/concepts/${n.id}`}
                        className="text-sm text-soft-ivory hover:text-soft-gold"
                      >
                        {n.thaiTitle || n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </noscript>
      </div>
    </main>
  );
}
