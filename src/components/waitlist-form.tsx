"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight, Loader2, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"

type FormStatus = "idle" | "loading" | "success"

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ")
}

function validateEmail(email: string): string | null {
  if (!email) return "Email requis"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email invalide"
  return null
}

export function WaitlistForm(): React.ReactElement {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<FormStatus>("idle")
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value
    setEmail(value)
    if (touched) {
      setError(validateEmail(value))
    }
  }

  function handleBlur(): void {
    setIsFocused(false)
    setTouched(true)
    setError(validateEmail(email))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const honeypot = formData.get("website") as string

    // Honeypot check (anti-bot)
    if (honeypot) {
      setStatus("success")
      return
    }

    const validationError = validateEmail(email)
    if (validationError) {
      setTouched(true)
      setError(validationError)
      toast.error(validationError)
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json() as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      setStatus("success")
      setEmail("")
      setTouched(false)
      setError(null)
      toast.success("Vous êtes sur la liste !")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(message)
      setStatus("idle")
    }
  }

  const isValid = !error && touched && email.length > 0
  const showError = Boolean(error && touched)

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      onSubmit={handleSubmit}
      className="w-full max-w-lg"
    >
      {status === "success" ? (
        /* Success State */
        <div className="flex items-center justify-center gap-3 h-14 px-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 w-full">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#9BA78F]/20">
            <Check className="w-4 h-4 text-[#9BA78F]" />
          </div>
          <span className="font-medium">Bienvenue dans la famille !</span>
        </div>
      ) : (
        /* Form State - Modern pill design */
        <div className="w-full">
          <div className={cn(
            "relative flex items-center w-full",
            "pl-4 pr-1.5 py-1.5 rounded-2xl",
            "bg-white/10 backdrop-blur-sm",
            "border transition-all duration-300",
            // Default border
            !isFocused && !showError && !isValid && "border-white/20",
            // Focus state
            isFocused && !showError && "border-white/40 bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
            // Error state
            showError && "border-red-400/50 bg-red-400/5",
            // Valid state
            isValid && !isFocused && "border-[#9BA78F]/50 bg-[#9BA78F]/5"
          )}>
            {/* Mail icon */}
            <Mail className={cn(
              "w-5 h-5 flex-shrink-0 transition-colors duration-300",
              showError ? "text-red-400" : isValid ? "text-[#9BA78F]" : isFocused ? "text-white" : "text-white/50"
            )} />

            {/* Email Input */}
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              placeholder="Votre email"
              disabled={status === "loading"}
              className={cn(
                "flex-1 h-full px-3 bg-transparent",
                "text-white placeholder:text-white/50",
                "focus:outline-none",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />

            {/* Status icon */}
            {showError && (
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
            )}
            {isValid && !isFocused && (
              <Check className="w-5 h-5 text-[#9BA78F] mr-2 flex-shrink-0" />
            )}

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute opacity-0 h-0 w-0 pointer-events-none"
              aria-hidden="true"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "group relative flex items-center justify-center gap-2",
                "h-11 px-6 rounded-xl overflow-hidden",
                "bg-white text-[#2D3B2D] font-semibold",
                "transition-all duration-500 ease-out",
                "hover:bg-[#FAFAF5] hover:shadow-[0_8px_30px_rgba(123,139,111,0.25)]",
                "hover:scale-[1.02]",
                "active:scale-[0.98] active:shadow-[0_4px_15px_rgba(123,139,111,0.2)]",
                "disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              )}
            >
              {/* Subtle shine effect on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline relative">S&apos;inscrire</span>
                  <ArrowRight className="w-4 h-4 relative transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:scale-110" />
                </>
              )}
            </button>
          </div>

          {/* Error message */}
          {showError && (
            <p className="text-red-400 text-xs mt-2 ml-4">{error}</p>
          )}
        </div>
      )}
    </motion.form>
  )
}
