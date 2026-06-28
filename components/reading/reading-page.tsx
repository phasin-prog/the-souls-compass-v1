import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentEntry, RelationType, SourceItem, Difficulty } from "@/types/content";
import { InternalLinkText } from "@/components/reading/internal-link-text";
import { conceptTitle } from "@/lib/content/concept-registry";

type Section = "articles" | "concepts";

const SECTION_LABEL: Record<Section, string> = {
  articles: "บทความ",
  concepts: "คลังแนวคิด",
};

const RELATION_LABEL: Record<RelationType, string> = {
  prerequisite: "ควรอ่านก่อน",
  related: "เกี่ยวข้องโดยตรง",
  "contrasts-with": "เปรียบเทียบ / ต่าง",
  "part-of": "เป็นส่วนหนึ่งของ",
  "source-of": "แหล่งที่มา",
  "used-in": "ถูกใช้ใน",
  "influenced-by": "ได้รับอิทธิพลจาก",
};

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "ผู้เริ่มต้น",
  intermediate: "ระดับกลาง",
  advanced: "อ่านลึก",
  "source-note": "บันทึกอ้างอิง",
};

const SOURCE_TYPE_LABEL: Record<string, string> = {
  "primary-source": "แหล่งต้นทาง",
  "secondary-source": "งานอธิบาย",
  commentary: "อรรถาธิบาย",
  "editorial-interpretation": "การตีความของเว็บ",
  website: "เว็บไซต์",
  "dictionary-lexicon": "พจนานุกรม / ศัพทานุกรม",
  other: "อื่น ๆ",
};

const MAX_RELATED_INLINE = 6;

// ประมาณเวลาอ่านจากความยาวเนื้อหา (ภาษาไทยไม่เว้นวรรค — ใช้จำนวนอักขระ ~400/นาที)
function readTime(entry: ContentEntry): string {
  const chars =
    (entry.visualExplanation ?? "").length +
    (entry.technicalMeaning ?? "").length +
    (entry.bodyMarkdown ?? "").length;
  return `${Math.max(1, Math.round(chars / 400))} นาที`;
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-surface-1/40 p-4">
      <dt className="text-[11px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-snug text-ivory">{value}</dd>
    </div>
  );
}

