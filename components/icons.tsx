// ชุดไอคอน line แบบ minimal — ใช้ currentColor (คุมสีด้วย Tailwind text-*)
// ขนาดปรับผ่าน className (ดีฟอลต์ h-5 w-5)

type IconProps = { className?: string };

const SVG = (className: string, children: React.ReactNode) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

// ARCHRON mark — วงกลมเปิด (ความรู้ไม่สิ้นสุด) + จุดศูนย์กลาง (มนุษย์)
// แทนไอคอน compass เดิม ตาม Founding Brand Codex (เลี่ยงสัญลักษณ์เข็มทิศ)
export function ArchronMark({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        strokeDasharray="42 8.3"
        transform="rotate(-55 12 12)"
      />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ARCHRON Logomark — vesica: วงรอบ (อารยธรรม) + สองวงซ้อน (จุดตัดของศาสตร์) + จุดศูนย์กลาง (มนุษย์)
// ใช้ currentColor คุมสีด้วย Tailwind text-* (ปกติ text-burnished-gold)
export function ArchronLogomark({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="21" strokeWidth="1.1" opacity="0.85" />
      <circle cx="17.5" cy="24" r="12.5" strokeWidth="1.4" />
      <circle cx="30.5" cy="24" r="12.5" strokeWidth="1.4" />
      <circle cx="24" cy="3.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="24" cy="44.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="24" cy="24" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ConceptIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <line x1="8" y1="11" x2="16" y2="7" />
      <line x1="8" y1="13" x2="16" y2="17" />
    </>,
  );
}

export function PersonIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
    </>,
  );
}

export function BookIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 6c-1.5-1.2-3.5-2-6-2v13c2.5 0 4.5.8 6 2 1.5-1.2 3.5-2 6-2V4c-2.5 0-4.5.8-6 2z" />
      <line x1="12" y1="6" x2="12" y2="21" />
    </>,
  );
}

export function SchoolIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M4 9l8-4 8 4" />
      <line x1="6" y1="10" x2="6" y2="17" />
      <line x1="10" y1="10" x2="10" y2="17" />
      <line x1="14" y1="10" x2="14" y2="17" />
      <line x1="18" y1="10" x2="18" y2="17" />
      <line x1="4" y1="19" x2="20" y2="19" />
    </>,
  );
}

export function SymbolIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 3l9 9-9 9-9-9z" />
      <circle cx="12" cy="12" r="2.2" />
    </>,
  );
}

export function TermIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M4 12l7-7h6a1 1 0 0 1 1 1v6l-7 7z" />
      <circle cx="14.5" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
    </>,
  );
}

export function SourceIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
      <line x1="9.5" y1="13" x2="16" y2="13" />
      <line x1="9.5" y1="16" x2="16" y2="16" />
    </>,
  );
}

export function PathIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="5" cy="6" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="18" r="1.8" />
      <line x1="6.4" y1="7.2" x2="10.6" y2="10.8" />
      <line x1="13.4" y1="13.2" x2="17.6" y2="16.8" />
    </>,
  );
}

export function SearchIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="11" cy="11" r="6" />
      <line x1="20" y1="20" x2="15.5" y2="15.5" />
    </>,
  );
}

export function MenuIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>,
  );
}

export function ArrowRightIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <line x1="4" y1="12" x2="19" y2="12" />
      <path d="M13 6l6 6-6 6" />
    </>,
  );
}

/* ============================================================================
   ARCHRON — ICON LANGUAGE (ชุดไอคอนประจำศาสตร์ ตาม brand board)
   ลายเส้นเชิงสัญลักษณ์ในวงแหวนล้อมรอบ (signature ของบอร์ด) · currentColor · 24x24
   ============================================================================ */

// ตัวห่อมาตรฐาน: วงแหวนวงนอก (ซิกเนเจอร์บอร์ด) + กลีฟด้านใน
const RingSVG = (className: string, children: React.ReactNode) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10.6" strokeWidth={0.9} opacity={0.55} />
    {children}
  </svg>
);

// จิตวิทยา — ร่างนั่งสงบ/จิต (psyche) ในวงแหวน
export function PsychologyIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="8.2" r="1.6" />
      <path d="M7.8 16.6c0-2.8 1.9-4.8 4.2-4.8s4.2 2 4.2 4.8" />
      <path d="M9 13.8c.9-.7 1.9-1 3-1s2.1.3 3 1" />
    </>,
  );
}

