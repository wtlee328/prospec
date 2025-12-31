
import { createClient } from '@/utils/supabase/server'
import RunsTable from '@/components/RunsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function RunsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-8">Please log in.</div>
  }

  const { data: runs } = await supabase
    .from('runs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Runs</h1>
        <Link href="/crawl">
            <Button>New Run</Button>
        </Link>
      </div>
      <RunsTable runs={runs || []} />
    </div>
  )
}
