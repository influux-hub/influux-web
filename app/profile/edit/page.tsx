'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Instagram, Youtube, Twitter, Music2, ArrowLeft, Check } from 'lucide-react'

const NICHES = [
  'Fashion & Beauty', 'Tech & Gadgets', 'Comedy & Entertainment',
  'Food & Cooking', 'Fitness & Health', 'Music', 'Lifestyle & Vlogging',
  'Business & Finance', 'Gaming', 'Education',
]

type SocialLinks = {
  instagram?: string
  tiktok?: string
  youtube?: string
  twitter?: string
}

export default function EditProfile() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [niche, setNiche] = useState('')
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
        return
      }

      setUserId(session.user.id)

      const { data } = await supabase
        .from('creator_profiles')
        .select('niche, social_links')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setNiche(data.niche ?? '')
        setSocialLinks(data.social_links ?? {})
      }

      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return

    setSaving(true)
    setSaved(false)

    const { error } = await supabase
      .from('creator_profiles')
      .update({ niche, social_links: socialLinks })
      .eq('id', userId)

    setSaving(false)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  function updateLink(platform: keyof SocialLinks, value: string) {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-influux-charcoal flex items-center justify-center">
        <p className="text-influux-offwhite/70">Loading your profile...</p>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-influux-charcoal overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-influux-charcoal via-[#20223a] to-influux-charcoal" />
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-influux-blue/15 rounded-full blur-[120px] animate-breathe" />

      <div className="relative z-10 max-w-xl mx-auto px-6 py-10">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-influux-offwhite/50 hover:text-influux-offwhite text-sm mb-8 transition"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <h1 className="text-2xl font-bold text-influux-offwhite mb-1 animate-fade-in-up">
          Complete your profile
        </h1>
        <p className="text-influux-offwhite/50 text-sm mb-8 animate-fade-in-up [animation-delay:0.1s]">
          This helps brands find and match with you.
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-8">
          {/* Niche */}
          <div className="animate-fade-in-up [animation-delay:0.2s]">
            <label className="block text-influux-offwhite text-sm font-medium mb-3">
              Your Niche
            </label>
            <div className="grid grid-cols-2 gap-2">
              {NICHES.map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setNiche(n)}
                  className={`text-sm text-left px-4 py-2.5 rounded-xl border transition ${
                    niche === n
                      ? 'bg-influux-blue/15 border-influux-blue text-influux-offwhite'
                      : 'bg-white/5 border-white/10 text-influux-offwhite/60 hover:border-white/25'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div className="animate-fade-in-up [animation-delay:0.3s]">
            <label className="block text-influux-offwhite text-sm font-medium mb-3">
              Social Links
            </label>
            <div className="flex flex-col gap-3">
              <SocialInput
                icon={<Instagram size={17} />}
                placeholder="Instagram username or link"
                value={socialLinks.instagram ?? ''}
                onChange={(v) => updateLink('instagram', v)}
              />
              <SocialInput
                icon={<Music2 size={17} />}
                placeholder="TikTok username or link"
                value={socialLinks.tiktok ?? ''}
                onChange={(v) => updateLink('tiktok', v)}
              />
              <SocialInput
                icon={<Youtube size={17} />}
                placeholder="YouTube channel link"
                value={socialLinks.youtube ?? ''}
                onChange={(v) => updateLink('youtube', v)}
              />
              <SocialInput
                icon={<Twitter size={17} />}
                placeholder="X (Twitter) username or link"
                value={socialLinks.twitter ?? ''}
                onChange={(v) => updateLink('twitter', v)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-influux-blue text-white font-semibold py-3.5 rounded-xl shadow-[0_8px_30px_rgba(52,152,219,0.35)] hover:shadow-[0_8px_30px_rgba(52,152,219,0.55)] transition disabled:opacity-60 animate-fade-in-up [animation-delay:0.4s]"
          >
            {saving ? 'Saving...' : saved ? (
              <>
                <Check size={17} /> Saved
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </form>
      </div>
    </main>
  )
}

function SocialInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-influux-blue transition">
      <span className="text-influux-offwhite/40">{icon}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent flex-1 text-influux-offwhite placeholder:text-influux-offwhite/30 focus:outline-none text-sm"
      />
    </div>
  )
}