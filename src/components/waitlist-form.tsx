"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

type FormState = "idle" | "loading" | "success" | "error"

export function WaitlistForm(): React.ReactElement {
  const [email, setEmail] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const honeypot = formData.get("website") as string

    // Honeypot check (should be empty)
    if (honeypot) {
      // Silently reject bot submissions
      setFormState("success")
      return
    }

    if (!email || !email.includes("@")) {
      toast.error("Veuillez entrer une adresse email valide")
      return
    }

    setFormState("loading")

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

      setFormState("success")
      setEmail("")
      toast.success("Bienvenue ! Vous êtes sur la liste.")
    } catch (error) {
      setFormState("error")
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(message)
    }
  }

  if (formState === "success") {
    return (
      <div className="text-center space-y-2">
        <p className="text-kizento-primary font-medium">Merci !</p>
        <p className="text-sm text-muted-foreground">
          Vous recevrez un email dès le lancement.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          name="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={formState === "loading"}
          className="flex-1 h-12 bg-white/80 border-kizento-primary/20 focus:border-kizento-primary focus:ring-kizento-primary/20"
        />
        {/* Honeypot field - hidden from users, visible to bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 h-0 w-0 pointer-events-none"
          aria-hidden="true"
        />
        <Button
          type="submit"
          disabled={formState === "loading"}
          className="h-12 px-6 bg-kizento-primary hover:bg-kizento-primary/90 text-white font-medium"
        >
          {formState === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Envoi...
            </span>
          ) : (
            "Rejoindre la liste"
          )}
        </Button>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        En vous inscrivant, vous acceptez de recevoir des emails de Kizento.
        Pas de spam, uniquement des nouvelles importantes.
      </p>
    </form>
  )
}
