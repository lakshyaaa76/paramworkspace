'use client'

import { useState, useEffect } from 'react'
import { Wrench, Plus, Edit, Trash2, ShieldAlert, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

const mockEquipment = [
  { id: '1', name: 'Prusa i3 MK3S+ 3D Printer', category: '3D Printing', status: 'available', lastMaintained: '2 weeks ago' },
  { id: '2', name: 'CO2 Laser Cutter 60W', category: 'Laser Cutting', status: 'maintenance', lastMaintained: 'Yesterday' },
  { id: '3', name: 'Solder Station Weller', category: 'Electronics', status: 'available', lastMaintained: '1 month ago' },
  { id: '4', name: 'CNC Router Carvey', category: 'Woodworking', status: 'available', lastMaintained: '3 days ago' },
  { id: '5', name: 'Oscilloscope Rigol', category: 'Electronics', status: 'broken', lastMaintained: '2 months ago' },
]

const statusColors: Record<string, string> = {
  available: 'bg-green-500/10 text-green-500 border-green-500/20',
  maintenance: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  broken: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export default function ManageEquipmentPage() {
  const { hasRole } = useAuthStore()
  const [equipment, setEquipment] = useState(mockEquipment)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">You need Admin access to view this page.</p>
      </div>
    )
  }

  const changeStatus = (id: string, newStatus: 'available' | 'maintenance' | 'broken') => {
    setEquipment((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        toast.success(`${e.name} status set to ${newStatus}`)
        return { ...e, status: newStatus }
      })
    )
  }

  const handleDelete = (id: string) => {
    setEquipment((prev) => prev.filter((e) => e.id !== id))
    toast.success('Equipment deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6 text-brand-orange" />
            Manage Equipment
          </h1>
          <p className="text-muted-foreground">Add, edit, or update makerspace machinery and tools</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </div>

      <div className="space-y-3">
        {equipment.map((e) => (
          <Card key={e.id} className="hover:border-brand-ocean/20 transition-colors">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{e.name}</h3>
                  <Badge className={statusColors[e.status]}>{e.status}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium text-brand-ocean">{e.category}</span>
                  <span>Last maintained: {e.lastMaintained}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  value={e.status}
                  onChange={(evt) => changeStatus(e.id, evt.target.value as any)} // Note: wait, it should be e.id! Let's correct this.
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="broken">Broken</option>
                </select>
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
