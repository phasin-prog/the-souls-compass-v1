import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { getEntryBySlug, allEntrySlugs } from "@/lib/content/entries";

export function generateStaticParams() {
  return allEntrySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const entry = getEntryBySlug(params.slug);
  return {
    title: entry
      ? `${entry.title} — The Soul's Compass`
      : "ไม่พบหน้า — The Soul's Compass",
  };
}

export default function ArticleEntryPage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = getEntryBySlug(params.slug);
  if (!entry) {
    notFound();
  }
  return <ReadingPage entry={entry} />;
}
