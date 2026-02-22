// Cloudflare KV-based waitlist storage (replaces Supabase)
import { getCloudflareContext } from "@opennextjs/cloudflare"

export interface WaitlistEntry {
  email: string
  created_at: string
}

interface InsertResult {
  error: { code: string; message: string } | null
}

async function getKV(): Promise<KVNamespace | null> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    return (env as Record<string, unknown>).WAITLIST as KVNamespace ?? null
  } catch {
    return null
  }
}

export async function insertWaitlistEmail(email: string): Promise<InsertResult> {
  const kv = await getKV()
  if (!kv) {
    return { error: { code: "KV_UNAVAILABLE", message: "Storage unavailable" } }
  }

  // Check for duplicate
  const existing = await kv.get(email)
  if (existing) {
    return { error: { code: "23505", message: "Duplicate email" } }
  }

  // Store email → timestamp
  await kv.put(email, JSON.stringify({ created_at: new Date().toISOString() }))
  return { error: null }
}
