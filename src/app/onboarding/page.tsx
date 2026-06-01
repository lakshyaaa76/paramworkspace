'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FolderKanban, Trophy, Calendar, Wrench } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'

const actions = [
  {
    icon: <FolderKanban className="h-8 w-8 text-brand-ocean" />,
    title: 'Create Your First Project',
    description: 'Share what you are building with the community.',
    action: '/dashboard/projects/new',
    buttonText: 'Start Creating',
  },
  {
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
    title: 'Complete a Challenge',
    description: 'Learn by doing with step-by-step guides.',
    action: '/challenges',
    buttonText: 'Browse Challenges',
  },
  {
    icon: <Calendar className="h-8 w-8 text-green-500" />,
    title: 'Register for an Event',
    description: 'Join build challenges and maker meetups.',
    action: '/events',
    buttonText: 'See Events',
  },
  {
    icon: <Wrench className="h-8 w-8 text-purple-500" />,
    title: 'Book Equipment',
    description: 'Use makerspace tools and machines.',
    action: '/dashboard/equipment',
    buttonText: 'View Equipment',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    // If they aren't loaded yet, wait
    if (isLoading) return
    
    // If not authenticated, go to login
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // If they are already a maker or higher, they don't need onboarding
    if (user && user.role !== 'viewer') {
      router.push('/dashboard')
    }
  }, [user, isAuthenticated, isLoading, router])

  if (isLoading || !user || user.role !== 'viewer') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">Welcome to Param Makerspace, {user.name.split(' ')[0]}! 👋</h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-muted-foreground">You are currently a</span>
          <Badge variant="secondary" className="bg-muted text-muted-foreground">Viewer</Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock <Badge className="bg-blue-green/15 text-blue-green border border-blue-green/30 px-2 py-0.5 mx-1 hover:bg-blue-green/20">MAKER</Badge> status by completing any of the actions below to get full access to the community!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {actions.map((action) => (
          <Card key={action.title} className="flex flex-col hover:border-brand-ocean/30 transition-colors group">
            <CardHeader>
              <div className="mb-4 p-3 bg-muted/50 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <CardTitle className="text-xl">{action.title}</CardTitle>
              <CardDescription className="text-base">{action.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Button asChild className="w-full bg-brand-cream border-border text-foreground hover:bg-muted" variant="outline">
                <Link href={action.action}>{action.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/dashboard">Skip for now, take me to my dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
