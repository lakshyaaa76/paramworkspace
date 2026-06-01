'use client'

import { useState } from 'react'
import { Calendar, Plus, Edit, Trash2, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

const mockEvents = [
  { id: '1', title: 'Weekend Build Challenge: Line-Following Robot', type: 'Build Challenge', date: 'Mar 22-23, 2026', location: 'Makerspace Lab A', capacity: 30, registered: 25, open: true },
  { id: '2', title: 'Tech Tuesday: Intro to KiCad', type: 'Tech Tuesday', date: 'Mar 25, 2026', location: 'Seminar Room B', capacity: 50, registered: 18, open: true },
  { id: '3', title: 'Maker Meetup: Show & Tell', type: 'Maker Meetup', date: 'Apr 5, 2026', location: 'Makerspace Main Hall', capacity: 100, registered: 42, open: true },
  { id: '4', title: 'PCB Design Workshop', type: 'Build Challenge', date: 'Apr 12, 2026', location: 'Electronics Lab', capacity: 20, registered: 20, open: false },
]

export default function ManageEventsPage() {
  const { hasRole } = useAuthStore()
  const [events, setEvents] = useState(mockEvents)

  if (!hasRole('mentor')) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">You need Mentor or Admin access to view this page.</p>
      </div>
    )
  }

  const toggleRegistration = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        toast.success(e.open ? 'Registration closed' : 'Registration opened')
        return { ...e, open: !e.open }
      })
    )
  }

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    toast.success('Event deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-brand-ocean" />
            Manage Events
          </h1>
          <p className="text-muted-foreground">Create, edit, and manage events</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white">
          <Plus className="mr-2 h-4 w-4" /> New Event
        </Button>
      </div>

      <div className="space-y-3">
        {events.map((e) => (
          <Card key={e.id} className="hover:border-brand-ocean/20 transition-colors">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{e.title}</h3>
                  <Badge variant="secondary" className="text-xs">{e.type}</Badge>
                  {e.open ? (
                    <Badge className="bg-green-500/10 text-green-500 text-xs">Open</Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-500 text-xs">Closed</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {e.registered}/{e.capacity}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => toggleRegistration(e.id)}>
                  {e.open ? 'Close Reg.' : 'Open Reg.'}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
