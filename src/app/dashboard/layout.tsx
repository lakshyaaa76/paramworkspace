'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, FolderKanban, Trophy, Calendar, Wrench,
  ShoppingCart, User, Settings, LogOut, ChevronLeft,
  ClipboardCheck, Users, Package, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/lib/stores/auth-store'

/* ─── Sidebar link configs by role ─── */
const baseSidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, minRole: 'maker' as const },
  { href: '/dashboard/projects', label: 'My Projects', icon: FolderKanban, minRole: 'maker' as const },
  { href: '/dashboard/challenges', label: 'Challenges', icon: Trophy, minRole: 'maker' as const },
  { href: '/dashboard/events', label: 'Events', icon: Calendar, minRole: 'maker' as const },
  { href: '/dashboard/equipment', label: 'Equipment', icon: Wrench, minRole: 'maker' as const },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart, minRole: 'maker' as const },
  { href: '/dashboard/profile', label: 'Profile', icon: User, minRole: 'maker' as const },
]

const mentorSidebarLinks = [
  { href: '/dashboard/review', label: 'Review Projects', icon: ClipboardCheck, minRole: 'mentor' as const },
  { href: '/dashboard/manage-challenges', label: 'Manage Challenges', icon: Trophy, minRole: 'mentor' as const },
  { href: '/dashboard/manage-events', label: 'Manage Events', icon: Calendar, minRole: 'mentor' as const },
]

const adminSidebarLinks = [
  { href: '/dashboard/manage-users', label: 'Manage Users', icon: Users, minRole: 'admin' as const },
  { href: '/dashboard/manage-equipment', label: 'Manage Equipment', icon: Wrench, minRole: 'admin' as const },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Package, minRole: 'admin' as const },
]

const roleHierarchy = { viewer: 0, maker: 1, mentor: 2, admin: 3 }

const roleColors: Record<string, string> = {
  maker: 'bg-blue-green/15 text-blue-green',
  mentor: 'bg-yellow/15 text-yellow',
  admin: 'bg-orange/15 text-orange',
  viewer: 'bg-muted text-muted-foreground',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  const [mounted, setMounted] = useState(false)

  // Wait for store hydration on mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if not authenticated (only after hydration)
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    )
  }

  const userLevel = roleHierarchy[user.role]

  // Build sidebar links based on role
  const allLinks = [
    ...baseSidebarLinks,
    ...(userLevel >= roleHierarchy.mentor ? mentorSidebarLinks : []),
    ...(userLevel >= roleHierarchy.admin ? adminSidebarLinks : []),
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card/50 p-4">
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <Badge variant="secondary" className={`text-[10px] ${roleColors[user.role]}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {/* Base links */}
          {baseSidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand-ocean/10 text-brand-ocean font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}

          {/* Mentor section */}
          {userLevel >= roleHierarchy.mentor && (
            <>
              <Separator className="my-3" />
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Mentor Tools</p>
              {mentorSidebarLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-brand-ocean/10 text-brand-ocean font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
            </>
          )}

          {/* Admin section */}
          {userLevel >= roleHierarchy.admin && (
            <>
              <Separator className="my-3" />
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                <Shield className="h-3 w-3 inline mr-1" />
                Admin
              </p>
              {adminSidebarLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-brand-ocean/10 text-brand-ocean font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        <Separator className="my-4" />

        <div className="space-y-1">
          <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors w-full cursor-pointer">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-2 p-4 border-b overflow-x-auto">
          {allLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                  isActive ? 'bg-brand-ocean/10 text-brand-ocean font-medium' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            )
          })}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
