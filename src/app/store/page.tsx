import Link from 'next/link'
import { ShoppingCart, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const mockProducts = [
  { id: '1', name: 'Param Makerspace T-Shirt', price: 25, category: 'Apparel', stock: 50, badgeRequired: false, icon: '👕' },
  { id: '2', name: 'Arduino Starter Kit', price: 45, category: 'Kits', stock: 20, badgeRequired: false, icon: '📦' },
  { id: '3', name: 'Custom PCB Service', price: 15, category: 'Services', stock: 100, badgeRequired: true, badgeName: 'Hardware Hero', icon: '🔌' },
  { id: '4', name: 'Maker Sticker Pack', price: 5, category: 'Accessories', stock: 200, badgeRequired: false, icon: '🏷️' },
  { id: '5', name: '3D Print Credits (10hr)', price: 30, category: 'Services', stock: 50, badgeRequired: true, badgeName: '3D Artisan', icon: '🖨️' },
  { id: '6', name: 'Soldering Iron Kit', price: 35, category: 'Tools', stock: 15, badgeRequired: false, icon: '🔧' },
  { id: '7', name: 'Raspberry Pi 5', price: 60, category: 'Kits', stock: 10, badgeRequired: false, icon: '🫐' },
  { id: '8', name: 'Champion Hoodie', price: 55, category: 'Apparel', stock: 5, badgeRequired: true, badgeName: 'Build Champion', icon: '👑' },
]

export default function StorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Store</h1>
        <p className="text-muted-foreground text-lg">Tools, kits, apparel, and exclusive badge-gated items</p>
      </div>
      <div className="flex gap-3 mb-8">
        <Select>
          <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="apparel">Apparel</SelectItem>
            <SelectItem value="kits">Kits</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockProducts.map((p) => (
          <Card key={p.id} className="group h-full transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
            <div className="aspect-square bg-gradient-to-br from-brand-deep/5 to-brand-ocean/5 flex items-center justify-center rounded-t-lg">
              <span className="text-5xl group-hover:scale-110 transition-transform">{p.icon}</span>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                {p.badgeRequired && <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30"><Lock className="h-2.5 w-2.5 mr-0.5" />{p.badgeName}</Badge>}
              </div>
              <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-lg font-bold text-brand-ocean mb-3">${p.price}</p>
              <Button size="sm" className="w-full" variant={p.badgeRequired ? 'outline' : 'default'} disabled={p.badgeRequired}>
                {p.badgeRequired ? <><Lock className="mr-1 h-3 w-3" /> Badge Required</> : <><ShoppingCart className="mr-1 h-3 w-3" /> Add to Cart</>}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
