
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { startCrawl } from '@/app/actions/crawl'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'

export default function FinderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form State
  const [companyName, setCompanyName] = useState('')
  const [jobTitleInput, setJobTitleInput] = useState('')
  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [industry, setIndustry] = useState('')

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
  }

  const handleStartCrawl = async () => {
    setError('')
    if (jobTitles.length === 0 && !companyName) {
      setError('Please provide at least a Company Name or Job Title.')
      return
    }

    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Left Panel: Inputs */}
      <div className="w-1/2 flex flex-col">
        <Card className="flex flex-col h-full">
          <CardHeader className="flex-none">
            <CardTitle>Find Leads</CardTitle>
            <CardDescription>Enter your search criteria to start crawling.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name (Optional)</Label>
              <Input 
                id="company" 
                placeholder="e.g. Acme Corp" 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Titles</Label>
              <div className="flex gap-2">
                <Input 
                  id="jobTitle" 
                  placeholder="e.g. CEO" 
                  value={jobTitleInput}
                  onChange={e => setJobTitleInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddJobTitle()}
                />
                <Button variant="outline" size="icon" onClick={handleAddJobTitle} type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {jobTitles.map(title => (
                  <Badge key={title} variant="secondary" className="flex items-center gap-1">
                    {title}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveJobTitle(title)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="e.g. New York, USA" 
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                placeholder="e.g. Software" 
                value={industry}
                onChange={e => setIndustry(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex-none mt-auto gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClearInput} disabled={loading}>
              Clear
            </Button>
            <Button className="flex-1" onClick={handleStartCrawl} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start Search
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right Panel: Illustration / Output */}
      <div className="w-1/2 bg-muted/30 rounded-lg border flex flex-col items-center justify-center text-center p-8 text-muted-foreground h-full">
        <div className="max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Ready to Dig?</h3>
            <p>Our crawler will search across multiple sources to find the best leads matching your criteria. This process typically takes 1-5 minutes.</p>
            <div className="mt-8 p-4 bg-background border rounded shadow-sm text-left text-sm font-mono w-full">
                <div className="text-xs text-muted-foreground mb-2">Console Output Preview</div>
                <div>{'>'} Waiting for input...</div>
            </div>
        </div>
      </div>
    </div>
  )
}
