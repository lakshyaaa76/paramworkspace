import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

/** Upload a project image to Supabase Storage and return the public URL */
export async function uploadProjectImage(
  userId: string,
  projectId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${projectId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(path, file, { upsert: false, contentType: file.type })

  if (uploadError) return { url: null, error: uploadError.message }

  const { data } = supabase.storage.from('project-images').getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

/** Upload a project file to Supabase Storage and return the public URL */
export async function uploadProjectFile(
  userId: string,
  projectId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const path = `${userId}/${projectId}/${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('project-files')
    .upload(path, file, { upsert: false, contentType: file.type })

  if (uploadError) return { url: null, error: uploadError.message }

  const { data } = supabase.storage.from('project-files').getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

/** Upload a user avatar. Replaces any existing avatar at the same path. */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { url: null, error: uploadError.message }

  // Append cache-busting timestamp to force browser refresh
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return { url: `${data.publicUrl}?t=${Date.now()}`, error: null }
}
