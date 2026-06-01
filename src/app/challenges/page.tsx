import Link from 'next/link'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const mockChallenges = [
  { id: '1', title: 'Build Your First Arduino Robot', tier: 'Beginner', domain: 'Robotics', time: '2–4 hours', completions: 50, icon: '🤖', desc: 'Learn basics of electronics and programming' },
  { id: '2', title: 'IoT Weather Station', tier: 'Intermediate', domain: 'IoT', time: '4–8 hours', completions: 23, icon: '🌦️', desc: 'Connect sensors to the cloud' },
  { id: '3', title: 'LED Matrix Art Display', tier: 'Beginner', domain: 'Electronics', time: '1–2 hours', completions: 67, icon: '💡', desc: 'Create stunning pixel art animations' },
  { id: '4', title: 'Smart Home Dashboard', tier: 'Advanced', domain: 'Web Development', time: '8+ hours', completions: 12, icon: '🏠', desc: 'Build a full-stack home automation dashboard' },
  { id: '5', title: 'PCB Design Basics', tier: 'Beginner', domain: 'Electronics', time: '2–4 hours', completions: 34, icon: '🔌', desc: 'Design your first printed circuit board' },
  { id: '6', title: '3D Print a Mechanical Clock', tier: 'Intermediate', domain: '3D Printing', time: '4–8 hours', completions: 18, icon: '⏰', desc: 'Master gears and mechanisms through 3D printing' },
]

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Challenges</h1>
        <p className="text-muted-foreground text-lg">Learn by doing — pick a challenge and start building</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search challenges..." className="pl-9" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Tier" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Domain" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="robotics">Robotics</SelectItem>
            <SelectItem value="iot">IoT</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="3d-printing">3D Printing</SelectItem>
            <SelectItem value="web">Web Development</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockChallenges.map((c) => (
          <Link key={c.id} href={`/challenges/${c.id}`}>
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
              <CardHeader>
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">{c.tier}</Badge>
                  <Badge variant="outline" className="text-xs">{c.domain}</Badge>
                </div>
                <CardTitle className="text-base group-hover:text-brand-ocean transition-colors">{c.title}</CardTitle>
                <CardDescription>{c.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>⏱️ {c.time}</span>
                  <span>✅ {c.completions} completed</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
