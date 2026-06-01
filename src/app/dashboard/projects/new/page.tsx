'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { DOMAINS } from '@/lib/constants/domains'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { uploadProjectImage } from '@/lib/utils/storage'
import { toast } from 'sonner'

export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [domain, setDomain] = useState('')
  const [tier, setTier] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [duration, setDuration] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (submitForReview = false) => {
    if (!user) {
      toast.error('You must be logged in.')
      return
    }
    if (!title.trim()) {
      toast.error('Project title is required.')
      return
    }

    setLoading(true)
    try {
      const { data: project, error } = await supabase
        .from('project')
        .insert({
          title: title.trim(),
          one_line_summary: summary.trim() || null,
          description: description.trim() || null,
          domain: domain || null,
          tier: tier ? parseInt(tier) : null,
          github_url: githubUrl.trim() || null,
          duration_estimate: duration || null,
          owner_id: user.id,
          status: submitForReview ? 'pending_review' : 'draft',
          visibility: 'private',
          showcase_ready: false,
        })
        .select('id')
        .single()

      if (error) {
        console.error('Project create error:', error.message)
        toast.error(`Failed to create project: ${error.message}`)
        return
      }

      // If video URL provided, save it
      if (videoUrl.trim() && project?.id) {
        await supabase.from('project_video').insert({
          project_id: project.id,
          video_url: videoUrl.trim(),
          display_order: 1,
          added_by: user.id,
        })
      }

      // If image provided, upload and save it
      if (imageFile && project?.id) {
        const { url, error: uploadError } = await uploadProjectImage(user.id, project.id, imageFile)
        if (url) {
          await supabase.from('project_image').insert({
            project_id: project.id,
            image_url: url,
            display_order: 1,
            uploaded_by: user.id,
          })
        } else {
          toast.error(`Image upload failed: ${uploadError}`)
        }
      }

      toast.success(
        submitForReview
          ? 'Project submitted for review! 🎉'
          : 'Project saved as draft.'
      )
      router.push('/dashboard/projects')
      router.refresh()
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/dashboard/projects">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-2">Create New Project</h1>
      <p className="text-muted-foreground mb-8">Share what you are building with the community</p>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="My Amazing Project"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">One-line Summary</Label>
              <Input
                id="summary"
                placeholder="A brief description of your project"
                maxLength={100}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-right">{summary.length}/100</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project in detail. Markdown supported."
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Domain</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tier</Label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger><SelectValue placeholder="Select tier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Beginner</SelectItem>
                    <SelectItem value="2">Intermediate</SelectItem>
                    <SelectItem value="3">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration Estimate</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue placeholder="How long?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="<1hr">Less than 1 hour</SelectItem>
                  <SelectItem value="1-4hr">1–4 hours</SelectItem>
                  <SelectItem value="1day">1 day</SelectItem>
                  <SelectItem value="1week">1 week</SelectItem>
                  <SelectItem value=">1week">More than 1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <Input
                type="file"
                accept="image/jpeg, image/png, image/webp, image/gif"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">Max 5MB per image. JPEG, PNG, WebP, GIF</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Video Link (YouTube or Vimeo)</Label>
              <Input
                id="video"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
          <CardContent>
            <Input placeholder="Add tags (comma-separated)" />
            <p className="text-xs text-muted-foreground mt-1">e.g. IoT, Arduino, Sensors, Agriculture</p>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={() => handleSubmit(false)}
          >
            <Save className="mr-2 h-4 w-4" /> Save as Draft
          </Button>
          <Button
            type="button"
            className="flex-1 bg-gradient-to-r from-brand-deep to-brand-ocean text-white"
            disabled={loading}
            onClick={() => handleSubmit(true)}
          >
            <Send className="mr-2 h-4 w-4" />
            {loading ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </div>
      </div>
    </div>
  )
}
