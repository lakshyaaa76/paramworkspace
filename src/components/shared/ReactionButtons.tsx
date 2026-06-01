'use client'

import { useState, useEffect } from 'react'
import { Heart, ArrowUpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleReaction } from '@/lib/utils/interactions'
import { useAuthStore } from '@/lib/stores/auth-store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { AuthGate } from '@/components/auth/AuthGate'

interface ReactionButtonsProps {
  targetType: 'project' | 'challenge'
  targetId: string
}

export function ReactionButtons({ targetType, targetId }: ReactionButtonsProps) {
  const { user, isAuthenticated, canAccess } = useAuthStore()
  const [likes, setLikes] = useState(0)
  const [upvotes, setUpvotes] = useState(0)
  const [userLiked, setUserLiked] = useState(false)
  const [userUpvoted, setUserUpvoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchReactions = async () => {
      const { data } = await supabase
        .from('reaction')
        .select('reaction_type, user_id')
        .eq('target_type', targetType)
        .eq('target_id', targetId)

      if (data) {
        setLikes(data.filter(r => r.reaction_type === 'like').length)
        setUpvotes(data.filter(r => r.reaction_type === 'upvote').length)
        
        if (isAuthenticated && user) {
          setUserLiked(data.some(r => r.reaction_type === 'like' && r.user_id === user.id))
          setUserUpvoted(data.some(r => r.reaction_type === 'upvote' && r.user_id === user.id))
        }
      }
      setLoading(false)
    }
    fetchReactions()
  }, [targetType, targetId, isAuthenticated, user, supabase])

  const handleToggle = async (type: 'like' | 'upvote') => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to react.')
      return
    }
    
    if (!canAccess('comment_react')) {
      toast.error('Only Makers can leave reactions. Submit a project to become a Maker!')
      return
    }

    // Optimistic UI update
    if (type === 'like') {
      setUserLiked(!userLiked)
      setLikes(prev => userLiked ? prev - 1 : prev + 1)
    } else {
      setUserUpvoted(!userUpvoted)
      setUpvotes(prev => userUpvoted ? prev - 1 : prev + 1)
    }

    const result = await toggleReaction(user.id, targetType, targetId, type)
    
    if (result.error) {
      // Revert optimistic update
      if (type === 'like') {
        setUserLiked(!userLiked)
        setLikes(prev => userLiked ? prev + 1 : prev - 1)
      } else {
        setUserUpvoted(!userUpvoted)
        setUpvotes(prev => userUpvoted ? prev + 1 : prev - 1)
      }
      toast.error('Failed to save reaction')
    }
  }

  return (
    <AuthGate feature="comment_react" fallbackMessage="Log in as Maker to react" showFallback={false}>
      <div className="flex gap-2">
        <Button 
          variant={userLiked ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleToggle('like')} 
          disabled={loading}
          className={userLiked ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' : ''}
        >
          <Heart className={`mr-2 h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
          {likes} Likes
        </Button>
        <Button 
          variant={userUpvoted ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleToggle('upvote')} 
          disabled={loading}
          className={userUpvoted ? 'bg-brand-ocean hover:bg-brand-ocean/90 text-white border-brand-ocean' : ''}
        >
          <ArrowUpCircle className={`mr-2 h-4 w-4 ${userUpvoted ? 'fill-current' : ''}`} />
          {upvotes} Upvotes
        </Button>
      </div>
    </AuthGate>
  )
}
