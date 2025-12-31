'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { startCrawl } from '@/app/actions/crawl'
import { useRouter } from 'next/navigation'
import { 
  Loader2, Plus, X, 
  Table as TableIcon, Lock, 
  ExternalLink, CheckCircle2, 
  Search, Zap, Cpu, 
  Database, Activity,
  LayoutDashboard
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'

const MOCK_LEADS = [
  { name: 'Sarah Chen', title: 'Senior Project Manager', company: 'Google', location: 'Mountain View, CA', email: 's***@google.com' },
  { name: 'Marcus Rodriguez', title: 'Technical Program Manager', company: 'Google', location: 'San Francisco, CA', email: 'm***@google.com' },
  { name: 'Emily Watson', title: 'Product Operations Lead', company: 'Google', location: 'New York, NY', email: 'e***@google.com' },
  { name: 'David Kim', title: 'Software Engineering Manager', company: 'Google', location: 'Seattle, WA', email: 'd***@google.com' },
  { name: 'Jessica Taylor', title: 'Global Project Coordinator', company: 'Google', location: 'London, UK', email: 'j***@google.com' },
]

type LogItem = {
  message: string;
  type: 'info' | 'success' | 'process' | 'target';
  time: string;
}

export function Finder() {
  const router = useRouter()
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [view, setView] = useState<'logs' | 'results'>('logs')
  
  // Form State
  const [companyName, setCompanyName] = useState('')
  const [jobTitleInput, setJobTitleInput] = useState('')
  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [industry, setIndustry] = useState('')
  
  // Activity Tracker state
  const [logs, setLogs] = useState<LogItem[]>([
    { message: 'System ready. Awaiting search parameters...', type: 'info', time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }) }
  ])

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      if (!user) {
        // Prefill for demo
        setCompanyName('Google')
        setJobTitles(['Project Manager', 'Software Engineer'])
        setLocation('California, USA')
        setIndustry('Technology')
        setLogs(prev => [...prev, { 
          message: 'Demo mode active. Sample data preloaded for Google search.', 
          type: 'info', 
          time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }) 
        }])
      }
    }
    checkUser()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const handleAddJobTitle = () => {
    if (jobTitleInput.trim() && !jobTitles.includes(jobTitleInput.trim())) {
      setJobTitles([...jobTitles, jobTitleInput.trim()])
      setJobTitleInput('')
    }
  }

  const handleRemoveJobTitle = (title: string) => {
    setJobTitles(jobTitles.filter(t => t !== title))
  }

  const handleClearInput = () => {
    setCompanyName('')
    setJobTitleInput('')
    setJobTitles([])
    setLocation('')
    setIndustry('')
    setError('')
    setView('logs')
    setLogs([{ 
      message: 'Inputs cleared. System reset.', 
      type: 'info', 
      time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }) 
    }])
  }

  const addLog = (message: string, type: LogItem['type'] = 'process') => {
    setLogs(prev => [...prev, { 
      message, 
      type, 
      time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }) 
    }])
  }

  const handleStartCrawl = async () => {
    setError('')
    if (jobTitles.length === 0 && !companyName) {
      setError('Please provide at least a Company Name or Job Title.')
      return
    }

    setLoading(true)
    setView('logs')
    
    if (!isAuthenticated) {
      addLog(`Initiating search for ${companyName || jobTitles[0]}`, 'target')
      
      const sequence = [
        { msg: 'Connecting to Prospec Crawl Cluster...', type: 'process' as const, delay: 600 },
        { msg: 'Aggregating data from LinkedIn & GitHub...', type: 'process' as const, delay: 1000 },
        { msg: 'Analyzing professional trajectories...', type: 'process' as const, delay: 800 },
        { msg: 'Identified 12 high-intent profiles.', type: 'info' as const, delay: 1200 },
        { msg: 'Validating corporate email protocols...', type: 'process' as const, delay: 1500 },
        { msg: 'Crawl completed. 12 leads added to buffer.', type: 'success' as const, delay: 400 },
        { msg: 'Compiling results table...', type: 'info' as const, delay: 600 }
      ]

      let currentDelay = 0
      sequence.forEach((step, index) => {
        currentDelay += step.delay
        setTimeout(() => {
          addLog(step.msg, step.type)
          if (index === sequence.length - 1) {
            setTimeout(() => {
              setView('results')
              setLoading(false)
            }, 800)
          }
        }, currentDelay)
      })

      return
    }

    try {
      await startCrawl({
        companyName,
        jobTitles,
        locations: location ? [location] : [],
        industries: industry ? [industry] : []
      })
      router.push('/runs')
    } catch (err: any) {
      setError(err.message || 'Failed to start crawl')
      setLoading(false)
    }
  }

  const getLogIcon = (type: LogItem['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'process': return <Cpu className="w-4 h-4 text-primary animate-pulse" />
      case 'target': return <Zap className="w-4 h-4 text-amber-500" />
      default: return <Activity className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex h-[calc(100vh-280px)] min-h-[500px] gap-8 p-1">
      {/* Left Panel: Inputs */}
      <div className="w-1/2 flex flex-col h-full">
        <Card className="flex flex-col h-full border border-border/40 shadow-xl bg-card overflow-hidden transition-shadow duration-300">
          <CardHeader className="flex-none border-b bg-muted/10 pb-5 px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-foreground">Find Leads</CardTitle>
                <CardDescription className="text-sm mt-1">Define your target audience to begin the extraction.</CardDescription>
              </div>
              {!isAuthenticated && isAuthenticated !== null && (
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 animate-pulse font-semibold px-3 py-1 text-[10px] uppercase tracking-wider">
                  Demo Mode
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-8 flex-1 overflow-y-auto p-8 scrollbar-thin">
            <div className="space-y-3">
              <Label htmlFor="company" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Target Company</Label>
              <Input 
                id="company" 
                placeholder="Google, Stripe, OpenAI..." 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="jobTitle" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Candidate Titles</Label>
              <div className="flex gap-2">
                <Input 
                  id="jobTitle" 
                  placeholder="Head of Engineering..." 
                  value={jobTitleInput}
                  onChange={e => setJobTitleInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddJobTitle()}
                  className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                />
                <Button variant="outline" size="icon" onClick={handleAddJobTitle} type="button" className="shrink-0 h-12 w-12 border-border/40 hover:bg-muted/50">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {jobTitles.map(title => (
                  <Badge key={title} variant="secondary" className="flex items-center gap-2 py-1.5 px-3 shadow-none border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors font-medium rounded-md">
                    {title}
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" onClick={() => handleRemoveJobTitle(title)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Location</Label>
                <Input 
                  id="location" 
                  placeholder="San Francisco, Remote..." 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="industry" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Industry</Label>
                <Input 
                  id="industry" 
                  placeholder="SaaS, AI, Fintech..." 
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {error && <div className="text-xs text-destructive bg-destructive/5 p-4 rounded-xl border border-destructive/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <div className="shrink-0 h-1.5 w-1.5 rounded-full bg-destructive" />
              {error}
            </div>}
          </CardContent>
          <CardFooter className="flex-none gap-4 p-8 border-t bg-muted/5">
            {isAuthenticated !== false && (
              <Button variant="ghost" className="flex-1 font-semibold h-12 text-muted-foreground hover:text-foreground" onClick={handleClearInput} disabled={loading}>
                Reset
              </Button>
            )}
            <Button className="flex-[2] font-bold h-12 text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all hover:-translate-y-0.5" onClick={handleStartCrawl} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAuthenticated === false ? 'Launch Analysis Demo' : 'Start Lead Discovery'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right Panel: Insight View */}
      <div className="w-1/2 flex flex-col h-full">
        <div className="flex-1 bg-background rounded-xl border border-border/40 flex flex-col overflow-hidden shadow-xl relative transition-shadow duration-300">
          <div className="flex items-center justify-between px-8 py-6 border-b bg-muted/5">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-primary/5">
                 {view === 'logs' ? <LayoutDashboard className="w-4 h-4 text-primary" /> : <Database className="w-4 h-4 text-primary" />}
               </div>
               <div>
                 <h4 className="text-sm font-medium tracking-tight text-muted-foreground font-mono">
                   {view === 'logs' ? 'Console Output Preview' : 'Persona Detection Map'}
                 </h4>
               </div>
             </div>
             {loading && (
               <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-2.5 py-1 animate-pulse gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Analyzing
               </Badge>
             )}
          </div>
          
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {view === 'logs' ? (
              <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-2 scrollbar-thin font-mono text-sm">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 text-muted-foreground/80 animate-in fade-in slide-in-from-left-1 duration-300">
                    <span className="shrink-0 font-bold opacity-50">{'>'}</span>
                    <p className="leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                ))}
                
                {loading && (
                   <div className="flex gap-2 text-muted-foreground/40 animate-pulse">
                     <span className="shrink-0 font-bold opacity-50">{'>'}</span>
                     <p>Processing request...</p>
                   </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-1000">
                <div className="flex-1 overflow-auto p-6">
                  <div className="rounded-xl border border-border/40 shadow-sm overflow-hidden bg-background/50">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/20 text-muted-foreground text-[9px] uppercase font-bold tracking-[0.2em] border-b border-border/40">
                        <tr>
                          <th className="px-6 py-4">Professional Persona</th>
                          <th className="px-6 py-4 text-right">Detection Protocol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {MOCK_LEADS.map((lead, i) => (
                          <tr key={i} className="hover:bg-muted/10 transition-all group">
                            <td className="px-6 py-5">
                              <div className="font-bold text-foreground text-sm tracking-tight mb-1 group-hover:text-primary transition-colors">{lead.name}</div>
                              <div className="text-[11px] text-muted-foreground/80 font-medium mb-2">{lead.title}</div>
                              <div className="flex items-center gap-2.5">
                                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider">{lead.company}</span>
                                <div className="w-1 h-1 rounded-full bg-border/40" />
                                <span className="text-[9px] text-muted-foreground/40 font-medium tracking-tight">{lead.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right align-top">
                              <div className="flex flex-col items-end gap-2">
                                <Badge variant="secondary" className="text-[8px] bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 px-2 h-4.5 font-bold tracking-widest uppercase rounded-sm">Verified</Badge>
                                <div className="text-[11px] font-mono text-muted-foreground/60 tracking-tighter">{lead.email}</div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[6px] flex items-center justify-center p-8 animate-in fade-in duration-700">
                    <Card className="border-primary/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] max-w-sm overflow-hidden bg-background/95">
                       <div className="h-1.5 w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                       <CardHeader className="text-center pb-2">
                         <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                           <Lock className="w-5 h-5 text-primary" />
                         </div>
                         <CardTitle className="text-xl font-bold">Unmask Full Results</CardTitle>
                         <CardDescription className="text-xs mt-3 px-4 leading-relaxed">
                            Search complete. You've identified 12 high-intent prospects at Google. Create your account to export the full verified contact data.
                         </CardDescription>
                       </CardHeader>
                       <CardFooter className="flex flex-col gap-3 p-6 pt-4">
                         <Button className="w-full font-bold h-12 shadow-xl shadow-primary/20 group" onClick={() => router.push('/login')}>
                            Access Complete Dataset <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                         </Button>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           Join 2,000+ sales teams
                         </p>
                       </CardFooter>
                    </Card>
                  </div>
                )}
              </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-background to-transparent h-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
