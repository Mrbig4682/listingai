'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

function ScoreCircle({ score, label, color }) {
  const c = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
          <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke={c} strokeWidth="3"
            strokeDasharray={`${score}, 100`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: c }}>{score}</span>
      </div>
      <span className="text-[10px] text-gray-500 mt-1 text-center">{label}</span>
    </div>
  )
}

function CopyBtn({ text, t }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-brand-500 hover:bg-brand-50">
      {copied ? '✓' : t?.common?.copy || 'Copy'}
    </button>
  )
}

export default function MarkaDnaPage() {
  const { t } = useI18n()
  const bd = t?.brandDna || {}
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url.trim()) return
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/brand-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
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
        <p className="font-semibold">{bd.analyzing || 'Analyzing brand DNA...'}</p>
        <p className="text-sm text-gray-400">{bd.analyzingDesc || 'Scanning website, extracting brand identity...'}</p>
      </div>
    )
  }

  if (result) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold">{result.brand_name}</h2>
            <p className="text-sm text-gray-500">{result.tagline}</p>
          </div>
          <button onClick={() => setResult(null)} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition">
            ← {bd.newAnalysis || 'New Analysis'}
          </button>
        </div>

        {/* Brand Scores */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="font-bold text-sm mb-4">{bd.brandScore || 'Brand Score'}</h3>
          <div className="flex justify-around">
            <ScoreCircle score={result.brand_score?.overall || 0} label={bd.overall || 'Overall'} />
            <ScoreCircle score={result.brand_score?.online_presence || 0} label={bd.onlinePresence || 'Online Presence'} />
            <ScoreCircle score={result.brand_score?.brand_clarity || 0} label={bd.brandClarity || 'Brand Clarity'} />
            <ScoreCircle score={result.brand_score?.market_fit || 0} label={bd.marketFit || 'Market Fit'} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Brand Personality */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">🎭 {bd.personality || 'Brand Personality'}</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">{bd.archetype || 'Archetype'}</span>
                <p className="text-sm font-semibold text-brand-600">{result.brand_personality?.archetype}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">{bd.toneOfVoice || 'Tone of Voice'}</span>
                <p className="text-sm">{result.brand_personality?.tone_of_voice}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(result.brand_personality?.traits || []).map((trait, i) => (
                  <span key={i} className="px-2.5 py-1 bg-brand-50 text-brand-600 text-xs font-semibold rounded-lg">{trait}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">🎯 {bd.targetAudience || 'Target Audience'}</h3>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500">{bd.primary || 'Primary'}</span>
                <p className="text-sm font-medium">{result.target_audience?.primary}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">{bd.demographics || 'Demographics'}</span>
                <p className="text-sm">{result.target_audience?.demographics}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">{bd.psychographics || 'Psychographics'}</span>
                <p className="text-sm">{result.target_audience?.psychographics}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Value Proposition */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">💎 {bd.valueProp || 'Value Proposition'}</h3>
            <p className="text-sm font-medium mb-3">{result.value_proposition?.main}</p>
            <div className="space-y-1.5">
              {(result.value_proposition?.differentiators || []).map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Positioning */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">📊 {bd.positioning || 'Market Positioning'}</h3>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500">{bd.segment || 'Segment'}</span>
                <p className="text-sm font-semibold capitalize">{result.market_positioning?.segment}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">{bd.competitiveAdv || 'Competitive Advantage'}</span>
                <p className="text-sm">{result.market_positioning?.competitive_advantage}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">{bd.competitors || 'Competitors'}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(result.market_positioning?.competitors || []).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-lg">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listing Recommendations - THE KILLER FEATURE */}
        <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-6 mb-6">
          <h3 className="font-bold text-sm mb-4">✨ {bd.listingRecs || 'Listing Recommendations'}</h3>
          <div className="space-y-4">
            <div className="bg-white/70 rounded-xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-500">{bd.recTone || 'Recommended Tone'}</span>
              </div>
              <p className="text-sm">{result.listing_recommendations?.tone}</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-500">{bd.keywordStrategy || 'Keyword Strategy'}</span>
              </div>
              <p className="text-sm">{result.listing_recommendations?.keywords_strategy}</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500">{bd.sampleTitle || 'Sample Title Template'}</span>
                <CopyBtn text={result.listing_recommendations?.sample_title_template || ''} t={t} />
              </div>
              <p className="text-sm font-medium text-brand-700">{result.listing_recommendations?.sample_title_template}</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500">{bd.sampleBullets || 'Sample Bullets'}</span>
                <CopyBtn text={(result.listing_recommendations?.sample_bullets || []).join('\n')} t={t} />
              </div>
              <div className="space-y-1">
                {(result.listing_recommendations?.sample_bullets || []).map((b, i) => (
                  <div key={i} className="text-sm flex gap-2">
                    <span className="text-brand-500">•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Identity */}
        {result.visual_identity && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <h3 className="font-bold text-sm mb-3">🎨 {bd.visualIdentity || 'Visual Identity'}</h3>
            <p className="text-sm mb-3">{result.visual_identity.style}</p>
            <div className="flex gap-2">
              {(result.visual_identity.color_palette || []).map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-500 font-mono">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvement Tips */}
        {result.improvement_tips?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">💡 {bd.tips || 'Improvement Tips'}</h3>
            <div className="space-y-2">
              {result.improvement_tips.map((tip, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-brand-500 font-bold">{i + 1}.</span>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Input form
  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-lg">🧬</div>
        <div>
          <h2 className="text-lg font-bold">{bd.title || 'Brand DNA Analyzer'}</h2>
          <p className="text-xs text-gray-400">{bd.subtitle || 'Enter your website URL to extract your brand identity'}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{bd.urlLabel || 'Website URL or App Link'} *</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="https://www.example.com"
            value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()} />
          <p className="text-[10px] text-gray-400 mt-1">{bd.urlHint || 'Enter your website, online store, or app store link'}</p>
        </div>
      </div>

      <button onClick={handleAnalyze} disabled={!url.trim()}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-base">
        🧬 {bd.analyze || 'Analyze Brand DNA'}
      </button>

      {/* Info cards */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <span className="text-2xl mb-2 block">🎭</span>
          <h4 className="text-xs font-bold">{bd.infoPersonality || 'Brand Personality'}</h4>
          <p className="text-[10px] text-gray-400 mt-1">{bd.infoPersonalityDesc || 'Discover your brand archetype and tone'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <span className="text-2xl mb-2 block">🎯</span>
          <h4 className="text-xs font-bold">{bd.infoAudience || 'Target Audience'}</h4>
          <p className="text-[10px] text-gray-400 mt-1">{bd.infoAudienceDesc || 'Understand who your customers are'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <span className="text-2xl mb-2 block">📊</span>
          <h4 className="text-xs font-bold">{bd.infoPositioning || 'Market Position'}</h4>
          <p className="text-[10px] text-gray-400 mt-1">{bd.infoPositioningDesc || 'See where you stand vs competitors'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <span className="text-2xl mb-2 block">✨</span>
          <h4 className="text-xs font-bold">{bd.infoListings || 'Listing Strategy'}</h4>
          <p className="text-[10px] text-gray-400 mt-1">{bd.infoListingsDesc || 'Get AI-powered listing recommendations'}</p>
        </div>
      </div>
    </div>
  )
}
