
import { createClient } from '@/utils/supabase/server'
import { apifyClient } from '@/lib/apify'
import { NextRequest, NextResponse } from 'next/server'

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
    const { items } = await apifyClient.dataset(datasetId).listItems()

    // Process leads
    const leads = items.map((item: any) => ({
      run_id: runId,
      // We need user_id. We fetch run to get user_id first.
      // But map function can't look it up per item efficiently.
      // We'll fetch run once.
      first_name: item.firstName || item.first_name,
      last_name: item.lastName || item.last_name,
      email: item.email,
      job_title: item.jobTitle || item.job_title,
      company_name: item.companyName || item.company_name,
      industry: item.industry,
      location: item.location,
      linkedin_url: item.linkedinUrl || item.linkedin_url,
      raw_data: item
    }))

    // Fetch run to get user_id
    const { data: run, error: runError } = await supabase
        .from('runs')
        .select('user_id')
        .eq('id', runId)
        .single()
    
    if (runError || !run) {
        return NextResponse.json({ error: 'Run not found' }, { status: 404 })
    }

    const leadsWithUser = leads.map(l => ({ ...l, user_id: run.user_id }))

    if (leadsWithUser.length > 0) {
        const { error: insertError } = await supabase.from('leads').insert(leadsWithUser)
        if (insertError) {
            console.error('Insert error', insertError)
            return NextResponse.json({ error: 'Failed to insert leads' }, { status: 500 })
        }
    }

    // Update Run
    const leadCount = leads.length
    const now = new Date()
    const expireDate = new Date()
    expireDate.setDate(now.getDate() + 3)

    await supabase.from('runs').update({
        status: 'completed',
        lead_count: leadCount,
        archived_at: now.toISOString(),
        expires_at: expireDate.toISOString()
    }).eq('id', runId)

    // Deduct Credits
    // We assume rpc function 'deduct_credits' exists OR we update manually.
    // Manual update for now if RPC not guaranteed, but highly recommend RPC.
    // I'll try RPC, if fails fall back? No, that's complex.
    // I'll use simple update: get current, subtract, update. (Race condition possible but low risk for MVP).
    // Or just UPDATE profiles SET credits_balance = credits_balance - count.
    // Supabase allows: .rpc? or standard SQL?
    // Supabase client filters don't support arithmetic updates directly without RPC.
    // So I will use RPC call. I will add the RPC to schema.sql.
    
    if (leadCount > 0) {
        const { error: rpcError } = await supabase.rpc('deduct_credits', {
            p_user_id: run.user_id,
            p_amount: leadCount
        })

        if (rpcError) {
             console.error('RPC Error, falling back to manual update', rpcError)
             // Fallback
             const { data: p } = await supabase.from('profiles').select('credits_balance').eq('id', run.user_id).single()
             if (p) {
                 await supabase.from('profiles').update({ credits_balance: p.credits_balance - leadCount }).eq('id', run.user_id)
             }
        }

        // Log transaction
        await supabase.from('credit_logs').insert({
            user_id: run.user_id,
            amount: -leadCount,
            run_id: runId,
            description: `Run deduction`
        })
    }

    return NextResponse.json({ success: true, count: leadCount })
  }

  return NextResponse.json({ message: 'Event ignored' })
}
