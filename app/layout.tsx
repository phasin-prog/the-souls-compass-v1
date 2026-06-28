import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
    <html lang="th">
      <body className="min-h-screen bg-midnight text-ivory antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
