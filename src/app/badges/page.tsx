import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockBadges = [
  { id: '1', name: 'First Project', desc: 'Submit your first project', tier: 'Beginner', type: 'Achievement', icon: '🎉', earned: false },
  { id: '2', name: 'IoT Explorer', desc: 'Complete 3 IoT challenges', tier: 'Intermediate', type: 'Completion', icon: '📡', earned: false },
  { id: '3', name: 'Team Player', desc: 'Collaborate on a group project', tier: 'Beginner', type: 'Achievement', icon: '🤝', earned: false },
  { id: '4', name: 'Challenge Master', desc: 'Complete 10 challenges', tier: 'Advanced', type: 'Completion', icon: '🏆', earned: false },
  { id: '5', name: 'Event Regular', desc: 'Attend 5 events', tier: 'Intermediate', type: 'Participation', icon: '📅', earned: false },
  { id: '6', name: 'Code Wizard', desc: 'Submit 5 software projects', tier: 'Advanced', type: 'Achievement', icon: '🧙', earned: false },
  { id: '7', name: 'Maker Mentor', desc: 'Help 3 makers with their projects', tier: 'Advanced', type: 'Contribution', icon: '🌟', earned: false },
  { id: '8', name: 'Hardware Hero', desc: 'Complete an electronics challenge', tier: 'Beginner', type: 'Completion', icon: '⚡', earned: false },
  { id: '9', name: 'Build Champion', desc: 'Win a build challenge event', tier: 'Advanced', type: 'Achievement', icon: '👑', earned: false },
  { id: '10', name: '3D Artisan', desc: 'Submit a 3D printing project', tier: 'Beginner', type: 'Achievement', icon: '🖨️', earned: false },
  { id: '11', name: 'Robotics Pioneer', desc: 'Complete 3 robotics challenges', tier: 'Intermediate', type: 'Completion', icon: '🤖', earned: false },
  { id: '12', name: 'Community Star', desc: 'React to 50 projects', tier: 'Intermediate', type: 'Participation', icon: '⭐', earned: false },
]

export default function BadgesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Badge Catalog</h1>
        <p className="text-muted-foreground text-lg">Earn badges by building projects, completing challenges, and engaging with the community</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mockBadges.map((b) => (
          <Card key={b.id} className="group text-center transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{b.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{b.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">{b.desc}</p>
              <div className="flex flex-col gap-1 items-center">
                <Badge variant="secondary" className="text-[10px]">{b.tier}</Badge>
                <Badge variant="outline" className="text-[10px]">{b.type}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
