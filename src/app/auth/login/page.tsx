'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuthStore, MOCK_USERS } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

const quickLogins = MOCK_USERS.map((u) => ({
  email: u.email,
  password: u.password,
  role: u.role,
  name: u.name,
}))

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = login(email, password)

    if (result.success) {
      toast.success('Logged in successfully!')
      router.push('/dashboard')
    } else {
      toast.error(result.error || 'Login failed')
    }

    setLoading(false)
  }

  const handleQuickLogin = (qEmail: string, qPassword: string) => {
    setEmail(qEmail)
    setPassword(qPassword)

    const result = login(qEmail, qPassword)
    if (result.success) {
      toast.success('Logged in successfully!')
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-brand-mist/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-brand-deep to-brand-ocean bg-clip-text text-transparent">Welcome Back</CardTitle>
          <CardDescription>Log in to your Param Makerspace account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Login Buttons */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">Quick Login (Dev Mode)</p>
            <div className="grid grid-cols-3 gap-2">
              {quickLogins.map((q) => (
                <button
                  key={q.email}
                  type="button"
                  onClick={() => handleQuickLogin(q.email, q.password)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:border-brand-ocean/40 hover:bg-brand-ocean/5 transition-all text-center cursor-pointer group"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform">
                    {q.name.split(' ')[0][0]}
                  </div>
                  <span className="text-xs font-semibold capitalize text-foreground">{q.role}</span>
                  <span className="text-[10px] text-muted-foreground">{q.email}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="pl-9" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-brand-ocean hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-brand-deep to-brand-ocean text-white hover:opacity-90 transition-opacity" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
          <Separator className="my-6" />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-brand-ocean hover:underline font-medium">Create one</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
