'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'

/**
 * Runs initAuth() once on mount so the Zustand store is always in sync
 * with the real Supabase session (handles page refresh, direct URL visits, etc.)
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return <>{children}</>
}
