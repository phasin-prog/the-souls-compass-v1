import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 bg-deep-navy relative overflow-hidden">
      {/* เอฟเฟกต์แสงพื้นหลังสร้างบรรยากาศ */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-antique-gold/5 blur-[120px]" />
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl tracking-wide text-burnished-gold">
            The Soul&apos;s Compass
          </h1>
          <p className="mt-2 text-xs tracking-widest text-on-surface-variant/60 uppercase">
            ผู้ดูแลระบบ & นักเขียนกิตติมศักดิ์
          </p>
        </div>

        <SignUp
          path="/th/register"
          routing="path"
          signInUrl="/th/login"
          fallbackRedirectUrl="/studio/editor"
          appearance={{
            variables: {
              colorPrimary: "#B08D57",
              colorBackground: "#F5F1E8",
              colorInputBackground: "rgba(255, 255, 255, 0.6)",
              colorInputText: "#1F2A44",
              colorText: "#2B2B2B",
              colorTextSecondary: "#6E665A",
              fontFamily: "var(--font-ibm-plex-thai), sans-serif",
            },
            elements: {
              card: "border border-slate-boundary/60 shadow-xl rounded-md bg-paper-raised/95 backdrop-blur-md p-6",
              formButtonPrimary: "bg-gradient-to-br from-antique-gold to-burnished-gold hover:brightness-105 text-ink font-semibold transition-all duration-300 py-2.5 rounded-sm border-0",
              footerActionLink: "text-gold-deep hover:text-verdigris transition-colors",
              headerTitle: "font-serif text-xl text-ivory tracking-tight",
              headerSubtitle: "text-on-surface-variant/70 text-xs",
              formFieldLabel: "text-soft-ivory text-xs font-medium uppercase tracking-wider",
              formFieldInput: "border-ink/10 bg-white/70 text-ivory outline-none focus:border-antique-gold/60 rounded-sm py-2 px-3",
              identityPreviewText: "text-ivory",
              identityPreviewEditButtonIcon: "text-antique-gold",
              socialButtonsBlockButton: "border border-ink/10 bg-white/60 text-ivory hover:bg-ink/5 hover:border-antique-gold/40 rounded-sm",
              socialButtonsBlockButtonText: "text-ivory font-medium",
              dividerLine: "bg-ink/10",
              dividerText: "text-on-surface-variant/40 text-[10px] uppercase tracking-widest",
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
