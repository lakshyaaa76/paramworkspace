import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns'

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy h:mm a')
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
}

export function isUpcoming(dateStr: string): boolean {
  return isAfter(parseISO(dateStr), new Date())
}

export function isPast(dateStr: string): boolean {
  return isBefore(parseISO(dateStr), new Date())
}
