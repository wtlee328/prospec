
import { createClient } from '@/utils/supabase/server'
import { apifyClient } from '@/lib/apify'
import { NextRequest, NextResponse } from 'next/server'

import { processRunResults } from '@/lib/apify-processing'

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  const runId = url.searchParams.get('run_id')

  if (secret !== process.env.APIFY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  if (!runId) {
    return NextResponse.json({ error: 'Missing run_id' }, { status: 400 })
  }

  const payload = await req.json()
  const { eventType, resource } = payload

  const supabase = await createClient()

  if (eventType === 'ACTOR.RUN.FAILED') {
    await supabase.from('runs').update({ status: 'failed' }).eq('id', runId)
    return NextResponse.json({ message: 'Run failed recorded' })
  }

  if (eventType === 'ACTOR.RUN.SUCCEEDED') {
    const datasetId = resource.defaultDatasetId
    
    try {
        const result = await processRunResults(runId, datasetId)
        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Processing error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Event ignored' })
}
