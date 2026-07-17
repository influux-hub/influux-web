'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Profile = {
  id: string
  user_type: 'creator' | 'business'
  full_name: string | null
}

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [creatorScore, setCreatorScore] = useState<number | null>(null)
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

        setCreatorScore(creatorData?.creator_score ?? null)
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

  return (
    <main className="min-h-screen bg-influux-charcoal">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span className="text-influux-offwhite font-bold text-lg">INFLUUX</span>
        <button
          onClick={handleLogout}
          className="text-influux-offwhite/60 hover:text-influux-offwhite text-sm transition"
        >
          Log out
        </button>
      </header>

      <div className="px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-influux-offwhite mb-1">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ''} 👋
        </h1>
        <p className="text-influux-offwhite/60 mb-8">
          {profile?.user_type === 'creator'
            ? "Here's your Creator Toolbox."
            : "Here's your Business Control Center."}
        </p>

        {profile?.user_type === 'creator' ? (
          <CreatorDashboard creatorScore={creatorScore} />
        ) : (
          <BusinessDashboard />
        )}
      </div>
    </main>
  )
}

function CreatorDashboard({ creatorScore }: { creatorScore: number | null }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <Card title="Creator Score" accent="blue">
        <p className="text-3xl font-bold text-influux-offwhite">{creatorScore ?? '--'}</p>
        <p className="text-influux-offwhite/50 text-sm mt-1">out of 100</p>
      </Card>

      <Card title="Wallet" accent="green">
        <p className="text-3xl font-bold text-influux-offwhite">₦0</p>
        <p className="text-influux-offwhite/50 text-sm mt-1">Available balance</p>
      </Card>

      <Card title="Marketplace Feed" accent="blue">
        <p className="text-influux-offwhite/50 text-sm">No campaigns yet — coming soon.</p>
      </Card>

      <Card title="Academy" accent="green">
        <p className="text-influux-offwhite/50 text-sm">Courses launching soon.</p>
      </Card>
    </div>
  )
}

function BusinessDashboard() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <Card title="Start a Campaign" accent="blue">
        <p className="text-influux-offwhite/50 text-sm">Campaign Creator coming soon.</p>
      </Card>

      <Card title="Matchmaker" accent="green">
        <p className="text-influux-offwhite/50 text-sm">Find creators — coming soon.</p>
      </Card>

      <Card title="Live Tracker" accent="blue">
        <p className="text-influux-offwhite/50 text-sm">Campaign analytics — coming soon.</p>
      </Card>
    </div>
  )
}

function Card({
  title,
  accent,
  children,
}: {
  title: string
  accent: 'blue' | 'green'
  children: React.ReactNode
}) {
  const borderColor = accent === 'blue' ? 'border-influux-blue/30' : 'border-influux-green/30'

  return (
    <div className={`bg-white/5 border ${borderColor} rounded-2xl p-5 hover:bg-white/[0.07] transition`}>
      <h3 className="text-influux-offwhite/70 text-sm font-medium mb-3">{title}</h3>
      {children}
    </div>
  )
}