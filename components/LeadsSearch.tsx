
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function LeadsSearch({ initialQuery, runId }: { initialQuery?: string, runId?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [input, setInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])

  useEffect(() => {
    if (initialQuery) {
      const k = initialQuery.split(/[,\s]+/).filter(k => k.length > 0)
      setKeywords(k)
    } else {
        setKeywords([])
    }
  }, [initialQuery])

  const handleAddKeyword = () => {
    const trimmed = input.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      const newKeywords = [...keywords, trimmed]
      setKeywords(newKeywords)
      setInput('')
      updateSearch(newKeywords)
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter(k => k !== keyword)
    setKeywords(newKeywords)
    updateSearch(newKeywords)
  }

  const updateSearch = (currentKeywords: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (currentKeywords.length > 0) {
      params.set('q', currentKeywords.join(','))
    } else {
      params.delete('q')
    }
    
    // Preserve run_id if it exists
    if (runId) {
      params.set('run_id', runId)
    }

    router.push(`/leads?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full lg:w-[450px]">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Add search keyword..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 h-10 border-border/40 bg-muted/20 focus:bg-background" 
          />
        </div>
        <Button onClick={handleAddKeyword} className="h-10 px-4">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>
      
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {keywords.map((k) => (
            <Badge 
              key={k} 
              variant="secondary" 
              className="px-3 py-1 rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 flex items-center gap-2 transition-all"
            >
              <span className="text-xs font-semibold uppercase tracking-wider">{k}</span>
              <button 
                onClick={() => handleRemoveKeyword(k)}
                className="hover:text-destructive transition-colors"
                title="Remove keyword"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button 
            onClick={() => {
              setKeywords([])
              updateSearch([])
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors ml-1"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
