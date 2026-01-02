
import { createClient } from '@/utils/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Search } from 'lucide-react'
import LeadsTable from '@/components/LeadsTable'
import LeadsSearch from '@/components/LeadsSearch'
import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function LeadsPage(props: { searchParams: Promise<{ run_id?: string; q?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const runId = searchParams.run_id
  const query = searchParams.q

  let dbQuery = supabase
    .from('leads')
    .select('*, runs(input_criteria, created_at)')
    .eq('user_id', user.id)

  if (runId) {
    dbQuery = dbQuery.eq('run_id', runId)
  }

  if (query) {
    // Split query by comma or space for multi-keyword search
    // We want an AND relationship between keywords: (Field Group matches K1) AND (Field Group matches K2)
    const keywords = query.split(/[,\s]+/).filter(k => k.length > 0)
    keywords.forEach(k => {
      const fieldMatch = [
        `job_title.ilike.%${k}%`,
        `company_name.ilike.%${k}%`,
        `full_name.ilike.%${k}%`,
        `first_name.ilike.%${k}%`,
        `last_name.ilike.%${k}%`,
        `email.ilike.%${k}%`,
        `location.ilike.%${k}%`,
        `industry.ilike.%${k}%`
      ].join(',')
      dbQuery = dbQuery.or(fieldMatch)
    })
  }

  const { data: leads, error } = await dbQuery.limit(500) 

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Leads Database</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {leads?.length || 0} Total
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              {runId ? `Viewing results for discovery run ${runId.slice(0,8)}` : 'Manage and search through all discovered leads across your campaigns.'}
            </p>
            <div className="pt-2">
              <Link href="/runs">
                <Button variant="ghost" size="sm" className="h-8 -ml-2 text-muted-foreground hover:text-primary transition-colors">
                  <Search className="h-3 w-3 mr-2 rotate-180" /> Back to Discoveries
                </Button>
              </Link>
            </div>
          </div>
          
          <Suspense fallback={<div className="h-10 w-[450px] bg-muted animate-pulse rounded-md" />}>
            <LeadsSearch initialQuery={query} runId={runId} />
          </Suspense>
        </div>
      </div>

      <LeadsTable leads={leads || []} />
    </div>
  )
}

