'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, CheckCircle2, BookOpen, Wrench, BarChart3, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuthGate } from '@/components/auth/AuthGate'
import { useAuthStore } from '@/lib/stores/auth-store'

const challenge = {
  title: 'Build Your First Arduino Robot',
  tier: 'Beginner',
  domain: 'Robotics',
  time_estimate: '2–4 hours',
  completions: 50,
  mystery: 'Can you build a robot that follows a line on the ground using just simple sensors?',
  core_idea: 'Line-following robots use infrared sensors to detect contrast between a dark line and a light surface. By comparing sensor readings, the robot decides whether to go straight, turn left, or turn right.',
  mission: 'Build a two-wheeled robot that can autonomously follow a black line on a white surface. Your robot should handle straight lines, gentle curves, and right-angle turns.',
  success_criteria: 'Your robot must complete a full loop of the test track without going off-line more than twice.',
  steps: [
    { order: 1, description: 'Assemble the chassis and attach the motors' },
    { order: 2, description: 'Wire up the IR sensors to the Arduino' },
    { order: 3, description: 'Write the basic motor control code' },
    { order: 4, description: 'Implement sensor reading and decision logic' },
    { order: 5, description: 'Calibrate sensors and test on practice track' },
    { order: 6, description: 'Fine-tune PID values for smooth following' },
  ],
  materials: [
    { name: 'Arduino Uno', qty: '1' },
    { name: 'IR Sensor Module', qty: '2' },
    { name: 'DC Motor + Wheels', qty: '2' },
    { name: 'Motor Driver (L298N)', qty: '1' },
    { name: 'Chassis Kit', qty: '1' },
    { name: '9V Battery', qty: '1' },
  ],
  skills: ['Basic Electronics', 'Arduino Programming', 'C/C++'],
  vocab: [
    { term: 'PID Controller', definition: 'A control loop mechanism used to smoothly follow the line' },
    { term: 'IR Sensor', definition: 'Infrared sensor that detects reflectivity differences' },
    { term: 'PWM', definition: 'Pulse Width Modulation — controls motor speed' },
  ],
}

export default function SingleChallengePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/challenges"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges</Link>
      </Button>

      {/* Cover */}
      <div className="aspect-video bg-gradient-to-br from-brand-deep/10 via-brand-ocean/10 to-brand-sky/10 rounded-xl flex items-center justify-center mb-8">
        <span className="text-7xl">🤖</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{challenge.tier}</Badge>
          <Badge variant="outline">{challenge.domain}</Badge>
          <Badge variant="outline" className="text-xs">⏱️ {challenge.time_estimate}</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
        <p className="text-sm text-muted-foreground">✅ {challenge.completions} makers completed this challenge</p>
      </div>

      {/* Mystery / Core Idea / Mission */}
      <div className="space-y-6 mb-8">
        <Card className="border-brand-ocean/20 bg-brand-ocean/5">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-brand-ocean mb-1">🔍 The Mystery</p>
            <p className="text-sm text-muted-foreground italic">{challenge.mystery}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold mb-1">💡 Core Idea</p>
            <p className="text-sm text-muted-foreground">{challenge.core_idea}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-deep/20 bg-brand-deep/5">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-brand-deep dark:text-brand-sky mb-1">🎯 Your Mission</p>
            <p className="text-sm text-muted-foreground">{challenge.mission}</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-8" />

      {/* Steps */}
      <Card className="mb-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Steps</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenge.steps.map((s) => (
              <div key={s.order} className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-brand-ocean/10 text-brand-ocean flex items-center justify-center text-xs font-bold shrink-0">{s.order}</div>
                <p className="text-sm pt-1">{s.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card className="mb-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Materials Needed</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {challenge.materials.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 text-sm">
                <span>{m.name}</span>
                <Badge variant="outline" className="text-xs">×{m.qty}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills & Vocabulary side by side */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <Card>
          <CardHeader><CardTitle className="text-base">Skills Required</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {challenge.skills.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Vocabulary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {challenge.vocab.map((v) => (
                <div key={v.term}>
                  <p className="text-sm font-semibold">{v.term}</p>
                  <p className="text-xs text-muted-foreground">{v.definition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Criteria */}
      <Card className="mb-8 border-green-500/20 bg-green-500/5">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-green-500 mb-1 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Success Criteria</p>
          <p className="text-sm text-muted-foreground">{challenge.success_criteria}</p>
        </CardContent>
      </Card>

      {/* CTA — Auth gated */}
      <div className="text-center">
        <AuthGate feature="complete_challenge" fallbackMessage="Log in to complete challenges">
          {isAuthenticated ? (
            <Button size="lg" className="bg-gradient-to-r from-brand-deep to-brand-ocean text-white shadow-lg">
              ✅ Mark as Completed
            </Button>
          ) : (
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" /> Log in to Start This Challenge
              </Link>
            </Button>
          )}
        </AuthGate>
      </div>
    </div>
  )
}
