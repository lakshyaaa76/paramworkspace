export const EVENT_TYPES = [
  { value: 'build_challenge', label: 'Build Challenge', icon: '🏗️', color: '#FF6B2B' },
  { value: 'maker_meetup', label: 'Maker Meetup', icon: '🤝', color: '#CE93D8' },
  { value: 'tech_tuesday', label: 'Tech Tuesday', icon: '💡', color: '#4FC3F7' },
] as const

export type EventType = (typeof EVENT_TYPES)[number]['value']

export function getEventTypeLabel(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type
}

export function getEventTypeIcon(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.icon ?? '📅'
}

export function getEventTypeColor(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.color ?? '#888'
}
