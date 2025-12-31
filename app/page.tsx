
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Search, List, Database, Coins, RotateCw } from 'lucide-react'
import { getApifyUsage } from '@/lib/apify'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Basic stats
  let totalLeads = 0
  let credits = 0
  let recentRunsCount = 0
  let apifyUsage: any = null

  if (user) {
    const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    totalLeads = count || 0

    try {
      apifyUsage = await getApifyUsage()
      const limit = apifyUsage?.limitUsd || 0
      const used = apifyUsage?.usageTotalUsd || 0
      credits = Math.max(0, limit - used)
    } catch (err) {
      console.error('Failed to fetch Apify usage:', err)
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const { count: runsCount } = await supabase
        .from('runs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
    recentRunsCount = runsCount || 0
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {user ? (
            <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{totalLeads}</div>
                <p className="text-xs text-muted-foreground">Crawled to date</p>
                </CardContent>
            </Card>
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                <div className="flex items-center gap-2">
                    <form action={async () => {
                        'use server'
                        const { revalidatePath } = await import('next/cache')
                        revalidatePath('/', 'layout')
                    }}>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                            <RotateCw className="h-3.5 w-3.5" />
                        </Button>
                    </form>
                    <Coins className="h-4 w-4 text-muted-foreground" />
                </div>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <div className="text-2xl font-bold">${credits.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Remaining Balance</p>
                </div>
                
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        <span>Usage</span>
                        <span>{((apifyUsage?.usageTotalUsd || 0) / (apifyUsage?.limitUsd || 1) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-500 ease-in-out" 
                            style={{ width: `${Math.min(100, (apifyUsage?.usageTotalUsd || 0) / (apifyUsage?.limitUsd || 1) * 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>${apifyUsage?.usageTotalUsd?.toFixed(2) || '0.00'} spent</span>
                        <span>${apifyUsage?.limitUsd?.toFixed(2) || '0.00'} limit</span>
                    </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Est. Leads Remaining</span>
                        <span className="text-sm font-bold text-primary">
                            {Math.floor(credits / 0.002).toLocaleString()}
                        </span>
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Runs (30d)</CardTitle>
                <List className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{recentRunsCount}</div>
                </CardContent>
            </Card>
            </div>
        ) : (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    Please <Link href="/login" className="underline">sign in</Link> to view your stats.
                </CardContent>
            </Card>
        )}
      </section>

      <section className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/10 space-y-4 text-center">
        <h2 className="text-xl font-semibold">Start Finding Leads</h2>
        <p className="text-muted-foreground max-w-md">Launch a new crawler to find prospects matching your criteria.</p>
        <Link href="/crawl">
            <Button size="lg" className="gap-2">
                <Search className="h-4 w-4" /> Start New Search
            </Button>
        </Link>
      </section>
    </div>
  )
}
