'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore, type Feature } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

interface AuthGateProps {
  children: React.ReactNode
  feature?: Feature
  fallbackMessage?: string
  className?: string
  showFallback?: boolean
}

/**
 * Wraps interactive elements. If the user is not logged in (or lacks the required role),
 * clicking shows a toast and redirects to login instead of performing the action.
 */
export function AuthGate({ children, feature, fallbackMessage, className }: AuthGateProps) {
  const router = useRouter()
  const { isAuthenticated, canAccess } = useAuthStore()

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      e.stopPropagation()
      toast.error(fallbackMessage || 'Please log in to perform this action')
      router.push('/auth/login')
      return
    }

    if (feature && !canAccess(feature)) {
      e.preventDefault()
      e.stopPropagation()
      toast.error('You don\'t have permission to perform this action')
      return
    }
  }

  if (!isAuthenticated || (feature && !canAccess(feature))) {
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    )
  }

  return <>{children}</>
}
