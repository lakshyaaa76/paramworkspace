import Link from 'next/link'
import { Search, Filter, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DOMAINS } from '@/lib/constants/domains'

const mockProjects = [
  { id: '1', title: 'IoT Plant Monitor', summary: 'Smart plant watering system with real-time soil sensors and automated alerts', maker: 'Sarah K.', domain: 'IoT', tier: 'Intermediate', likes: 42 },
  { id: '2', title: 'Arduino Robot Car', summary: 'Line-following robot with obstacle avoidance using ultrasonic sensors', maker: 'Alex M.', domain: 'Robotics', tier: 'Beginner', likes: 38 },
  { id: '3', title: '3D Printed Drone', summary: 'Custom quadcopter with GPS navigation and first-person view camera', maker: 'Mike R.', domain: '3D Printing', tier: 'Advanced', likes: 56 },
  { id: '4', title: 'Smart Mirror', summary: 'AI-powered mirror with weather, calendar, and facial recognition', maker: 'Jane L.', domain: 'AI/ML', tier: 'Intermediate', likes: 45 },
  { id: '5', title: 'LED Matrix Display', summary: 'Programmable 32x32 LED matrix with custom animations and games', maker: 'Tom B.', domain: 'Electronics', tier: 'Beginner', likes: 33 },
  { id: '6', title: 'Weather Station', summary: 'Solar-powered weather station with cloud dashboard and alerts', maker: 'Lisa P.', domain: 'IoT', tier: 'Intermediate', likes: 29 },
  { id: '7', title: 'CNC Pen Plotter', summary: 'DIY pen plotter built from stepper motors and 3D printed parts', maker: 'David W.', domain: 'Robotics', tier: 'Advanced', likes: 51 },
  { id: '8', title: 'Smart Doorbell', summary: 'ESP32-based video doorbell with motion detection and notifications', maker: 'Emma S.', domain: 'IoT', tier: 'Intermediate', likes: 37 },
]

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground text-lg">Explore what our community is building</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-9" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            {DOMAINS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Beginner</SelectItem>
            <SelectItem value="2">Intermediate</SelectItem>
            <SelectItem value="3">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="az">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
              <div className="aspect-video bg-gradient-to-br from-brand-deep/10 to-brand-ocean/10 flex items-center justify-center rounded-t-lg">
                <FolderKanban className="h-10 w-10 text-brand-ocean/40 group-hover:scale-110 transition-transform" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{project.domain}</Badge>
                  <Badge variant="outline" className="text-xs">{project.tier}</Badge>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-brand-ocean transition-colors">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.summary}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>by {project.maker}</span>
                  <span>❤️ {project.likes}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
