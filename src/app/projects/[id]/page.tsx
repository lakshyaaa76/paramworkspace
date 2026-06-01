'use client'

import Link from 'next/link'
import { ArrowLeft, FolderKanban, Github, Calendar, Users, FileText, ExternalLink, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuthGate } from '@/components/auth/AuthGate'
import { useAuthStore } from '@/lib/stores/auth-store'

// Mock single project data
const project = {
  id: '1',
  title: 'IoT Plant Monitor',
  one_line_summary: 'Smart plant watering system with real-time soil sensors and automated alerts',
  description: `## Overview\n\nThis project uses an ESP32 microcontroller connected to soil moisture sensors, temperature sensors, and a water pump to automatically monitor and water plants.\n\n## Features\n\n- Real-time soil moisture monitoring\n- Automatic watering when soil is dry\n- Temperature and humidity tracking\n- Cloud dashboard with historical data\n- Mobile push notifications\n- Solar-powered option\n\n## Technical Details\n\nThe system uses MQTT protocol to communicate with a cloud server, where data is stored and visualized. The frontend dashboard is built with React and shows real-time sensor readings plus historical charts.`,
  maker: 'Sarah K.',
  domain: 'IoT',
  tier: 2,
  status: 'active',
  github_url: 'https://github.com/sarahk/iot-plant-monitor',
  duration_estimate: '1 week',
  tags: ['IoT', 'ESP32', 'Sensors', 'Agriculture'],
  milestones: [
    { title: 'Hardware Setup', description: 'Connect sensors to ESP32', completed: true },
    { title: 'Firmware Development', description: 'Write sensor reading and MQTT code', completed: true },
    { title: 'Cloud Backend', description: 'Set up MQTT broker and database', completed: true },
    { title: 'Dashboard', description: 'Build React dashboard', completed: false },
  ],
  members: ['Sarah K.', 'Alex M.'],
  files: [
    { name: 'firmware.ino', type: 'code', size: '12 KB' },
    { name: 'schematic.pdf', type: 'pdf', size: '340 KB' },
    { name: 'enclosure.stl', type: 'stl', size: '1.2 MB' },
  ],
}

export default function SingleProjectPage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      {/* Cover Image */}
      <div className="aspect-video bg-gradient-to-br from-brand-deep/10 via-brand-ocean/10 to-brand-sky/10 rounded-xl flex items-center justify-center mb-8">
        <FolderKanban className="h-20 w-20 text-brand-ocean/30" />
      </div>

      {/* Header area */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{project.domain}</Badge>
            <Badge variant="outline">Tier {project.tier}</Badge>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-3">{project.one_line_summary}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> by {project.maker}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {project.duration_estimate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 min-w-[160px]">
          <AuthGate feature="like_bookmark" fallbackMessage="Log in to interact with projects">
            {isAuthenticated ? (
              <>
                <Button className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white">❤️ Like</Button>
                <Button variant="outline">⬆️ Upvote</Button>
                <Button variant="outline">🔖 Bookmark</Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/auth/login"><LogIn className="mr-2 h-4 w-4" /> Log in to Interact</Link>
              </Button>
            )}
          </AuthGate>
          {project.github_url && (
            <Button variant="outline" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </a>
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-brand-ocean/10">{tag}</Badge>
          </Link>
        ))}
      </div>

      {/* Description */}
      <Card className="mb-8">
        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="mb-8">
        <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${m.completed ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                  {m.completed ? '✓' : i + 1}
                </div>
                <div>
                  <p className={`font-medium text-sm ${m.completed ? 'line-through text-muted-foreground' : ''}`}>{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="mb-8">
        <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {project.members.map((m) => (
              <div key={m} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-full bg-brand-ocean/20 flex items-center justify-center text-xs font-bold text-brand-ocean">
                  {m.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm font-medium">{m}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Files */}
      <Card className="mb-8">
        <CardHeader><CardTitle>Files</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.files.map((f) => (
              <div key={f.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{f.name}</span>
                  <Badge variant="outline" className="text-xs">{f.type}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{f.size}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comments placeholder */}
      <Card>
        <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Login as a Maker to leave comments.</p>
        </CardContent>
      </Card>
    </div>
  )
}
