'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, FolderKanban, Github, Calendar, Users, FileText, ExternalLink, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuthGate } from '@/components/auth/AuthGate'
import { useAuthStore } from '@/lib/stores/auth-store'
import { BookmarkButton } from '@/components/shared/BookmarkButton'
import { ReactionButtons } from '@/components/shared/ReactionButtons'
import { CommentSection } from '@/components/shared/CommentSection'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/lib/types'

type ProjectDetails = Project & {
  app_user: { name: string } | null
  project_image: { image_url: string; display_order: number }[]
  project_file: { file_name: string; file_type: string; file_url: string; file_size_bytes: number | null }[]
  project_video: { video_url: string; display_order: number; title: string | null }[]
  project_milestone: { title: string; description: string | null; completed_at: string | null }[]
  entity_tag: { tag: { name: string } }[]
}

const TIERS: Record<number, string> = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }

export default function SingleProjectPage() {
  const { isAuthenticated } = useAuthStore()
  const params = useParams()
  const projectId = params.id as string
  const supabase = createClient()
  
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('project')
        .select(`
          *,
          app_user!project_owner_id_fkey(name),
          project_image(image_url, display_order),
          project_file(file_name, file_type, file_url, file_size_bytes),
          project_video(video_url, display_order, title),
          project_milestone(title, description, completed_at)
        `)
        .eq('id', projectId)
        .single()

      if (error) {
        console.error('Project fetch error:', error.message, '| code:', error.code)
        setFetchError(error.message)
      }

      if (!error && data) {
        // Fetch polymorphic tags separately since PostgREST can't auto-join on generic target_id
        const { data: tagData } = await supabase
          .from('entity_tag')
          .select('tag(name)')
          .eq('target_type', 'project')
          .eq('target_id', projectId)

        setProject({
          ...data,
          entity_tag: tagData || []
        } as unknown as ProjectDetails)
      }
      setLoading(false)
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <FolderKanban className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Project not found</h1>
        <p className="text-muted-foreground mb-2">This project may be private or still under review.</p>
        {fetchError && (
          <p className="text-xs text-red-400 font-mono bg-red-500/10 px-3 py-1.5 rounded mb-4">{fetchError}</p>
        )}
        <Button asChild><Link href="/projects">Browse all projects</Link></Button>
      </div>
    )
  }

  const coverImage = project.project_image?.find(img => img.display_order === 1)?.image_url

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </Button>

      {/* Cover Image */}
      <div className="aspect-video bg-gradient-to-br from-brand-deep/10 via-brand-ocean/10 to-brand-sky/10 rounded-xl flex items-center justify-center mb-8 overflow-hidden relative border border-border/50">
        {coverImage ? (
          <img src={coverImage} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <FolderKanban className="h-20 w-20 text-brand-ocean/30" />
        )}
      </div>

      {/* Header area */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {project.domain && <Badge variant="secondary">{project.domain}</Badge>}
            {project.tier && <Badge variant="outline">Tier {TIERS[project.tier]}</Badge>}
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          {project.one_line_summary && (
            <p className="text-lg text-muted-foreground mb-3">{project.one_line_summary}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> by {project.app_user?.name ?? 'Unknown'}</span>
            {project.duration_estimate && (
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {project.duration_estimate}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 min-w-[180px]">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <ReactionButtons targetType="project" targetId={project.id} />
              <BookmarkButton targetType="project" targetId={project.id} className="w-full justify-center" />
            </div>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/auth/login"><LogIn className="mr-2 h-4 w-4" /> Log in to Interact</Link>
            </Button>
          )}
          
          {project.github_url && (
            <Button variant="outline" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> GitHub Repository
              </a>
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Tags */}
      {project.entity_tag && project.entity_tag.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {project.entity_tag.map(({ tag }) => (
            <Link key={tag.name} href={`/tags/${tag.name.toLowerCase()}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-brand-ocean/10">{tag.name}</Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Description */}
      <Card className="mb-8 border-border/50 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4"><CardTitle>Description</CardTitle></CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
          <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
            {project.description || 'No description provided.'}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Milestones */}
          {project.project_milestone && project.project_milestone.length > 0 && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4"><CardTitle>Milestones</CardTitle></CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {project.project_milestone.map((m, i) => {
                    const done = !!m.completed_at
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                          {done ? '✓' : i + 1}
                        </div>
                        <div>
                          <p className={`font-medium text-sm ${done ? 'line-through text-muted-foreground' : ''}`}>{m.title}</p>
                          {m.description && <p className="text-xs text-muted-foreground mt-1">{m.description}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Comments Section */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4"><CardTitle>Discussion</CardTitle></CardHeader>
            <CardContent className="pt-6">
              <CommentSection targetType="project" targetId={project.id} />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          {/* Files */}
          {project.project_file && project.project_file.length > 0 && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4"><CardTitle>Files</CardTitle></CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {project.project_file.map((f) => (
                    <a key={f.file_url} href={f.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium truncate group-hover:text-brand-ocean transition-colors">{f.file_name}</span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Videos */}
          {project.project_video && project.project_video.length > 0 && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4"><CardTitle>Videos</CardTitle></CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {project.project_video.map((v) => (
                    <div key={v.video_url} className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                      <a href={v.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all z-10">
                        <ExternalLink className="h-6 w-6 mb-2" />
                        <span className="text-xs font-medium px-4 text-center">{v.title || 'Watch Video'}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
