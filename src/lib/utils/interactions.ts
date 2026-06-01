import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

/** Toggle a bookmark for the current user on any entity */
export async function toggleBookmark(
  userId: string,
  targetType: 'project' | 'challenge' | 'event',
  targetId: string
) {
  const { data: existing } = await supabase
    .from('user_bookmark')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('user_bookmark')
      .delete()
      .eq('id', existing.id)
    return { bookmarked: false, error }
  } else {
    const { error } = await supabase
      .from('user_bookmark')
      .insert({ user_id: userId, target_type: targetType, target_id: targetId })
    return { bookmarked: true, error }
  }
}

/** Check if the user has bookmarked a given entity */
export async function isBookmarked(
  userId: string,
  targetType: string,
  targetId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('user_bookmark')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle()

  return !!data
}

/** Toggle a reaction (like / upvote) on any entity */
export async function toggleReaction(
  userId: string,
  targetType: 'project' | 'challenge',
  targetId: string,
  type: 'like' | 'upvote'
) {
  const { data: existing } = await supabase
    .from('reaction')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('reaction_type', type)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from('reaction').delete().eq('id', existing.id)
    return { reacted: false, error }
  } else {
    const { error } = await supabase.from('reaction').insert({
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
      reaction_type: type,
    })
    return { reacted: true, error }
  }
}

/** Post a comment on any entity */
export async function postComment(
  userId: string,
  targetType: 'project' | 'challenge',
  targetId: string,
  content: string,
  parentId?: string
) {
  const { data, error } = await supabase
    .from('comment')
    .insert({
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
      content: content.trim(),
      parent_comment_id: parentId ?? null,
    })
    .select('*, app_user(name)')
    .single()

  return { comment: data, error }
}

/** Fetch all comments for an entity */
export async function fetchComments(targetType: string, targetId: string) {
  const { data, error } = await supabase
    .from('comment')
    .select('*, app_user(name)')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .order('created_at', { ascending: true })

  return { comments: data ?? [], error }
}
