import Link from 'next/link'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const mockMakers = [
  { slug: 'sarah-k', name: 'Sarah K.', bio: 'IoT enthusiast building smart agricultural solutions', skills: ['IoT', 'ESP32', 'Python'], badges: 5, projects: 3, initials: 'SK' },
  { slug: 'alex-m', name: 'Alex M.', bio: 'Robotics maker exploring autonomous navigation', skills: ['Robotics', 'Arduino', 'C++'], badges: 4, projects: 2, initials: 'AM' },
  { slug: 'mike-r', name: 'Mike R.', bio: '3D printing expert and drone builder', skills: ['3D Printing', 'CAD', 'Drones'], badges: 7, projects: 5, initials: 'MR' },
  { slug: 'jane-l', name: 'Jane L.', bio: 'AI/ML engineer working on computer vision projects', skills: ['AI/ML', 'Python', 'TensorFlow'], badges: 6, projects: 4, initials: 'JL' },
  { slug: 'tom-b', name: 'Tom B.', bio: 'Electronics hobbyist and LED art creator', skills: ['Electronics', 'Arduino', 'LED'], badges: 3, projects: 2, initials: 'TB' },
  { slug: 'lisa-p', name: 'Lisa P.', bio: 'Full-stack developer building IoT dashboards', skills: ['Web Dev', 'React', 'IoT'], badges: 4, projects: 3, initials: 'LP' },
  { slug: 'david-w', name: 'David W.', bio: 'Mechanical engineer and CNC enthusiast', skills: ['CNC', 'Robotics', 'CAD'], badges: 8, projects: 6, initials: 'DW' },
  { slug: 'emma-s', name: 'Emma S.', bio: 'Embedded systems developer and maker educator', skills: ['ESP32', 'Arduino', 'Teaching'], badges: 5, projects: 4, initials: 'ES' },
]

export default function MakersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Makers</h1>
        <p className="text-muted-foreground text-lg">Meet the builders and creators in our community</p>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search makers..." className="pl-9" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockMakers.map((maker) => (
          <Link key={maker.slug} href={`/makers/${maker.slug}`}>
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
              <CardContent className="p-5 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-lg font-bold mx-auto mb-3 group-hover:scale-105 transition-transform">
                  {maker.initials}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-brand-ocean transition-colors">{maker.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{maker.bio}</p>
                <div className="flex flex-wrap justify-center gap-1 mb-3">
                  {maker.skills.slice(0, 3).map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px] px-1.5">{s}</Badge>
                  ))}
                </div>
                <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                  <span>🏆 {maker.badges} badges</span>
                  <span>📁 {maker.projects} projects</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
