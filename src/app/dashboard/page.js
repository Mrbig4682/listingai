'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n/context'

export default function DashboardPage() {
  const { t } = useI18n()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ total: 0, avgSeo: 0, thisMonth: 0 })
  const [recentListings, setRecentListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user: u } } = await supabase.auth.getUser()
        if (!u) {
          setLoading(false)
          return
        }
        setUser(u)

        const { data: p } = await supabase.from('user_profiles').select('*').eq('id', u.id).single()
        if (p) setProfile(p)

        const { data: listings } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', u.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (listings) {
          const now = new Date()
          const thisMonth = listings.filter(l => new Date(l.created_at).getMonth() === now.getMonth())
          const scores = listings.filter(l => l.seo_score).map(l => l.seo_score)
          const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
          setStats({ total: listings.length, avgSeo: avg, thisMonth: thisMonth.length })
          setRecentListings(listings.slice(0, 8))
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const plan = profile?.plan || 'free'
  const used = profile?.listings_used || 0
  const limit = profile?.listings_limit || 10

  const planLabel = plan === 'business' ? 'Business' : plan === 'pro' ? 'Pro' : t?.common?.free || 'Free'

  const tools = [
    { href: '/dashboard/yeni', icon: '✦', label: t?.nav?.newListing || 'New Listing', desc: t?.dashboard?.newListingDesc || 'Create AI-optimized product listings', color: 'bg-violet-500', size: 'large' },
    { href: '/dashboard/marka-dna', icon: '🧬', label: t?.nav?.brandDna || 'Brand DNA', desc: t?.dashboard?.brandDnaDesc || 'Extract your brand identity from URL', color: 'bg-fuchsia-500', size: 'large' },
    { href: '/dashboard/rakip-analiz', icon: '⚔️', label: t?.nav?.competitorAnalysis || 'Competitors', desc: t?.dashboard?.competitorDesc || 'AI competitive intelligence', color: 'bg-rose-500', size: 'medium' },
    { href: '/dashboard/ab-test', icon: '⚖️', label: t?.nav?.abTest || 'A/B Test', desc: t?.dashboard?.abTestDesc || 'Compare listing versions', color: 'bg-cyan-500', size: 'medium' },
    { href: '/dashboard/toplu', icon: '◫', label: t?.nav?.bulkGenerate || 'Bulk Generate', desc: t?.dashboard?.bulkDesc || 'Generate multiple listings at once', color: 'bg-emerald-500', size: 'medium' },
    { href: '/dashboard/optimizer', icon: '◈', label: t?.nav?.optimizer || 'Optimizer', desc: t?.dashboard?.optimizerDesc || 'Optimize existing listings', color: 'bg-amber-500', size: 'medium' },
    { href: '/dashboard/anahtar-kelime', icon: '◎', label: t?.nav?.keywords || 'Keywords', desc: t?.dashboard?.keywordsDesc || 'SEO keyword research', color: 'bg-sky-500', size: 'small' },
    { href: '/dashboard/asistan', icon: '◉', label: t?.nav?.aiAssistant || 'AI Assistant', desc: t?.dashboard?.assistantDesc || 'Your e-commerce expert', color: 'bg-purple-500', size: 'small' },
  ]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return t?.dashboard?.morning || 'Good Morning'
    if (h < 18) return t?.dashboard?.afternoon || 'Good Afternoon'
    return t?.dashboard?.evening || 'Good Evening'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-500 rounded-full animate-spin-slow" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-purple-600 to-fuchsia-500 p-6 md:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{greeting()} 👋</h1>
            <p className="text-sm text-white/80 mt-1">{user?.email}</p>
            <p className="text-xs text-white/60 mt-0.5">{t?.dashboard?.welcomeSub || 'Here\'s your listing performance overview'}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/20">
            <span className="text-xs font-semibold">{planLabel} Plan</span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Compact 2x2 on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Listings */}
        <div className="bg-white rounded-xl border border-surface-200 p-4 hover:shadow-soft-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">📊</div>
            <span className="text-[11px] font-semibold text-trust-light uppercase tracking-wide">{t?.analytics?.totalListings || 'Total Listings'}</span>
          </div>
          <div className="text-2xl font-bold text-trust-dark">{stats.total}</div>
          <div className="text-xs text-trust-light mt-1">
            <span className="text-emerald-500 font-medium">+{stats.thisMonth}</span> {t?.analytics?.thisMonth || 'bu ay'}
          </div>
        </div>

        {/* Avg SEO Score */}
        <div className="bg-white rounded-xl border border-surface-200 p-4 hover:shadow-soft-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm">⚡</div>
            <span className="text-[11px] font-semibold text-trust-light uppercase tracking-wide">{t?.analytics?.avgSeo || 'Avg. SEO'}</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: stats.avgSeo >= 70 ? '#10b981' : stats.avgSeo >= 50 ? '#f59e0b' : '#94a3b8' }}>
            {stats.avgSeo || '—'}
          </div>
          <div className="text-xs text-trust-light mt-1">
            {stats.avgSeo >= 70 ? (t?.analytics?.excellent || 'Mükemmel') : stats.avgSeo >= 50 ? (t?.analytics?.good || 'İyi') : (t?.analytics?.low || 'Düşük')}
            <span className="text-trust-muted"> / 100</span>
          </div>
        </div>

        {/* Quota */}
        <div className="bg-white rounded-xl border border-surface-200 p-4 hover:shadow-soft-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-sm">🎯</div>
            <span className="text-[11px] font-semibold text-trust-light uppercase tracking-wide">{t?.dashboard?.quota || 'Kota'}</span>
          </div>
          <div className="text-2xl font-bold text-trust-dark">
            {used}<span className="text-sm text-trust-light font-normal"> / {limit >= 999 ? '∞' : limit}</span>
          </div>
          <div className="w-full bg-surface-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} />
          </div>
        </div>

        {/* Plan */}
        <div className="bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl p-4 text-white hover:shadow-soft-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm">👑</div>
            <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wide">{t?.analytics?.currentPlan || 'Plan'}</span>
          </div>
          <div className="text-2xl font-bold">{planLabel}</div>
          {plan === 'free' ? (
            <Link href="/dashboard/odeme" className="text-xs font-semibold text-white/80 hover:text-white mt-1 inline-flex items-center gap-1">
              {t?.plan?.upgradeToPro || 'Yükselt'} →
            </Link>
          ) : (
            <div className="text-xs text-white/60 mt-1">{t?.plan?.unlimitedListings || 'Sınırsız'}</div>
          )}
        </div>
      </div>

      {/* Quick Access - Bento Grid */}
      <div>
        <h2 className="text-base font-bold text-trust-dark mb-3">{t?.dashboard?.quickAccess || 'Hızlı Erişim'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative bg-white rounded-xl border border-surface-200 p-4 md:p-5 hover:shadow-soft-lg hover:border-brand-200 transition-all hover:-translate-y-0.5 overflow-hidden ${
                tool.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className="relative z-10">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${tool.color} flex items-center justify-center text-lg md:text-xl text-white mb-3 group-hover:scale-105 transition-transform shadow-sm`}>
                  {tool.icon}
                </div>
                <h3 className="font-semibold text-sm text-trust-dark group-hover:text-brand-600 transition">{tool.label}</h3>
                <p className="text-xs text-trust-light mt-1 leading-relaxed line-clamp-2">{tool.desc}</p>

                {tool.size === 'large' && (
                  <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-surface-50 flex items-center justify-center text-trust-light group-hover:bg-brand-50 group-hover:text-brand-500 transition text-sm">
                    →
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Listings */}
      {recentListings.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold text-trust-dark">{t?.dashboard?.recentListings || 'Son İlanlar'}</h2>
            <Link href="/dashboard/gecmis" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition">
              {t?.dashboard?.viewAll || 'Tümünü Gör'} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {recentListings.map((l, i) => (
              <Link
                key={l.id || i}
                href={`/dashboard/gecmis/${l.id}`}
                className="group bg-white rounded-xl border border-surface-200 px-4 py-3 hover:shadow-soft-md hover:border-brand-200 transition-all"
              >
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-trust-dark truncate group-hover:text-brand-600 transition">
                      {l.product_name || l.title || 'Listing'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-trust-light">
                      <span className="capitalize px-1.5 py-0.5 bg-surface-50 rounded text-trust-medium text-[11px]">{l.platform || 'general'}</span>
                      <span>{new Date(l.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {l.seo_score != null && (
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      l.seo_score >= 80 ? 'bg-emerald-50 text-emerald-600' :
                      l.seo_score >= 60 ? 'bg-amber-50 text-amber-600' :
                      'bg-surface-50 text-trust-light'
                    }`}>
                      {l.seo_score}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State - Eye-catching distinct design */}
      {recentListings.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-brand-200 bg-gradient-to-br from-brand-50 via-purple-50 to-fuchsia-50 p-10 md:p-14 text-center">
          <div className="absolute top-4 left-6 text-5xl opacity-10">✦</div>
          <div className="absolute bottom-4 right-6 text-5xl opacity-10">◈</div>
          <div className="absolute top-1/2 left-1/4 text-3xl opacity-5">◎</div>
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-2xl text-white shadow-glow">
              ✦
            </div>
            <h3 className="text-lg font-bold text-trust-dark mb-1">{t?.dashboard?.noListings || 'Henüz ilan oluşturmadınız'}</h3>
            <p className="text-sm text-trust-medium mb-6 max-w-xs mx-auto">{t?.dashboard?.startFirst || 'İlk ilanınızı oluşturun ve AI\'ın gücünü keşfedin'}</p>
            <Link
              href="/dashboard/yeni"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-glow hover:scale-[1.02] transition-all text-sm"
            >
              ✦ {t?.nav?.newListing || 'İlan Oluştur'}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
