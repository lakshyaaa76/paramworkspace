'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DOMAINS } from '@/lib/constants/domains'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/lib/types'

type ProjectWithUser = Project & { app_user: { name: string } | null }

const TIERS: Record<number, string> = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }

export default function ProjectsPage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<ProjectWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('all')
  const [tier, setTier] = useState('all')
  const [sort, setSort] = useState('recent')

  const fetchProjects = async () => {
    setLoading(true)
    let query = supabase
      .from('project')
      .select('*, app_user!project_owner_id_fkey(name)')
      .eq('status', 'active')
      .eq('visibility', 'public')

    if (domain && domain !== 'all') query = query.eq('domain', domain)
    if (tier && tier !== 'all') query = query.eq('tier', parseInt(tier))
    if (search.trim()) query = query.ilike('title', `%${search.trim()}%`)
    if (sort === 'az') query = query.order('title', { ascending: true })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query.limit(20)
    if (!error) setProjects((data as ProjectWithUser[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [domain, tier, sort])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProjects()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground text-lg">Explore what our community is building</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={domain} onValueChange={(v) => setDomain(v || '')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {DOMAINS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={tier} onValueChange={(v) => setTier(v || '')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="1">Beginner</SelectItem>
            <SelectItem value="2">Intermediate</SelectItem>
            <SelectItem value="3">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v || '')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="az">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <FolderKanban className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No projects found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
                <div className="aspect-video bg-gradient-to-br from-brand-deep/10 to-brand-ocean/10 flex items-center justify-center rounded-t-lg">
                  <FolderKanban className="h-10 w-10 text-brand-ocean/40 group-hover:scale-110 transition-transform" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {project.domain && (
                      <Badge variant="secondary" className="text-xs">{project.domain}</Badge>
                    )}
                    {project.tier && (
                      <Badge variant="outline" className="text-xs">{TIERS[project.tier]}</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-brand-ocean transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.one_line_summary ?? project.description ?? 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {project.app_user?.name ?? 'Unknown'}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
