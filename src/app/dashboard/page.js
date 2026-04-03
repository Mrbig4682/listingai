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

  const tools = [
    { href: '/dashboard/yeni', icon: '✦', label: t?.nav?.newListing || 'New Listing', desc: t?.dashboard?.newListingDesc || 'Create AI-optimized product listings', gradient: 'from-indigo-500 to-purple-500', size: 'large' },
    { href: '/dashboard/marka-dna', icon: '🧬', label: t?.nav?.brandDna || 'Brand DNA', desc: t?.dashboard?.brandDnaDesc || 'Extract your brand identity from URL', gradient: 'from-purple-500 to-pink-500', size: 'large' },
    { href: '/dashboard/rakip-analiz', icon: '⚔️', label: t?.nav?.competitorAnalysis || 'Competitors', desc: t?.dashboard?.competitorDesc || 'AI competitive intelligence', gradient: 'from-red-500 to-orange-500', size: 'medium' },
    { href: '/dashboard/ab-test', icon: '⚖️', label: t?.nav?.abTest || 'A/B Test', desc: t?.dashboard?.abTestDesc || 'Compare listing versions', gradient: 'from-blue-500 to-cyan-500', size: 'medium' },
    { href: '/dashboard/toplu', icon: '◫', label: t?.nav?.bulkGenerate || 'Bulk Generate', desc: t?.dashboard?.bulkDesc || 'Generate multiple listings at once', gradient: 'from-emerald-500 to-teal-500', size: 'medium' },
    { href: '/dashboard/optimizer', icon: '◈', label: t?.nav?.optimizer || 'Optimizer', desc: t?.dashboard?.optimizerDesc || 'Optimize existing listings', gradient: 'from-amber-500 to-orange-500', size: 'medium' },
    { href: '/dashboard/anahtar-kelime', icon: '◎', label: t?.nav?.keywords || 'Keywords', desc: t?.dashboard?.keywordsDesc || 'SEO keyword research', gradient: 'from-sky-500 to-blue-500', size: 'small' },
    { href: '/dashboard/asistan', icon: '◉', label: t?.nav?.aiAssistant || 'AI Assistant', desc: t?.dashboard?.assistantDesc || 'Your e-commerce expert', gradient: 'from-violet-500 to-purple-500', size: 'small' },
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
        <div className="text-gray-400">{t?.dashboard?.loading || 'Loading...'}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{greeting()} 👋</h1>
            <p className="text-base text-gray-600 mt-2">{user?.email || 'Welcome back'}</p>
            <p className="text-sm text-gray-500 mt-1">{t?.dashboard?.welcomeSub || 'Here\'s your listing performance overview'}</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white rounded-2xl px-4 py-2 border border-indigo-100">
              <span className="text-xs font-semibold text-indigo-600 capitalize">{plan} {t?.plan?.plan || 'Plan'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Listings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t?.analytics?.totalListings || 'Total Listings'}</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
              <div className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                <span className="text-green-500">+{stats.thisMonth}</span>
                <span className="text-gray-400">{t?.analytics?.thisMonth || 'This Month'}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-xl">📊</div>
          </div>
        </div>

        {/* Avg SEO Score */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t?.analytics?.avgSeo || 'Avg. SEO Score'}</div>
              <div className="text-3xl font-bold mt-2" style={{ color: stats.avgSeo >= 70 ? '#10b981' : stats.avgSeo >= 50 ? '#f59e0b' : '#6b7280' }}>
                {stats.avgSeo || '—'}
              </div>
              <div className="text-sm text-gray-500 mt-3">
                {stats.avgSeo >= 70 ? '🟢 Excellent' : stats.avgSeo >= 50 ? '🟡 Good' : '⚪ Needs Work'} / 100
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-xl">⚡</div>
          </div>
        </div>

        {/* Quota Usage */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t?.dashboard?.quota || 'Quota Used'}</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {used}
                <span className="text-lg text-gray-400 font-normal ml-1">/ {limit === 999 ? '∞' : limit}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
                />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-xl">🎯</div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border border-indigo-400 p-6 shadow-sm hover:shadow-md transition-shadow text-white overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wide">{t?.analytics?.currentPlan || 'Current Plan'}</div>
              <div className="text-2xl font-bold text-white mt-1 capitalize truncate">{plan}</div>
              {plan === 'free' && (
                <Link href="/dashboard/odeme" className="text-xs font-semibold text-indigo-100 hover:text-white mt-2 inline-flex items-center gap-1 transition">
                  {t?.plan?.upgradeToPro || 'Upgrade'} →
                </Link>
              )}
              {plan !== 'free' && (
                <div className="text-xs text-indigo-200 mt-2">{t?.plan?.unlimitedListings || 'Premium'}</div>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg flex-shrink-0">👑</div>
          </div>
        </div>
      </div>

      {/* Quick Access - Bento Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t?.dashboard?.quickAccess || 'Quick Access'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all hover:-translate-y-1 cursor-pointer overflow-hidden ${
                tool.size === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'
              }`}
            >
              {/* Background gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                  {tool.icon}
                </div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition">{tool.label}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{tool.desc}</p>

                {tool.size === 'large' && (
                  <div className="absolute bottom-6 right-6 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition">
                    →
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Listings Section */}
      {recentListings.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t?.dashboard?.recentListings || 'Recent Listings'}</h2>
            <Link href="/dashboard/gecmis" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
              {t?.dashboard?.viewAll || 'View All'} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentListings.map((l, i) => (
              <Link
                key={l.id || i}
                href={`/dashboard/gecmis/${l.id}`}
                className="group bg-white rounded-2xl border border-gray-100 px-6 py-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition">
                      {l.product_name || l.title || 'Listing'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="capitalize px-2 py-1 bg-gray-100 rounded-md">{l.platform || 'general'}</span>
                      <span className="text-gray-300">•</span>
                      <span>{new Date(l.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {l.seo_score !== null && l.seo_score !== undefined && (
                    <div className={`flex-shrink-0 text-center`}>
                      <div className={`text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ${
                        l.seo_score >= 80 ? 'bg-green-50 text-green-700' :
                        l.seo_score >= 60 ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {l.seo_score}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">SEO</div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentListings.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{t?.dashboard?.noListingsTitle || 'No listings yet'}</h3>
          <p className="text-sm text-gray-500 mb-6">{t?.dashboard?.noListingsDesc || 'Create your first AI-optimized listing to get started'}</p>
          <Link
            href="/dashboard/yeni"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            ✦ {t?.nav?.newListing || 'Create New Listing'}
          </Link>
        </div>
      )}
    </div>
  )
}
