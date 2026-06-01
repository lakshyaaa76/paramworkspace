import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const mockChallenges = [
  { id: '1', title: 'Build Your First Arduino Robot', status: 'completed', verified: true, completedDate: 'Feb 10' },
  { id: '2', title: 'IoT Weather Station', status: 'completed', verified: true, completedDate: 'Feb 25' },
  { id: '3', title: 'LED Matrix Art Display', status: 'completed', verified: false, completedDate: 'Mar 5' },
  { id: '4', title: 'PCB Design Basics', status: 'completed', verified: true, completedDate: 'Mar 12' },
]

export default function DashboardChallengesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Challenges</h1>
        <p className="text-muted-foreground">Track your challenge completions</p>
      </div>
      <div className="space-y-3">
        {mockChallenges.map((c) => (
          <Card key={c.id} className="hover:border-brand-ocean/20 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <div>
                  <h3 className="font-semibold text-sm">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">Completed {c.completedDate}</p>
                </div>
              </div>
              <Badge className={c.verified ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}>
                {c.verified ? '✓ Verified' : '⏳ Pending'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button variant="outline" asChild><Link href="/challenges">Browse More Challenges</Link></Button>
      </div>
    </div>
  )
}
