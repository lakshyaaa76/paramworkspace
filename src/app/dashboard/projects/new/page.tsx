'use client'

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

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/dashboard/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
      </Button>

      <h1 className="text-2xl font-bold mb-2">Create New Project</h1>
      <p className="text-muted-foreground mb-8">Share what you are building with the community</p>

      <form className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input id="title" placeholder="My Amazing Project" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">One-line Summary</Label>
              <Input id="summary" placeholder="A brief description of your project" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your project in detail. Markdown supported." rows={8} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Domain</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tier</Label>
                <Select>
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
              <Input id="github" placeholder="https://github.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Duration Estimate</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="How long?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hr">Less than 1 hour</SelectItem>
                  <SelectItem value="1-4hr">1–4 hours</SelectItem>
                  <SelectItem value="1day">1 day</SelectItem>
                  <SelectItem value="1week">1 week</SelectItem>
                  <SelectItem value="1week+">More than 1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground text-sm mb-2">Drag & drop images here, or click to browse</p>
              <p className="text-xs text-muted-foreground">Max 5MB per image. JPEG, PNG, WebP, GIF</p>
              <Button variant="outline" size="sm" className="mt-3">Upload Images</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Video Link</Label>
              <Input id="video" placeholder="YouTube or Vimeo URL" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Files</CardTitle></CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground text-sm mb-2">Upload project files</p>
              <p className="text-xs text-muted-foreground">Max 50MB. ZIP, PDF, STL, code files</p>
              <Button variant="outline" size="sm" className="mt-3">Upload Files</Button>
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
          <Button type="button" variant="outline" className="flex-1"><Save className="mr-2 h-4 w-4" /> Save as Draft</Button>
          <Button type="submit" className="flex-1 bg-gradient-to-r from-brand-deep to-brand-ocean text-white"><Send className="mr-2 h-4 w-4" /> Submit for Review</Button>
        </div>
      </form>
    </div>
  )
}
