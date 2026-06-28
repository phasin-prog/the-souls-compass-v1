import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { getEntryBySlug, allEntrySlugs } from "@/lib/content/entries";

// Next 15: params เป็น Promise — ต้อง await
export function generateStaticParams() {
  return allEntrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  return {
    title: entry
      ? `${entry.title} — The Soul's Compass`
      : "ไม่พบหน้า — The Soul's Compass",
  };
}

export default async function ArticleEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) {
    notFound();
  }
  return <ReadingPage entry={entry} />;
}
