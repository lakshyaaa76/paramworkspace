'use client'

import Link from 'next/link'
import { Save, Github, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function ProfilePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your maker profile</p>

      <form className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Avatar & Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brand-deep to-brand-ocean flex items-center justify-center text-white text-2xl font-bold">SK</div>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Sarah K." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Profile URL Slug</Label>
                <Input id="slug" defaultValue="sarah-k" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" defaultValue="IoT enthusiast building smart agricultural solutions." rows={3} maxLength={500} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aspirations">Aspirations</Label>
              <Textarea id="aspirations" placeholder="What do you want to build?" rows={2} maxLength={300} />
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
                <Input id="github" className="pl-9" placeholder="https://github.com/..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="linkedin" className="pl-9" placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">ESP32</Badge>
              <Badge variant="secondary">Python</Badge>
              <Badge variant="secondary">MQTT</Badge>
              <Badge variant="secondary">3D Printing</Badge>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add a skill..." className="flex-1" />
              <Button variant="outline" size="sm">Add</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">IoT</Badge>
              <Badge variant="secondary">Agriculture</Badge>
              <Badge variant="secondary">Sustainability</Badge>
            </div>
            <Input placeholder="Add tags (comma-separated)" />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full bg-gradient-to-r from-brand-deep to-brand-ocean text-white">
          <Save className="mr-2 h-4 w-4" /> Save Profile
        </Button>
      </form>
    </div>
  )
}
