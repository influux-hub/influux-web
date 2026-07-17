'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import {
  Wallet,
  LogOut,
  Sparkles,
  BookOpen,
  Users,
  BarChart3,
  Rocket,
  ChevronRight,
} from 'lucide-react'

type Profile = {
  id: string
  user_type: 'creator' | 'business'
  full_name: string | null
}

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [creatorScore, setCreatorScore] = useState<number>(50)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, user_type, full_name')
        .eq('id', session.user.id)
        .single()

      if (!profileData) {
        router.push('/')
        return
      }

      setProfile(profileData)

      if (profileData.user_type === 'creator') {
        const { data: creatorData } = await supabase
          .from('creator_profiles')
          .select('creator_score')
          .eq('id', session.user.id)
          .single()

        setCreatorScore(creatorData?.creator_score ?? 50)
      }

      setLoading(false)
    }

    loadDashboard()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-influux-charcoal flex items-center justify-center">
        <p className="text-influux-offwhite/70">Loading your dashboard...</p>
      </main>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <main className="relative min-h-screen bg-influux-charcoal overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-influux-charcoal via-[#20223a] to-influux-charcoal" />
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-influux-blue/15 rounded-full blur-[120px] animate-breathe" />
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-influux-green/15 rounded-full blur-[120px] animate-breathe [animation-delay:2s]" />

      <div className="relative z-10">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-influux-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-influux-offwhite font-bold tracking-tight">INFLUUX</span>
          </div>

          <div className="flex items-center gap-3">
            {profile?.user_type === 'creator' && (
              <div className="flex items-center gap-2 bg-influux-green/10 border border-influux-green/30 rounded-full px-4 py-1.5">
                <Wallet size={15} className="text-influux-green" />
                <span className="text-influux-offwhite text-sm font-semibold">₦0</span>
              </div>
            )}

            <div className="w-8 h-8 rounded-full bg-influux-blue/20 border border-influux-blue/40 flex items-center justify-center text-influux-offwhite text-xs font-semibold">
              {firstName ? firstName[0].toUpperCase() : 'U'}
            </div>

            <button
              onClick={handleLogout}
              className="text-influux-offwhite/50 hover:text-influux-offwhite transition p-1.5 rounded-lg hover:bg-white/5"
              aria-label="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>

        <div className="px-6 py-10 max-w-5xl mx-auto">
          {/* Greeting */}
          <div className="animate-fade-in-up mb-10">
            <p className="text-influux-blue text-sm font-medium mb-1 flex items-center gap-1.5">
              <Sparkles size={14} />
              {profile?.user_type === 'creator' ? 'Creator Toolbox' : 'Business Control Center'}
            </p>
            <h1 className="text-3xl font-bold text-influux-offwhite">
              {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
            </h1>
          </div>

          {profile?.user_type === 'creator' ? (
            <CreatorDashboard creatorScore={creatorScore} />
          ) : (
            <BusinessDashboard />
          )}
        </div>
      </div>
    </main>
  )
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff15" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke="#3498DB" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-influux-offwhite">{score}</span>
        <span className="text-[10px] text-influux-offwhite/40 uppercase tracking-wide">Score</span>
      </div>
    </div>
  )
}

function CreatorDashboard({ creatorScore }: { creatorScore: number }) {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {/* Featured: Creator Score */}
      <div className="sm:col-span-1 sm:row-span-2 bg-white/5 border border-influux-blue/25 rounded-2xl p-6 flex flex-col items-center justify-center text-center animate-fade-in-up [animation-delay:0.1s]">
        <ScoreRing score={creatorScore} />
        <p className="text-influux-offwhite/50 text-xs mt-4 leading-relaxed">
          Complete campaigns to raise your score and unlock better opportunities.
        </p>
      </div>

      <FeatureCard
        icon={<Rocket size={18} />}
        title="Marketplace Feed"
        subtitle="No open campaigns yet"
        accent="green"
        delay="0.2s"
      />
      <FeatureCard
        icon={<BookOpen size={18} />}
        title="Academy"
        subtitle="Courses launching soon"
        accent="blue"
        delay="0.3s"
      />
      <div className="sm:col-span-2 animate-fade-in-up [animation-delay:0.4s]">
        <div className="bg-gradient-to-r from-influux-blue/10 to-influux-green/10 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-influux-offwhite font-medium text-sm">Your profile is looking a little empty</p>
            <p className="text-influux-offwhite/50 text-xs mt-0.5">Add your niche and social links to start getting matched.</p>
          </div>
          <ChevronRight size={18} className="text-influux-offwhite/40" />
        </div>
      </div>
    </div>
  )
}

function BusinessDashboard() {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      <FeatureCard
        icon={<Rocket size={18} />}
        title="Start a Campaign"
        subtitle="Launch your first campaign"
        accent="blue"
        delay="0.1s"
        primary
      />
      <FeatureCard
        icon={<Users size={18} />}
        title="Matchmaker"
        subtitle="Find creators — coming soon"
        accent="green"
        delay="0.2s"
      />
      <FeatureCard
        icon={<BarChart3 size={18} />}
        title="Live Tracker"
        subtitle="Analytics — coming soon"
        accent="blue"
        delay="0.3s"
      />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  subtitle,
  accent,
  delay,
  primary = false,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  accent: 'blue' | 'green'
  delay: string
  primary?: boolean
}) {
  const accentColor = accent === 'blue' ? 'text-influux-blue bg-influux-blue/10' : 'text-influux-green bg-influux-green/10'
  const borderColor = accent === 'blue' ? 'hover:border-influux-blue/40' : 'hover:border-influux-green/40'

  return (
    <div
      className={`group bg-white/5 border border-white/10 ${borderColor} rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-white/[0.07] cursor-pointer animate-fade-in-up ${
        primary ? 'sm:col-span-2' : ''
      }`}
      style={{ animationDelay: delay }}
    >
      <div className={`w-9 h-9 rounded-lg ${accentColor} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-influux-offwhite font-semibold text-sm mb-1">{title}</h3>
      <p className="text-influux-offwhite/50 text-xs">{subtitle}</p>
    </div>
  )
}