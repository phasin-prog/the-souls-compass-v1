"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContextMenu, type ContextMenuItem } from "@/components/context-menu";

// ลิงก์ [[wikilink]] ในเนื้อหาอ่าน + เมนูลัด wiki (inline, คลิกขวา/กดค้าง)
export function InternalConceptLink({ slug, label }: { slug: string; label: string }) {
  const router = useRouter();
  const href = `/concepts/${slug}`;

  const items: ContextMenuItem[] = [
    { label: "เปิดหน้าเต็ม", icon: "open_in_full", onSelect: () => router.push(href) },
    {
      label: "ดูในแผนที่ความสัมพันธ์",
      icon: "hub",
      onSelect: () => router.push(`/constellation?focus=${slug}`),
    },
    {
      label: "คัดลอกลิงก์",
      icon: "link",
      onSelect: () => {
        navigator.clipboard?.writeText(`${window.location.origin}${href}`).catch(() => {});
      },
    },
  ];

  return (
    <ContextMenu as="span" items={items} className="inline">
      <Link href={href} className="text-soft-gold hover:underline">
        {label}
      </Link>
    </ContextMenu>
  );
}
