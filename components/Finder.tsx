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
  LayoutDashboard,
  Check,
  ChevronsUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const INDUSTRIES = [
  "Information Technology & Services",
  "Construction",
  "Marketing & Advertising",
  "Health, Wellness & Fitness",
  "Pharmaceuticals",
  "Biotechnology",
  "Real Estate",
  "Management Consulting",
  "Computer Software",
  "Internet",
  "Semiconductors",
  "Retail",
  "Financial Services",
  "Consumer Services",
  "Hospital & Health Care",
  "Automotive",
  "Restaurants",
  "Education Management",
  "Food & Beverages",
  "Design",
  "Apparel & Fashion",
  "Import & Export",
  "Hospitality",
  "Accounting",
  "Events Services",
  "Luxury Goods & Jewelry",
  "Cosmetics",
  "Logistics & Supply Chain",
  "Warehousing",
  "Package / Freight Delivery"
]

const SENIORITY_LEVELS = [
  "Owner", "Partner", "CXO", "VP", "Director", "Manager", "Senior", "Entry", "Unpaid"
]

const FUNCTIONAL_LEVELS = [
  "Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Product", "Support", "Legal", "Design"
]

const EMAIL_STATUSES = [
  "Verified", "Guessed"
]

const COMPANY_SIZES = [
  "1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"
]

const FUNDING_ROUNDS = [
  "Seed", "Series A", "Series B", "Series C", "Series D", "Series E", "IPO", "Private Equity", "Debt Financing"
]

