'use client'

import { useState, useEffect } from 'react'
import { Shield, Ban, CheckCircle, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

const mockUsers = [
  { id: '1', name: 'Aarav Maker', email: 'maker@param.dev', role: 'maker' as const, active: true, projects: 3, joined: 'Jan 2025' },
  { id: '2', name: 'Priya Mentor', email: 'mentor@param.dev', role: 'mentor' as const, active: true, projects: 0, joined: 'Dec 2024' },
  { id: '3', name: 'Raj Admin', email: 'admin@param.dev', role: 'admin' as const, active: true, projects: 0, joined: 'Nov 2024' },
  { id: '4', name: 'Neha S.', email: 'neha@example.com', role: 'maker' as const, active: true, projects: 5, joined: 'Feb 2025' },
  { id: '5', name: 'Vikram R.', email: 'vikram@example.com', role: 'maker' as const, active: false, projects: 1, joined: 'Mar 2025' },
  { id: '6', name: 'Arjun K.', email: 'arjun@example.com', role: 'viewer' as const, active: true, projects: 0, joined: 'Apr 2025' },
]

const roleColors: Record<string, string> = {
  viewer: 'bg-gray-500/10 text-gray-500',
  maker: 'bg-blue-500/10 text-blue-500',
  mentor: 'bg-amber-500/10 text-amber-500 border-amber-500/20 text-yellow',
  admin: 'bg-red-500/10 text-red-500 border-red-500/20 text-orange',
}

export default function ManageUsersPage() {
  const { hasRole } = useAuthStore()
  const [users, setUsers] = useState(mockUsers)
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

  const toggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        toast.success(u.active ? `${u.name} deactivated` : `${u.name} activated`)
        return { ...u, active: !u.active }
      })
    )
  }

  const changeRole = (id: string, newRole: 'viewer' | 'maker' | 'mentor' | 'admin') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        toast.success(`${u.name} role updated to ${newRole}`)
        return { ...u, role: newRole }
      })
    )
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-brand-orange" />
            Manage Users
          </h1>
          <p className="text-muted-foreground">{users.length} total users</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredUsers.map((u) => (
          <Card key={u.id} className={`transition-colors ${!u.active ? 'opacity-60' : ''}`}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {u.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{u.name}</h3>
                    <Badge className={`text-[10px] ${roleColors[u.role]}`}>{u.role}</Badge>
                    {!u.active && <Badge variant="destructive" className="text-[10px]">Inactive</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{u.email}</span>
                    <span>{u.projects} projects</span>
                    <span>Joined {u.joined}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value as any)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="maker">Maker</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
                <Button
                  variant={u.active ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => toggleActive(u.id)}
                >
                  {u.active ? <><Ban className="mr-1.5 h-3.5 w-3.5" /> Deactivate</> : <><CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Activate</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