export function ReadingPage({
  entry,
  section = "concepts",
}: {
  entry: ContentEntry;
  section?: Section;
}) {
  const relatedInline = entry.relatedConcepts.slice(0, MAX_RELATED_INLINE);
  const hasOverflow = entry.relatedConcepts.length > MAX_RELATED_INLINE;

  const thinker =
    entry.mainThinkers && entry.mainThinkers.length > 0
      ? entry.mainThinkers.join(", ")
      : "—";
  const level = entry.difficulty ? DIFFICULTY_LABEL[entry.difficulty] : "—";
  const subtitleParts = [entry.thaiName, entry.originalTerm, entry.partOfSpeech].filter(Boolean);

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-10">
      {/* Breadcrumb */}
      <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link href="/" className="transition-colors hover:text-soft-gold">หน้าแรก</Link>
        <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
        <Link href={`/${section}`} className="transition-colors hover:text-soft-gold">
          {SECTION_LABEL[section]}
        </Link>
        <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
        <span className="text-soft-ivory">{entry.mainTerm ?? entry.title}</span>
      </nav>

      {/* Header Zone */}
      <header className="mt-7">
        <h1 className="font-serif text-4xl font-bold text-ivory md:text-5xl">
          {entry.mainTerm ?? entry.title}
        </h1>
        {subtitleParts.length > 0 || entry.ipa ? (
          <p className="mt-3 text-base text-soft-ivory">
            {subtitleParts.join(" · ")}
            {entry.ipa ? <span className="text-muted"> {entry.ipa}</span> : null}
          </p>
        ) : null}
        {entry.shortDescription ? (
          <p className="mt-5 text-lg leading-relaxed text-soft-ivory">{entry.shortDescription}</p>
        ) : null}
        {entry.updatedAt ? (
          <p className="mt-3 text-xs text-subtle">อัปเดตล่าสุด {entry.updatedAt}</p>
        ) : null}
      </header>

      {/* Meta-data Grid */}
      <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetaCell label="สำนัก / กรอบทฤษฎี" value={entry.framework ?? "—"} />
        <MetaCell label="นักคิดหลัก" value={thinker} />
        <MetaCell label="ระดับการอ่าน" value={level} />
        <MetaCell label="เวลาอ่านโดยประมาณ" value={readTime(entry)} />
      </dl>

      {/* Main Content Zone */}
      {entry.visualExplanation ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-ivory">คำอธิบายให้เห็นภาพ</h2>
          <p className="mt-4 whitespace-pre-line text-lg leading-loose text-soft-ivory">
            <InternalLinkText text={entry.visualExplanation} />
          </p>
        </section>
      ) : null}

      {entry.technicalMeaning ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-ivory">ความหมายทางวิชาการ / เทคนิค</h2>
          <p className="mt-4 whitespace-pre-line text-lg leading-loose text-soft-ivory">
            <InternalLinkText text={entry.technicalMeaning} />
          </p>
        </section>
      ) : null}

      {entry.bodyMarkdown && entry.bodyMarkdown.trim() !== "" ? (
        <section className="mt-12">
          <div className="md-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.bodyMarkdown}</ReactMarkdown>
          </div>
        </section>
      ) : null}

      {entry.roots ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-ivory">ที่มาของคำและบริบท</h2>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-soft-ivory">
            {entry.roots.etymology ? (
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" aria-hidden="true" />
                <span><span className="text-muted">รากศัพท์: </span>{entry.roots.etymology}</span>
              </li>
            ) : null}
            {entry.roots.historicalUsage ? (
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" aria-hidden="true" />
                <span><span className="text-muted">การใช้ในอดีต: </span>{entry.roots.historicalUsage}</span>
              </li>
            ) : null}
            {entry.roots.meaningShift ? (
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" aria-hidden="true" />
                <span><span className="text-muted">การเปลี่ยนความหมาย: </span>{entry.roots.meaningShift}</span>
              </li>
            ) : null}
          </ul>
          {entry.roots.caution ? (
            <p className="mt-4 border-l-2 border-antique-gold/40 pl-4 text-sm italic leading-relaxed text-muted">
              ข้อควรระวัง: {entry.roots.caution}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Ecosystem & Relations Zone */}
      {entry.relatedConcepts.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-serif text-2xl text-ivory">แนวคิดที่เกี่ยวข้อง</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedInline.map((rc) => (
              <Link
                key={rc.conceptSlug}
                href={`/concepts/${rc.conceptSlug}`}
                className="group flex flex-col rounded-md border border-white/10 bg-charcoal/40 p-5 transition-colors hover:border-antique-gold/40"
              >
                <span className="font-serif text-lg text-ivory group-hover:text-soft-gold">
                  {conceptTitle(rc.conceptSlug)}
                </span>
                <span className="mt-2 inline-block w-fit rounded-full border border-antique-gold/30 px-2.5 py-0.5 text-[11px] text-antique-gold">
                  {RELATION_LABEL[rc.relationType]}
                </span>
                {rc.reason ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{rc.reason}</p>
                ) : null}
              </Link>
            ))}
          </div>
          {hasOverflow ? (
            <Link href="/concepts" className="mt-5 inline-block text-sm text-soft-gold hover:underline">
              ดูแผนที่ความสัมพันธ์ทั้งหมด →
            </Link>
          ) : null}
        </section>
      ) : null}

      {/* Footer Zone — References */}
      {entry.references.length > 0 ? (
        <section className="mt-14">
          <h2 className="flex items-center gap-2 font-serif text-2xl text-ivory">
            <span className="material-symbols-outlined text-[22px] text-antique-gold">format_quote</span>
            เอกสารอ้างอิง
          </h2>
          <ol className="mt-5 space-y-3">
            {entry.references.map((s: SourceItem, i) => (
              <li key={i} className="text-sm leading-relaxed text-soft-ivory">
                <span className="mr-2 text-antique-gold">{i + 1}.</span>
                <span className="mr-1 text-xs uppercase tracking-wide text-antique-gold/70">
                  [{SOURCE_TYPE_LABEL[s.sourceType] ?? s.sourceType}]
                </span>
                <span className="text-ivory">{[s.author, s.title].filter(Boolean).join(", ")}</span>
                {s.year ? <span className="text-muted"> ({s.year})</span> : null}
                {s.relatedClaim ? (
                  <span className="mt-1 block text-muted">รองรับ: {s.relatedClaim}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* Engagement Box — on-brand (สำรวจความรู้ ไม่ใช่ขายบริการ) */}
      <aside className="mt-16 rounded-md border border-antique-gold/25 bg-surface-1/40 p-7 text-center">
        <h2 className="font-serif text-xl text-ivory">สำรวจแนวคิดนี้ต่อในบริบทที่กว้างขึ้น</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          เดินตามเส้นความสัมพันธ์ของแนวคิด หรืออ่านงานเรียบเรียงที่เชื่อมโยงกัน
          โดยไม่ลดทอนให้เหลือเพียงป้ายกำกับ
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/concepts"
            className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-antique-gold to-soft-gold px-6 py-3 text-sm font-semibold text-[#1a1306] transition-transform hover:-translate-y-0.5"
          >
            เปิดแผนที่ความสัมพันธ์
            <span className="material-symbols-outlined text-[18px]">hub</span>
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-sm text-ivory transition-colors hover:border-antique-gold hover:text-soft-gold"
          >
            อ่านบทความที่เกี่ยวข้อง
          </Link>
        </div>
      </aside>
    </main>
  );
}
