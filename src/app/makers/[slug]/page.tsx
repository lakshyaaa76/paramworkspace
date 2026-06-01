import Link from 'next/link'
import { ArrowLeft, Github, Linkedin, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const maker = {
  name: 'Sarah K.', initials: 'SK',
  bio: 'IoT enthusiast building smart agricultural solutions.',
  aspirations: 'Build open-source IoT devices for small-scale farmers.',
  github: 'https://github.com/sarahk', linkedin: 'https://linkedin.com/in/sarahk',
  skills: [
    { name: 'ESP32', domain: 'Electronics' }, { name: 'Python', domain: 'Programming' },
    { name: 'MQTT', domain: 'IoT' }, { name: '3D Printing', domain: '3D Printing' },
  ],
  badges: [
    { name: 'IoT Explorer', icon: '📡' }, { name: 'First Project', icon: '🎉' },
    { name: 'Team Player', icon: '🤝' }, { name: 'Challenge Master', icon: '🏆' },
  ],
  projects: [
    { id: '1', title: 'IoT Plant Monitor', domain: 'IoT', tier: 'Intermediate' },
    { id: '8', title: 'Smart Doorbell', domain: 'IoT', tier: 'Intermediate' },
  ],
  tags: ['IoT', 'Agriculture', 'ESP32'],
}

export default function SingleMakerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/makers"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Makers</Link>
      </Button>
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-3xl font-bold shrink-0">{maker.initials}</div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{maker.name}</h1>
          <p className="text-muted-foreground mb-3">{maker.bio}</p>
          <p className="text-sm text-muted-foreground italic mb-4">&quot;{maker.aspirations}&quot;</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><a href={maker.github} target="_blank" rel="noopener noreferrer"><Github className="mr-1 h-3.5 w-3.5" /> GitHub</a></Button>
            <Button variant="outline" size="sm" asChild><a href={maker.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="mr-1 h-3.5 w-3.5" /> LinkedIn</a></Button>
          </div>
        </div>
      </div>
      <Separator className="mb-8" />
      <div className="flex flex-wrap gap-2 mb-8">
        {maker.tags.map((t) => (<Badge key={t} variant="secondary">{t}</Badge>))}
      </div>
      <Card className="mb-6">
        <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {maker.skills.map((s) => (<div key={s.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm"><span className="font-medium">{s.name}</span><Badge variant="outline" className="text-[10px] px-1">{s.domain}</Badge></div>))}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {maker.badges.map((b) => (<div key={b.name} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/30 min-w-[80px]"><span className="text-2xl">{b.icon}</span><span className="text-[10px] text-muted-foreground text-center">{b.name}</span></div>))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maker.projects.map((p) => (<Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"><div className="flex items-center gap-3"><FolderKanban className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium group-hover:text-brand-ocean transition-colors">{p.title}</span></div><Badge variant="secondary" className="text-xs">{p.domain}</Badge></Link>))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
