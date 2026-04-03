'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

function ScoreBar({ score, label, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function RakipAnalizPage() {
  const { t, platforms } = useI18n()
  const ca = t?.competitorAnalysis || {}
  const [product, setProduct] = useState('')
  const [platform, setPlatform] = useState(platforms?.[0]?.id || 'amazon')
  const [category, setCategory] = useState('')
  const [competitors, setCompetitors] = useState('')
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
        body: JSON.stringify({ product, platform, category, competitors }),
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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin-slow" />
        <p className="font-semibold">{ca.analyzing || 'Analyzing competition...'}</p>
        <p className="text-sm text-gray-400">{ca.analyzingDesc || 'Scanning market data, pricing, and competitors...'}</p>
      </div>
    )
  }

  if (result) {
    const os = result.overall_score || {}
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold">{ca.results || 'Competitive Analysis'}</h2>
            <p className="text-sm text-gray-500">"{product}" - {platform}</p>
          </div>
          <button onClick={() => setResult(null)} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition">
            ← {ca.newAnalysis || 'New Analysis'}
          </button>
        </div>

        {/* Score Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="font-bold text-sm mb-4">{ca.marketScores || 'Market Scores'}</h3>
          <div className="space-y-3">
            <ScoreBar score={os.market_opportunity || 0} label={ca.marketOpportunity || 'Market Opportunity'} color="#10b981" />
            <ScoreBar score={os.profit_potential || 0} label={ca.profitPotential || 'Profit Potential'} color="#6366f1" />
            <ScoreBar score={100 - (os.competition_intensity || 0)} label={ca.competitionEase || 'Competition Ease'} color="#f59e0b" />
            <ScoreBar score={100 - (os.entry_barrier || 0)} label={ca.entryEase || 'Entry Ease'} color="#8b5cf6" />
          </div>
        </div>

        {/* Market Overview */}
        <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-6 mb-6">
          <h3 className="font-bold text-sm mb-3">📊 {ca.marketOverview || 'Market Overview'}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/70 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">{ca.saturation || 'Saturation'}</div>
              <div className={`text-sm font-bold capitalize ${result.market_overview?.saturation_level === 'low' ? 'text-green-600' : result.market_overview?.saturation_level === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                {result.market_overview?.saturation_level}
              </div>
            </div>
            <div className="bg-white/70 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">{ca.trend || 'Trend'}</div>
              <div className={`text-sm font-bold capitalize ${result.market_overview?.growth_trend === 'growing' ? 'text-green-600' : 'text-amber-600'}`}>
                {result.market_overview?.growth_trend === 'growing' ? '📈' : result.market_overview?.growth_trend === 'declining' ? '📉' : '➡️'} {result.market_overview?.growth_trend}
              </div>
            </div>
            <div className="bg-white/70 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">{ca.opportunity || 'Opportunity'}</div>
              <div className="text-sm font-bold text-brand-600">{result.market_overview?.opportunity_score}/100</div>
            </div>
          </div>
        </div>

        {/* Top Competitors */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="font-bold text-sm mb-4">🏆 {ca.topCompetitors || 'Top Competitors'}</h3>
          <div className="space-y-3">
            {(result.top_competitors || []).map((comp, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${comp.threat_level === 'high' ? 'bg-red-500' : comp.threat_level === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}>{i + 1}</span>
                    <span className="font-semibold text-sm">{comp.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-brand-600">{comp.estimated_price}</span>
                    <span className="text-amber-500">★ {comp.estimated_rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[10px] text-green-600 font-semibold">{ca.strengths || 'Strengths'}</span>
                    {(comp.strengths || []).map((s, j) => (
                      <div key={j} className="text-xs text-gray-600 flex gap-1"><span className="text-green-500">+</span>{s}</div>
                    ))}
                  </div>
                  <div>
                    <span className="text-[10px] text-red-600 font-semibold">{ca.weaknesses || 'Weaknesses'}</span>
                    {(comp.weaknesses || []).map((w, j) => (
                      <div key={j} className="text-xs text-gray-600 flex gap-1"><span className="text-red-500">-</span>{w}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Analysis */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="font-bold text-sm mb-3">💰 {ca.priceAnalysis || 'Price Analysis'}</h3>
          <div className="flex justify-between items-center mb-3">
            <div className="text-center">
              <div className="text-xs text-gray-500">{ca.lowest || 'Lowest'}</div>
              <div className="text-sm font-bold text-green-600">{result.price_analysis?.lowest}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">{ca.sweetSpot || 'Sweet Spot'}</div>
              <div className="text-lg font-bold text-brand-600">{result.price_analysis?.sweet_spot}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">{ca.highest || 'Highest'}</div>
              <div className="text-sm font-bold text-red-600">{result.price_analysis?.highest}</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-sm">{result.price_analysis?.recommendation}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Keyword Gaps */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">🔑 {ca.keywordGaps || 'Keyword Gaps'}</h3>
            <div className="space-y-2">
              {(result.keyword_gaps || []).map((k, i) => (
                <div key={i} className="bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{k.keyword}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${k.opportunity === 'high' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {k.opportunity}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{k.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiation Opportunities */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">🚀 {ca.diffOpps || 'Differentiation Opportunities'}</h3>
            <div className="space-y-2">
              {(result.differentiation_opportunities || []).map((d, i) => (
                <div key={i} className="bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">{d.area}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${d.impact === 'high' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {d.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-sm mb-4">📋 {ca.actionPlan || 'Action Plan'}</h3>
          <div className="space-y-3">
            {(result.action_plan || []).map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${a.timeline === 'immediate' ? 'bg-red-500' : a.timeline === 'short-term' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                  {a.priority}
                </span>
                <div>
                  <div className="text-sm font-semibold">{a.action}</div>
                  <div className="text-xs text-gray-500">{a.expected_impact}</div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${a.timeline === 'immediate' ? 'bg-red-50 text-red-600' : a.timeline === 'short-term' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
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
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-lg">⚔️</div>
        <div>
          <h2 className="text-lg font-bold">{ca.title || 'Competitor Analysis'}</h2>
          <p className="text-xs text-gray-400">{ca.subtitle || 'AI-powered competitive intelligence for your products'}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{ca.productLabel || 'Product / Niche'} *</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder={ca.productPlaceholder || 'e.g., wireless earbuds, yoga mat, protein powder'}
            value={product} onChange={e => setProduct(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.common?.platform || 'Platform'}</label>
          <div className="flex gap-2 flex-wrap">
            {(platforms || []).map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`py-2 px-3 rounded-xl text-sm font-semibold border-2 transition ${platform === p.id ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-gray-200 text-gray-400'}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{ca.categoryLabel || 'Category'}</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder={ca.categoryPlaceholder || 'e.g., Electronics, Health & Fitness'}
            value={category} onChange={e => setCategory(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{ca.competitorsLabel || 'Known Competitors'} ({t?.common?.optional || 'optional'})</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder={ca.competitorsPlaceholder || 'e.g., Sony, JBL, Bose'}
            value={competitors} onChange={e => setCompetitors(e.target.value)} />
        </div>
      </div>

      <button onClick={handleAnalyze} disabled={!product.trim()}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-base">
        ⚔️ {ca.analyze || 'Analyze Competition'}
      </button>

      {/* Pro badge */}
      <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-4 text-center">
        <span className="text-xs font-bold text-amber-700">⚡ {ca.proBadge || 'PRO Feature'}</span>
        <p className="text-[10px] text-gray-500 mt-1">{ca.proBadgeDesc || 'Deep competitive analysis powered by AI. Unlock with Pro plan.'}</p>
      </div>
    </div>
  )
}
