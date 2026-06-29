import type { ReactNode } from "react";

// EmptyState — สถานะว่าง/ยังไม่มีเนื้อหา แบบมาตรฐาน
// ใช้ทุกหน้า list เพื่อความสม่ำเสมอ (articles, reading-sets, sources, ฯลฯ)
// icon = ชื่อ Material Symbols (เช่น "menu_book", "auto_stories")
export function EmptyState({
  icon = "inbox",
  title,
  description,
  children,
}: {
  icon?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-md border border-ink/10 bg-surface-1/50 p-10 text-center">
      <span
        className="material-symbols-outlined text-[32px] text-on-surface-variant/40"
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className="mt-4 text-lg font-serif text-soft-ivory">{title}</p>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}