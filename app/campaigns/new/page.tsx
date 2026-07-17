'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Rocket } from 'lucide-react'

const CREATOR_TYPES = [
  'Fashion & Beauty', 'Tech & Gadgets', 'Comedy & Entertainment',
  'Food & Cooking', 'Fitness & Health', 'Music', 'Lifestyle & Vlogging',
  'Business & Finance', 'Gaming', 'Education',
]

export default function NewCampaign() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [creatorType, setCreatorType] = useState('')
  const [paymentStructure, setPaymentStructure] = useState<'fixed' | 'per_post' | 'commission'>('fixed')
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrorMsg('')

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push('/')
      return
    }

    const { error } = await supabase.from('campaigns').insert({
      business_id: session.user.id,
      title,
      description,
      budget: budget ? Number(budget) : null,
      creator_type: creatorType,
      payment_structure: paymentStructure,
      status: 'open',
    })

    setSaving(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="relative min-h-screen bg-influux-charcoal overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-influux-charcoal via-[#20223a] to-influux-charcoal" />
      <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-influux-green/15 rounded-full blur-[120px] animate-breathe" />

      <div className="relative z-10 max-w-xl mx-auto px-6 py-10">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-influux-offwhite/50 hover:text-influux-offwhite text-sm mb-8 transition"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="flex items-center gap-2 mb-1 animate-fade-in-up">
          <Rocket size={20} className="text-influux-green" />
          <h1 className="text-2xl font-bold text-influux-offwhite">Start a Campaign</h1>
        </div>
        <p className="text-influux-offwhite/50 text-sm mb-8 animate-fade-in-up [animation-delay:0.1s]">
          Tell us what you're looking for — we'll help match you with the right creators.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="animate-fade-in-up [animation-delay:0.15s]">
            <label className="block text-influux-offwhite text-sm font-medium mb-2">
              Campaign Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Launch promo for our new skincare line"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-influux-offwhite placeholder:text-influux-offwhite/30 focus:outline-none focus:border-influux-green transition"
            />
          </div>

          <div className="animate-fade-in-up [animation-delay:0.2s]">
            <label className="block text-influux-offwhite text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the campaign, deliverables, and what you're hoping to achieve"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-influux-offwhite placeholder:text-influux-offwhite/30 focus:outline-none focus:border-influux-green transition resize-none"
            />
          </div>

          <div className="animate-fade-in-up [animation-delay:0.25s]">
            <label className="block text-influux-offwhite text-sm font-medium mb-2">
              Budget (₦)
            </label>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-influux-offwhite placeholder:text-influux-offwhite/30 focus:outline-none focus:border-influux-green transition"
            />
          </div>

          <div className="animate-fade-in-up [animation-delay:0.3s]">
            <label className="block text-influux-offwhite text-sm font-medium mb-2">
              Creator Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CREATOR_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setCreatorType(type)}
                  className={`text-sm text-left px-4 py-2.5 rounded-xl border transition ${
                    creatorType === type
                      ? 'bg-influux-green/15 border-influux-green text-influux-offwhite'
                      : 'bg-white/5 border-white/10 text-influux-offwhite/60 hover:border-white/25'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up [animation-delay:0.35s]">
            <label className="block text-influux-offwhite text-sm font-medium mb-2">
              Payment Structure
            </label>
            <div className="flex gap-2">
              {(['fixed', 'per_post', 'commission'] as const).map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setPaymentStructure(option)}
                  className={`flex-1 text-sm px-4 py-2.5 rounded-xl border transition capitalize ${
                    paymentStructure === option
                      ? 'bg-influux-green/15 border-influux-green text-influux-offwhite'
                      : 'bg-white/5 border-white/10 text-influux-offwhite/60 hover:border-white/25'
                  }`}
                >
                  {option.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-influux-green text-influux-charcoal font-semibold py-3.5 rounded-xl shadow-[0_8px_30px_rgba(52,199,89,0.35)] hover:shadow-[0_8px_30px_rgba(52,199,89,0.55)] transition disabled:opacity-60 animate-fade-in-up [animation-delay:0.4s]"
          >
            {saving ? 'Publishing...' : 'Publish Campaign'}
          </button>
        </form>
      </div>
    </main>
  )
}