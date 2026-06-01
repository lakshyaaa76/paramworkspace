import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockEvents = [
  { id: '1', title: 'Weekend Build Challenge: Line-Following Robot', type: 'build_challenge', typeLabel: 'Build Challenge', date: 'Mar 22–23, 2026', location: 'Makerspace Lab A', capacity: 30, registered: 25, open: true, icon: '🏗️' },
  { id: '2', title: 'Maker Meetup: Spring Showcase', type: 'maker_meetup', typeLabel: 'Maker Meetup', date: 'Mar 28, 2026', location: 'Community Hall', capacity: 80, registered: 42, open: true, icon: '🤝' },
  { id: '3', title: 'Tech Tuesday: Intro to PCB Design', type: 'tech_tuesday', typeLabel: 'Tech Tuesday', date: 'Mar 25, 2026', location: 'Online (Zoom)', capacity: 50, registered: 18, open: true, icon: '💡' },
  { id: '4', title: 'Build Challenge: IoT Smart Garden', type: 'build_challenge', typeLabel: 'Build Challenge', date: 'Apr 5–6, 2026', location: 'Makerspace Lab B', capacity: 24, registered: 8, open: true, icon: '🏗️' },
  { id: '5', title: 'Tech Tuesday: 3D Printing Masterclass', type: 'tech_tuesday', typeLabel: 'Tech Tuesday', date: 'Apr 1, 2026', location: 'Online (Zoom)', capacity: 50, registered: 31, open: true, icon: '💡' },
  { id: '6', title: 'Maker Meetup: Project Demo Night', type: 'maker_meetup', typeLabel: 'Maker Meetup', date: 'Apr 15, 2026', location: 'Community Hall', capacity: 60, registered: 12, open: true, icon: '🤝' },
]

function EventCard({ event }: { event: typeof mockEvents[0] }) {
  const spotsLeft = event.capacity - event.registered
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{event.icon}</span>
            <Badge variant="secondary" className="text-xs">{event.typeLabel}</Badge>
            {event.open ? (
              <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/20">Open</Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">Closed</Badge>
            )}
          </div>
          <CardTitle className="text-base group-hover:text-brand-ocean transition-colors">{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{event.date}</div>
            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</div>
            <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{spotsLeft} spots left</div>
          </div>
          <div className="mt-4 w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-brand-ocean/60 rounded-full transition-all" style={{ width: `${(event.registered / event.capacity) * 100}%` }} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-muted-foreground text-lg">Join events, compete in challenges, and connect with makers</p>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="build_challenge">Build Challenges</TabsTrigger>
          <TabsTrigger value="maker_meetup">Maker Meetups</TabsTrigger>
          <TabsTrigger value="tech_tuesday">Tech Tuesdays</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockEvents.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </TabsContent>
        <TabsContent value="build_challenge" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockEvents.filter(e => e.type === 'build_challenge').map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </TabsContent>
        <TabsContent value="maker_meetup" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockEvents.filter(e => e.type === 'maker_meetup').map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </TabsContent>
        <TabsContent value="tech_tuesday" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockEvents.filter(e => e.type === 'tech_tuesday').map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
