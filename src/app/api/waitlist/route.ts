import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Rate limiting map (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // requests per window
const RATE_WINDOW = 60 * 1000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return false
  }

  if (entry.count >= RATE_LIMIT) {
    return true
  }

  entry.count++
  return false
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded?.split(",")[0]?.trim() || "unknown"

    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans une minute." },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { email, honeypot } = body

    // Honeypot check - if filled, silently accept but don't process
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    // Validate email presence
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Adresse email requise" },
        { status: 400 }
      )
    }

    // Validate email format
    const trimmedEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 254) {
      return NextResponse.json(
        { error: "Format d'adresse email invalide" },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: "Service temporairement indisponible" },
        { status: 503 }
      )
    }

    // Insert into Supabase
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: trimmedEmail })

    if (error) {
      // Handle duplicate email (PostgreSQL unique violation code)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Cette adresse email est déjà inscrite" },
          { status: 409 }
        )
      }

      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Une erreur est survenue. Veuillez réessayer." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Inscription réussie" },
      { status: 201 }
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
