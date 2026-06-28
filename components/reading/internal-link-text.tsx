import Link from "next/link";
import { parseInternalLinks } from "@/lib/content/internal-links";

// render ข้อความที่อาจมี [[ ]] internal link เป็นข้อความ + ลิงก์ไป node จริง
// dead link (ไม่พบ node) จะแสดงเป็นข้อความเตือนแบบ dotted ไม่ใช่ลิงก์
export function InternalLinkText({ text }: { text: string }) {
  const tokens = parseInternalLinks(text);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.type === "text") {
          return <span key={i}>{t.value}</span>;
        }
        if (t.dead) {
          return (
            <span
              key={i}
              className="text-danger underline decoration-dotted"
              title="dead link — ไม่พบ node ปลายทางใน registry"
            >
              {t.label}
            </span>
          );
        }
        return (
          <Link key={i} href={`/concepts/${t.slug}`} className="text-soft-gold hover:underline">
            {t.label}
          </Link>
        );
      })}
    </>
  );
}
