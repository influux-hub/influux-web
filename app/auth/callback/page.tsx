'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Logging you in...')

  useEffect(() => {
    async function handleCallback() {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        setMessage('Something went wrong. Please try the link again.')
        return
      }

      const userId = session.user.id
      const userType = searchParams.get('type')

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (!existingProfile && userType) {
        await supabase.from('profiles').insert({
          id: userId,
          user_type: userType,
        })

        if (userType === 'creator') {
          await supabase.from('creator_profiles').insert({ id: userId })
        } else if (userType === 'business') {
          await supabase.from('business_profiles').insert({ id: userId })
        }
      }

      router.push('/dashboard')
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <main className="min-h-screen bg-influux-charcoal flex items-center justify-center">
      <p className="text-influux-offwhite/70">{message}</p>
    </main>
  )
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-influux-charcoal flex items-center justify-center">
          <p className="text-influux-offwhite/70">Loading...</p>
        </main>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  )
}