// ปรัชญา — ต้นไม้แห่งความคิด (ทรงพุ่ม + ราก)
export function PhilosophyIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <path d="M12 17.6V10.2" />
      <path d="M12 17.6l-1.7 1.5M12 17.6l1.7 1.5" />
      <path d="M7.4 10.6A4.7 4.7 0 0 1 16.6 10.6" />
      <path d="M12 12.6l-2.5-1.9M12 12.6l2.5-1.9" />
    </>,
  );
}

// มานุษยวิทยา — มนุษย์ (กางแขน-ขา, ความเป็นมนุษย์)
export function AnthropologyIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="7.4" r="1.6" />
      <path d="M12 9v4.6" />
      <path d="M12 10.6L8.3 8.1M12 10.6l3.7-2.5" />
      <path d="M12 13.6L9.3 17.6M12 13.6l2.7 4" />
    </>,
  );
}

// ประวัติศาสตร์ — นาฬิกาทราย (กาลเวลา)
export function HistoryIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <path d="M8.2 6.8h7.6M8.2 17.2h7.6" />
      <path d="M9 6.8c0 3.7 6 3.9 6 5.2 0 1.3-6 1.5-6 5.2" />
      <path d="M15 6.8c0 3.7-6 3.9-6 5.2 0 1.3 6 1.5 6 5.2" />
    </>,
  );
}

// ภาษา — หนังสือ/แผ่นจารึก (ตัวอักษรและการตีความ)
export function LanguageIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <path d="M12 8.6C10.5 7.6 8.7 7.4 7 7.6v9c1.7-.2 3.5.1 5 1.1 1.5-1 3.3-1.3 5-1.1v-9c-1.7-.2-3.5.1-5 1z" />
      <path d="M12 8.6v9.1" />
    </>,
  );
}

// ตำนาน — สัตว์มีปีก (ปีกกางออกจากศูนย์)
export function MythologyIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="9.2" r="1.1" />
      <path d="M12 10.6v6" />
      <path d="M12 11.4C9.4 9.4 7.6 10.1 5.8 8.6c.8 2.4 2.5 3.7 5.2 3.9" />
      <path d="M12 11.4c2.6-2 4.4-1.3 6.2-2.8-.8 2.4-2.5 3.7-5.2 3.9" />
    </>,
  );
}

// ศาสนา — ร่างมีรัศมี/ภาวะเหนือพ้น
export function ReligionIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="9" r="1.7" />
      <path d="M9.3 7.4c0-1 1.2-1.8 2.7-1.8s2.7.8 2.7 1.8" />
      <path d="M8 17.4c0-2.7 1.8-4.7 4-4.7s4 2 4 4.7" />
    </>,
  );
}

// วิทยาศาสตร์ — อะตอม (นิวเคลียส + วงโคจร)
export function ScienceIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.5" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.5" transform="rotate(120 12 12)" />
    </>,
  );
}

// สัญลักษณ์ — ดวงตาในรูปสี่เหลี่ยมข้าวหลามตัด (สัญญะ/ความหมาย)
export function SymbolismIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <path d="M12 5.6L18.4 12 12 18.4 5.6 12z" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" stroke="none" />
    </>,
  );
}

// ศิลปะ — ใบไม้/รอยพู่กัน (vesica + ก้าน)
export function ArtIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <path d="M12 5.6c3.1 2.7 3.1 8.1 0 10.8-3.1-2.7-3.1-8.1 0-10.8z" />
      <path d="M12 8v10" />
    </>,
  );
}

// ปัญญาประดิษฐ์ & อนาคต — โครงข่ายโหนด (ระบบเชื่อมโยง)
export function AIFutureIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="11.2" r="1.6" />
      <circle cx="7.4" cy="8.4" r="1.2" />
      <circle cx="16.6" cy="9.4" r="1.2" />
      <circle cx="11.4" cy="16.6" r="1.2" />
      <path d="M10.7 10.1 8.4 9M13.4 10.6l2-.7M11.6 12.8l-.1 2.6" />
    </>,
  );
}

// อารยธรรม — กงล้อรัศมี (ศูนย์กลาง + แฉกรอบทิศ)
export function CivilizationIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="12" r="1.7" />
      <path d="M12 8.6V6M12 15.4V18M8.6 12H6M15.4 12H18" />
      <path d="M9.6 9.6 7.8 7.8M14.4 9.6l1.8-1.8M9.6 14.4l-1.8 1.8M14.4 14.4l1.8 1.8" />
      <circle cx="12" cy="6" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="0.5" fill="currentColor" stroke="none" />
    </>,
  );
}
