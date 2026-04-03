'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AnalitikPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Profil bilgisi
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Tüm listingler
    const { data: listings } = await supabase
      .from('listings')
      .select('*, listing_results(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const allListings = listings || []
    const allResults = allListings.flatMap(l => l.listing_results || [])

    // Genel istatistikler
    const now = new Date()
    const thisMonth = allListings.filter(l => {
      const d = new Date(l.created_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const scores = allResults.map(r => r.seo_score).filter(Boolean)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

    // Platform bazlı istatistikler
    const platformStats = {}
    allResults.forEach(r => {
      if (!platformStats[r.platform]) {
        platformStats[r.platform] = { count: 0, totalScore: 0, scores: [] }
      }
      platformStats[r.platform].count++
      if (r.seo_score) {
        platformStats[r.platform].totalScore += r.seo_score
        platformStats[r.platform].scores.push(r.seo_score)
      }
    })

    // Son 6 ay trendi
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = d.toLocaleDateString('tr-TR', { month: 'short' })
      const monthListings = allListings.filter(l => {
        const ld = new Date(l.created_at)
        return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear()
      })
      const monthResults = monthListings.flatMap(l => l.listing_results || [])
      const monthScores = monthResults.map(r => r.seo_score).filter(Boolean)
      const monthAvg = monthScores.length > 0 ? Math.round(monthScores.reduce((a, b) => a + b, 0) / monthScores.length) : 0

      monthlyData.push({
        month,
        count: monthListings.length,
        avgScore: monthAvg,
      })
    }

    // Skor dağılımı
    const scoreDistribution = { excellent: 0, good: 0, average: 0, low: 0 }
    scores.forEach(s => {
      if (s >= 85) scoreDistribution.excellent++
      else if (s >= 70) scoreDistribution.good++
      else if (s >= 55) scoreDistribution.average++
      else scoreDistribution.low++
    })

    // En iyi 3 listing
    const topListings = allListings
      .map(l => {
        const bestResult = (l.listing_results || []).reduce((best, r) =>
          (r.seo_score || 0) > (best?.seo_score || 0) ? r : best, null)
        return { ...l, bestScore: bestResult?.seo_score || 0, bestPlatform: bestResult?.platform }
      })
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 3)

    setStats({
      profile,
      total: allListings.length,
      avgScore,
      thisMonth,
      platformStats,
      monthlyData,
      scoreDistribution,
      topListings,
      totalResults: allResults.length,
    })
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin-slow" />
      </div>
    )
  }

  if (!stats) return null

  const plan = stats.profile?.plan || 'free'
  const used = stats.profile?.listings_used || 0
  const limit = stats.profile?.listings_limit || 10
  const planLabel = plan === 'business' ? 'Business' : plan === 'pro' ? 'Pro' : 'Ücretsiz'
  const maxBarCount = Math.max(...stats.monthlyData.map(m => m.count), 1)

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Analitik</h2>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📦" value={stats.total} label="Toplam Listing" />
        <StatCard icon="🎯" value={stats.avgScore || '—'} label="Ort. SEO Skoru" highlight={stats.avgScore >= 75} />
        <StatCard icon="📅" value={stats.thisMonth} label="Bu Ay Üretilen" />
        <StatCard icon="🎟️" value={plan === 'business' ? '∞' : Math.max(0, limit - used)} label="Kalan Hak" />
      </div>

      {/* Aylık trend grafiği */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h3 className="font-bold text-sm mb-4">Son 6 Ay Listing Trendi</h3>
        <div className="flex items-end gap-3 h-40">
          {stats.monthlyData.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-brand-600">{m.count > 0 ? m.count : ''}</span>
              <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '120px' }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-brand-500 to-brand-300 rounded-t-lg transition-all duration-500"
                  style={{ height: `${m.count > 0 ? Math.max(8, (m.count / maxBarCount) * 100) : 0}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{m.month}</span>
              {m.avgScore > 0 && <span className="text-[10px] text-gray-400">SEO: {m.avgScore}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Platform istatistikleri */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-sm mb-4">Platform Performansı</h3>
          {Object.keys(stats.platformStats).length === 0 ? (
            <p className="text-sm text-gray-400">Henüz veri yok</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.platformStats).map(([platform, data]) => {
                const avg = data.scores.length > 0 ? Math.round(data.totalScore / data.scores.length) : 0
                const colors = {
                  trendyol: 'bg-orange-500',
                  hepsiburada: 'bg-orange-600',
                  n11: 'bg-purple-500',
                }
                return (
                  <div key={platform}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold capitalize">{platform}</span>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>{data.count} listing</span>
                        <span className={`font-bold ${avg >= 75 ? 'text-green-600' : avg >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                          SEO: {avg || '—'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${colors[platform] || 'bg-brand-500'}`}
                        style={{ width: `${Math.min(100, avg)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* SEO skor dağılımı */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-sm mb-4">SEO Skor Dağılımı</h3>
          {stats.totalResults === 0 ? (
            <p className="text-sm text-gray-400">Henüz veri yok</p>
          ) : (
            <div className="space-y-3">
              <ScoreRow label="Mükemmel (85+)" count={stats.scoreDistribution.excellent} total={stats.totalResults} color="bg-green-500" />
              <ScoreRow label="İyi (70-84)" count={stats.scoreDistribution.good} total={stats.totalResults} color="bg-blue-500" />
              <ScoreRow label="Orta (55-69)" count={stats.scoreDistribution.average} total={stats.totalResults} color="bg-amber-500" />
              <ScoreRow label="Düşük (<55)" count={stats.scoreDistribution.low} total={stats.totalResults} color="bg-red-500" />
            </div>
          )}
        </div>
      </div>

      {/* En iyi listingler */}
      {stats.topListings.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="font-bold text-sm mb-4">En Yüksek SEO Skorlu Listinglerin</h3>
          <div className="space-y-3">
            {stats.topListings.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{l.product_name}</div>
                  <div className="text-xs text-gray-400">{l.bestPlatform && <span className="capitalize">{l.bestPlatform}</span>}</div>
                </div>
                <span className={`text-sm font-bold ${l.bestScore >= 80 ? 'text-green-600' : l.bestScore >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                  {l.bestScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan bilgileri */}
      <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-6">
        <h3 className="font-bold text-sm mb-4">Plan Bilgileri</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span>Mevcut Plan</span>
            <span className="font-bold text-brand-600">{planLabel} {plan === 'business' ? '✨' : plan === 'pro' ? '⚡' : ''}</span>
          </div>
          <div className="flex justify-between">
            <span>Aylık Limit</span>
            <span className="font-semibold">{plan === 'business' ? 'Sınırsız' : `${limit} listing`}</span>
          </div>
          <div className="flex justify-between">
            <span>Kullanılan</span>
            <span className="font-semibold">{used} listing</span>
          </div>
          {stats.profile?.plan_expires_at && (
            <div className="flex justify-between">
              <span>Plan Bitiş</span>
              <span className="font-semibold">{new Date(stats.profile.plan_expires_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          )}
        </div>
        {plan !== 'business' && (
          <div className="mt-3">
            <div className="bg-white/60 rounded-full h-2 overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{used}/{limit} kullanıldı</div>
          </div>
        )}
        {plan === 'free' && (
          <Link href="/dashboard/odeme" className="block w-full mt-4 py-2.5 bg-brand-500 text-white text-sm font-bold rounded-xl hover:bg-brand-600 transition text-center">
            Pro'ya Geçerek Limiti Artır
          </Link>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, value, label, highlight }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-extrabold ${highlight ? 'text-green-600' : 'text-brand-900'}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}

function ScoreRow({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{count} ({pct}%)</span>
      </div>
      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
