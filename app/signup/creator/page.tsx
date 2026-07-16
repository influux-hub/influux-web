'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CreatorSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?type=creator`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-influux-charcoal flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-influux-charcoal via-[#232538] to-influux-charcoal" />
      <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-influux-blue/30 rounded-full blur-[100px] animate-breathe" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        <h1 className="text-3xl font-bold text-influux-offwhite mb-1">
          Join as a Creator
        </h1>
        <p className="text-influux-offwhite/60 mb-8">
          We'll email you a secure link — no password needed.
        </p>

        {status === 'sent' ? (
          <div className="bg-influux-blue/10 border border-influux-blue/40 rounded-xl p-5 text-influux-offwhite">
            <p className="font-semibold mb-1">Check your email 📩</p>
            <p className="text-sm text-influux-offwhite/70">
              We sent a login link to <span className="text-influux-blue">{email}</span>.
              Click it to continue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-influux-offwhite placeholder:text-influux-offwhite/40 focus:outline-none focus:border-influux-blue transition"
            />

            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-influux-blue text-white font-semibold py-3 rounded-xl shadow-[0_8px_30px_rgba(52,152,219,0.35)] hover:shadow-[0_8px_30px_rgba(52,152,219,0.55)] transition disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending link...' : 'Send Magic Link'}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </main>
  )
}