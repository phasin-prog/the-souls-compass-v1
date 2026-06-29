"use client";

import Link from "next/link";
import { SignIn, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { ArchronLogomark } from "@/components/icons";
import { roleFromMetadata, isAdmin } from "@/lib/content/roles";

// หน้า Studio landing/login เฉพาะนักเขียน (ก่อนเข้า editor) — แยกโทนจากบัญชีนักอ่าน (/th/login)
// /studio เปิดสาธารณะ (middleware ป้องกันเฉพาะ /studio/editor)
export default function StudioLandingPage() {
  const { user } = useUser();
  const admin = isAdmin(roleFromMetadata(user?.publicMetadata));
  return (
    <main className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* แสงทองนุ่มหลังฉาก */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-antique-gold/5 blur-[120px]" />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-burnished-gold">
            <ArchronLogomark className="h-7 w-7" />
            <span className="font-wordmark text-xl font-semibold tracking-[0.2em]">ARCHRON</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-burnished-gold/70">
            Studio · ห้องเขียน
          </span>
          <h1 className="mt-3 font-serif text-3xl text-on-surface">ห้องเขียนของนักเขียน</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-on-surface-variant/70">
            พื้นที่สำหรับนักเขียนและผู้ดูแล — เขียน เรียบเรียง เปรียบเทียบ และดูแลคลังความรู้ของ
            ARCHRON อย่างมีบริบทและตรวจสอบได้
          </p>
        </div>

        <SignedOut>
          <div className="flex justify-center">
            <SignIn
              routing="hash"
              signUpUrl="/th/register"
              fallbackRedirectUrl="/studio/editor"
              appearance={{
                variables: {
                  colorPrimary: "#B58D4A",
                  colorBackground: "#181B24",
                  colorInputBackground: "rgba(255, 255, 255, 0.06)",
                  colorInputText: "#F3EEE5",
                  colorText: "#E7E2D8",
                  colorTextSecondary: "#9A948A",
                  fontFamily: "var(--font-ibm-plex-thai), sans-serif",
                },
                elements: {
                  card: "border border-slate-boundary/60 shadow-xl rounded-md bg-paper-raised/95 backdrop-blur-md p-6",
                  formButtonPrimary:
                    "bg-gradient-to-br from-antique-gold to-burnished-gold hover:brightness-105 text-prima font-semibold transition-all duration-300 py-2.5 rounded-sm border-0",
                  footerActionLink: "text-gold-deep hover:text-verdigris transition-colors",
                  headerTitle: "font-serif text-xl text-ivory tracking-tight",
                  headerSubtitle: "text-on-surface-variant/70 text-xs",
                  formFieldLabel: "text-soft-ivory text-xs font-medium uppercase tracking-wider",
                  formFieldInput:
                    "border-ink/10 bg-charcoal/70 text-ivory outline-none focus:border-antique-gold/60 rounded-sm py-2 px-3",
                  socialButtonsBlockButton:
                    "border border-ink/10 bg-charcoal/60 text-ivory hover:bg-ink/5 hover:border-antique-gold/40 rounded-sm",
                  socialButtonsBlockButtonText: "text-ivory font-medium",
                  dividerLine: "bg-ink/10",
                  dividerText: "text-on-surface-variant/55 text-[10px] uppercase tracking-widest",
                  formFieldWarningText: "text-danger text-xs",
                  formFieldErrorText: "text-danger text-xs",
                  alert: "bg-danger/10 border border-danger/30 text-danger rounded-sm text-xs",
                },
              }}
            />
          </div>
          <p className="mt-6 text-center text-xs text-on-surface-variant/50">
            สำหรับการอ่านและเก็บบทความ ไปที่{" "}
            <Link href="/th/login" className="text-gold-deep hover:text-verdigris">
              บัญชีนักอ่าน
            </Link>
          </p>
        </SignedOut>

        <SignedIn>
          <div className="rounded-md border border-slate-boundary/60 bg-paper-raised/60 p-7 text-center backdrop-blur">
            <p className="text-sm text-on-surface-variant/80">คุณเข้าสู่ระบบแล้ว</p>
            <div className="mt-5 flex flex-col items-center gap-4">
              <Link
                href="/studio/editor"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-antique-gold to-burnished-gold px-8 py-3 text-sm font-semibold text-prima transition-transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                เข้าสู่ห้องเขียน
              </Link>
              <Link
                href="/studio/profile"
                className="inline-flex items-center gap-2 text-sm text-gold-deep transition-colors hover:text-verdigris"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                โปรไฟล์ของฉัน
              </Link>
              {admin ? (
                <Link
                  href="/studio/users"
                  className="inline-flex items-center gap-2 text-sm text-gold-deep transition-colors hover:text-verdigris"
                >
                  <span className="material-symbols-outlined text-[18px]">shield_person</span>
                  จัดการผู้ใช้ (แอดมิน)
                </Link>
              ) : null}
              {admin ? (
                <Link
                  href="/studio/comments"
                  className="inline-flex items-center gap-2 text-sm text-gold-deep transition-colors hover:text-verdigris"
                >
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                  ดูแลความคิดเห็น (แอดมิน)
                </Link>
              ) : null}
              <div className="flex items-center gap-3 text-xs text-on-surface-variant/60">
                <UserButton afterSignOutUrl="/studio" />
                จัดการบัญชี / ออกจากระบบ
              </div>
            </div>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
