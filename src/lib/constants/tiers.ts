export const TIERS = [
  { value: 1, label: 'Beginner', color: '#87BAC3' },
  { value: 2, label: 'Intermediate', color: '#53629E' },
  { value: 3, label: 'Advanced', color: '#473472' },
] as const

export function getTierLabel(tier: number): string {
  return TIERS.find((t) => t.value === tier)?.label ?? 'Unknown'
}

export function getTierColor(tier: number): string {
  return TIERS.find((t) => t.value === tier)?.color ?? '#888'
}
