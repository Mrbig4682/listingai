'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/dashboard/yeni', icon: '➕', label: 'Yeni Listing' },
  { href: '/dashboard/toplu', icon: '📦', label: 'Toplu Üretim' },
  { href: '/dashboard/optimizer', icon: '⚡', label: 'Optimizer' },
  { href: '/dashboard/anahtar-kelime', icon: '🔑', label: 'Anahtar Kelime' },
  { href: '/dashboard/asistan', icon: '🤖', label: 'AI Asistan' },
  { href: '/dashboard/gecmis', icon: '📋', label: 'Geçmiş' },
  { href: '/dashboard/analitik', icon: '📊', label: 'Analitik' },
  { href: '/dashboard/odeme', icon: '💎', label: 'Planı Yükselt' },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/giris')
      else {
        setUser(data.user)
        supabase.from('user_profiles').select('*').eq('id', data.user.id).single()
          .then(({ data: p }) => { if (p) setProfile(p) })
      }
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin-slow" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:static z-40 w-56 bg-white border-r border-gray-100 h-screen flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5">
          <Link href="/dashboard" className="text-xl font-extrabold text-brand-500">🚀 ListingAI</Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${active ? 'bg-brand-50 text-brand-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4">
          <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-xl p-4">
            {profile?.plan === 'business' ? (
              <>
                <div className="font-bold text-xs text-purple-700">Business Plan ✨</div>
                <div className="text-xs text-gray-500 mt-1">Sınırsız listing hakkı</div>
                <div className="bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </>
            ) : profile?.plan === 'pro' ? (
              <>
                <div className="font-bold text-xs text-brand-600">Pro Plan ⚡</div>
                <div className="text-xs text-gray-500 mt-1">{profile.listings_used || 0}/{profile.listings_limit || 200} listing kullanıldı</div>
                <div className="bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, ((profile.listings_used || 0) / (profile.listings_limit || 200)) * 100)}%` }} />
                </div>
              </>
            ) : (
              <>
                <div className="font-bold text-xs">Ücretsiz Plan</div>
                <div className="text-xs text-gray-500 mt-1">{profile?.listings_used || 0}/{profile?.listings_limit || 10} listing kullanıldı</div>
                <div className="bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, ((profile?.listings_used || 0) / (profile?.listings_limit || 10)) * 100)}%` }} />
                </div>
                <Link href="/dashboard/odeme" className="block w-full mt-3 py-2 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition text-center">
                  Pro'ya Geç
                </Link>
              </>
            )}
          </div>
          <button onClick={handleLogout} className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition">
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 text-xl">☰</button>
          <span className="text-lg font-bold text-brand-500">🚀 ListingAI</span>
          <div className="w-6" />
        </div>
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
