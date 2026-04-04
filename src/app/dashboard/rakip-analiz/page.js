'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

function ScoreBar({ score, label, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="font-bold text-base" style={{ color }}>{score}/100</span>
      </div>
      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

const COUNTRIES = [
  { value: 'Türkiye', label: 'Türkiye' },
  { value: 'ABD', label: 'ABD' },
  { value: 'Almanya', label: 'Almanya' },
  { value: 'İngiltere', label: 'İngiltere' },
  { value: 'Fransa', label: 'Fransa' },
  { value: 'İspanya', label: 'İspanya' },
  { value: 'Brezilya', label: 'Brezilya' },
  { value: 'Global', label: 'Global' },
]

export default function RakipAnalizPage() {
  const { t, platforms } = useI18n()
  const ca = t?.competitorAnalysis || {}
  const [product, setProduct] = useState('')
  const [platform, setPlatform] = useState(platforms?.[0]?.id || 'amazon')
  const [category, setCategory] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [country, setCountry] = useState('Türkiye')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!product.trim()) return
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/competitor-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, platform, category, competitors, language: 'tr', country }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-3 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
        <p className="text-lg font-bold text-gray-800">{ca.analyzing || 'Rakipleri analiz ediliyor...'}</p>
        <p className="text-base text-gray-500">{ca.analyzingDesc || 'Pazar verisi, fiyatlandırma ve rakip verisi taranıyor...'}</p>
      </div>
    )
  }

  if (result) {
    const os = result.overall_score || {}
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{ca.results || 'Rakip Analizi Sonuçları'}</h2>
            <p className="text-base text-gray-600 mt-1">"{product}" - {platform} ({country})</p>
          </div>
          <button onClick={() => setResult(null)} className="px-5 py-3 text-base font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-all shadow-sm">
            ← {ca.newAnalysis || 'Yeni Analiz'}
          </button>
        </div>

        {/* Score Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-md mb-8 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg mb-6 text-gray-900">{ca.marketScores || 'Pazar Puanları'}</h3>
          <div className="space-y-3">
            <ScoreBar score={os.market_opportunity || 0} label={ca.marketOpportunity || 'Market Opportunity'} color="#10b981" />
            <ScoreBar score={os.profit_potential || 0} label={ca.profitPotential || 'Profit Potential'} color="#6366f1" />
            <ScoreBar score={100 - (os.competition_intensity || 0)} label={ca.competitionEase || 'Competition Ease'} color="#f59e0b" />
            <ScoreBar score={100 - (os.entry_barrier || 0)} label={ca.entryEase || 'Entry Ease'} color="#8b5cf6" />
          </div>
        </div>

        {/* Market Overview */}
        <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-200 p-8 mb-8 shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-gray-900">📊 {ca.marketOverview || 'Pazar Özeti'}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/80 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 font-medium">{ca.saturation || 'Doygunluk'}</div>
              <div className={`text-lg font-bold capitalize mt-2 ${result.market_overview?.saturation_level === 'low' ? 'text-green-600' : result.market_overview?.saturation_level === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                {result.market_overview?.saturation_level}
              </div>
            </div>
            <div className="bg-white/80 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 font-medium">{ca.trend || 'Trend'}</div>
              <div className={`text-lg font-bold capitalize mt-2 ${result.market_overview?.growth_trend === 'growing' ? 'text-green-600' : 'text-amber-600'}`}>
                {result.market_overview?.growth_trend === 'growing' ? '📈' : result.market_overview?.growth_trend === 'declining' ? '📉' : '➡️'} {result.market_overview?.growth_trend}
              </div>
            </div>
            <div className="bg-white/80 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 font-medium">{ca.opportunity || 'Fırsat'}</div>
              <div className="text-lg font-bold text-brand-600 mt-2">{result.market_overview?.opportunity_score}/100</div>
            </div>
          </div>
        </div>

        {/* Top Competitors */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-md mb-8 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg mb-5">🏆 {ca.topCompetitors || 'En İyi Rakipler'}</h3>
          <div className="space-y-4">
            {(result.top_competitors || []).map((comp, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${comp.threat_level === 'high' ? 'bg-red-500' : comp.threat_level === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}>{i + 1}</span>
                    <div>
                      {comp.website_url ? (
                        <a href={comp.website_url} target="_blank" rel="noopener noreferrer" className="font-bold text-base text-brand-600 hover:text-brand-700 hover:underline transition">
                          {comp.name} ↗
                        </a>
                      ) : (
                        <span className="font-bold text-base text-gray-800">{comp.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-bold text-brand-600">{comp.estimated_price}</span>
                    <span className="text-amber-500 font-semibold">★ {comp.estimated_rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <span className="text-xs text-green-600 font-bold uppercase">{ca.strengths || 'Güçlü Yönler'}</span>
                    {(comp.strengths || []).map((s, j) => (
                      <div key={j} className="text-sm text-gray-700 flex gap-2 mt-1"><span className="text-green-500 font-bold">+</span>{s}</div>
                    ))}
                  </div>
                  <div>
                    <span className="text-xs text-red-600 font-bold uppercase">{ca.weaknesses || 'Zayıf Yönler'}</span>
                    {(comp.weaknesses || []).map((w, j) => (
                      <div key={j} className="text-sm text-gray-700 flex gap-2 mt-1"><span className="text-red-500 font-bold">-</span>{w}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Analysis */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-md mb-8 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg mb-5">💰 {ca.priceAnalysis || 'Fiyat Analizi'}</h3>
          <div className="flex justify-between items-center mb-5">
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">{ca.lowest || 'En Düşük'}</div>
              <div className="text-lg font-bold text-green-600 mt-1">{result.price_analysis?.lowest}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">{ca.sweetSpot || 'İdeal Fiyat'}</div>
              <div className="text-2xl font-bold text-brand-600 mt-1">{result.price_analysis?.sweet_spot}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">{ca.highest || 'En Yüksek'}</div>
              <div className="text-lg font-bold text-red-600 mt-1">{result.price_analysis?.highest}</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-base text-gray-800 border border-blue-200">{result.price_analysis?.recommendation}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Keyword Gaps */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-4">🔑 {ca.keywordGaps || 'Anahtar Kelime Boşlukları'}</h3>
            <div className="space-y-3">
              {(result.keyword_gaps || []).map((k, i) => (
                <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-3 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-semibold text-gray-800">{k.keyword}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${k.opportunity === 'high' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {k.opportunity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{k.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiation Opportunities */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-4">🚀 {ca.diffOpps || 'Farklılaştırma Fırsatları'}</h3>
            <div className="space-y-3">
              {(result.differentiation_opportunities || []).map((d, i) => (
                <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-3 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-semibold text-gray-800">{d.area}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${d.impact === 'high' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {d.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg mb-6">📋 {ca.actionPlan || 'Aksiyon Planı'}</h3>
          <div className="space-y-4">
            {(result.action_plan || []).map((a, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${a.timeline === 'immediate' ? 'bg-red-500' : a.timeline === 'short-term' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                  {a.priority}
                </span>
                <div className="flex-1">
                  <div className="text-base font-bold text-gray-900">{a.action}</div>
                  <div className="text-sm text-gray-600 mt-1">{a.expected_impact}</div>
                  <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-block font-semibold ${a.timeline === 'immediate' ? 'bg-red-100 text-red-700' : a.timeline === 'short-term' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {a.timeline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Input Form
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl">⚔️</div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{ca.title || 'Rakip Analizi'}</h1>
          <p className="text-base text-gray-600 mt-1">{ca.subtitle || 'Ürünleriniz için yapay zeka destekli rakip istihbaratı'}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 text-base p-4 rounded-xl mb-6 border border-red-200 font-medium">{error}</div>}

      <div className="space-y-6 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">{ca.productLabel || 'Ürün / Niş'} *</label>
          <input className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition"
            placeholder={ca.productPlaceholder || 'ör: kablosuz kulaklık, yoga matı, protein tozу'}
            value={product} onChange={e => setProduct(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">{t?.common?.platform || 'Platform'}</label>
          <div className="flex gap-3 flex-wrap">
            {(platforms || []).map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`py-3 px-4 rounded-xl text-base font-semibold border-2 transition-all ${platform === p.id ? 'border-brand-500 bg-brand-50 text-brand-600 shadow-md' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">{ca.categoryLabel || 'Kategori'}</label>
          <input className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition"
            placeholder={ca.categoryPlaceholder || 'ör: Elektronik, Sağlık & Fitness'}
            value={category} onChange={e => setCategory(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">{ca.countryLabel || 'Ülke / Pazar'}</label>
          <select value={country} onChange={e => setCountry(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition bg-white">
            {COUNTRIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">{ca.competitorsLabel || 'Bilinen Rakipler'} <span className="text-gray-500 font-normal">({t?.common?.optional || 'isteğe bağlı'})</span></label>
          <input className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition"
            placeholder={ca.competitorsPlaceholder || 'ör: Sony, JBL, Bose'}
            value={competitors} onChange={e => setCompetitors(e.target.value)} />
        </div>
      </div>

      <button onClick={handleAnalyze} disabled={!product.trim()}
        className="w-full mt-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg">
        ⚔️ {ca.analyze || 'Rakipleri Analiz Et'}
      </button>

      {/* Pro badge */}
      <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
        <span className="text-sm font-bold text-amber-700">⚡ {ca.proBadge || 'PRO ÖZELLİK'}</span>
        <p className="text-base text-gray-700 mt-2">{ca.proBadgeDesc || 'Yapay zeka tarafından desteklenen derin rakip analizi. Pro planu ile kilidini açın.'}</p>
      </div>
    </div>
  )
}
