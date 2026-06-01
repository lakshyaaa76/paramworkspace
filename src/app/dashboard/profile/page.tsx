'use client'

import { useState, useEffect } from 'react'
import { Save, Github, Linkedin, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { uploadAvatar } from '@/lib/utils/storage'
import { toast } from 'sonner'
import Image from 'next/image'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [bio, setBio] = useState('')
  const [aspirations, setAspirations] = useState('')
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      
      setName(user.name) // name lives in app_user
      
      const { data } = await supabase
        .from('maker_profile')
        .select('*')
        .eq('user_id', user.id)
        .single()
        
      if (data) {
        setSlug(data.public_url_slug || '')
        setBio(data.bio || '')
        setAspirations(data.aspirations || '')
        setGithub(data.github_url || '')
        setLinkedin(data.linkedin_url || '')
        setAvatarUrl(data.avatar_url || null)
      }
      setLoading(false)
    }
    
    fetchProfile()
  }, [user])

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      // Show local preview immediately
      setAvatarUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    try {
      // Update name in app_user
      if (name.trim() !== user.name) {
        await supabase.from('app_user').update({ name: name.trim() }).eq('id', user.id)
        // Note: auth store name needs refresh, handled via layout's initAuth on next load
      }

      // Handle Avatar Upload if changed
      let finalAvatarUrl = avatarUrl
      if (avatarFile) {
        const { url, error: uploadError } = await uploadAvatar(user.id, avatarFile)
        if (uploadError) {
          toast.error('Avatar upload failed: ' + uploadError)
        } else if (url) {
          finalAvatarUrl = url
        }
      }

      // Upsert maker profile
      const { error } = await supabase
        .from('maker_profile')
        .upsert({
          user_id: user.id,
          public_url_slug: slug.trim() || null,
          bio: bio.trim() || null,
          aspirations: aspirations.trim() || null,
          github_url: github.trim() || null,
          linkedin_url: linkedin.trim() || null,
          avatar_url: finalAvatarUrl,
        })

      if (error) {
        // Handle unique constraint error on slug
        if (error.code === '23505') {
          toast.error('That Profile URL Slug is already taken.')
        } else {
          toast.error('Failed to update profile.')
        }
      } else {
        toast.success('Profile saved successfully!')
      }
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your maker profile</p>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Avatar & Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-2 border-border">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span>{name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <Input 
                  type="file" 
                  id="avatar" 
                  className="hidden" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleAvatarSelect}
                />
                <Button type="button" variant="outline" size="sm" asChild>
                  <label htmlFor="avatar" className="cursor-pointer">
                    <Camera className="mr-2 h-4 w-4" /> Change Avatar
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Max 2MB. JPEG, PNG.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Profile URL Slug (Optional)</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. sarah-k" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={500} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aspirations">Aspirations</Label>
              <Textarea id="aspirations" value={aspirations} onChange={(e) => setAspirations(e.target.value)} placeholder="What do you want to build?" rows={2} maxLength={300} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="github" className="pl-9" placeholder="https://github.com/..." value={github} onChange={(e) => setGithub(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="linkedin" className="pl-9" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full bg-gradient-to-r from-brand-deep to-brand-ocean text-white" disabled={saving}>
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  )
}
