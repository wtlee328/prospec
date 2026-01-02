
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

export default function RunsTable({ runs }: { runs: any[] }) {
  const supabase = createClient()
  const router = useRouter()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const toggleSaved = async (runId: string, current: boolean) => {
    await supabase.from('runs').update({ is_saved: !current }).eq('id', runId)
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
              <TableCell className="max-w-[200px] truncate">
                {run.search_criteria?.companyName || run.search_criteria?.jobTitles?.join(', ')}
              </TableCell>
              <TableCell>
                <Badge variant={run.status === 'completed' ? 'default' : run.status === 'failed' ? 'destructive' : 'secondary'}>
                  {run.status}
                </Badge>
              </TableCell>
              <TableCell>{run.lead_count}</TableCell>
              <TableCell>
                <Switch 
                    checked={run.is_saved} 
                    onCheckedChange={() => toggleSaved(run.id, run.is_saved)} 
                />
              </TableCell>
              <TableCell>
                {run.is_saved ? 'Never' : run.expires_at ? new Date(run.expires_at).toLocaleDateString() : '-'}
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
