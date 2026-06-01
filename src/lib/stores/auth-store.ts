'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import type { AppUser } from '@/lib/types'

/* ─── Role Hierarchy ─── */
type Role = AppUser['role']

const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 0,
  maker: 1,
  mentor: 2,
  admin: 3,
}

/* ─── Feature Permissions ─── */
type Feature =
  | 'create_project'
  | 'comment_react'
  | 'like_bookmark'
  | 'complete_challenge'
  | 'register_event'
  | 'book_equipment'
  | 'buy_store'
  | 'public_profile'
  | 'review_projects'
  | 'manage_challenges'
  | 'manage_events'
  | 'manage_users'
  | 'manage_equipment'
  | 'manage_inventory'

const FEATURE_MIN_ROLE: Record<Feature, Role> = {
  create_project:    'viewer',   // viewers CAN create (to become a maker)
  complete_challenge:'viewer',   // viewers CAN complete challenges
  register_event:    'viewer',   // viewers CAN register for events
  book_equipment:    'viewer',   // viewers CAN book equipment
  buy_store:         'viewer',   // viewers CAN buy from store
  like_bookmark:     'viewer',   // viewers CAN bookmark
  comment_react:     'maker',    // only makers can comment/react
  public_profile:    'maker',    // only makers can make profile public
  review_projects:   'mentor',
  manage_challenges: 'mentor',
  manage_events:     'mentor',
  manage_users:      'admin',
  manage_equipment:  'admin',
  manage_inventory:  'admin',
}

/* ─── Store Interface ─── */
interface AuthState {
  user: AppUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  setUser: (user: AppUser | null) => void
  initAuth: () => Promise<void>
  hasRole: (minRole: Role) => boolean
  canAccess: (feature: Feature) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: AppUser | null) => {
        set({ user, isAuthenticated: !!user })
      },

      initAuth: async () => {
        const supabase = createClient()
        set({ isLoading: true })
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser()
          if (!authUser) {
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          const { data: appUser } = await supabase
            .from('app_user')
            .select('*')
            .eq('id', authUser.id)
            .single()

          set({
            user: appUser ?? null,
            isAuthenticated: !!appUser,
            isLoading: false,
          })
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      login: async (email: string, password: string) => {
        const supabase = createClient()
        set({ isLoading: true })

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (authError || !authData.user) {
          set({ isLoading: false })
          return { success: false, error: authError?.message || 'Login failed' }
        }

        // Fetch app_user profile
        const { data: appUser, error: profileError } = await supabase
          .from('app_user')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profileError || !appUser) {
          set({ isLoading: false })
          return { success: false, error: 'Could not load your profile. Please contact support.' }
        }

        set({ user: appUser, isAuthenticated: true, isLoading: false })
        return { success: true }
      },

      logout: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false })
      },

      hasRole: (minRole: Role) => {
        const { user } = get()
        if (!user) return false
        return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minRole]
      },

      canAccess: (feature: Feature) => {
        const { hasRole } = get()
        return hasRole(FEATURE_MIN_ROLE[feature])
      },
    }),
    {
      name: 'param-auth',
      // Only persist the user object — re-validate session on load via initAuth
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export type { Feature, Role }
