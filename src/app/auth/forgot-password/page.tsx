'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="text-4xl mb-2">✉️</div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>We sent a password reset link to your email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild><Link href="/auth/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-9" required />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-brand-deep to-brand-ocean text-white">Send Reset Link</Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-sm text-brand-ocean hover:underline"><ArrowLeft className="inline mr-1 h-3 w-3" />Back to Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
