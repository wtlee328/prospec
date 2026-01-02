
'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Maximize2, Minimize2, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function LeadsTable({ leads }: { leads: any[] }) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isAllExpanded, setIsAllExpanded] = useState(false)

  const exportToCSV = () => {
    if (!leads || leads.length === 0) return

    const headers = ['First Name', 'Last Name', 'Full Name', 'Job Title', 'Company', 'Email', 'Location', 'LinkedIn']
    const rows = leads.map(l => [
      l.first_name || '',
      l.last_name || '',
      l.full_name || `${l.first_name || ''} ${l.last_name || ''}`.trim(),
      l.job_title || '',
      l.company_name || '',
      l.email || '',
      l.location || l.industry || '',
      l.linkedin_url || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `prospec_leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedRows(new Set())
    } else {
      setExpandedRows(new Set(leads.map(l => l.id)))
    }
    setIsAllExpanded(!isAllExpanded)
  }

  const formatValue = (val: any) => {
    if (val === null || val === undefined) return '-'
    if (typeof val === 'boolean') return val ? 'Yes' : 'No'
    if (Array.isArray(val)) return val.join(', ')
    return String(val)
  }

  const CollapsibleValue = ({ value }: { value: string }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const needsCollapsing = value.length > 150

    return (
      <div className="relative group/val">
        <div className={`text-sm leading-relaxed text-foreground/90 break-words whitespace-normal transition-all duration-200 ${!isExpanded && needsCollapsing ? 'line-clamp-3 overflow-hidden' : ''}`}>
          {value}
        </div>
        {needsCollapsing && (
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 mt-1 transition-colors flex items-center gap-1"
          >
            {isExpanded ? (
              <>Show Less <ChevronDown className="h-3 w-3 rotate-180" /></>
            ) : (
              <>Show More <ChevronDown className="h-3 w-3" /></>
            )}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV}
          className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleExpandAll}
          className="flex items-center gap-2 shadow-sm"
        >
          {isAllExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          {isAllExpanded ? 'Collapse All' : 'Expand All'}
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Run Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              const isExpanded = expandedRows.has(lead.id)
              return (
                <React.Fragment key={lead.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleRow(lead.id)}
                  >
                    <TableCell>
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {lead.first_name} {lead.last_name}
                      {lead.full_name && !lead.first_name && <span>{lead.full_name}</span>}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                      {lead.job_title}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {lead.company_name}
                    </TableCell>
                    <TableCell>
                      {lead.email ? (
                        <a 
                          href={`mailto:${lead.email}`} 
                          className="text-primary hover:underline text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.location || lead.industry}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-muted/20 border-t-0 hover:bg-muted/20">
                      <TableCell colSpan={7} className="p-0">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                          {Object.entries(lead.raw_data || {}).map(([key, value]) => {
                            if (!value || (Array.isArray(value) && value.length === 0)) return null;
                            const label = key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/_/g, ' ')
                              .replace(/^./, (str) => str.toUpperCase())
                              .trim();
                            
                            const isExpandableField = ['keywords', 'company_technologies', 'company_description', 'headline'].includes(key.toLowerCase());
                            
                            return (
                              <div key={key} className="space-y-1.5 overflow-hidden">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 block">
                                  {label}
                                </label>
                                <div className="text-sm leading-relaxed text-foreground/90 break-words whitespace-normal">
                                  {typeof value === 'object' ? (
                                    <pre className="text-[11px] font-mono bg-background/50 p-2 rounded border border-border/40 overflow-x-auto max-w-full">
                                      {JSON.stringify(value, null, 2)}
                                    </pre>
                                  ) : (
                                    <>
                                      {(key.toLowerCase().includes('linkedin') || 
                                        key.toLowerCase().includes('url') || 
                                        key.toLowerCase().includes('website')) && 
                                        typeof value === 'string' && value.startsWith('http') ? (
                                        <a 
                                          href={value} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-primary hover:underline break-all inline-flex items-center gap-1 group"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {value}
                                        </a>
                                      ) : isExpandableField && typeof value === 'string' ? (
                                        <CollapsibleValue value={value} />
                                      ) : (
                                        <span className="block w-full">{formatValue(value)}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
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

import React from 'react'
