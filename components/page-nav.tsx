import Link from "next/link";

// ลำดับหน้าสาธารณะสำหรับนำทาง ย้อนกลับ / ถัดไป
export const PAGE_ORDER = [
  { href: "/articles", label: "บทความ" },
  { href: "/concepts", label: "คลังแนวคิด" },
  { href: "/reading-sets", label: "ซีรีส์" },
  { href: "/sources", label: "แหล่งอ้างอิง" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/support", label: "สนับสนุน" },
];

export function PageNav({ current }: { current: string }) {
  const i = PAGE_ORDER.findIndex((p) => p.href === current);
  const prev = i > 0 ? PAGE_ORDER[i - 1] : null;
  const next = i >= 0 && i < PAGE_ORDER.length - 1 ? PAGE_ORDER[i + 1] : null;

  return (
    <nav className="mx-auto mt-20 max-w-6xl px-6" aria-label="นำทางระหว่างหน้า">
      <div className="grid grid-cols-3 items-center gap-4 border-t border-white/10 pt-8 text-sm">
        <div>
          {prev ? (
            <Link href={prev.href} className="text-soft-ivory transition-colors hover:text-soft-gold">
              ← {prev.label}
            </Link>
          ) : null}
        </div>
        <div className="text-center">
          <Link href="/" className="text-muted transition-colors hover:text-soft-gold">
            กลับหน้าแรก
          </Link>
        </div>
        <div className="text-right">
          {next ? (
            <Link href={next.href} className="text-soft-ivory transition-colors hover:text-soft-gold">
              {next.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
