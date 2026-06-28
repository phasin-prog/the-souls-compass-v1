import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
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

        <SignIn
          path="/studio/sign-in"
          routing="path"
          signUpUrl="/studio/sign-up"
          fallbackRedirectUrl="/studio/editor"
          appearance={{
            variables: {
              colorPrimary: "#C8A85A",
              colorBackground: "#0B1020",
              colorInputBackground: "rgba(8, 11, 22, 0.4)",
              colorInputText: "#fffff0",
              colorText: "#fffff0",
              colorTextSecondary: "#a1a1aa",
              fontFamily: "var(--font-ibm-plex-thai), sans-serif",
            },
            elements: {
              card: "border border-slate-boundary/50 shadow-2xl rounded-md bg-midnight/95 backdrop-blur-md p-6",
              formButtonPrimary: "bg-gradient-to-br from-antique-gold to-burnished-gold hover:brightness-110 text-deep-navy font-semibold transition-all duration-300 py-2.5 rounded-sm border-0",
              footerActionLink: "text-antique-gold hover:text-soft-gold transition-colors",
              headerTitle: "font-serif text-xl text-ivory tracking-tight",
              headerSubtitle: "text-on-surface-variant/70 text-xs",
              formFieldLabel: "text-soft-ivory text-xs font-medium uppercase tracking-wider",
              formFieldInput: "border-white/10 bg-charcoal/40 text-ivory outline-none focus:border-antique-gold/50 rounded-sm py-2 px-3",
              identityPreviewText: "text-ivory",
              identityPreviewEditButtonIcon: "text-antique-gold",
              socialButtonsBlockButton: "border border-white/10 bg-charcoal/20 text-ivory hover:bg-white/5 hover:border-antique-gold/30 rounded-sm",
              socialButtonsBlockButtonText: "text-ivory font-medium",
              dividerLine: "bg-white/10",
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
