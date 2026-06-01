'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import {
  Users,
  FolderKanban,
  Calendar,
  Trophy,
  Wrench,
  ChevronRight,
  BookOpen,
  Handshake,
  Award,
  Target,
  Star,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { ScrollStrokeLine } from '@/components/ui/svg-follow-scroll'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ─── Fade-in wrapper ─── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Data ─── */
const stats = [
  { label: 'Makers', value: '500+', icon: Users },
  { label: 'Projects', value: '300+', icon: FolderKanban },
  { label: 'Events', value: '50+', icon: Calendar },
  { label: 'Challenges', value: '20+', icon: Trophy },
]

const featuredProjects = [
  { id: '1', title: 'IoT Plant Monitor', summary: 'Smart plant watering with real-time soil sensors', maker: 'Sarah K.', domain: 'IoT', tier: 'Intermediate', icon: '🌱' },
  { id: '2', title: 'Arduino Robot Car', summary: 'Line-following robot with obstacle avoidance', maker: 'Alex M.', domain: 'Robotics', tier: 'Beginner', icon: '🤖' },
  { id: '3', title: '3D Printed Drone', summary: 'Custom quadcopter with GPS navigation', maker: 'Mike R.', domain: '3D Printing', tier: 'Advanced', icon: '🚁' },
  { id: '4', title: 'Smart Mirror', summary: 'AI-powered mirror with weather and calendar', maker: 'Jane L.', domain: 'AI/ML', tier: 'Intermediate', icon: '🪞' },
  { id: '5', title: 'LED Art Wall', summary: 'Massive programmable LED matrix for pixel art', maker: 'Tom D.', domain: 'Electronics', tier: 'Advanced', icon: '💡' },
  { id: '6', title: 'Soil Sensor Network', summary: 'Distributed soil monitoring for agriculture', maker: 'Priya N.', domain: 'IoT', tier: 'Intermediate', icon: '📡' },
]

const activeChallenges = [
  {
    id: '1',
    title: 'Build Your First Arduino Robot',
    tier: 'Beginner',
    completions: 50,
    text: 'Learn the basics of electronics, motors, and programming by assembling a simple line-following robot from scratch.',
    icon: '🤖',
    maker: 'Mentor Raj',
  },
  {
    id: '2',
    title: 'IoT Weather Station',
    tier: 'Intermediate',
    completions: 23,
    text: 'Connect temperature, humidity, and pressure sensors to the cloud. Visualize real-time data on a dashboard.',
    icon: '🌦️',
    maker: 'Mentor Priya',
  },
  {
    id: '3',
    title: 'LED Matrix Art Display',
    tier: 'Beginner',
    completions: 67,
    text: 'Create stunning pixel art animations on an LED matrix. Learn multiplexing, shift registers, and creative coding.',
    icon: '💡',
    maker: 'Mentor Sam',
  },
  {
    id: '4',
    title: 'PCB Design Basics',
    tier: 'Intermediate',
    completions: 31,
    text: 'Design your first printed circuit board using KiCad. From schematic to Gerber files ready for manufacturing.',
    icon: '🔌',
    maker: 'Mentor Raj',
  },
  {
    id: '5',
    title: 'Smart Home Controller',
    tier: 'Advanced',
    completions: 12,
    text: 'Build a hub that controls lights, fans, and sensors via Wi-Fi. Full-stack from firmware to mobile app.',
    icon: '🏠',
    maker: 'Mentor Priya',
  },
  {
    id: '6',
    title: '3D Print a Mechanical Toy',
    tier: 'Beginner',
    completions: 45,
    text: 'Model, slice, and 3D print a working mechanical toy with gears and moving parts. No electronics required.',
    icon: '🧸',
    maker: 'Mentor Sam',
  },
]

const benefits = [
  { icon: BookOpen, title: 'Learn by Building', desc: 'Real skills through hands-on projects and guided challenges' },
  { icon: Handshake, title: 'Collaborate', desc: 'Join teams, group projects, and get mentored by experts' },
  { icon: Award, title: 'Showcase & Earn', desc: 'Build your portfolio, earn badges, get recognized' },
  { icon: Wrench, title: 'Access Tools', desc: '3D printers, laser cutters, electronics, and more' },
  { icon: Target, title: 'Challenge Yourself', desc: 'Complete guided challenges across multiple domains' },
  { icon: Star, title: 'Join Community', desc: 'Be part of something bigger — connect with fellow makers' },
]

