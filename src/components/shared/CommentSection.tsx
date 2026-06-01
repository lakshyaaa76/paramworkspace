'use client'

import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { fetchComments, postComment } from '@/lib/utils/interactions'
import { useAuthStore } from '@/lib/stores/auth-store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { AuthGate } from '@/components/auth/AuthGate'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  app_user: { name: string } | null
}

interface CommentSectionProps {
  targetType: 'project' | 'challenge'
  targetId: string
}

export function CommentSection({ targetType, targetId }: CommentSectionProps) {
  const { user, isAuthenticated, canAccess } = useAuthStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadComments = async () => {
      const { comments: data } = await fetchComments(targetType, targetId)
      setComments((data as unknown as Comment[]) || [])
      setLoading(false)
    }
    loadComments()

    // Real-time subscription for comments
    const channel = supabase
      .channel(`comments-${targetId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comment',
          filter: `target_type=eq.${targetType}&target_id=eq.${targetId}`,
        },
        async (payload) => {
          // Fetch the full comment to get app_user(name) relation
          const { data } = await supabase
            .from('comment')
            .select('*, app_user(name)')
            .eq('id', payload.new.id)
            .single()
            
          if (data) {
            setComments(prev => [...prev, data as unknown as Comment])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [targetType, targetId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return
    
    if (!canAccess('comment_react')) {
      toast.error('Only Makers can leave comments.')
      return
    }

    setPosting(true)
    const { error } = await postComment(user.id, targetType, targetId, newComment)
    
    if (error) {
      toast.error('Failed to post comment: ' + error.message)
    } else {
      setNewComment('')
      toast.success('Comment posted!')
    }
    setPosting(false)
  }

  return (
    <div className="space-y-6">
      <AuthGate feature="comment_react" fallbackMessage="Become a Maker to join the conversation. Submit a project first!" showFallback={true}>
        <form onSubmit={handleSubmit} className="flex gap-3 items-start">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarFallback className="bg-brand-ocean/10 text-brand-ocean font-semibold">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Leave a comment or ask a question..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!newComment.trim() || posting} className="bg-brand-ocean text-white hover:bg-brand-ocean/90">
                <Send className="mr-2 h-4 w-4" /> {posting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </form>
      </AuthGate>

      <div className="space-y-4 mt-6">
        <h3 className="font-semibold">{comments.length} Comments</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-ocean border-t-transparent" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No comments yet. Be the first to start the conversation!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {comment.app_user?.name ? comment.app_user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted/30 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{comment.app_user?.name || 'Unknown User'}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
