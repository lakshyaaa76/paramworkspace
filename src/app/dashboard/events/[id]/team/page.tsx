'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Plus, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import type { Event } from '@/lib/types'

type TeamInfo = {
  id: string
  team_name: string
  created_by: string
  members: { user_id: string; role: string; app_user: { name: string } | null }[]
}

export default function EventTeamPage() {
  const params = useParams()
  const eventId = params.id as string
  const router = useRouter()
  const { user } = useAuthStore()
  const supabase = createClient()

  const [event, setEvent] = useState<Event | null>(null)
  const [team, setTeam] = useState<TeamInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [teamName, setTeamName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = async () => {
    if (!user) return
    setLoading(true)

    // 1. Fetch Event
    const { data: eventData } = await supabase
      .from('event')
      .select('*')
      .eq('id', eventId)
      .single()

    setEvent(eventData)

    // 2. See if user is in a team for this event
    const { data: memberData } = await supabase
      .from('event_team_member')
      .select('team_id')
      .eq('user_id', user.id)
      
    let foundTeamId = null
    if (memberData && memberData.length > 0) {
      // Find the team that belongs to THIS event
      for (const m of memberData) {
        const { data: t } = await supabase.from('event_team').select('id, event_id').eq('id', m.team_id).single()
        if (t && t.event_id === eventId) {
          foundTeamId = t.id
          break
        }
      }
    }

    if (foundTeamId) {
      const { data: teamData } = await supabase
        .from('event_team')
        .select(`
          id, team_name, team_lead_id,
          members:event_team_member(user_id, app_user(name))
        `)
        .eq('id', foundTeamId)
        .single()
      
      setTeam(teamData as unknown as TeamInfo)
    } else {
      setTeam(null)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [eventId, user])

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim() || !user) return

    setActionLoading(true)
    // 1. Create team
    const { data: newTeam, error: teamError } = await supabase
      .from('event_team')
      .insert({ event_id: eventId, team_name: teamName.trim(), created_by: user.id })
      .select()
      .single()

    if (teamError) {
      toast.error('Failed to create team: ' + teamError.message)
      setActionLoading(false)
      return
    }

    // 2. Add creator as member
    if (newTeam) {
      await supabase
        .from('event_team_member')
        .insert({ team_id: newTeam.id, user_id: user.id, role: 'lead' })
      
      toast.success('Team created!')
      setTeamName('')
      fetchData()
    }
    setActionLoading(false)
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim() || !user) return
    setActionLoading(true)

    // Treat joinCode as the exact team ID for now
    const { data: targetTeam, error: findError } = await supabase
      .from('event_team')
      .select('id, event_id')
      .eq('id', joinCode.trim())
      .single()

    if (findError || !targetTeam || targetTeam.event_id !== eventId) {
      toast.error('Invalid team code for this event.')
      setActionLoading(false)
      return
    }

    const { error: joinError } = await supabase
      .from('event_team_member')
      .insert({ team_id: targetTeam.id, user_id: user.id })

    if (joinError) {
      toast.error('Failed to join team: ' + joinError.message)
    } else {
      toast.success('Successfully joined team!')
      setJoinCode('')
      fetchData()
    }
    setActionLoading(false)
  }

  const handleLeaveTeam = async () => {
    if (!team || !user) return
    if (!confirm('Are you sure you want to leave this team?')) return
    
    setActionLoading(true)
    
    if (team.created_by === user.id) {
      // If leader leaves, delete the team (cascades to members)
      await supabase.from('event_team').delete().eq('id', team.id)
    } else {
      // Otherwise just delete the member record
      await supabase.from('event_team_member').delete().eq('team_id', team.id).eq('user_id', user.id)
    }
    
    toast.success('Left team.')
    fetchData()
    setActionLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/dashboard/events">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-2">Team Management</h1>
      <p className="text-muted-foreground mb-8">
        Build Challenge: <span className="font-semibold text-foreground">{event?.title}</span>
      </p>

      {team ? (
        <Card className="border-brand-ocean/20 shadow-md">
          <CardHeader className="bg-brand-ocean/5 border-b border-brand-ocean/10">
            <div className="flex items-start justify-between">
              <div>
                <CardDescription className="uppercase tracking-wider text-xs font-bold text-brand-ocean">Your Team</CardDescription>
                    <CardTitle className="text-2xl mt-1">{team.team_name}</CardTitle>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-md border text-xs font-mono select-all">
                <span className="text-muted-foreground mr-2">Team Code:</span>
                <span className="font-bold">{team.id.substring(0,8)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2" /> Team Members ({team.members.length})
            </h3>
            <div className="space-y-2 mb-6">
              {team.members.map((m) => (
                <div key={m.user_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
                  <span className="font-medium text-sm">{m.app_user?.name || 'Unknown'}</span>
                  {m.user_id === team.created_by && (
                    <Badge variant="secondary" className="bg-brand-ocean/10 text-brand-ocean border-0">
                      <ShieldCheck className="h-3 w-3 mr-1" /> Team Lead
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {user?.id === team.created_by
                  ? "As team lead, leaving will delete the team for everyone."
                  : "You can leave the team at any time."}
              </p>
              <Button variant="destructive" size="sm" onClick={handleLeaveTeam} disabled={actionLoading}>
                Leave Team
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create a Team</CardTitle>
              <CardDescription>Start a new team and invite others to join.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input 
                    id="teamName" 
                    placeholder="e.g. The Innovators" 
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-brand-ocean text-white hover:bg-brand-ocean/90" disabled={actionLoading}>
                  <Plus className="h-4 w-4 mr-2" /> Create Team
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Join a Team</CardTitle>
              <CardDescription>Have a code from a team leader? Enter it here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinTeam} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="joinCode">Team Code</Label>
                  <Input 
                    id="joinCode" 
                    placeholder="Enter the 8-character code" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="outline" className="w-full" disabled={actionLoading}>
                  Join Team
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
