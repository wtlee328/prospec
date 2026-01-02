
'use server'

import { createClient } from '@/utils/supabase/server'
import { apifyClient, getApifyUsage } from '@/lib/apify'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function startCrawl(criteria: {
  fetchCount?: number;
  runName?: string;
  jobTitles: string[];
  excludedJobTitles?: string[];
  locations: string[];
  cities?: string[];
  excludedLocations?: string[];
  excludedCities?: string[];
  industries: string[];
  excludedIndustries?: string[];
  companyNames: string[];
  keywords?: string[];
  excludedKeywords?: string[];
  companySize?: string[];
  seniorityLevel?: string[];
  functionalLevel?: string[];
  emailStatus?: string[];
  funding?: string[];
  minRevenue?: string;
  maxRevenue?: string;
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
      lead_count: 0,
      file_name: criteria.runName // Store run name if user provided it
    })
    .select()
    .single()

  if (runError || !run) {
    console.error('Run creation error:', runError)
    throw new Error('Failed to create run')
  }

  // 3. Call Apify
  // Mapping inputs to match input_schema.md
  
  const input = {
    // General
    fetch_count: criteria.fetchCount || 100,
    file_name: criteria.runName,
    
    // Contact Filters
    contact_job_title: criteria.jobTitles,
    contact_not_job_title: criteria.excludedJobTitles,
    seniority_level: criteria.seniorityLevel,
    functional_level: criteria.functionalLevel,
    email_status: criteria.emailStatus,
    
    // Location Filters
    contact_location: criteria.locations,
    contact_city: criteria.cities,
    contact_not_location: criteria.excludedLocations,
    contact_not_city: criteria.excludedCities,
    
    // Company Filters
    company_domain: criteria.companyNames.length > 0 ? criteria.companyNames : undefined,
    company_industry: criteria.industries,
    company_not_industry: criteria.excludedIndustries,
    company_keywords: criteria.keywords,
    company_not_keywords: criteria.excludedKeywords,
    size: criteria.companySize,
    funding: criteria.funding,
    
    // Revenue Filters
    min_revenue: criteria.minRevenue,
    max_revenue: criteria.maxRevenue,
    
    // Compatibility mapping (Actor might still expect queries for company names)
    queries: criteria.companyNames.length > 0 ? criteria.companyNames : undefined,
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
