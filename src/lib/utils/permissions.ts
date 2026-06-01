export enum Role {
  VIEWER = 'viewer',
  MAKER = 'maker',
  MENTOR = 'mentor',
  ADMIN = 'admin',
}

const roleHierarchy: Record<Role, number> = {
  [Role.VIEWER]: 0,
  [Role.MAKER]: 1,
  [Role.MENTOR]: 2,
  [Role.ADMIN]: 3,
}

export function hasRole(userRole: string, requiredRole: Role): boolean {
  return (roleHierarchy[userRole as Role] ?? -1) >= roleHierarchy[requiredRole]
}

export function canCreateProject(userRole: string): boolean {
  return hasRole(userRole, Role.VIEWER) // All logged-in users can create drafts
}

export function canApproveProjects(userRole: string): boolean {
  return hasRole(userRole, Role.MENTOR)
}

export function canComment(userRole: string): boolean {
  return hasRole(userRole, Role.MAKER)
}

export function canCreateEvent(userRole: string): boolean {
  return hasRole(userRole, Role.MENTOR)
}

export function canManageUsers(userRole: string): boolean {
  return userRole === Role.ADMIN
}

export function canManageChallenges(userRole: string): boolean {
  return userRole === Role.ADMIN
}

export function canManageBadges(userRole: string): boolean {
  return userRole === Role.ADMIN
}

export function canManageTags(userRole: string): boolean {
  return userRole === Role.ADMIN
}

export function canManageStore(userRole: string): boolean {
  return userRole === Role.ADMIN
}

export function canManageEquipment(userRole: string): boolean {
  return userRole === Role.ADMIN
}

export function canVerifyCompletions(userRole: string): boolean {
  return hasRole(userRole, Role.MENTOR)
}

export function canMakeProfilePublic(userRole: string): boolean {
  return hasRole(userRole, Role.MAKER)
}

export function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (role) {
    case Role.ADMIN: return 'destructive'
    case Role.MENTOR: return 'default'
    case Role.MAKER: return 'secondary'
    default: return 'outline'
  }
}
