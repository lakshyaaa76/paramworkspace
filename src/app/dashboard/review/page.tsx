'use client'

import { useState } from 'react'
import { ClipboardCheck, Check, X, Eye, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

const pendingProjects = [
  { id: '1', title: 'Smart Doorbell v2', maker: 'Aarav Maker', domain: 'IoT', tier: 2, submitted: '2 days ago', summary: 'A smart doorbell with facial recognition and cloud notifications.' },
  { id: '2', title: 'Drone Delivery System', maker: 'Neha S.', domain: 'Robotics', tier: 3, submitted: '3 days ago', summary: 'GPS-guided drone for campus package delivery with obstacle avoidance.' },
  { id: '3', title: 'Solar Tracker', maker: 'Vikram R.', domain: 'Electronics', tier: 1, submitted: '5 days ago', summary: 'Arduino-based solar panel tracker that follows the sun for max efficiency.' },
  { id: '4', title: 'Voice-Controlled Robot Arm', maker: 'Priya N.', domain: 'AI/ML', tier: 2, submitted: '1 week ago', summary: 'A 6-DOF robotic arm controlled via voice commands using NLP.' },
  { id: '5', title: 'Plant Health Monitor', maker: 'Arjun K.', domain: 'IoT', tier: 1, submitted: '1 week ago', summary: 'Uses computer vision to detect plant diseases from leaf images.' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export default function ReviewProjectsPage() {
  const { hasRole } = useAuthStore()
  const [projects, setProjects] = useState(
    pendingProjects.map((p) => ({ ...p, status: 'pending' as 'pending' | 'approved' | 'rejected', feedback: '' }))
  )

  if (!hasRole('mentor')) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">You need Mentor or Admin access to view this page.</p>
      </div>
    )
  }

  const handleApprove = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p))
    )
    toast.success('Project approved!')
  }

  const handleReject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' as const } : p))
    )
    toast.error('Project rejected')
  }

  const pending = projects.filter((p) => p.status === 'pending')
  const reviewed = projects.filter((p) => p.status !== 'pending')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-brand-ocean" />
            Review Projects
          </h1>
          <p className="text-muted-foreground">Approve or reject submitted projects</p>
        </div>
        <Badge variant="secondary" className="text-sm">{pending.length} pending</Badge>
      </div>

      {/* Pending */}
      {pending.length > 0 ? (
        <div className="space-y-4 mb-10">
          {pending.map((project) => (
            <Card key={project.id} className="border-amber-500/20">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{project.title}</h3>
                      <Badge className={statusColors.pending}>Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>by <strong>{project.maker}</strong></span>
                      <Badge variant="outline" className="text-xs">{project.domain}</Badge>
                      <span>Tier {project.tier}</span>
                      <span>Submitted {project.submitted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(project.id)}
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(project.id)}
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-10">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">🎉 All projects have been reviewed!</p>
          </CardContent>
        </Card>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <>
          <Separator className="mb-6" />
          <h2 className="text-lg font-bold mb-4">Recently Reviewed</h2>
          <div className="space-y-3">
            {reviewed.map((project) => (
              <Card key={project.id} className="opacity-75">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-sm">{project.title}</h3>
                    <Badge className={statusColors[project.status]}>{project.status}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">by {project.maker}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
