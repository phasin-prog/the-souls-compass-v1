import type { ContentEntry } from "@/types/content";

// ข้อมูลตัวอย่าง (Phase 6) — เนื้อหาจริงชุดแรกจะมาใน Phase 13 (Initial Content Seed)
export const entries: ContentEntry[] = [
  {
    id: "concept-psyche",
    title: "Psyche",
    slug: "psyche",
    status: "published",
    contentType: "concept",
    author: "The Soul's Compass",
    publishedAt: "2026-06-24",
    updatedAt: "2026-06-28",
    mainTerm: "Psyche",
    thaiName: "ไซคี",
    originalTerm: "psukhē (Greek)",
    partOfSpeech: "noun",
    languageRoot: "Greek",
    ipa: "/ˈsaɪ.kiː/",
    shortDescription:
      "ระบบชีวิตทางจิตทั้งหมด ทั้งส่วนที่รู้ตัวและส่วนที่ยังทำงานอยู่ใต้ระดับการรู้ตัว",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "intermediate",
    tags: ["psyche", "depth-psychology", "jung"],
    visualExplanation:
      "Psyche ไม่ได้หมายถึง จิตใจ ในความหมายแคบแบบความคิดประจำวันเท่านั้น แต่เป็นชื่อเรียกพื้นที่ทั้งหมดของชีวิตภายใน ทั้งส่วนที่เรารู้ตัวและส่วนที่ยังทำงานอยู่ใต้ระดับการรู้ตัว",
    technicalMeaning:
      "ในกรอบจิตวิทยาวิเคราะห์ Psyche หมายถึงระบบชีวิตทางจิตทั้งหมด ไม่ได้จำกัดอยู่เฉพาะ Ego หรือจิตสำนึก แต่รวมถึง unconscious, complexes, archetypal patterns และกระบวนการที่ทำให้ชีวิตภายในจัดรูปตัวเอง",
    relatedConcepts: [
      { conceptSlug: "ego", relationType: "part-of", reason: "Ego เป็นศูนย์กลางของจิตสำนึกภายใน Psyche" },
      { conceptSlug: "unconscious", relationType: "part-of", reason: "จิตไร้สำนึกเป็นส่วนสำคัญของ Psyche" },
      { conceptSlug: "self", relationType: "related", reason: "Self คือศูนย์รวมและภาพรวมของ Psyche" },
    ],
    references: [
      {
        sourceType: "primary-source",
        author: "C. G. Jung",
        title: "Collected Works",
        relatedClaim: "นิยาม Psyche ในกรอบจิตวิทยาวิเคราะห์",
      },
      {
        sourceType: "editorial-interpretation",
        title: "การเรียบเรียงของ The Soul's Compass",
        relatedClaim: "การสรุปภาพรวมเพื่อการอ่าน — เป็นการตีความ ไม่ใช่ข้อความจากแหล่งต้นทาง",
      },
    ],
    roots: {
      etymology:
        "คำว่า psyche มาจากภาษากรีก psukhē ซึ่งเกี่ยวข้องกับลมหายใจ ชีวิต หรือวิญญาณในบางบริบทโบราณ",
      meaningShift:
        "เมื่อเข้าสู่จิตวิทยาสมัยใหม่ คำนี้ค่อย ๆ ถูกใช้เพื่อพูดถึงระบบชีวิตทางจิต ไม่ใช่เพียง soul ในความหมายศาสนาหรืออภิปรัชญา",
      caution:
        "รากศัพท์ช่วยให้เห็นประวัติของคำ แต่ไม่ควรถูกใช้แทนนิยามเชิงทฤษฎีโดยตรง",
    },
    relatedCTA: {
      conceptSlugs: ["ego", "unconscious", "self"],
      showConstellationMap: false,
    },
  },
];

export function getEntryBySlug(slug: string): ContentEntry | undefined {
  return entries.find((e) => e.slug === slug);
}

export function allEntrySlugs(): string[] {
  return entries.map((e) => e.slug);
}
