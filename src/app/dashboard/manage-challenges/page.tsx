'use client'

import { useState } from 'react'
import { Trophy, Plus, Edit, Trash2, Eye, EyeOff, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

const mockChallenges = [
  { id: '1', title: 'Build Your First Arduino Robot', tier: 'Beginner', domain: 'Robotics', completions: 50, status: 'published' },
  { id: '2', title: 'IoT Weather Station', tier: 'Intermediate', domain: 'IoT', completions: 23, status: 'published' },
  { id: '3', title: 'LED Matrix Art Display', tier: 'Beginner', domain: 'Electronics', completions: 67, status: 'published' },
  { id: '4', title: 'PCB Design Basics', tier: 'Intermediate', domain: 'Electronics', completions: 31, status: 'draft' },
  { id: '5', title: 'Smart Home Controller', tier: 'Advanced', domain: 'IoT', completions: 12, status: 'published' },
  { id: '6', title: '3D Print a Mechanical Toy', tier: 'Beginner', domain: '3D Printing', completions: 45, status: 'archived' },
]

const statusColors: Record<string, string> = {
  published: 'bg-green-500/10 text-green-500',
  draft: 'bg-amber-500/10 text-amber-500',
  archived: 'bg-gray-500/10 text-gray-500',
}

export default function ManageChallengesPage() {
  const { hasRole } = useAuthStore()
  const [challenges, setChallenges] = useState(mockChallenges)

  if (!hasRole('mentor')) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">You need Mentor or Admin access to view this page.</p>
      </div>
    )
  }

  const toggleStatus = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const next = c.status === 'published' ? 'draft' : 'published'
        toast.success(`Challenge ${next === 'published' ? 'published' : 'unpublished'}`)
        return { ...c, status: next }
      })
    )
  }

  const handleDelete = (id: string) => {
    setChallenges((prev) => prev.filter((c) => c.id !== id))
    toast.success('Challenge deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-brand-ocean" />
            Manage Challenges
          </h1>
          <p className="text-muted-foreground">Create, edit, and manage challenges</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white">
          <Plus className="mr-2 h-4 w-4" /> New Challenge
        </Button>
      </div>

      <div className="space-y-3">
        {challenges.map((c) => (
          <Card key={c.id} className="hover:border-brand-ocean/20 transition-colors">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{c.title}</h3>
                  <Badge className={statusColors[c.status]}>{c.status}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">{c.tier}</Badge>
                  <span>{c.domain}</span>
                  <span>{c.completions} completions</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => toggleStatus(c.id)}>
                  {c.status === 'published' ? (
                    <><EyeOff className="mr-1.5 h-3.5 w-3.5" /> Unpublish</>
                  ) : (
                    <><Eye className="mr-1.5 h-3.5 w-3.5" /> Publish</>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>
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
