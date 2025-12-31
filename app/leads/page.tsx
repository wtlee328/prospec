
import { createClient } from '@/utils/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Search } from 'lucide-react'

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
    .select('*, runs(search_criteria, created_at)')
    .eq('user_id', user.id)

  if (runId) {
    dbQuery = dbQuery.eq('run_id', runId)
  }

  if (query) {
    dbQuery = dbQuery.or(`job_title.ilike.%${query}%,company_name.ilike.%${query}%`)
  }

  const { data: leads, error } = await dbQuery.limit(500) // basic pagination limit

  // Prepare simple search form
  // We can't put interactive form in server component directly easily without client component or form action.
  // I'll create a simple search form component or raw form.
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads {runId && <span className="text-muted-foreground text-lg ml-2">(Run: {runId.slice(0,8)}...)</span>}</h1>
        <div className="flex gap-2">
            <Link href="/runs"><Button variant="outline">Back to Runs</Button></Link>
            <form className="flex gap-2" action="/leads" method="get">
                {runId && <input type="hidden" name="run_id" value={runId} />}
                <Input name="q" placeholder="Search title or company..." defaultValue={query} className="w-[300px]" />
                <Button type="submit" size="icon"><Search className="h-4 w-4" /></Button>
            </form>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Run Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leads?.map((lead) => (
                    <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.first_name} {lead.last_name}</TableCell>
                        <TableCell>{lead.job_title}</TableCell>
                        <TableCell>{lead.company_name}</TableCell>
                        <TableCell>
                            {lead.email ? (
                                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                            ) : '-'}
                        </TableCell>
                        <TableCell>{lead.location || lead.industry}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">
                           {/* Accessing joined runs data needs type assertion or better query */}
                           {/* For now, just show lead creation date */}
                           {new Date(lead.created_at).toLocaleDateString()}
                        </TableCell>
                    </TableRow>
                ))}
                {(!leads || leads.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                            No leads found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}
