
'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns' // Need date-fns or native Intl
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function RunsTable({ runs }: { runs: any[] }) {
  const supabase = createClient()
  const router = useRouter()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewCriteria, setViewCriteria] = useState<any | null>(null)

  const toggleSaved = async (runId: string, current: boolean) => {
    await supabase.from('runs').update({ saved: !current }).eq('id', runId)
    router.refresh()
  }

  const handleDeleteClick = (runId: string) => {
    setDeleteConfirm(runId)
  }

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await supabase.from('runs').delete().eq('id', deleteConfirm)
      setDeleteConfirm(null)
      router.refresh()
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Criteria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Leads</TableHead>
            <TableHead>Saved</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell>{new Date(run.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 max-w-[220px]">
                  <span className="truncate text-sm">
                    {run.input_criteria?.companyDomains?.join(', ') || 
                     run.input_criteria?.companyNames?.join(', ') || 
                     run.input_criteria?.jobTitles?.join(', ') || 
                     'No primary criteria'}
                  </span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-[10px] w-fit text-primary/70 hover:text-primary"
                    onClick={() => setViewCriteria(run.input_criteria)}
                  >
                    Show All
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={run.status === 'completed' ? 'default' : run.status === 'failed' ? 'destructive' : 'secondary'}>
                  {run.status}
                </Badge>
              </TableCell>
              <TableCell>{run.number_of_leads}</TableCell>
              <TableCell>
                <Switch 
                    checked={run.saved} 
                    onCheckedChange={() => toggleSaved(run.id, run.saved)} 
                />
              </TableCell>
              <TableCell>
                {run.saved ? 'Never' : run.expires_at ? new Date(run.expires_at).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/leads?run_id=${run.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(run.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {runs.length === 0 && (
            <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No runs found.
                </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Criteria View Dialog */}
      <Dialog open={!!viewCriteria} onOpenChange={(open) => !open && setViewCriteria(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Run Criteria</DialogTitle>
            <DialogDescription>
              Structured breakdown of search parameters used for this run.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2 space-y-6">
            {Object.entries(viewCriteria || {})
              .filter(([_, value]) => {
                if (value === null || value === undefined || value === '') return false;
                if (Array.isArray(value) && value.length === 0) return false;
                return true;
              })
              .map(([key, value]) => {
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .replace('Input', '')
                  .trim();

                return (
                  <div key={key} className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                      {label}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(value) ? (
                        value.map((v, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary" 
                            className="px-3 py-1 rounded-full bg-secondary/50 border-secondary-foreground/10 text-xs font-medium"
                          >
                            {String(v)}
                          </Badge>
                        ))
                      ) : (
                        <Badge 
                          variant="secondary" 
                          className="px-3 py-1 rounded-full bg-secondary/50 border-secondary-foreground/10 text-xs font-medium"
                        >
                          {String(value)}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={cancelDelete}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure? This will delete all leads in this run.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
