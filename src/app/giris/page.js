'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GirisPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <Link href="/" className="text-2xl font-extrabold text-brand-500 block text-center mb-6">🚀 ListingAI</Link>
        <h1 className="text-2xl font-bold text-center mb-2">Giriş Yap</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Hesabına giriş yap ve listing oluşturmaya başla.</p>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-posta</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="ornek@email.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Şifreni gir" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabın yok mu?{' '}
          <Link href="/kayit" className="text-brand-500 font-semibold hover:underline">Ücretsiz Hesap Oluştur</Link>
        </p>
      </div>
    </div>
  )
}