const REVENUE_RANGES = [
  "100K", "500K", "1M", "5M", "10M", "25M", "50M", "100M", "500M", "1B", "5B", "10B"
]

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
  
  // Form State - Default Fields
  const [fetchCount, setFetchCount] = useState(100)
  const [runName, setRunName] = useState('')
  const [jobTitleInput, setJobTitleInput] = useState('')
  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [locationInput, setLocationInput] = useState('')
  const [locations, setLocations] = useState<string[]>([])
  const [cityInput, setCityInput] = useState('')
  const [cities, setCities] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [industryOpen, setIndustryOpen] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  
  // Advanced Filters Toggle
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Advanced Fields
  const [companyInput, setCompanyInput] = useState('')
  const [companies, setCompanies] = useState<string[]>([])
  
  // Excluded Fields Inputs
  const [excludedJobTitleInput, setExcludedJobTitleInput] = useState('')
  const [excludedJobTitles, setExcludedJobTitles] = useState<string[]>([])
  const [excludedLocationInput, setExcludedLocationInput] = useState('')
  const [excludedLocations, setExcludedLocations] = useState<string[]>([])
  const [excludedCityInput, setExcludedCityInput] = useState('')
  const [excludedCities, setExcludedCities] = useState<string[]>([])
  const [excludedKeywordInput, setExcludedKeywordInput] = useState('')
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>([])
  
  // Dropdown/Select Fields
  const [selectedSeniorities, setSelectedSeniorities] = useState<string[]>([])
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([])
  const [selectedEmailStatuses, setSelectedEmailStatuses] = useState<string[]>([])
  const [selectedExcludedIndustries, setSelectedExcludedIndustries] = useState<string[]>([])
  const [excludedIndustryOpen, setExcludedIndustryOpen] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedFundingRounds, setSelectedFundingRounds] = useState<string[]>([])
  const [minRevenue, setMinRevenue] = useState<string>('')
  const [maxRevenue, setMaxRevenue] = useState<string>('')
  
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
        setRunName('Demo Search - Google')
        setFetchCount(100)
        setJobTitles(['Project Manager', 'Software Engineer'])
        setLocations(['California, USA'])
        setCities(['San Francisco', 'Mountain View'])
        setSelectedIndustries(['Information Technology & Services'])
        setKeywords(['AI', 'Cloud'])
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

  const handleAddCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      setCompanies([...companies, companyInput.trim()])
      setCompanyInput('')
    }
  }

  const handleRemoveCompany = (name: string) => {
    setCompanies(companies.filter(c => c !== name))
  }

  const handleAddLocation = () => {
    if (locationInput.trim() && !locations.includes(locationInput.trim())) {
      setLocations([...locations, locationInput.trim()])
      setLocationInput('')
    }
  }

  const handleRemoveLocation = (loc: string) => {
    setLocations(locations.filter(l => l !== loc))
  }

  const handleAddCity = () => {
    if (cityInput.trim() && !cities.includes(cityInput.trim())) {
      setCities([...cities, cityInput.trim()])
      setCityInput('')
    }
  }

  const handleRemoveCity = (city: string) => {
    setCities(cities.filter(c => c !== city))
  }

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  // Helper functions for excluded/advanced fields
  const handleAddExcludedJobTitle = () => {
    if (excludedJobTitleInput.trim() && !excludedJobTitles.includes(excludedJobTitleInput.trim())) {
      setExcludedJobTitles([...excludedJobTitles, excludedJobTitleInput.trim()])
      setExcludedJobTitleInput('')
    }
  }

  const handleRemoveExcludedJobTitle = (title: string) => {
    setExcludedJobTitles(excludedJobTitles.filter(t => t !== title))
  }

  const handleAddExcludedLocation = () => {
    if (excludedLocationInput.trim() && !excludedLocations.includes(excludedLocationInput.trim())) {
      setExcludedLocations([...excludedLocations, excludedLocationInput.trim()])
      setExcludedLocationInput('')
    }
  }

  const handleRemoveExcludedLocation = (loc: string) => {
    setExcludedLocations(excludedLocations.filter(l => l !== loc))
  }

  const handleAddExcludedCity = () => {
    if (excludedCityInput.trim() && !excludedCities.includes(excludedCityInput.trim())) {
      setExcludedCities([...excludedCities, excludedCityInput.trim()])
      setExcludedCityInput('')
    }
  }

  const handleRemoveExcludedCity = (city: string) => {
    setExcludedCities(excludedCities.filter(c => c !== city))
  }

  const handleAddExcludedKeyword = () => {
    if (excludedKeywordInput.trim() && !excludedKeywords.includes(excludedKeywordInput.trim())) {
      setExcludedKeywords([...excludedKeywords, excludedKeywordInput.trim()])
      setExcludedKeywordInput('')
    }
  }

  const handleRemoveExcludedKeyword = (keyword: string) => {
    setExcludedKeywords(excludedKeywords.filter(k => k !== keyword))
  }

  const handleClearInput = () => {
    setFetchCount(100)
    setRunName('')
    setCompanyInput('')
    setCompanies([])
    setJobTitleInput('')
    setJobTitles([])
    setLocationInput('')
    setLocations([])
    setCityInput('')
    setCities([])
    setSelectedIndustries([])
    setKeywordInput('')
    setKeywords([])
    
    // Clear Advanced Fields
    setExcludedJobTitleInput('')
    setExcludedJobTitles([])
    setExcludedLocationInput('')
    setExcludedLocations([])
    setExcludedCityInput('')
    setExcludedCities([])
    setExcludedKeywordInput('')
    setExcludedKeywords([])
    setSelectedSeniorities([])
    setSelectedFunctions([])
    setSelectedEmailStatuses([])
    setSelectedExcludedIndustries([])
    setSelectedSizes([])
    setSelectedFundingRounds([])
    setMinRevenue('')
    setMaxRevenue('')
    
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
    if (jobTitles.length === 0 && companies.length === 0) {
      setError('Please provide at least a Company Name or Job Title.')
      return
    }

    setLoading(true)
    setView('logs')
    
    if (!isAuthenticated) {
      addLog(`Initiating search for ${companies[0] || jobTitles[0]}`, 'target')
      
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
        fetchCount,
        runName,
        companyNames: companies,
        jobTitles,
        excludedJobTitles,
        locations,
        cities,
        excludedLocations,
        excludedCities,
        industries: selectedIndustries,
        excludedIndustries: selectedExcludedIndustries,
        keywords,
        excludedKeywords,
        companySize: selectedSizes,
        seniorityLevel: selectedSeniorities,
        functionalLevel: selectedFunctions,
        emailStatus: selectedEmailStatuses,
        funding: selectedFundingRounds,
        minRevenue,
        maxRevenue
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
    <div className="flex h-[calc(100vh-140px)] min-h-[600px] gap-6 p-1 pb-12">
      {/* Left Panel: Inputs */}
      <div className="w-1/2 flex flex-col h-full">
        <Card className="flex flex-col h-full border border-border/40 shadow-xl bg-card overflow-hidden transition-shadow duration-300">
          <CardContent className="space-y-6 flex-1 overflow-y-auto p-8 scrollbar-thin">
            {/* Fetch Count & Run Name */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="fetchCount" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                  Leads to Fetch
                </Label>
                <Input
                  id="fetchCount"
                  type="number"
                  min={1}
                  max={10000}
                  value={fetchCount}
                  onChange={(e) => setFetchCount(Math.min(10000, Math.max(1, parseInt(e.target.value) || 100)))}
                  className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                />
                <p className="text-[10px] text-muted-foreground">Min: 1, Max: 10,000</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="runName" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                  Run Name
                </Label>
                <Input
                  id="runName"
                  placeholder="e.g., Q1 Tech Leads"
                  value={runName}
                  onChange={(e) => setRunName(e.target.value)}
                  className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Job Titles */}
            <div className="space-y-3">
              <Label htmlFor="jobTitle" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                Job Titles
              </Label>
              <div className="flex gap-2">
                <Input
                  id="jobTitle"
                  placeholder="e.g., Software Engineer, Product Manager"
                  value={jobTitleInput}
                  onChange={(e) => setJobTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddJobTitle()}
                  className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                />
                <Button variant="outline" size="icon" onClick={handleAddJobTitle} type="button" className="shrink-0 h-12 w-12 border-border/40 hover:bg-muted/50">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {jobTitles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {jobTitles.map(title => (
                    <Badge key={title} variant="secondary" className="flex items-center gap-2 py-1.5 pl-3 pr-2 shadow-none border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors font-medium rounded-md">
                      <span>{title}</span>
                      <button
                        type="button"
                        className="ml-0.5 rounded-sm hover:bg-muted transition-colors p-0.5"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveJobTitle(title);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Location & City Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Locations */}
              <div className="space-y-3">
                <Label htmlFor="location" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                  Location
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="e.g., California, USA"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
                    className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                  />
                  <Button variant="outline" size="icon" onClick={handleAddLocation} type="button" className="shrink-0 h-12 w-12 border-border/40 hover:bg-muted/50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {locations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {locations.map(loc => (
                      <Badge key={loc} variant="secondary" className="flex items-center gap-2 py-1.5 pl-3 pr-2 shadow-none border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors font-medium rounded-md text-xs">
                        <span>{loc}</span>
                        <button
                          type="button"
                          className="ml-0.5 rounded-sm hover:bg-muted transition-colors p-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveLocation(loc);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Cities */}
              <div className="space-y-3">
                <Label htmlFor="city" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                  City
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="city"
                    placeholder="e.g., San Francisco"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                    className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                  />
                  <Button variant="outline" size="icon" onClick={handleAddCity} type="button" className="shrink-0 h-12 w-12 border-border/40 hover:bg-muted/50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {cities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cities.map(city => (
                      <Badge key={city} variant="secondary" className="flex items-center gap-2 py-1.5 pl-3 pr-2 shadow-none border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors font-medium rounded-md text-xs">
                        <span>{city}</span>
                        <button
                          type="button"
                          className="ml-0.5 rounded-sm hover:bg-muted transition-colors p-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveCity(city);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Industries & Keywords Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Industries */}
              <div className="space-y-3">
                <Label htmlFor="industry" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                  Industries
                </Label>
                <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={industryOpen}
                      className="w-full justify-between bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all hover:bg-muted/30 font-normal px-4"
                    >
                      <span className="truncate text-muted-foreground">
                        {selectedIndustries.length > 0
                          ? `${selectedIndustries.length} selected`
                          : "Select industries..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command className="border-none">
                      <CommandInput placeholder="Search industry..." className="h-11 shadow-none border-none focus:ring-0" />
                      <CommandList className="max-h-[300px] overflow-y-auto scrollbar-thin">
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandGroup>
                          {INDUSTRIES.map((ind) => (
                            <CommandItem
                              key={ind}
                              value={ind}
                              onSelect={() => {
                                setSelectedIndustries(prev =>
                                  prev.includes(ind)
                                    ? prev.filter(i => i !== ind)
                                    : [...prev, ind]
                                )
                              }}
                              className="flex items-start gap-2 px-4 py-3 cursor-pointer hover:bg-muted font-medium"
                            >
                              <div className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary transition-colors mt-0.5",
                                selectedIndustries.includes(ind) ? "bg-primary text-primary-foreground" : "opacity-50"
                              )}>
                                {selectedIndustries.includes(ind) && <Check className="h-3 w-3" />}
                              </div>
                              <span className="flex-1">{ind}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedIndustries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedIndustries.map(ind => (
                      <Badge
                        key={ind}
                        variant="secondary"
                        className="text-[10px] py-0 pl-2 pr-1 h-6 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors flex items-center gap-1 font-semibold"
                      >
                        <span>{ind}</span>
                        <button
                          type="button"
                          className="ml-0.5 rounded-sm hover:bg-primary/20 p-0.5 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedIndustries(prev => prev.filter(i => i !== ind));
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Keywords */}
              <div className="space-y-3">
                <Label htmlFor="keywords" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                  Keywords
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    placeholder="e.g., AI, Cloud, SaaS"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                    className="bg-muted/20 focus:bg-background border-border/40 h-12 text-sm transition-all focus:ring-1 focus:ring-primary/20"
                  />
                  <Button variant="outline" size="icon" onClick={handleAddKeyword} type="button" className="shrink-0 h-12 w-12 border-border/40 hover:bg-muted/50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map(keyword => (
                      <Badge key={keyword} variant="secondary" className="flex items-center gap-2 py-1.5 pl-3 pr-2 shadow-none border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors font-medium rounded-md text-xs">
                        <span>{keyword}</span>
                        <button
                          type="button"
                          className="ml-0.5 rounded-sm hover:bg-muted transition-colors p-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveKeyword(keyword);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="pt-4 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full justify-between h-10 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <span>Advanced Filters</span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* Advanced Filters Section */}
            {showAdvanced && (
              <div className="space-y-6 pt-4 border-t border-border/40">
                {/* Contact Filters */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/90 flex items-center gap-2">
                    <div className="h-px bg-border/60 flex-1" />
                    Contact Filters
                    <div className="h-px bg-border/60 flex-1" />
                  </h4>
                  
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Exclude Job Titles</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g., Intern, Student, Assistant" 
                        value={excludedJobTitleInput}
                        onChange={e => setExcludedJobTitleInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddExcludedJobTitle()}
                        className="bg-muted/20 focus:bg-background border-border/40 h-10 text-sm"
                      />
                      <Button variant="outline" size="icon" onClick={handleAddExcludedJobTitle} type="button" className="shrink-0 h-10 w-10 border-border/40">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {excludedJobTitles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {excludedJobTitles.map(title => (
                          <Badge key={title} variant="destructive" className="flex items-center gap-2 py-0.5 px-2 text-xs opacity-80 hover:opacity-100">
                            <span>{title}</span>
                            <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveExcludedJobTitle(title)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Seniority</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-10 text-sm bg-muted/20 border-border/40 font-normal px-3">
                            <span className="truncate text-muted-foreground">{selectedSeniorities.length ? `${selectedSeniorities.length} selected` : 'Select seniority...'}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No results.</CommandEmpty>
                              <CommandGroup>
                                {SENIORITY_LEVELS.map((level) => (
                                  <CommandItem key={level} value={level} onSelect={() => {
                                    setSelectedSeniorities(prev => prev.includes(level) ? prev.filter(i => i !== level) : [...prev, level])
                                  }}>
                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedSeniorities.includes(level) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                                      {selectedSeniorities.includes(level) && <Check className="h-3 w-3" />}
                                    </div>
                                    {level}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Department</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-10 text-sm bg-muted/20 border-border/40 font-normal px-3">
                            <span className="truncate text-muted-foreground">{selectedFunctions.length ? `${selectedFunctions.length} selected` : 'Select department...'}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No results.</CommandEmpty>
                              <CommandGroup>
                                {FUNCTIONAL_LEVELS.map((level) => (
                                  <CommandItem key={level} value={level} onSelect={() => {
                                    setSelectedFunctions(prev => prev.includes(level) ? prev.filter(i => i !== level) : [...prev, level])
                                  }}>
                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedFunctions.includes(level) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                                      {selectedFunctions.includes(level) && <Check className="h-3 w-3" />}
                                    </div>
                                    {level}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Email Status</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-10 text-sm bg-muted/20 border-border/40 font-normal px-3">
                          <span className="truncate text-muted-foreground">{selectedEmailStatuses.length ? `${selectedEmailStatuses.length} selected` : 'Select status...'}</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {EMAIL_STATUSES.map((status) => (
                                <CommandItem key={status} value={status} onSelect={() => {
                                  setSelectedEmailStatuses(prev => prev.includes(status) ? prev.filter(i => i !== status) : [...prev, status])
                                }}>
                                  <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedEmailStatuses.includes(status) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                                    {selectedEmailStatuses.includes(status) && <Check className="h-3 w-3" />}
                                  </div>
                                  {status}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Location Filters */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/90 flex items-center gap-2">
                    <div className="h-px bg-border/60 flex-1" />
                    Location Exclusion
                    <div className="h-px bg-border/60 flex-1" />
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Exclude Locations</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Region/Country" 
                          value={excludedLocationInput}
                          onChange={e => setExcludedLocationInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddExcludedLocation()}
                          className="bg-muted/20 focus:bg-background border-border/40 h-10 text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={handleAddExcludedLocation} type="button" className="shrink-0 h-10 w-10 border-border/40">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {excludedLocations.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-2">
                           {excludedLocations.map(loc => (
                             <Badge key={loc} variant="destructive" className="flex items-center gap-2 py-0.5 px-2 text-xs opacity-80 hover:opacity-100">
                               <span>{loc}</span>
                               <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveExcludedLocation(loc)} />
                             </Badge>
                           ))}
                         </div>
                       )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Exclude Cities</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="City" 
                          value={excludedCityInput}
                          onChange={e => setExcludedCityInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddExcludedCity()}
                          className="bg-muted/20 focus:bg-background border-border/40 h-10 text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={handleAddExcludedCity} type="button" className="shrink-0 h-10 w-10 border-border/40">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {excludedCities.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-2">
                           {excludedCities.map(city => (
                             <Badge key={city} variant="destructive" className="flex items-center gap-2 py-0.5 px-2 text-xs opacity-80 hover:opacity-100">
                               <span>{city}</span>
                               <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveExcludedCity(city)} />
                             </Badge>
                           ))}
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                {/* Company Filters */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/90 flex items-center gap-2">
                    <div className="h-px bg-border/60 flex-1" />
                    Company Filters
                    <div className="h-px bg-border/60 flex-1" />
                  </h4>
                  
                  {/* Include Company Domains here */}
                  <div className="space-y-3">
                      <Label htmlFor="company" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                        Company Domains
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="company"
                          placeholder="e.g., google.com, apple.com"
                          value={companyInput}
                          onChange={(e) => setCompanyInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCompany()}
                          className="bg-muted/20 focus:bg-background border-border/40 h-10 text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={handleAddCompany} type="button" className="shrink-0 h-10 w-10 border-border/40">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {companies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {companies.map(name => (
                            <Badge key={name} variant="secondary" className="flex items-center gap-2 py-1.5 pl-3 pr-2 shadow-none border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors font-medium rounded-md text-xs">
                              <span>{name}</span>
                              <button
                                type="button"
                                className="ml-0.5 rounded-sm hover:bg-muted transition-colors p-0.5"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveCompany(name);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Exclude Industries</Label>
                       <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-10 text-sm bg-muted/20 border-border/40 font-normal px-3">
                            <span className="truncate text-muted-foreground">{selectedExcludedIndustries.length ? `${selectedExcludedIndustries.length} excluded` : 'Select...'}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No results.</CommandEmpty>
                              <CommandGroup>
                                {INDUSTRIES.map((ind) => (
                                  <CommandItem key={ind} value={ind} onSelect={() => {
                                    setSelectedExcludedIndustries(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind])
                                  }}>
                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedExcludedIndustries.includes(ind) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                                      {selectedExcludedIndustries.includes(ind) && <Check className="h-3 w-3" />}
                                    </div>
                                    {ind}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Exclude Keywords</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Keyword" 
                          value={excludedKeywordInput}
                          onChange={e => setExcludedKeywordInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddExcludedKeyword()}
                          className="bg-muted/20 focus:bg-background border-border/40 h-10 text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={handleAddExcludedKeyword} type="button" className="shrink-0 h-10 w-10 border-border/40">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {excludedKeywords.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-2">
                           {excludedKeywords.map(k => (
                             <Badge key={k} variant="destructive" className="flex items-center gap-2 py-0.5 px-2 text-xs opacity-80 hover:opacity-100">
                               <span>{k}</span>
                               <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveExcludedKeyword(k)} />
                             </Badge>
                           ))}
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Company Size</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-10 text-sm bg-muted/20 border-border/40 font-normal px-3">
                            <span className="truncate text-muted-foreground">{selectedSizes.length ? `${selectedSizes.length} selected` : 'Select size...'}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                {COMPANY_SIZES.map((size) => (
                                  <CommandItem key={size} value={size} onSelect={() => {
                                    setSelectedSizes(prev => prev.includes(size) ? prev.filter(i => i !== size) : [...prev, size])
                                  }}>
                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedSizes.includes(size) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                                      {selectedSizes.includes(size) && <Check className="h-3 w-3" />}
                                    </div>
                                    {size}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Funding</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-10 text-sm bg-muted/20 border-border/40 font-normal px-3">
                            <span className="truncate text-muted-foreground">{selectedFundingRounds.length ? `${selectedFundingRounds.length} selected` : 'Select funding...'}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No results.</CommandEmpty>
                              <CommandGroup>
                                {FUNDING_ROUNDS.map((round) => (
                                  <CommandItem key={round} value={round} onSelect={() => {
                                    setSelectedFundingRounds(prev => prev.includes(round) ? prev.filter(i => i !== round) : [...prev, round])
                                  }}>
                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedFundingRounds.includes(round) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                                      {selectedFundingRounds.includes(round) && <Check className="h-3 w-3" />}
                                    </div>
                                    {round}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Revenue Filters */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/90 flex items-center gap-2">
                    <div className="h-px bg-border/60 flex-1" />
                    Revenue Filters
                    <div className="h-px bg-border/60 flex-1" />
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Min Revenue</Label>
                       <Select value={minRevenue} onValueChange={setMinRevenue}>
                         <SelectTrigger className="h-10 text-sm bg-muted/20 border-border/40">
                           <SelectValue placeholder="Select min..." />
                         </SelectTrigger>
                         <SelectContent>
                           {REVENUE_RANGES.map((rev) => (
                             <SelectItem key={rev} value={rev}>{rev}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Max Revenue</Label>
                       <Select value={maxRevenue} onValueChange={setMaxRevenue}>
                         <SelectTrigger className="h-10 text-sm bg-muted/20 border-border/40">
                           <SelectValue placeholder="Select max..." />
                         </SelectTrigger>
                         <SelectContent>
                           {REVENUE_RANGES.map((rev) => (
                             <SelectItem key={rev} value={rev}>{rev}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="text-xs text-destructive bg-destructive/5 p-4 rounded-xl border border-destructive/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <div className="shrink-0 h-1.5 w-1.5 rounded-full bg-destructive" />
              {error}
            </div>}
          </CardContent>
          <CardFooter className="flex-none gap-2 p-6 border-t bg-muted/5">
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
