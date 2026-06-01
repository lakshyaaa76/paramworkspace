'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuthStore } from '@/lib/stores/auth-store'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/events', label: 'Events' },
  { href: '/makers', label: 'Makers' },
  { href: '/badges', label: 'Badges' },
  { href: '/store', label: 'Store' },
]

const roleColors: Record<string, string> = {
  maker: 'bg-blue-green/15 text-blue-green border-blue-green/30',
  mentor: 'bg-yellow/15 text-yellow border-yellow/30',
  admin: 'bg-orange/15 text-orange border-orange/30',
  viewer: 'bg-muted text-muted-foreground border-border',
}

export function Header() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-peach/20 bg-brand-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-brand-brown">Param</span>{' '}
            <span className="text-brand-orange">Makerspace</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-brand-brown/70 transition-colors hover:text-brand-brown rounded-md hover:bg-brand-peach/20"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-xs font-bold">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight">{user.name}</span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${roleColors[user.role]}`}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login" className="text-brand-brown">Log in</Link>
              </Button>
              <Button size="sm" className="bg-brand-orange hover:bg-brand-orange/90 text-white shadow-md" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-brand-peach/20 text-brand-brown cursor-pointer">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-brand-cream" showCloseButton={false}>
            <div className="flex flex-col gap-6 mt-8">
              {/* User info on mobile */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 px-3 pb-4 border-b border-border">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-sm font-bold">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${roleColors[user.role]}`}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-brand-brown/70 transition-colors hover:text-brand-brown rounded-md hover:bg-brand-peach/20"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-brand-ocean transition-colors hover:text-brand-brown rounded-md hover:bg-brand-peach/20"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
              <div className="flex flex-col gap-2 px-3">
                {isAuthenticated ? (
                  <Button variant="outline" onClick={() => { handleLogout(); setOpen(false) }}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/auth/login" onClick={() => setOpen(false)}>Log in</Link>
                    </Button>
                    <Button className="bg-brand-orange text-white" asChild>
                      <Link href="/auth/register" onClick={() => setOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
