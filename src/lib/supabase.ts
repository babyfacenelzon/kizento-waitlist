import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase environment variables not configured")
    return null
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

export const supabase = createSupabaseClient()

export interface WaitlistEntry {
  id: string
  email: string
  created_at: string
}
