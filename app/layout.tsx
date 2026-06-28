import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Noto_Serif_Thai, IBM_Plex_Sans_Thai, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-thai",
  display: "swap",
});

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ibm-plex-thai",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Soul's Compass — คลังความรู้จิตใจมนุษย์",
  description:
    "คลังความรู้ภาษาไทยสำหรับศึกษาจิตใจมนุษย์ผ่านจิตวิทยา จิตวิเคราะห์ ปรัชญา ประสาทวิทยาศาสตร์ สัญลักษณ์ และทฤษฎีความรู้ โดยแยกแหล่งที่มา ข้อเท็จจริง และการตีความออกจากกัน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="th"
        className={`${notoSerifThai.variable} ${ibmPlexThai.variable} ${playfair.variable}`}
      >
        <body className="min-h-screen bg-midnight text-ivory antialiased">
          <SiteHeader />
          {children}
          <SiteFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
