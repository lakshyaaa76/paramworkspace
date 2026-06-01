'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isBookmarked, toggleBookmark } from '@/lib/utils/interactions'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

interface BookmarkButtonProps {
  targetType: 'project' | 'challenge' | 'event'
  targetId: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
}

export function BookmarkButton({ 
  targetType, 
  targetId, 
  variant = 'outline', 
  size = 'default',
  className = '',
  showLabel = true 
}: BookmarkButtonProps) {
  const { user, isAuthenticated } = useAuthStore()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }
    
    isBookmarked(user.id, targetType, targetId).then(status => {
      setBookmarked(status)
      setLoading(false)
    })
  }, [user, isAuthenticated, targetType, targetId])

  const handleToggle = async () => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to bookmark.')
      return
    }

    setLoading(true)
    // Optimistic UI update
    const previousState = bookmarked
    setBookmarked(!bookmarked)

    const result = await toggleBookmark(user.id, targetType, targetId)
    
    if (result.error) {
      setBookmarked(previousState)
      toast.error('Failed to save bookmark')
    }
    
    setLoading(false)
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleToggle} 
      disabled={loading}
      className={`${bookmarked ? 'bg-brand-ocean/10 text-brand-ocean border-brand-ocean/30' : ''} ${className}`}
    >
      <Bookmark className={`${showLabel ? 'mr-2' : ''} h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      {showLabel && (bookmarked ? 'Saved' : 'Bookmark')}
    </Button>
  )
}
