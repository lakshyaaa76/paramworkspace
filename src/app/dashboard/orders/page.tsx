import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export default function DashboardOrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">View your purchase history</p>
      </div>
      <Card className="text-center p-12">
        <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-semibold mb-2">No orders yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Visit the store to browse kits, tools, and exclusive items</p>
        <Button variant="outline" asChild><Link href="/store">Visit Store</Link></Button>
      </Card>
    </div>
  )
}
