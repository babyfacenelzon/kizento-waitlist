import { Logo } from "@/components/logo"
import { WaitlistForm } from "@/components/waitlist-form"
import { Benefits } from "@/components/benefits"
import { SocialLinks } from "@/components/social-links"
import { Toaster } from "@/components/ui/sonner"

export default function Home(): React.ReactElement {
  return (
    <>
      <Toaster position="top-center" />
      <div className="seigaiha-pattern min-h-screen flex flex-col">
        {/* Main content - centered */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl flex flex-col items-center gap-10">
            {/* Logo */}
            <div className="opacity-0 animate-fade-in-up">
              <Logo />
            </div>

            {/* Hero text */}
            <div className="text-center space-y-4 opacity-0 animate-fade-in-up animation-delay-100">
              <h1 className="text-3xl sm:text-4xl font-light text-kizento-text tracking-tight">
                L&apos;art du bento, réinventé.
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Bentos isothermes premium, design japonais. Bientôt disponible.
              </p>
            </div>

            {/* Waitlist form */}
            <div className="w-full flex justify-center opacity-0 animate-fade-in-up animation-delay-200">
              <WaitlistForm />
            </div>

            {/* Benefits */}
            <div className="w-full flex justify-center">
              <Benefits />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-kizento-primary/10">
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Kizento. Tous droits réservés.
            </p>
            <SocialLinks />
          </div>
        </footer>
      </div>
    </>
  )
}
