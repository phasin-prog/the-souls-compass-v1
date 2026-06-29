import { ClerkProvider } from "@clerk/nextjs";

// ครอบ Clerk เฉพาะ subtree /studio (ไม่ใช่ทั้งแอป) — หน้า public จึง build ได้โดยไม่ต้องมีคีย์ Clerk
// force-dynamic: ไม่ prerender ตอน build → publishableKey ต้องการเฉพาะตอน runtime
export const dynamic = "force-dynamic";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
