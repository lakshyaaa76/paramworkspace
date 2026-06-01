'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, Clock, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuthGate } from '@/components/auth/AuthGate'
import { useAuthStore } from '@/lib/stores/auth-store'

const event = {
  id: '1',
  title: 'Weekend Build Challenge: Line-Following Robot',
  type: 'build_challenge',
  typeLabel: 'Build Challenge',
  description: 'Join us for an exciting weekend build challenge! Over two days, teams of 2-4 will build a line-following robot from scratch. All materials and tools provided. Perfect for beginners and intermediate makers.\n\nDay 1: Build and wire the robot chassis, connect sensors.\nDay 2: Write the firmware, calibrate, and compete on the test track!\n\nPrizes awarded for fastest completion, most creative design, and best documentation.',
  start_date: 'March 22, 2026 — 9:00 AM',
  end_date: 'March 23, 2026 — 5:00 PM',
  location: 'Makerspace Lab A',
  capacity: 30,
  registered: 25,
  open: true,
  teams: [
    { name: 'Circuit Breakers', members: ['Sarah K.', 'Alex M.', 'Tom B.'] },
    { name: 'Robo Makers', members: ['Jane L.', 'Mike R.'] },
    { name: 'Team Spark', members: ['Lisa P.', 'David W.', 'Emma S.', 'Chris T.'] },
  ],
}

export default function SingleEventPage() {
  const spotsLeft = event.capacity - event.registered
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/events"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Events</Link>
      </Button>

      {/* Cover */}
      <div className="aspect-video bg-gradient-to-br from-brand-deep/10 via-brand-ocean/10 to-brand-sky/10 rounded-xl flex items-center justify-center mb-8">
        <span className="text-7xl">🏗️</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{event.typeLabel}</Badge>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Registration Open</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{event.start_date} — {event.end_date}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{event.location}</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4" />{event.registered}/{event.capacity} registered ({spotsLeft} spots left)</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[180px]">
          <AuthGate feature="register_event" fallbackMessage="Log in to register for events">
            {isAuthenticated ? (
              <Button size="lg" className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white shadow-lg">Register Now</Button>
            ) : (
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login"><LogIn className="mr-2 h-4 w-4" /> Log in to Register</Link>
              </Button>
            )}
          </AuthGate>
          <AuthGate feature="like_bookmark" fallbackMessage="Log in to bookmark events">
            <Button variant="outline">🔖 Bookmark</Button>
          </AuthGate>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-8">
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-ocean to-brand-sky rounded-full transition-all" style={{ width: `${(event.registered / event.capacity) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{Math.round((event.registered / event.capacity) * 100)}% full</p>
      </div>

      <Separator className="mb-8" />

      {/* Description */}
      <Card className="mb-8">
        <CardHeader><CardTitle>About This Event</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{event.description}</p>
        </CardContent>
      </Card>

      {/* Teams */}
      {event.type === 'build_challenge' && (
        <Card className="mb-8">
          <CardHeader><CardTitle>Teams ({event.teams.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {event.teams.map((team) => (
                <div key={team.name} className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-semibold text-sm mb-2">{team.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((m) => (
                      <div key={m} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="h-6 w-6 rounded-full bg-brand-ocean/20 flex items-center justify-center text-[10px] font-bold text-brand-ocean">
                          {m.split(' ').map(n => n[0]).join('')}
                        </div>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments placeholder */}
      <Card>
        <CardHeader><CardTitle>Discussion</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Login to join the discussion.</p>
        </CardContent>
      </Card>
    </div>
  )
}
