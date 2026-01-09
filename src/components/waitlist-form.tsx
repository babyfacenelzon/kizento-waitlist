"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight, Loader2, Check } from "lucide-react"
import { toast } from "sonner"

type FormStatus = "idle" | "loading" | "success"

export function WaitlistForm(): React.ReactElement {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<FormStatus>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const honeypot = formData.get("website") as string

    // Honeypot check (anti-bot)
    if (honeypot) {
      setStatus("success")
      return
    }

    if (!email || !email.includes("@")) {
      toast.error("Veuillez entrer une adresse email valide")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      setStatus("success")
      setEmail("")
      toast.success("Vous êtes sur la liste !")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(message)
      setStatus("idle")
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10"
      >
        <div className="h-10 w-10 rounded-full bg-[#7B8B6F] flex items-center justify-center">
          <Check className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-medium text-white">Merci !</p>
          <p className="text-sm text-white/70">
            Vous serez notifié en avant-première.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      onSubmit={handleSubmit}
      className="w-full max-w-xl"
    >
      <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300 focus-within:border-[#7B8B6F]/50 focus-within:shadow-[0_0_20px_rgba(123,139,111,0.3)]">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Mail className="h-5 w-5 text-white/50 flex-shrink-0" />
          <input
            type="email"
            name="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none py-3 disabled:opacity-50"
          />
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 h-0 w-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#7B8B6F] hover:bg-[#8E9F82] text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              S&apos;inscrire
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
}
