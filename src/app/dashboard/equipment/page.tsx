import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const equipment = [
  { id: '1', name: '3D Printer — Prusa i3 MK3S+', category: '3D Printing', status: 'available', location: 'Lab A', requiresInduction: true },
  { id: '2', name: 'Laser Cutter — Glowforge Plus', category: 'Laser Cutting', status: 'in_use', location: 'Lab B', requiresInduction: true },
  { id: '3', name: 'Soldering Station — Hakko FX-888D', category: 'Electronics', status: 'available', location: 'Lab A', requiresInduction: false },
  { id: '4', name: 'CNC Router — Shapeoko 4', category: 'CNC', status: 'maintenance', location: 'Workshop', requiresInduction: true },
  { id: '5', name: 'Oscilloscope — Rigol DS1054Z', category: 'Electronics', status: 'available', location: 'Lab A', requiresInduction: false },
]

const statusColors: Record<string, string> = {
  available: 'bg-green-500/10 text-green-500 border-green-500/20',
  in_use: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  maintenance: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export default function EquipmentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Equipment</h1>
        <p className="text-muted-foreground">Browse and book makerspace equipment</p>
      </div>
      <div className="space-y-3">
        {equipment.map((e) => (
          <Card key={e.id} className="hover:border-brand-ocean/20 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔧</span>
                <div>
                  <h3 className="font-semibold text-sm">{e.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">{e.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{e.location}</span>
                    {e.requiresInduction && <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">🎓 Induction Required</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${statusColors[e.status]}`}>{e.status.replace('_', ' ')}</Badge>
                <Button size="sm" variant="outline" disabled={e.status !== 'available'}>
                  {e.status === 'available' ? 'Book' : 'Unavailable'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
