'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FolderKanban, Pencil, Trash2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import type { Project } from '@/lib/types'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  pending_review: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  active: 'Active',
  rejected: 'Rejected',
}

export default function MyProjectsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('project')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load projects')
    } else {
      setProjects(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [user])

  const handleSubmitForReview = async (projectId: string) => {
    const { error } = await supabase
      .from('project')
      .update({ status: 'pending_review' })
      .eq('id', projectId)
      .eq('owner_id', user!.id)

    if (error) {
      toast.error('Failed to submit: ' + error.message)
    } else {
      toast.success('Project submitted for review!')
      fetchProjects()
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Delete this draft project? This cannot be undone.')) return

    const { error } = await supabase
      .from('project')
      .delete()
      .eq('id', projectId)
      .eq('owner_id', user!.id)
      .eq('status', 'draft') // safety: only delete drafts

    if (error) {
      toast.error('Failed to delete: ' + error.message)
    } else {
      toast.success('Project deleted.')
      fetchProjects()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-muted-foreground">Manage your projects and submissions</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white" asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first project to start your maker journey.
          </p>
          <Button asChild className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white">
            <Link href="/dashboard/projects/new">Create First Project</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Card key={p.id} className="group hover:border-brand-ocean/20 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-brand-deep/10 to-brand-ocean/10 flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-brand-ocean/50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-brand-ocean transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {p.domain && (
                        <Badge variant="outline" className="text-[10px]">{p.domain}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`text-xs ${statusColors[p.status]}`}>
                    {statusLabels[p.status]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{p.visibility}</Badge>
                  <div className="flex gap-1">
                    {p.status === 'draft' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-brand-ocean"
                          onClick={() => handleSubmitForReview(p.id)}
                        >
                          <Send className="mr-1 h-3 w-3" /> Submit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/projects/${p.id}/edit`}>
                        <Pencil className="h-3 w-3 mr-1" /> Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
