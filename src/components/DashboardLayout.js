'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n/context'
import Logo from './Logo'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t, locale, setLocale, locales, translations } = useI18n()

  const navSections = [
    {
      items: [
        { href: '/dashboard', icon: '⬡', label: t.nav?.dashboard || 'Dashboard' },
      ]
    },
    {
      label: t.nav?.createSection || 'Create',
      items: [
        { href: '/dashboard/yeni', icon: '✦', label: t.nav.newListing },
        { href: '/dashboard/toplu', icon: '◫', label: t.nav.bulkGenerate },
      ]
    },
    {
      label: t.nav?.analyzeSection || 'Analyze',
      items: [
        { href: '/dashboard/optimizer', icon: '◈', label: t.nav.optimizer },
        { href: '/dashboard/anahtar-kelime', icon: '◎', label: t.nav.keywords },
        { href: '/dashboard/marka-dna', icon: '◇', label: t.nav.brandDna },
        { href: '/dashboard/rakip-analiz', icon: '◆', label: t.nav.competitorAnalysis },
        { href: '/dashboard/ab-test', icon: '⬢', label: t.nav.abTest },
      ]
    },
    {
      label: t.nav?.toolsSection || 'Tools',
      items: [
        { href: '/dashboard/asistan', icon: '◉', label: t.nav.aiAssistant },
        { href: '/dashboard/gecmis', icon: '◷', label: t.nav.history },
        { href: '/dashboard/analitik', icon: '◑', label: t.nav.analytics },
      ]
    },
  ]

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
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-500 rounded-full animate-spin-slow" />
      </div>
    )
  }

  const plan = profile?.plan || 'free'
  const used = profile?.listings_used || 0
  const limit = profile?.listings_limit || 10

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-trust-dark/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:static z-40 w-60 bg-white border-r border-surface-200 h-screen flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 pb-4">
          <Link href="/dashboard">
            <Logo size="md" />
          </Link>
        </div>

        {/* Language selector */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-0.5 bg-surface-50 rounded-xl p-1">
            {locales.map(loc => (
              <button key={loc} onClick={() => setLocale(loc)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider transition ${locale === loc ? 'bg-white shadow-soft text-trust-dark' : 'text-trust-light hover:text-trust-medium'}`}>
                {translations[loc].code}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          {navSections.map((section, si) => (
            <div key={si} className={si > 0 ? 'mt-4' : ''}>
              {section.label && (
                <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-trust-light">
                  {section.label}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                        active
                          ? 'bg-brand-50 text-brand-600 font-semibold'
                          : 'text-trust-medium hover:bg-surface-50 hover:text-trust-dark'
                      }`}>
                      <span className={`text-base ${active ? 'text-brand-500' : 'text-trust-light'}`}>{item.icon}</span>
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4">
          {/* Plan info */}
          <div className="bg-surface-50 rounded-2xl p-4 border border-surface-200">
            {plan === 'business' ? (
              <>
                <div className="font-semibold text-xs text-brand-600">{t.plan.business}</div>
                <div className="text-xs text-trust-light mt-1">{t.plan.unlimitedListings}</div>
                <div className="bg-surface-200 rounded-full h-1 mt-2 overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full w-full" />
                </div>
              </>
            ) : plan === 'pro' ? (
              <>
                <div className="font-semibold text-xs text-brand-600">{t.plan.pro}</div>
                <div className="text-xs text-trust-light mt-1">{used}/{limit} {t.plan.listingsUsed}</div>
                <div className="bg-surface-200 rounded-full h-1 mt-2 overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} />
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold text-xs text-trust-dark">{t.plan.free}</div>
                <div className="text-xs text-trust-light mt-1">{used}/{limit} {t.plan.listingsUsed}</div>
                <div className="bg-surface-200 rounded-full h-1 mt-2 overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} />
                </div>
                <Link href="/dashboard/odeme" className="block w-full mt-3 py-2 bg-trust-dark text-white text-xs font-semibold rounded-lg hover:bg-brand-600 transition text-center">
                  {t.plan.upgradeToPro}
                </Link>
              </>
            )}
          </div>

          <button onClick={handleLogout} className="w-full mt-3 py-2 text-xs text-trust-light hover:text-trust-dark transition font-medium">
            {t.nav.logout}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-surface-200">
          <button onClick={() => setSidebarOpen(true)} className="text-trust-medium text-xl">☰</button>
          <Logo size="sm" />
          <div className="w-6" />
        </div>
        <div className="p-5 md:p-8 max-w-4xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
