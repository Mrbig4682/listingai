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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  // Mobile bottom tab bar items — the 5 most important
  const mobileTabItems = [
    { href: '/dashboard', icon: '⬡', label: t.nav?.dashboard || 'Ana Sayfa', activeColor: 'text-violet-600' },
    { href: '/dashboard/yeni', icon: '✦', label: t.nav?.newListing || 'İlan', activeColor: 'text-purple-600' },
    { href: '/dashboard/marka-dna', icon: '◇', label: 'DNA', activeColor: 'text-fuchsia-600' },
    { href: '/dashboard/asistan', icon: '◉', label: 'AI', activeColor: 'text-indigo-600' },
    { href: '#more', icon: '☰', label: t.nav?.toolsSection || 'Menü', activeColor: 'text-brand-600' },
  ]

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/giris')
      else {
        setUser(data.user)
        supabase.from('user_profiles').select('*').eq('id', data.user.id).single()
          .then(({ data: p }) => {
            if (p) setProfile(p)
            // Check if user selected a plan before signup — redirect to payment
            const savedPlan = localStorage.getItem('listingai_selected_plan')
            if (savedPlan && ['starter', 'pro', 'business'].includes(savedPlan) && (!p || p.plan === 'free')) {
              localStorage.removeItem('listingai_selected_plan')
              router.push('/dashboard/odeme')
            }
          })
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

  const isTabActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen flex bg-[#faf8ff]">
      {/* =================== DESKTOP SIDEBAR =================== */}
      {/* Mobile overlay for sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-trust-dark/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:static z-40 w-60 bg-white border-r border-surface-200 h-screen flex-col transition-transform hidden md:flex`}>
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
                    <Link key={item.href} href={item.href}
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

        <div className="p-3 pt-1">
          <div className="bg-surface-50 rounded-xl p-3 border border-surface-200">
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
                <Link href="/dashboard/odeme" className="block w-full mt-2 py-1.5 bg-trust-dark text-white text-xs font-semibold rounded-lg hover:bg-brand-600 transition text-center">
                  {t.plan.upgradeToPro}
                </Link>
              </>
            )}
          </div>
          <button onClick={handleLogout} className="w-full mt-2 py-1.5 text-xs text-trust-light hover:text-trust-dark transition font-medium">
            {t.nav.logout}
          </button>
        </div>
      </aside>

      {/* =================== MAIN CONTENT =================== */}
      <main className="flex-1 min-h-screen md:min-h-0 overflow-y-auto">
        {/* Mobile Top Bar — thin, app-like */}
        <div className="md:hidden sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-surface-200">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo size="sm" />
            {/* Language mini selector */}
            <div className="flex items-center gap-1">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="text-[11px] font-semibold text-trust-medium bg-surface-50 border border-surface-200 rounded-lg px-2 py-1 appearance-none"
              >
                {locales.map(loc => (
                  <option key={loc} value={loc}>{translations[loc].code}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content area — extra bottom padding on mobile for tab bar */}
        <div className="p-4 pb-24 md:p-6 md:pb-8 max-w-6xl mx-auto animate-fade-in">
          {children}
        </div>

        {/* =================== MOBILE BOTTOM TAB BAR =================== */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
          {/* Full-screen menu overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setMobileMenuOpen(false)}>
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto animate-sheet-up" onClick={e => e.stopPropagation()}>
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-surface-200 rounded-full" />
                </div>

                {/* Menu header */}
                <div className="px-5 pb-3 border-b border-surface-100">
                  <h3 className="text-base font-bold text-gray-900">{t.nav?.toolsSection || 'Tüm Araçlar'}</h3>
                </div>

                {/* All nav items */}
                <div className="px-4 py-3">
                  {(() => {
                    const iconGradients = {
                      '⬡': 'from-violet-500 to-purple-600',
                      '✦': 'from-violet-500 to-purple-600',
                      '◫': 'from-emerald-500 to-teal-600',
                      '◈': 'from-amber-500 to-orange-600',
                      '◎': 'from-sky-500 to-indigo-600',
                      '◇': 'from-fuchsia-500 to-pink-600',
                      '◆': 'from-rose-500 to-red-600',
                      '⬢': 'from-cyan-500 to-blue-600',
                      '◉': 'from-purple-500 to-violet-600',
                      '◷': 'from-slate-500 to-gray-600',
                      '◑': 'from-indigo-500 to-blue-600',
                    }
                    return navSections.map((section, si) => (
                      <div key={si} className={si > 0 ? 'mt-4' : ''}>
                        {section.label && (
                          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-trust-light">
                            {section.label}
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-2">
                          {section.items.map(item => {
                            const active = isTabActive(item.href)
                            const grad = iconGradients[item.icon] || 'from-gray-500 to-gray-600'
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl text-center transition ${
                                  active
                                    ? 'bg-brand-50 text-brand-600 ring-1 ring-brand-200'
                                    : 'bg-surface-50 text-trust-medium hover:bg-surface-100'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-lg shadow-sm`}>
                                  {item.icon}
                                </div>
                                <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  })()}

                  {/* Quick links */}
                  <div className="mt-5 pt-4 border-t border-surface-100">
                    <div className="flex flex-wrap gap-3 text-[11px] text-trust-light">
                      <Link href="/dashboard/sss" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-600">SSS</Link>
                      <span>·</span>
                      <Link href="/mesafeli-satis" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-600">{t.sidebar?.distanceSales || 'Mesafeli Satış'}</Link>
                      <span>·</span>
                      <Link href="/gizlilik" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-600">{t.sidebar?.privacy || 'Gizlilik'}</Link>
                    </div>

                    {/* Plan badge */}
                    <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-brand-50 via-purple-50 to-fuchsia-50 rounded-xl p-3 border border-brand-100">
                      <div>
                        <div className="text-xs font-bold text-brand-600">
                          {plan === 'business' ? t.plan.business : plan === 'pro' ? t.plan.pro : t.plan.free}
                        </div>
                        <div className="text-[11px] text-trust-light mt-0.5">
                          {plan === 'business' ? t.plan.unlimitedListings : `${used}/${limit >= 999 ? '∞' : limit} ${t.plan.listingsUsed}`}
                        </div>
                      </div>
                      {plan === 'free' && (
                        <Link href="/dashboard/odeme" onClick={() => setMobileMenuOpen(false)}
                          className="text-[11px] font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 px-3 py-1.5 rounded-lg shadow-sm">
                          {t.plan.upgradeToPro}
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="w-full mt-3 mb-2 py-2.5 text-xs text-trust-light hover:text-red-500 transition font-medium text-center">
                      {t.nav.logout}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab bar */}
          <div className="bg-white/95 backdrop-blur-lg border-t border-surface-200 px-2 pb-safe">
            <div className="flex items-center justify-around py-1.5">
              {mobileTabItems.map((item) => {
                const isMore = item.href === '#more'
                const active = !isMore && isTabActive(item.href)

                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      if (isMore) {
                        setMobileMenuOpen(!mobileMenuOpen)
                      } else {
                        setMobileMenuOpen(false)
                        router.push(item.href)
                      }
                    }}
                    className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
                      active
                        ? item.activeColor
                        : isMore && mobileMenuOpen
                        ? 'text-brand-600'
                        : 'text-trust-light'
                    }`}
                  >
                    <span className={`text-xl transition-transform duration-300 ${active ? 'scale-125' : ''}`}>{item.icon}</span>
                    <span className={`text-[10px] font-semibold ${active ? item.activeColor : 'text-trust-light'}`}>{item.label}</span>
                    {active && <div className="w-4 h-1 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 mt-0.5" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
