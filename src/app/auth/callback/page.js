'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Supabase client-side automatically picks up the auth code from URL hash/params
    // and exchanges it for a session via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/dashboard')
      }
      if (event === 'TOKEN_REFRESHED') {
        router.replace('/dashboard')
      }
    })

    // Also check if already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard')
      }
    })

    // Timeout fallback — if nothing happens in 5 seconds, redirect to login
    const timeout = setTimeout(() => {
      router.replace('/giris?error=Giriş zaman aşımına uğradı, tekrar deneyin')
    }, 5000)

    return () => {
      subscription?.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Giriş yapılıyor...</p>
      </div>
    </div>
  )
}
