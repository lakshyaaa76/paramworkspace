'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppUser } from '@/lib/types'

/* ─── Mock Users ─── */
const MOCK_USERS: (AppUser & { password: string })[] = [
  {
    id: 'mock-maker-001',
    name: 'Aarav Maker',
    email: 'maker@param.dev',
    password: 'maker123',
    role: 'maker',
    email_verified: true,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'mock-mentor-001',
    name: 'Priya Mentor',
    email: 'mentor@param.dev',
    password: 'mentor123',
    role: 'mentor',
    email_verified: true,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'mock-admin-001',
    name: 'Raj Admin',
    email: 'admin@param.dev',
    password: 'admin123',
    role: 'admin',
    email_verified: true,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
]

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
  | 'like_bookmark'
  | 'complete_challenge'
  | 'register_event'
  | 'book_equipment'
  | 'buy_store'
  | 'review_projects'
  | 'manage_challenges'
  | 'manage_events'
  | 'manage_users'
  | 'manage_equipment'
  | 'manage_inventory'

const FEATURE_MIN_ROLE: Record<Feature, Role> = {
  create_project: 'maker',
  like_bookmark: 'maker',
  complete_challenge: 'maker',
  register_event: 'maker',
  book_equipment: 'maker',
  buy_store: 'maker',
  review_projects: 'mentor',
  manage_challenges: 'mentor',
  manage_events: 'mentor',
  manage_users: 'admin',
  manage_equipment: 'admin',
  manage_inventory: 'admin',
}

/* ─── Store Interface ─── */
interface AuthState {
  user: AppUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  hasRole: (minRole: Role) => boolean
  canAccess: (feature: Feature) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const found = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        )
        if (!found) {
          return { success: false, error: 'Invalid email or password' }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...user } = found
        set({ user, isAuthenticated: true })
        return { success: true }
      },

      logout: () => {
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
    }
  )
)

export type { Feature, Role }
export { MOCK_USERS }
