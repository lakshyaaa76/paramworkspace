import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const myEvents = [
  { id: '1', title: 'Weekend Build Challenge: Line-Following Robot', date: 'Mar 22', location: 'Lab A', type: 'Build Challenge', checkedIn: false },
  { id: '2', title: 'Maker Meetup: Spring Showcase', date: 'Mar 28', location: 'Community Hall', type: 'Maker Meetup', checkedIn: false },
]

export default function DashboardEventsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Events</h1>
        <p className="text-muted-foreground">Your event registrations</p>
      </div>
      <Tabs defaultValue="registered">
        <TabsList><TabsTrigger value="registered">My Registrations</TabsTrigger><TabsTrigger value="browse">Browse Events</TabsTrigger></TabsList>
        <TabsContent value="registered" className="mt-6 space-y-3">
          {myEvents.map((e) => (
            <Card key={e.id} className="hover:border-brand-ocean/20 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <h3 className="font-semibold text-sm">{e.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{e.type}</Badge>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Registered</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="browse" className="mt-6 text-center">
          <p className="text-muted-foreground mb-4">Discover upcoming events</p>
          <Button asChild><Link href="/events">Browse All Events</Link></Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
