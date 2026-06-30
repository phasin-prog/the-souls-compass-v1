import { SignUp } from "@clerk/nextjs";
import { ArchronLogomark } from "@/components/icons";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 bg-deep-navy relative overflow-hidden">
      {/* เอฟเฟกต์แสงพื้นหลังสร้างบรรยากาศ */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-antique-gold/5 blur-[120px]" />
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-burnished-gold">
            <ArchronLogomark className="h-7 w-7" />
            <span className="font-wordmark text-xl font-semibold tracking-[0.2em]">ARCHRON</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-burnished-gold/70">
            บัญชีนักอ่าน
          </span>
          <h1 className="mt-3 font-serif text-3xl text-on-surface">สร้างบัญชีนักอ่าน</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-on-surface-variant/70">
            สมัครเพื่อเก็บบทความ แนวคิด และความคืบหน้าการอ่าน
            โดยเนื้อหาหลักของเว็บไซต์ยังคงเปิดให้อ่านได้โดยไม่ต้องมีบัญชี
          </p>
        </div>

        <SignUp
          path="/th/register"
          routing="path"
          signInUrl="/th/login"
          fallbackRedirectUrl="/studio/editor"
          appearance={{
            variables: {
              colorPrimary: "#B58D4A",
              colorBackground: "#2E3349",
              colorInputBackground: "rgba(255, 255, 255, 0.06)",
              colorInputText: "#F3EEE5",
              colorText: "#E7E2D8",
              colorTextSecondary: "#9A948A",
              fontFamily: "var(--font-ibm-plex-thai), sans-serif",
            },
            elements: {
              card: "border border-antique-gold/45 shadow-xl rounded-lg bg-paper-raised backdrop-blur-md p-6 ring-1 ring-antique-gold/10",
              formButtonPrimary: "bg-gradient-to-br from-antique-gold to-burnished-gold hover:brightness-105 text-prima font-semibold transition-all duration-300 py-2.5 rounded-sm border-0",
              footerActionLink: "text-gold-deep hover:text-verdigris transition-colors",
              headerTitle: "font-serif text-xl text-ivory tracking-tight",
              headerSubtitle: "text-on-surface-variant/70 text-xs",
              formFieldLabel: "text-soft-ivory text-xs font-medium uppercase tracking-wider",
              formFieldInput: "border-slate-boundary/60 bg-white/5 text-ivory outline-none focus:border-antique-gold/60 rounded-sm py-2 px-3",
              identityPreviewText: "text-ivory",
              identityPreviewEditButtonIcon: "text-antique-gold",
              socialButtonsBlockButton: "border border-slate-boundary/60 bg-white/5 text-ivory hover:bg-white/10 hover:border-antique-gold/40 rounded-sm",
              socialButtonsBlockButtonText: "text-ivory font-medium",
              dividerLine: "bg-slate-boundary/40",
              dividerText: "text-on-surface-variant/55 text-[10px] uppercase tracking-widest",
              formFieldWarningText: "text-danger text-xs",
              formFieldErrorText: "text-danger text-xs",
              alert: "bg-danger/10 border border-danger/30 text-danger rounded-sm text-xs",
            }
          }}
        />
      </div>
    </main>
  );
}
