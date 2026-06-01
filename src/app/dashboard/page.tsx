'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderKanban, Trophy, Calendar, Wrench, ShoppingCart, Award, Plus, ArrowRight, ClipboardCheck, Users, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { createClient } from '@/lib/supabase/client'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-500',
  pending_review: 'bg-amber-500/10 text-amber-500',
  active: 'bg-green-500/10 text-green-500',
  rejected: 'bg-red-500/10 text-red-500',
}

export default function DashboardPage() {
  const { user, hasRole } = useAuthStore()
  const supabase = createClient()
  const firstName = user?.name?.split(' ')[0] || 'Maker'

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    projects: 0,
    activeProjects: 0,
    draftProjects: 0,
    badges: 0,
    events: 0,
    challenges: 0,
    bookings: 0,
    orders: 0
  })
  const [mentorStatsData, setMentorStatsData] = useState({ pendingReviews: 0 })
  const [adminStatsData, setAdminStatsData] = useState({ users: 0, equipment: 0 })
  const [recentProjects, setRecentProjects] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return
      
      // Fetch Maker Stats
      const [projsRes, badgesRes, eventsRes, challengesRes] = await Promise.all([
        supabase.from('project').select('status, id, title, updated_at').eq('owner_id', user.id).order('updated_at', { ascending: false }),
        supabase.from('user_badge').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('event_registration').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('challenge_completion').select('id', { count: 'exact' }).eq('user_id', user.id)
      ])

      const projects = projsRes.data || []
      const draft = projects.filter(p => p.status === 'draft').length
      const active = projects.filter(p => p.status === 'active').length

      setStats({
        projects: projects.length,
        draftProjects: draft,
        activeProjects: active,
        badges: badgesRes.count || 0,
        events: eventsRes.count || 0,
        challenges: challengesRes.count || 0,
        bookings: 0, // Mocked for now until ops wired
        orders: 0
      })
      setRecentProjects(projects.slice(0, 3))

      // Mentor Stats
      if (hasRole('mentor') || hasRole('admin')) {
        const { count } = await supabase.from('project').select('id', { count: 'exact' }).eq('status', 'pending_review')
        setMentorStatsData({ pendingReviews: count || 0 })
      }

      // Admin Stats
      if (hasRole('admin')) {
        const [usersRes, equipRes] = await Promise.all([
          supabase.from('app_user').select('id', { count: 'exact' }),
          supabase.from('equipment').select('id', { count: 'exact' })
        ])
        setAdminStatsData({ users: usersRes.count || 0, equipment: equipRes.count || 0 })
      }

      setLoading(false)
    }

    fetchDashboard()
  }, [user, hasRole])

  const makerStats = [
    { label: 'Projects', value: stats.projects.toString(), sub: `${stats.draftProjects} draft, ${stats.activeProjects} active`, icon: FolderKanban, href: '/dashboard/projects' },
    { label: 'Badges', value: stats.badges.toString(), sub: 'earned so far', icon: Award, href: '/badges' },
    { label: 'Events', value: stats.events.toString(), sub: 'registered', icon: Calendar, href: '/dashboard/events' },
    { label: 'Challenges', value: stats.challenges.toString(), sub: 'completed', icon: Trophy, href: '/dashboard/challenges' },
    { label: 'Bookings', value: stats.bookings.toString(), sub: 'active', icon: Wrench, href: '/dashboard/equipment' },
    { label: 'Orders', value: stats.orders.toString(), sub: 'pending', icon: ShoppingCart, href: '/dashboard/orders' },
  ]

  const mentorStats = [
    { label: 'Pending Reviews', value: mentorStatsData.pendingReviews.toString(), sub: 'projects awaiting review', icon: ClipboardCheck, href: '/dashboard/review' },
    { label: 'My Challenges', value: '0', sub: 'active challenges', icon: Trophy, href: '/dashboard/manage-challenges' },
    { label: 'My Events', value: '0', sub: 'upcoming', icon: Calendar, href: '/dashboard/manage-events' },
  ]

  const adminStats = [
    { label: 'Total Users', value: adminStatsData.users.toString(), sub: 'platform wide', icon: Users, href: '/dashboard/manage-users' },
    { label: 'Equipment', value: adminStatsData.equipment.toString(), sub: 'total inventory', icon: Wrench, href: '/dashboard/manage-equipment' },
  ]

  if (loading) return null


  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {firstName}! 👋</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your makerspace</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white" asChild>
          <Link href="/dashboard/projects/new"><Plus className="mr-2 h-4 w-4" /> New Project</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {makerStats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="group hover:border-brand-ocean/30 transition-all hover:-translate-y-0.5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-brand-ocean/10 flex items-center justify-center group-hover:bg-brand-ocean/15 transition-colors">
                  <s.icon className="h-5 w-5 text-brand-ocean" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label} · {s.sub}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Mentor Stats */}
      {hasRole('mentor') && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-yellow" />
            Mentor Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {mentorStats.map((s) => (
              <Link key={s.label} href={s.href}>
                <Card className="group hover:border-yellow/30 transition-all hover:-translate-y-0.5 border-yellow/10">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow/10 flex items-center justify-center group-hover:bg-yellow/15 transition-colors">
                      <s.icon className="h-5 w-5 text-yellow" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label} · {s.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Admin Stats */}
      {hasRole('admin') && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange" />
            Admin Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {adminStats.map((s) => (
              <Link key={s.label} href={s.href}>
                <Card className="group hover:border-orange/30 transition-all hover:-translate-y-0.5 border-orange/10">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange/10 flex items-center justify-center group-hover:bg-orange/15 transition-colors">
                      <s.icon className="h-5 w-5 text-orange" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label} · {s.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Projects</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentProjects.map((p) => (
              <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium group-hover:text-brand-ocean transition-colors">{p.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</span>
                  <Badge className={`text-xs ${statusColors[p.status]}`}>{p.status.replace('_', ' ')}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="group hover:border-brand-ocean/30 transition-all hover:-translate-y-0.5">
          <CardContent className="p-5 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold text-sm mb-1">Browse Challenges</h3>
            <p className="text-xs text-muted-foreground mb-3">Learn something new today</p>
            <Button variant="outline" size="sm" asChild><Link href="/challenges">Explore</Link></Button>
          </CardContent>
        </Card>
        <Card className="group hover:border-brand-ocean/30 transition-all hover:-translate-y-0.5">
          <CardContent className="p-5 text-center">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-sm mb-1">Upcoming Events</h3>
            <p className="text-xs text-muted-foreground mb-3">Don&apos;t miss out</p>
            <Button variant="outline" size="sm" asChild><Link href="/events">View Events</Link></Button>
          </CardContent>
        </Card>
        <Card className="group hover:border-brand-ocean/30 transition-all hover:-translate-y-0.5">
          <CardContent className="p-5 text-center">
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="font-semibold text-sm mb-1">Book Equipment</h3>
            <p className="text-xs text-muted-foreground mb-3">Reserve tools and machines</p>
            <Button variant="outline" size="sm" asChild><Link href="/dashboard/equipment">Book Now</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
