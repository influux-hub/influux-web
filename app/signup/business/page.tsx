'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function BusinessSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?type=business`,
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
      <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] bg-influux-green/25 rounded-full blur-[100px] animate-breathe" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        <h1 className="text-3xl font-bold text-influux-offwhite mb-1">
          Join as a Business
        </h1>
        <p className="text-influux-offwhite/60 mb-8">
          We&apos;ll email you a secure link — no password needed.
        </p>

        {status === 'sent' ? (
          <div className="bg-influux-green/10 border border-influux-green/40 rounded-xl p-5 text-influux-offwhite">
            <p className="font-semibold mb-1">Check your email 📩</p>
            <p className="text-sm text-influux-offwhite/70">
              We sent a login link to <span className="text-influux-green">{email}</span>.
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
              placeholder="you@company.com"
              className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-influux-offwhite placeholder:text-influux-offwhite/40 focus:outline-none focus:border-influux-green transition"
            />

            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-transparent border-2 border-influux-green text-influux-offwhite font-semibold py-3 rounded-xl hover:bg-influux-green/10 transition disabled:opacity-60"
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