'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/lib/types'

const EVENT_LABELS: Record<string, string> = {
  build_challenge: 'Build Challenge',
  maker_meetup: 'Maker Meetup',
  tech_tuesday: 'Tech Tuesday',
}

const EVENT_ICONS: Record<string, string> = {
  build_challenge: '🏗️',
  maker_meetup: '🤝',
  tech_tuesday: '💡',
}

type EventWithCount = Event & { registrations: { count: number }[] }

function EventCard({ event }: { event: EventWithCount }) {
  const capacity = event.capacity ?? 0
  const registered = event.registrations?.[0]?.count ?? 0
  const spotsLeft = capacity - registered
  const isFull = capacity > 0 && spotsLeft <= 0

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{EVENT_ICONS[event.event_type] ?? '📅'}</span>
            <Badge variant="secondary" className="text-xs">
              {EVENT_LABELS[event.event_type] ?? event.event_type}
            </Badge>
            {event.registration_open && !isFull ? (
              <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/20">Open</Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">{isFull ? 'Full' : 'Closed'}</Badge>
            )}
          </div>
          <CardTitle className="text-base group-hover:text-brand-ocean transition-colors line-clamp-2">
            {event.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(event.start_date).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> {event.location}
              </div>
            )}
            {capacity > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
              </div>
            )}
          </div>
          {capacity > 0 && (
            <div className="mt-4 w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-ocean/60 rounded-full transition-all"
                style={{ width: `${Math.min((registered / capacity) * 100, 100)}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default function EventsPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<EventWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('event')
        .select('*, registrations:event_registration(count)')
        .order('start_date', { ascending: true })
        .limit(30)

      if (!error) setEvents((data as EventWithCount[]) ?? [])
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const byType = (type: string) => events.filter((e) => e.event_type === type)

  const renderGrid = (list: EventWithCount[]) =>
    list.length === 0 ? (
      <p className="text-muted-foreground text-sm py-8 text-center">No events in this category.</p>
    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
      </div>
    )
  }

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
        <TabsContent value="all" className="mt-6">{renderGrid(events)}</TabsContent>
        <TabsContent value="build_challenge" className="mt-6">{renderGrid(byType('build_challenge'))}</TabsContent>
        <TabsContent value="maker_meetup" className="mt-6">{renderGrid(byType('maker_meetup'))}</TabsContent>
        <TabsContent value="tech_tuesday" className="mt-6">{renderGrid(byType('tech_tuesday'))}</TabsContent>
      </Tabs>
    </div>
  )
}
