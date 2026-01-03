
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Search, List, Database, Coins, RotateCw, Zap, Shield, Target, ArrowRight } from 'lucide-react'
import { getApifyUsage } from '@/lib/apify'
import { Finder } from '@/components/Finder'

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

    return (
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/leads" className="block transform transition-all duration-200 hover:scale-[1.02] h-full">
              <Card className="hover:border-primary/50 transition-colors h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">{totalLeads}</div>
                  <p className="text-xs text-muted-foreground">Crawled to date</p>
                  </CardContent>
              </Card>
            </Link>
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
            <Link href="/runs" className="block transform transition-all duration-200 hover:scale-[1.02] h-full">
              <Card className="hover:border-primary/50 transition-colors h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Runs (30d)</CardTitle>
                  <List className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">{recentRunsCount}</div>
                  </CardContent>
              </Card>
            </Link>
          </div>
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

  // Landing Page for Unauthenticated Users
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
          <Zap className="w-3 h-3 fill-primary" />
          Powered by Intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-foreground">
          Precision Lead Discovery, <span className="text-primary italic">Automated.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The ultimate engine for high-intent professional discovery. Map personnel, verify data, and unmask prospects in seconds.
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4">
           <Link href="#demo">
             <Button size="lg" className="h-14 px-8 font-bold text-base shadow-xl shadow-primary/20 group">
               Start Searching Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
             </Button>
           </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-16">
          <div className="flex flex-col items-center p-6 space-y-3">
             <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-2 border border-border/40">
                <Target className="w-6 h-6 text-primary" />
             </div>
             <h3 className="font-bold">Deep Persona Mapping</h3>
             <p className="text-xs text-muted-foreground leading-relaxed">Systematically identify key decision makers across LinkedIn and GitHub.</p>
          </div>
          <div className="flex flex-col items-center p-6 space-y-3">
             <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-2 border border-border/40">
                <Shield className="w-6 h-6 text-primary" />
             </div>
             <h3 className="font-bold">Verified Direct Access</h3>
             <p className="text-xs text-muted-foreground leading-relaxed">Automated email validation and status checks for 100% deliverability.</p>
          </div>
          <div className="flex flex-col items-center p-6 space-y-3">
             <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-2 border border-border/40">
                <Database className="w-6 h-6 text-primary" />
             </div>
             <h3 className="font-bold">Massive Scale Buffer</h3>
             <p className="text-xs text-muted-foreground leading-relaxed">Parallelized crawl clusters capable of processing thousands of profiles instantly.</p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="max-w-7xl mx-auto w-full px-1 scroll-mt-20">
        <div className="mb-8 text-center">
           <h2 className="text-2xl font-bold tracking-tight">Try the Live Demo</h2>
           <p className="text-sm text-muted-foreground mt-2">See our extraction engine in action below.</p>
        </div>
        <div className="border border-border/40 rounded-2xl p-4 bg-muted/5 shadow-inner">
           <Finder />
        </div>
      </section>
    </div>
  )
}
