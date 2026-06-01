'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

const mockInventory = [
  { id: '1', name: 'PLA Filament 1.75mm (Grey)', category: '3D Printing', quantity: 12, unit: 'kg', threshold: 5 },
  { id: '2', name: 'Arduino Uno R3', category: 'Electronics', quantity: 25, unit: 'pcs', threshold: 10 },
  { id: '3', name: 'ESP32 Development Board', category: 'Electronics', quantity: 4, unit: 'pcs', threshold: 10 },
  { id: '4', name: 'M3 Hex Screws Assortment', category: 'Hardware', quantity: 3, unit: 'boxes', threshold: 2 },
  { id: '5', name: 'Resistor Assortment Kit', category: 'Electronics', quantity: 8, unit: 'kits', threshold: 3 },
  { id: '6', name: 'Acrylic Sheets 3mm (Transparent)', category: 'Laser Cutting', quantity: 1, unit: 'sheets', threshold: 5 },
]

export default function InventoryPage() {
  const { hasRole } = useAuthStore()
  const [inventory, setInventory] = useState(mockInventory)
  const [search, setSearch] = useState('')
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

  const updateQuantity = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const newQty = Math.max(0, item.quantity + delta)
        return { ...item, quantity: newQty }
      })
    )
  }

  const handleDelete = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id))
    toast.success('Inventory item deleted')
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-brand-orange" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground">Monitor and restock makerspace consumable parts and components</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inventory..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredInventory.map((item) => {
          const isLowStock = item.quantity <= item.threshold
          return (
            <Card key={item.id} className={`hover:border-brand-ocean/20 transition-colors ${isLowStock ? 'border-red-500/20 bg-red-500/[0.01]' : ''}`}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {isLowStock ? (
                      <Badge variant="destructive" className="text-[10px] animate-pulse">Low Stock</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">In Stock</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-brand-ocean">{item.category}</span>
                    <span>Min Threshold: {item.threshold} {item.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center text-sm font-semibold">
                      {item.quantity} {item.unit}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
