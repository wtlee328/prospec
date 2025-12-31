
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL. Please update .env.local with your Supabase URL.')
  }

  if (!supabaseKey) {
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Please update .env.local with your Supabase Publishable Key.')
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
