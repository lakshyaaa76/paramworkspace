'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DOMAINS } from '@/lib/constants/domains'
import { createClient } from '@/lib/supabase/client'
import type { Challenge } from '@/lib/types'

const TIERS: Record<number, string> = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Expert' }

export default function ChallengesPage() {
  const supabase = createClient()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('all')
  const [tier, setTier] = useState('all')

  const fetchChallenges = async () => {
    setLoading(true)
    let query = supabase
      .from('challenge')
      .select('*')
      .eq('status', 'published')

    if (domain && domain !== 'all') query = query.eq('domain', domain)
    if (tier && tier !== 'all') query = query.eq('tier', parseInt(tier))
    if (search.trim()) query = query.ilike('title', `%${search.trim()}%`)

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query.limit(20)
    if (!error) setChallenges(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchChallenges()
  }, [domain, tier])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchChallenges()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Challenges</h1>
        <p className="text-muted-foreground text-lg">Learn by doing — pick a challenge and start building</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Tier" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="1">Beginner</SelectItem>
            <SelectItem value="2">Intermediate</SelectItem>
            <SelectItem value="3">Advanced</SelectItem>
            <SelectItem value="4">Expert</SelectItem>
          </SelectContent>
        </Select>
        <Select value={domain} onValueChange={setDomain}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Domain" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {DOMAINS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
          </SelectContent>
        </Select>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No challenges found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((c) => (
            <Link key={c.id} href={`/challenges/${c.id}`}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-brand-ocean/30 hover:-translate-y-1">
                <CardHeader>
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="flex items-center gap-2 mb-1">
                    {c.tier && <Badge variant="secondary" className="text-xs">{TIERS[c.tier]}</Badge>}
                    {c.domain && <Badge variant="outline" className="text-xs">{c.domain}</Badge>}
                  </div>
                  <CardTitle className="text-base group-hover:text-brand-ocean transition-colors">
                    {c.title}
                  </CardTitle>
                  {c.mystery && (
                    <CardDescription className="line-clamp-2">{c.mystery}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {c.time_estimate && <span>⏱️ {c.time_estimate}</span>}
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
