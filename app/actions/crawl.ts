
'use server'

import { createClient } from '@/utils/supabase/server'
import { apifyClient, getApifyUsage } from '@/lib/apify'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function startCrawl(criteria: {
  jobTitles: string[];
  locations: string[];
  industries: string[];
  companySize?: string;
  companyName?: string; // Optional if searching by job title
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // 1. Check Apify credits (Shared Account)
  try {
    const usage = await getApifyUsage()
    const balance = usage.limitUsd - usage.usageTotalUsd
    if (balance <= 0) {
      throw new Error('Insufficient shared account balance on Apify')
    }
  } catch (err: any) {
    if (err.message.includes('Insufficient')) throw err
    console.warn('Could not verify Apify balance, proceeding anyway:', err)
  }

  // 2. Create pending run
  const { data: run, error: runError } = await supabase
    .from('runs')
    .insert({
      user_id: user.id,
      status: 'pending',
      search_criteria: criteria as any, // Cast to any or JSON type
      lead_count: 0
    })
    .select()
    .single()

  if (runError || !run) {
    console.error('Run creation error:', runError)
    throw new Error('Failed to create run')
  }

  // 3. Call Apify
  // Mapping logic based on assumed Actor capabilities.
  // Actor: IoSHqwTR9YGhzccez (Contact Details Scraper usually?)
  // PRD Example Input: { "queries": ["Company Name"], "jobTitles": ... }
  // Assuming "queries" handles company name if provided, or maybe we assume generic search?
  // PRD says: "Frontend form must map to Actor's JSON input... queries, jobTitles, locations..."
  
  const input = {
    queries: criteria.companyName ? [criteria.companyName] : undefined, 
    // If no company name, maybe queries is empty? The PRD implies broad search.
    jobTitles: criteria.jobTitles,
    locations: criteria.locations,
    industries: criteria.industries,
    maxItems: 50
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://api.prospec.app'; // Use a valid domain for Apify validation
    const url = new URL('/api/webhooks/apify', baseUrl)
    url.searchParams.set('secret', process.env.APIFY_WEBHOOK_SECRET || '')
    url.searchParams.set('run_id', run.id)
    const requestUrl = url.toString()

    const runOptions = {
      webhooks: [
        {
            eventTypes: ['ACTOR.RUN.SUCCEEDED', 'ACTOR.RUN.FAILED'] as any,
            requestUrl,
        }
      ]
    }

    // Using start() to run asynchronously
    const actorRun = await apifyClient.actor('IoSHqwTR9YGhzccez').start(input, runOptions)
    
    // 4. Update run with apify_run_id
    await supabase.from('runs').update({
        apify_run_id: actorRun.id,
        status: 'running'
    }).eq('id', run.id)

    // 5. Revalidate Apify usage to show updated stats
    revalidatePath('/', 'layout')

    return { success: true, runId: run.id }

  } catch (error: any) {
     console.error('Apify start error:', error)
     await supabase.from('runs').update({ status: 'failed' }).eq('id', run.id)
     throw new Error(`Failed to start crawl: ${error.message}`)
  }
}
