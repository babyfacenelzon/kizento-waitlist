import { NextResponse } from "next/server"
import { insertWaitlistEmail } from "@/lib/supabase"
import { createHash } from "crypto"

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Rate limiting map (in-memory, resets on worker restart)
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

/**
 * Send a Lead event to Meta CAPI (fire-and-forget)
 */
async function sendMetaLeadEvent(email: string, ip: string, userAgent: string): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID
  const accessToken = process.env.META_CAPI_TOKEN
  if (!pixelId || !accessToken) return

  const hashedEmail = createHash("sha256").update(email.trim().toLowerCase()).digest("hex")
  const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: "website",
            event_source_url: "https://kizento.com",
            user_data: {
              em: [hashedEmail],
              client_ip_address: ip !== "unknown" ? ip : undefined,
              client_user_agent: userAgent,
            },
          },
        ],
      }),
    })
    const result = await response.text()
    if (!response.ok) {
      console.error("[Meta CAPI] Error:", response.status, result)
    }
  } catch (error) {
    console.error("[Meta CAPI] Error:", error)
  }
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
    const body = await request.json() as { email?: string; honeypot?: string }
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

    // Insert into KV
    const { error } = await insertWaitlistEmail(trimmedEmail)

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Cette adresse email est déjà inscrite" },
          { status: 409 }
        )
      }

      console.error("KV error:", error)
      return NextResponse.json(
        { error: "Une erreur est survenue. Veuillez réessayer." },
        { status: 500 }
      )
    }

    // Send Meta CAPI Lead event (must await on Cloudflare Workers)
    const userAgent = request.headers.get("user-agent") || ""
    await sendMetaLeadEvent(trimmedEmail, ip, userAgent)

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
