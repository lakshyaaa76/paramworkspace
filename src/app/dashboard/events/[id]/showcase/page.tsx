'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import type { Event, Project } from '@/lib/types'

type ShowcaseSlot = {
  id: string
  slot_title: string
  slot_type: string
  status: string
  notes: string | null
  project_id: string | null
  project: { title: string } | null
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export default function ShowcaseBookingPage() {
  const params = useParams()
  const eventId = params.id as string
  const router = useRouter()
  const { user } = useAuthStore()
  const supabase = createClient()

  const [event, setEvent] = useState<Event | null>(null)
  const [existingSlot, setExistingSlot] = useState<ShowcaseSlot | null>(null)
  const [myProjects, setMyProjects] = useState<{id: string, title: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [projectId, setProjectId] = useState('none')
  const [notes, setNotes] = useState('')

  const fetchData = async () => {
    if (!user) return
    setLoading(true)

    // 1. Fetch event
    const { data: ev } = await supabase.from('event').select('*').eq('id', eventId).single()
    setEvent(ev)

    // 2. Fetch existing slot
    const { data: slot } = await supabase
      .from('event_showcase_slot')
      .select('*, project(title)')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()
      
    if (slot) {
      setExistingSlot(slot as unknown as ShowcaseSlot)
    }

    // 3. Fetch user's active projects for dropdown
    const { data: projs } = await supabase
      .from('project')
      .select('id, title')
      .eq('owner_id', user.id)
      .eq('status', 'active')
    
    setMyProjects(projs || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [eventId, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!title.trim() || !type) {
      toast.error('Please fill in required fields')
      return
    }

    setActionLoading(true)
    const { error } = await supabase.from('event_showcase_slot').insert({
      event_id: eventId,
      user_id: user.id,
      slot_title: title.trim(),
      slot_type: type,
      project_id: projectId === 'none' ? null : projectId,
      notes: notes.trim() || null,
      status: 'pending'
    })

    if (error) {
      toast.error('Failed to request slot: ' + error.message)
    } else {
      toast.success('Showcase slot requested successfully!')
      fetchData()
    }
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
    <div className="max-w-2xl">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/dashboard/events">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-2">Book a Showcase Slot</h1>
      <p className="text-muted-foreground mb-8">
        Maker Meetup: <span className="font-semibold text-foreground">{event?.title}</span>
      </p>

      {existingSlot ? (
        <Card className="border-brand-ocean/20 shadow-md">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Request</CardTitle>
              <Badge className={statusColors[existingSlot.status]}>
                {existingSlot.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Title</p>
              <p className="font-medium">{existingSlot.slot_title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Type</p>
                <p className="capitalize">{existingSlot.slot_type}</p>
              </div>
              {existingSlot.project && (
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Linked Project</p>
                  <p className="text-brand-ocean">{existingSlot.project.title}</p>
                </div>
              )}
            </div>
            
            {existingSlot.status === 'pending' && (
              <div className="bg-amber-500/10 text-amber-600 p-3 rounded-lg flex items-start gap-2 mt-4 text-sm">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Your request is pending mentor review. You will be notified once a time slot is assigned.</p>
              </div>
            )}
            
            {existingSlot.status === 'rejected' && (
              <div className="bg-red-500/10 text-red-600 p-3 rounded-lg flex items-start gap-2 mt-4 text-sm">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Unfortunately, your request could not be accommodated for this meetup. Check mentor feedback in your notifications.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Request a Slot</CardTitle>
            <CardDescription>Pitch what you want to present at the meetup. Mentors will review and assign times.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Presentation Title *</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Live Demo: Smart Plant Monitor" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={type} onValueChange={(v) => setType(v || '')} required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Live Demo</SelectItem>
                      <SelectItem value="speaker">Speaker Talk</SelectItem>
                      <SelectItem value="product_launch">Product Launch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Link to Project (Optional)</Label>
                  <Select value={projectId} onValueChange={(v) => setProjectId(v || '')}>
                    <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {myProjects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Tell us what equipment you might need, or special requirements..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full bg-brand-ocean text-white hover:bg-brand-ocean/90" disabled={actionLoading}>
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
