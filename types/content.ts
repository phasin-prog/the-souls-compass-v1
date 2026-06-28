// types/content.ts — โครงข้อมูลเริ่มต้น (v0.1)
// ขยายเต็มใน Phase 3 (Content Architecture) และ Phase 7 (Wiki / Concept Registry)

export type ArticleStatus =
  | "draft"
  | "needs-source-check"
  | "ready-to-publish"
  | "published"
  | "archived";

export type ContentType =
  | "article"
  | "concept"
  | "reading-set"
  | "source-note"
  | "person"
  | "book"
  | "school"
  | "symbol"
  | "term";

export type Difficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "source-note";

export type RelationType =
  | "prerequisite"
  | "related"
  | "contrasts-with"
  | "part-of"
  | "source-of"
  | "used-in"
  | "influenced-by";
