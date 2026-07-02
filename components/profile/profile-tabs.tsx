"use client";

import { useState, type ReactNode } from "react";

// สลับแท็บบนหน้า /profile — client component เล็ก ๆ (state อยู่ฝั่ง client)
// รับ content ของแต่ละแท็บเป็น ReactNode (เรนเดอร์จาก server component แม่)
// showWork = แสดงแท็บ "งานของฉัน" เฉพาะนักเขียน

export type ProfileTabKey = "reading" | "work";

export function ProfileTabs({
  reading,
  work,
  showWork,
}: {
  reading: ReactNode;
  work: ReactNode;
  showWork: boolean;
}) {
  const [active, setActive] = useState<ProfileTabKey>("reading");

  const tabs: { key: ProfileTabKey; label: string; icon: string; show: boolean }[] = [
    { key: "reading", label: "การอ่านของฉัน", icon: "auto_stories", show: true },
    { key: "work", label: "งานของฉัน", icon: "edit_note", show: showWork },
  ];

  return (
    <div>
      {/* แถบแท็บ */}
      <div
        role="tablist"
        aria-label="หมวดโปรไฟล์"
        className="flex flex-wrap gap-2 border-b border-slate-boundary/30"
      >
        {tabs
          .filter((t) => t.show)
          .map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(t.key)}
                className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-burnished-gold text-soft-gold"
                    : "border-transparent text-muted hover:text-soft-ivory"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  {t.icon}
                </span>
                {t.label}
              </button>
            );
          })}
      </div>

      {/* เนื้อหาแท็บ */}
      <div className="mt-8">
        <div hidden={active !== "reading"}>{reading}</div>
        {showWork ? <div hidden={active !== "work"}>{work}</div> : null}
      </div>
    </div>
  );
}
