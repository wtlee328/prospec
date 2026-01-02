
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
  companyDomains?: string[];
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
  console.log('Starting crawl with criteria:', JSON.stringify(criteria))
  
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
        console.error('Auth error:', authError)
        throw new Error(`Authentication failed: ${authError.message}`)
    }

    if (!user) {
        console.error('No user found')
        throw new Error('Not authenticated')
    }
    console.log('User authenticated:', user.id)

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
    console.log('Creating run record...')
    const runPayload = {
        user_id: user.id,
        status: 'pending',
        input_criteria: criteria as any, // Cast to any or JSON type
        number_of_leads: 0,
        run_name: criteria.runName // Store run name if user provided it
    }
    console.log('Run Payload:', JSON.stringify(runPayload))

    const { data: run, error: runError } = await supabase
        .from('runs')
        .insert(runPayload)
        .select()
        .single()

    if (runError) {
        console.error('Run creation error details:', JSON.stringify(runError, null, 2))
        throw new Error(`Failed to create run: ${runError.message}`)
    }
    if (!run) {
        throw new Error('Run created but returned null')
    }
    console.log('Run created:', run.id)

    // 3. Call Apify - Build input object with only non-empty fields
    const input: Record<string, any> = {
        // General - always include these
        fetch_count: criteria.fetchCount || 100,
        file_name: criteria.runName || 'Prospects',
    }
    
    // Helper function to add field only if it has values
    const addIfNotEmpty = (key: string, value: any) => {
        if (value !== undefined && value !== null && value !== '') {
            // For arrays, only add if not empty
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    input[key] = value
                }
            } else {
                input[key] = value
            }
        }
    }
    
    // Contact Filters
    addIfNotEmpty('contact_job_title', criteria.jobTitles)
    addIfNotEmpty('contact_not_job_title', criteria.excludedJobTitles)
    addIfNotEmpty('seniority_level', criteria.seniorityLevel)
    addIfNotEmpty('functional_level', criteria.functionalLevel)
    
    // Map email status to lowercase values expected by API
    if (criteria.emailStatus && criteria.emailStatus.length > 0) {
        const mappedEmailStatus = criteria.emailStatus.map(status => {
            if (status.toLowerCase() === 'verified') return 'validated'
            if (status.toLowerCase() === 'guessed') return 'guessed'
            return status.toLowerCase()
        })
        addIfNotEmpty('email_status', mappedEmailStatus)
    }
    
    // Location Filters
    addIfNotEmpty('contact_location', criteria.locations)
    addIfNotEmpty('contact_city', criteria.cities)
    addIfNotEmpty('contact_not_location', criteria.excludedLocations)
    addIfNotEmpty('contact_not_city', criteria.excludedCities)
    
    // Company Filters
    addIfNotEmpty('company_name', criteria.companyNames)
    addIfNotEmpty('company_domain', criteria.companyDomains)
    addIfNotEmpty('company_industry', criteria.industries)
    addIfNotEmpty('company_not_industry', criteria.excludedIndustries)
    addIfNotEmpty('company_keywords', criteria.keywords)
    addIfNotEmpty('company_not_keywords', criteria.excludedKeywords)
    addIfNotEmpty('size', criteria.companySize)
    addIfNotEmpty('funding', criteria.funding)
    
    // Revenue Filters
    addIfNotEmpty('min_revenue', criteria.minRevenue)
    addIfNotEmpty('max_revenue', criteria.maxRevenue)
    
    console.log('Apify Input:', JSON.stringify(input))

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://api.prospec.app'; 
    const url = new URL('/api/webhooks/apify', baseUrl)
    url.searchParams.set('secret', process.env.APIFY_WEBHOOK_SECRET || '')
    url.searchParams.set('run_id', run.id)
    const requestUrl = url.toString()
    console.log('Webhook URL:', requestUrl)

    // 4. Start Actor and handle results
    const isLocal = baseUrl.includes('localhost') || process.env.NODE_ENV === 'development';
    console.log('Environment check - isLocal:', isLocal, 'baseUrl:', baseUrl);
    
    if (isLocal) {
        console.log('Running in local/dev mode, using call() to wait for results...');
        const actorRun = await apifyClient.actor('IoSHqwTR9YGhzccez').call(input);
        console.log('Actor run finished with status:', actorRun.status, 'ID:', actorRun.id);

        await supabase.from('runs').update({
            apify_run_id: actorRun.id,
            status: 'running'
        }).eq('id', run.id);

        if (actorRun.status === 'SUCCEEDED') {
            console.log('Processing results directly for run:', run.id);
            const { processRunResults } = await import('@/lib/apify-processing');
            const result = await processRunResults(run.id, actorRun.defaultDatasetId);
            console.log('Processing finished:', result);
        } else {
            console.error('Actor run failed or timed out:', actorRun.status);
            await supabase.from('runs').update({ status: 'failed' }).eq('id', run.id);
        }
    } else {
        // In production, use start() and rely on webhooks
        const runOptions = {
            webhooks: [
                {
                    eventTypes: ['ACTOR.RUN.SUCCEEDED', 'ACTOR.RUN.FAILED'] as any,
                    requestUrl,
                }
            ]
        };
        
        console.log('Starting actor with webhooks...');
        const actorRun = await apifyClient.actor('IoSHqwTR9YGhzccez').start(input, runOptions);
        console.log('Actor started:', actorRun.id);
        
        await supabase.from('runs').update({
            apify_run_id: actorRun.id,
            status: 'running'
        }).eq('id', run.id);
    }

    // 5. Revalidate Apify usage to show updated stats
    revalidatePath('/', 'layout')

    return { success: true, runId: run.id }

  } catch (error: any) {
     console.error('Critical Error in startCrawl:', error)
     return { success: false, error: error.message }
  }
}
