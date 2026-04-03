'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AnalitikPage() {
  const [stats, setStats] = useState({ total: 0, avgScore: 0, thisMonth: 0 })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: listings } = await supabase
      .from('listings')
      .select('created_at')
      .eq('user_id', user.id)

    const { data: results } = await supabase
      .from('listing_results')
      .select('seo_score, listing_id, listings!inner(user_id)')
      .eq('listings.user_id', user.id)

    const now = new Date()
    const thisMonth = (listings || []).filter(l => {
      const d = new Date(l.created_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const scores = (results || []).map(r => r.seo_score).filter(Boolean)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

    setStats({
      total: listings?.length || 0,
      avgScore,
      thisMonth,
    })
  }

  const statCards = [
    { label: 'Toplam Listing', value: stats.total, icon: '📦' },
    { label: 'Ort. SEO Skoru', value: stats.avgScore || '—', icon: '🎯' },
    { label: 'Bu Ay', value: stats.thisMonth, icon: '📅' },
    { label: 'Kalan Hak', value: Math.max(0, 10 - stats.thisMonth), icon: '🎟️' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">📊 Analitik</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-extrabold text-brand-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-sm mb-4">Plan Bilgileri</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span>Mevcut Plan</span>
            <span className="font-semibold">Ücretsiz</span>
          </div>
          <div className="flex justify-between">
            <span>Aylık Limit</span>
            <span className="font-semibold">10 listing</span>
          </div>
          <div className="flex justify-between">
            <span>Kullanılan</span>
            <span className="font-semibold">{stats.thisMonth} listing</span>
          </div>
        </div>
        <button className="w-full mt-4 py-2.5 bg-brand-500 text-white text-sm font-bold rounded-xl hover:bg-brand-600 transition">
          Pro'ya Geçerek Limiti Artır
        </button>
      </div>
    </div>
  )
}
