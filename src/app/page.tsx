import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { BadgePill } from "@/components/badge-pill"
import { HeroTitle } from "@/components/hero-title"
import { WaitlistForm } from "@/components/waitlist-form"
import { TrustBadges } from "@/components/trust-badges"
import { Toaster } from "@/components/ui/sonner"

export default function Home(): React.ReactElement {
  return (
    <>
      <Toaster position="top-center" theme="dark" />
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <AnimatedBackground />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl mx-auto text-center">
          <BadgePill />
          <HeroTitle />
          <WaitlistForm />
          <TrustBadges />

          <Link
            href="/privacy"
            className="text-sm text-white/50 hover:text-white/70 transition-colors flex items-center gap-1"
          >
            Politique de confidentialité
            <span>→</span>
          </Link>
        </div>
      </main>
    </>
  )
}
