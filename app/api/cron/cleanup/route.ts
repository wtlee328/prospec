
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // Check authorization if needed (e.g. CRON_SECRET)
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createClient()
  const now = new Date().toISOString()

  // Delete expired runs where is_saved is false
  const { error, count } = await supabase
    .from('runs')
    .delete({ count: 'exact' })
    .match({ is_saved: false })
    .lt('expires_at', now)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ deleted: count })
}
