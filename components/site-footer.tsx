import Link from "next/link";

const FOOT_NAV = [
  { label: "บทความ", href: "/#knowledge" },
  { label: "คลังแนวคิด", href: "/#concept" },
  { label: "ซีรีส์", href: "/#concept" },
  { label: "แหล่งอ้างอิง", href: "/#footer" },
  { label: "Manifesto", href: "/#manifesto" },
  { label: "สนับสนุน", href: "/#footer" },
];

export function SiteFooter() {
  return (
    <footer id="footer" className="border-t border-antique-gold/15 bg-[#080B16]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-serif text-lg text-ivory">The Soul&apos;s Compass</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            คลังความรู้จิตวิทยา ปรัชญา และจิตใจมนุษย์
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-7 gap-y-3" aria-label="เมนูย่อ">
          {FOOT_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-soft-ivory transition-colors hover:text-soft-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-xs text-subtle">
            สร้างขึ้นเพื่อการศึกษา การอ่าน และการตีความอย่างมีบริบท
          </p>
        </div>
      </div>
    </footer>
  );
}
