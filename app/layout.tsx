import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
