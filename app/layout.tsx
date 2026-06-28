import type { Metadata } from "next";
import { Noto_Serif_Thai, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-serif-thai",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans-thai",
});

export const metadata: Metadata = {
  title: "The Soul's Compass — คลังความรู้จิตใจมนุษย์",
  description:
    "คลังความรู้ภาษาไทยสำหรับศึกษาจิตใจมนุษย์ผ่านจิตวิทยา จิตวิเคราะห์ ปรัชญา ประสาทวิทยาศาสตร์ สัญลักษณ์ และทฤษฎีความรู้",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${notoSerifThai.variable} ${ibmPlexSansThai.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
