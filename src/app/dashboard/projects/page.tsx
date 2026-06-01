import Link from 'next/link'
import { Plus, FolderKanban, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockProjects = [
  { id: '1', title: 'IoT Plant Monitor', status: 'active', visibility: 'public', domain: 'IoT', created: 'Jan 15, 2026' },
  { id: '2', title: 'Smart Doorbell v2', status: 'draft', visibility: 'private', domain: 'IoT', created: 'Feb 20, 2026' },
  { id: '3', title: 'Soil Sensor Network', status: 'active', visibility: 'public', domain: 'IoT', created: 'Mar 1, 2026' },
  { id: '4', title: 'LED Art Installation', status: 'pending_review', visibility: 'private', domain: 'Electronics', created: 'Mar 10, 2026' },
]

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  pending_review: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const statusLabels: Record<string, string> = {
  draft: 'Draft', pending_review: 'Pending Review', active: 'Active', rejected: 'Rejected',
}

export default function MyProjectsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-muted-foreground">Manage your projects and submissions</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white" asChild>
          <Link href="/dashboard/projects/new"><Plus className="mr-2 h-4 w-4" /> New Project</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {mockProjects.map((p) => (
          <Card key={p.id} className="group hover:border-brand-ocean/20 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-brand-deep/10 to-brand-ocean/10 flex items-center justify-center">
                  <FolderKanban className="h-5 w-5 text-brand-ocean/50" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-brand-ocean transition-colors">{p.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">{p.domain}</Badge>
                    <span className="text-[10px] text-muted-foreground">{p.created}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`text-xs ${statusColors[p.status]}`}>{statusLabels[p.status]}</Badge>
                <Badge variant="outline" className="text-xs">{p.visibility}</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects/${p.id}`}>Edit</Link>
                  </Button>
                  {p.status === 'draft' && (
                    <Button variant="outline" size="sm" className="text-brand-ocean">Submit</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