const steps = [
  { num: '01', icon: '🔍', title: 'Explore', desc: 'Browse projects, challenges, and events freely.' },
  { num: '02', icon: '📝', title: 'Create Account', desc: 'Join as a Viewer — bookmark and set up your profile.' },
  { num: '03', icon: '🔨', title: 'Build a Project', desc: 'Create and submit your first project for review.' },
  { num: '04', icon: '🚀', title: 'Become a Maker', desc: 'Get approved, unlock full access, and grow.' },
]

/* ─── Infinite Scroll Carousel for Projects ─── */
function ProjectCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0)
        api.scrollTo(0)
      } else {
        api.scrollNext()
        setCurrent(current + 1)
      }
    }, 2500)
    return () => clearTimeout(timer)
  }, [api, current])

  return (
    <Carousel setApi={setApi} className="w-full" opts={{ loop: true, align: 'start' }}>
      <CarouselContent>
        {featuredProjects.map((project) => (
          <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3" key={project.id}>
            <Link href={`/projects/${project.id}`}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/10 hover:border-brand-orange/30 hover:-translate-y-1 bg-white/70 border-brand-peach/30">
                <div className="aspect-video bg-gradient-to-br from-brand-peach/20 to-brand-orange/10 flex items-center justify-center rounded-t-lg">
                  <span className="text-5xl group-hover:scale-110 transition-transform">{project.icon}</span>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs font-semibold bg-brand-peach/30 text-brand-brown border-brand-peach/50">{project.domain}</Badge>
                    <Badge variant="outline" className="text-xs font-medium border-brand-brown/30 text-brand-brown/80">{project.tier}</Badge>
                  </div>
                  <h3 className="font-bold text-brand-brown mb-1 group-hover:text-brand-orange transition-colors">{project.title}</h3>
                  <p className="text-sm text-brand-brown/70 mb-3 line-clamp-2">{project.summary}</p>
                  <p className="text-xs font-semibold text-brand-brown/50">by {project.maker}</p>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

/* ─── Challenges (Testimonials-style cards) ─── */
function ChallengeCards() {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? activeChallenges : activeChallenges.slice(0, 3)

  return (
    <div className="relative">
      <div className={cn(
        "flex justify-center items-stretch gap-5 flex-wrap",
        !showAll && activeChallenges.length > 3 && "max-h-[500px] overflow-hidden"
      )}>
        {displayed.map((c) => (
          <Link key={c.id} href={`/challenges/${c.id}`}>
            <Card className="w-80 h-auto p-5 bg-[#261400] border-brand-peach/10 hover:border-brand-orange/30 transition-all group">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-brand-orange/20 flex items-center justify-center text-2xl">{c.icon}</div>
                <div className="flex flex-col pl-4">
                  <span className="font-bold text-base text-brand-cream">{c.tier}</span>
                  <span className="text-sm text-brand-peach/60">{c.completions} completions</span>
                </div>
              </div>
              <div className="mt-4 mb-3">
                <h3 className="font-bold text-brand-cream group-hover:text-brand-orange transition-colors mb-2">{c.title}</h3>
                <p className="text-brand-peach/70 text-sm leading-relaxed">{c.text}</p>
              </div>
              <p className="text-xs font-semibold text-brand-peach/40 flex items-center gap-1">
                Created by {c.maker} <ArrowRight className="h-3 w-3" />
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {activeChallenges.length > 3 && !showAll && (
        <>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-brand-brown to-transparent" />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <Button variant="secondary" onClick={() => setShowAll(true)} className="bg-brand-orange text-white hover:bg-brand-orange/90 font-semibold shadow-md">
              Load More Challenges
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── PAGE ─── */
export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-ocean border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col relative">
      <ScrollStrokeLine />

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-peach/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-center">
          <FadeIn>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-semibold border border-brand-peach/50 bg-brand-peach/20 text-brand-brown">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
              Community for Builders & Creators
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6">
              <span className="text-brand-brown">Param</span>{' '}
              <span className="text-brand-orange">Makerspace</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-brand-brown/80 mb-4">
              Where Ideas Become Reality
            </p>

            <p className="text-base sm:text-lg text-brand-brown/60 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
              A community of builders, thinkers, and creators collaborating on real-world projects.
              Learn by doing, earn badges, and showcase your work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-base px-8 h-12 shadow-lg shadow-brand-orange/25"
                asChild
              >
                <Link href="/auth/register">
                  Start Your First Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-brand-brown/30 text-brand-brown font-bold hover:bg-brand-peach/20" asChild>
                <Link href="/projects">
                  Explore What Others Built
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="border-y border-brand-peach/30 bg-brand-peach/15 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1} className="text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-brand-orange" />
                <div className="text-3xl font-extrabold text-brand-brown">{stat.value}</div>
                <div className="text-sm font-semibold text-brand-brown/60">{stat.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PROJECTS (Carousel) ==================== */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-brown mb-3">Featured Projects</h2>
            <p className="text-brand-brown/60 text-lg font-medium">Discover what our community is building</p>
          </FadeIn>

          <FadeIn>
            <ProjectCarousel />
          </FadeIn>

          <FadeIn className="text-center mt-10">
            <Button variant="outline" size="lg" className="border-brand-brown/30 text-brand-brown font-bold hover:bg-brand-peach/20" asChild>
              <Link href="/projects">
                View All Projects
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ==================== CHALLENGES (Testimonials style) ==================== */}
      <section className="py-20 md:py-28 bg-brand-brown relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-cream mb-3">Active Challenges</h2>
            <p className="text-brand-peach/70 text-lg font-medium">Learn by doing — pick a challenge and start building</p>
          </FadeIn>

          <FadeIn>
            <ChallengeCards />
          </FadeIn>

          <FadeIn className="text-center mt-10">
            <Button variant="outline" size="lg" className="border-brand-cream/40 text-brand-cream font-bold hover:bg-brand-cream/10 hover:border-brand-cream/60" asChild>
              <Link href="/challenges">
                Browse All Challenges
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ==================== BENEFITS ==================== */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-brown mb-3">Why Join Param Makerspace?</h2>
            <p className="text-brand-brown/60 text-lg font-medium">Everything you need to learn, build, and grow</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.1}>
                <Card className="group border-brand-peach/30 bg-white/50 hover:bg-white/80 hover:border-brand-orange/30 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-orange/15 mb-4 group-hover:bg-brand-orange/20 transition-colors">
                      <b.icon className="h-5 w-5 text-brand-orange" />
                    </div>
                    <h3 className="font-bold text-brand-brown mb-2">{b.title}</h3>
                    <p className="text-sm text-brand-brown/60 leading-relaxed font-medium">{b.desc}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 md:py-28 bg-brand-peach/15 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-brown mb-3">How It Works</h2>
            <p className="text-brand-brown/60 text-lg font-medium">From explorer to maker in four simple steps</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.15} className="relative text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="text-xs font-extrabold text-brand-orange tracking-wider mb-2">STEP {step.num}</div>
                <h3 className="font-bold text-brand-brown mb-2">{step.title}</h3>
                <p className="text-sm text-brand-brown/60 font-medium">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-8 -right-3 h-5 w-5 text-brand-peach" />
                )}
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-14">
            <Button
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-base px-10 h-12 shadow-lg shadow-brand-orange/25"
              asChild
            >
              <Link href="/auth/register">
                Get Started — It&apos;s Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-brown mb-3">What Makers Say</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn>
              <Card className="bg-gradient-to-br from-brand-peach/20 to-brand-orange/5 border-brand-peach/30">
                <CardContent className="p-6">
                  <p className="text-brand-brown/80 italic mb-4 leading-relaxed font-medium">
                    &quot;I went from zero electronics knowledge to building my own IoT devices in 3 months! The step-by-step challenges made all the difference.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-sm font-bold text-brand-orange">SK</div>
                    <div>
                      <p className="font-bold text-sm text-brand-brown">Sarah K.</p>
                      <p className="text-xs font-semibold text-brand-brown/50">IoT Maker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay={0.15}>
              <Card className="bg-gradient-to-br from-brand-orange/5 to-brand-peach/20 border-brand-peach/30">
                <CardContent className="p-6">
                  <p className="text-brand-brown/80 italic mb-4 leading-relaxed font-medium">
                    &quot;The weekend build challenges pushed me to try things I never thought I could do. The community support is incredible.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-brown/15 flex items-center justify-center text-sm font-bold text-brand-brown">AM</div>
                    <div>
                      <p className="font-bold text-sm text-brand-brown">Alex M.</p>
                      <p className="text-xs font-semibold text-brand-brown/50">Robotics Maker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
