'use client'

import { useState, useEffect } from 'react'
import { Shield, Ban, CheckCircle, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'

type UserData = {
  id: string
  name: string
  email: string
  role: 'viewer' | 'maker' | 'mentor' | 'admin'
  active: boolean
  projects: number
  joined: string
}

const roleColors: Record<string, string> = {
  viewer: 'bg-gray-500/10 text-gray-500',
  maker: 'bg-blue-500/10 text-blue-500',
  mentor: 'bg-amber-500/10 text-amber-500 border-amber-500/20 text-yellow',
  admin: 'bg-red-500/10 text-red-500 border-red-500/20 text-orange',
}

export default function ManageUsersPage() {
  const { hasRole } = useAuthStore()
  const supabase = createClient()
  
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  const fetchUsers = async () => {
    if (!hasRole('admin')) return
    setLoading(true)
    
    const { data, error } = await supabase
      .from('app_user')
      .select(`
        id, name, email, role, is_active, created_at,
        project!project_owner_id_fkey(id)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load users: ' + error.message)
    } else if (data) {
      const formatted = data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        active: u.is_active,
        projects: u.project?.length || 0,
        joined: new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }))
      setUsers(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    setMounted(true)
    fetchUsers()
  }, [hasRole])

  if (!mounted) return null

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">You need Admin access to view this page.</p>
      </div>
    )
  }

  const toggleActive = async (user: UserData) => {
    const { error } = await supabase
      .from('app_user')
      .update({ is_active: !user.active })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to update status: ' + error.message)
    } else {
      toast.success(user.active ? `${user.name} deactivated` : `${user.name} activated`)
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u))
    }
  }

  const changeRole = async (id: string, newRole: 'viewer' | 'maker' | 'mentor' | 'admin', name: string) => {
    const { error } = await supabase
      .from('app_user')
      .update({ role: newRole })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update role: ' + error.message)
    } else {
      toast.success(`${name}'s role updated to ${newRole}`)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
    }
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
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-ocean border-t-transparent" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No users found.</p>
        ) : filteredUsers.map((u) => (
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
                  onChange={(e) => changeRole(u.id, e.target.value as any, u.name)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="maker">Maker</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
                <Button
                  variant={u.active ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => toggleActive(u)}
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
