'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, FolderKanban, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import type { Project } from '@/lib/types'

type ProjectWithOwner = Project & {
  app_user: { name: string; email: string } | null
}

export default function ReviewProjectsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [projects, setProjects] = useState<ProjectWithOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchPending = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('project')
      .select('*, app_user!project_owner_id_fkey(name, email)')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Fetch pending projects error:', error)
      toast.error('Failed to load review queue: ' + error.message)
    } else {
      setProjects((data as ProjectWithOwner[]) ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleApprove = async (projectId: string) => {
    setActionLoading(true)
    const { error } = await supabase
      .from('project')
      .update({ status: 'active', visibility: 'public', mentor_id: user!.id })
      .eq('id', projectId)

    if (error) {
      toast.error('Approval failed: ' + error.message)
    } else {
      toast.success('Project approved and published! ✅')
      fetchPending()
    }
    setActionLoading(false)
  }

  const handleReject = async () => {
    if (!rejectTarget) return
    setActionLoading(true)
    const { error } = await supabase
      .from('project')
      .update({ status: 'rejected' })
      .eq('id', rejectTarget)

    if (error) {
      toast.error('Rejection failed: ' + error.message)
    } else {
      toast.success('Project rejected.')
      setRejectTarget(null)
      setRejectReason('')
      fetchPending()
    }
    setActionLoading(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground">
          Projects pending approval — {projects.length} waiting
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500/40 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">All caught up!</h3>
          <p className="text-sm text-muted-foreground">No projects waiting for review.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <Card key={p.id} className="border-amber-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-deep/10 to-brand-ocean/10 flex items-center justify-center">
                      <FolderKanban className="h-5 w-5 text-brand-ocean/50" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{p.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {p.app_user?.name ?? 'Unknown'} · {p.app_user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.domain && <Badge variant="outline">{p.domain}</Badge>}
                    {p.tier && (
                      <Badge variant="secondary">
                        {['', 'Beginner', 'Intermediate', 'Advanced'][p.tier]}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {p.one_line_summary && (
                  <p className="text-sm text-muted-foreground mb-4">{p.one_line_summary}</p>
                )}
                {p.github_url && (
                  <a
                    href={p.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-ocean hover:underline mb-4"
                  >
                    <ExternalLink className="h-3 w-3" /> View on GitHub
                  </a>
                )}
                <div className="flex gap-3 pt-2 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(p.id)}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve & Publish
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                    onClick={() => setRejectTarget(p.id)}
                    disabled={actionLoading}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reject modal */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Provide feedback so the maker knows what to improve:
            </p>
            <Textarea
              placeholder="Explain what needs to be changed..."
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
