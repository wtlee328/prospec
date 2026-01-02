
import { createClient } from '@/utils/supabase/server'
import { apifyClient } from '@/lib/apify'

export async function processRunResults(runId: string, datasetId: string) {
  const supabase = await createClient()

  // 1. Fetch items from Apify
  const { items } = await apifyClient.dataset(datasetId).listItems()
  console.log(`Fetched ${items.length} items from dataset ${datasetId}`)
  if (items.length > 0) {
      console.log('Sample item keys:', Object.keys(items[0]))
  }

  // Helper to safely convert potential arrays/objects to strings for DB text columns
  const safeString = (val: any) => {
    if (val === undefined || val === null) return null;
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  // 2. Map items to Schema
  const leads = items.map((item: any) => ({
      run_id: runId,
      first_name: safeString(item.firstName || item.first_name),
      last_name: safeString(item.lastName || item.last_name),
      full_name: safeString(item.full_name || item.fullName || `${item.first_name || ''} ${item.last_name || ''}`.trim()),
      email: safeString(item.email),
      mobile_number: safeString(item.mobile_number || item.mobileNumber || item.phone),
      personal_email: safeString(item.personal_email || item.personalEmail),
      job_title: safeString(item.jobTitle || item.job_title),
      headline: safeString(item.headline),
      company_name: safeString(item.companyName || item.company_name),
      industry: safeString(item.industry),
      location: safeString(item.location || [item.city, item.state, item.country].filter(Boolean).join(', ')),
      linkedin_url: safeString(item.linkedinUrl || item.linkedin_url || item.linkedin),
      
      // New fields mapping
      city: safeString(item.city),
      state: safeString(item.state),
      country: safeString(item.country),
      company_domain: safeString(item.company_domain || item.company_website || item.companyDomain),
      company_phone: safeString(item.company_phone || item.companyPhone),
      company_website: safeString(item.company_website || item.companyWebsite),
      company_linkedin: safeString(item.company_linkedin || item.companyLinkedin),
      company_description: safeString(item.company_description || item.companyDescription),
      
      keywords: safeString(item.keywords),
      seniority_level: safeString(item.seniority_level || item.seniorityLevel),
      functional_level: safeString(item.functional_level || item.functionalLevel),
      
      company_annual_revenue: safeString(item.company_annual_revenue || item.revenue),
      company_annual_revenue_clean: safeString(item.company_annual_revenue_clean || item.revenue_clean || item.revenueClean),
      company_size: safeString(item.company_size || item.companySize),
      
      company_total_funding: safeString(item.company_total_funding || item.totalFunding),
      company_total_funding_clean: safeString(item.company_total_funding_clean || item.totalFundingClean),
      company_technologies: safeString(item.company_technologies || item.technologies),
      company_founded_year: safeString(item.company_founded_year || item.foundedYear || item.founded),
      
      raw_data: item
  }))

  // 3. Fetch run to get user_id
  const { data: run, error: runError } = await supabase
      .from('runs')
      .select('user_id')
      .eq('id', runId)
      .single()
  
  if (runError || !run) {
      console.error('Run not found for ID:', runId, runError)
      throw new Error(`Run not found: ${runError?.message}`)
  }

  const leadsWithUser = leads.map(l => ({ ...l, user_id: run.user_id }))
  console.log(`Prepared ${leadsWithUser.length} leads for insertion`)

  // 4. Insert Leads
  if (leadsWithUser.length > 0) {
      const { error: insertError } = await supabase.from('leads').insert(leadsWithUser)
      if (insertError) {
          console.error('Insert error details:', JSON.stringify(insertError, null, 2))
          throw new Error('Failed to insert leads into database')
      }
      console.log('Leads inserted successfully')
  }

  // 5. Update Run Status
  const leadCount = leads.length
  const now = new Date()
  const expireDate = new Date()
  expireDate.setDate(now.getDate() + 3)

  await supabase.from('runs').update({
      status: 'completed',
      number_of_leads: leadCount,
      archived_at: now.toISOString(),
      expires_at: expireDate.toISOString()
  }).eq('id', runId)

  // 6. Deduct Credits
  if (leadCount > 0) {
      const { error: rpcError } = await supabase.rpc('deduct_credits', {
          p_user_id: run.user_id,
          p_amount: leadCount
      })

      if (rpcError) {
           console.error('RPC Error, falling back to manual update', rpcError)
           const { data: p } = await supabase.from('profiles').select('credits_balance').eq('id', run.user_id).single()
           if (p) {
               await supabase.from('profiles').update({ credits_balance: p.credits_balance - leadCount }).eq('id', run.user_id)
           }
      }

      await supabase.from('credit_logs').insert({
          user_id: run.user_id,
          amount: -leadCount,
          run_id: runId,
          description: `Run deduction`
      })
  }

  return { success: true, count: leadCount }
}
