'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-brand-500 hover:bg-brand-50">
      {copied ? '✓' : label}
    </button>
  )
}

function KeywordBadge({ volume, competition, t }) {
  const volumeLabel = t?.keywords?.[`${volume}`] || volume
  const competitionLabel = t?.keywords?.[`${competition}`] || competition
  const vColor = volume === 'high' ? 'bg-green-100 text-green-700' : volume === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
  const cColor = competition === 'low' ? 'bg-green-100 text-green-700' : competition === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
  return (
    <div className="flex gap-1">
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${vColor}`}>{t?.keywords?.volume}: {volumeLabel}</span>
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${cColor}`}>{t?.keywords?.competition}: {competitionLabel}</span>
    </div>
  )
}

export default function AnahtarKelimePage() {
  const { t, platforms } = useI18n()
  const categories = t?.categories || []
  const [product, setProduct] = useState('')
  const [category, setCategory] = useState('')
  const [platform, setPlatform] = useState('all')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!product.trim()) return
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, category, platform }),
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
        <p className="font-semibold">{t?.keywords?.loading}</p>
        <p className="text-sm text-gray-400">{t?.keywords?.loadingDesc}</p>
      </div>
    )
  }

  if (result) {
    const allKeywords = [...(result.primary_keywords || []), ...(result.long_tail || [])].map(k => k.keyword)

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">{t?.keywords?.results}</h2>
            <p className="text-sm text-gray-500">"{product}" {t?.keywords?.found} {allKeywords.length}</p>
          </div>
          <div className="flex gap-2">
            <CopyBtn text={allKeywords.join(', ')} label={t?.common?.copy} />
            <button onClick={() => setResult(null)} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              ← {t?.common?.newSearch}
            </button>
          </div>
        </div>

        {/* Ana Anahtar Kelimeler */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="font-bold text-sm mb-3">🎯 {t?.keywords?.primaryKw}</h3>
          <div className="space-y-2">
            {(result.primary_keywords || []).map((k, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm font-medium">{k.keyword}</span>
                </div>
                <div className="flex items-center gap-2">
                  <KeywordBadge volume={k.volume} competition={k.competition} t={t} />
                  <div className="flex items-center gap-0.5">
                    {[...Array(10)].map((_, j) => (
                      <div key={j} className={`w-1.5 h-3 rounded-sm ${j < k.relevance ? 'bg-brand-500' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uzun kuyruklu */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="font-bold text-sm mb-3">🔗 {t?.keywords?.longTail}</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {(result.long_tail || []).map((k, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                <span className="text-sm">{k.keyword}</span>
                <KeywordBadge volume={k.volume} competition={k.competition} t={t} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Trend olanlar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">🔥 {t?.keywords?.trending}</h3>
            <div className="space-y-2">
              {(result.trending || []).map((k, i) => (
                <div key={i} className="flex items-center gap-2 bg-orange-50 rounded-xl px-4 py-2.5">
                  <span className="text-orange-500">📈</span>
                  <span className="text-sm font-medium">{k.keyword}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Negatif kelimeler */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">🚫 {t?.keywords?.negative}</h3>
            <p className="text-xs text-gray-400 mb-2">{t?.keywords?.negativeNote}</p>
            <div className="space-y-2">
              {(result.negative || []).map((word, i) => (
                <div key={i} className="flex items-center gap-2 bg-red-50 rounded-xl px-4 py-2.5">
                  <span className="text-red-400">✕</span>
                  <span className="text-sm text-red-600">{word}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Başlık önerisi */}
        {result.title_suggestion && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">💡 {t?.keywords?.suggestedTitle}</h3>
              <CopyBtn text={result.title_suggestion} label={t?.common?.copy} />
            </div>
            <div className="bg-brand-50 rounded-xl p-4 text-sm font-medium text-brand-800">{result.title_suggestion}</div>
          </div>
        )}

        {/* SEO İpuçları */}
        {result.tips?.length > 0 && (
          <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-6">
            <h3 className="font-bold text-sm mb-3">💡 {t?.keywords?.seoTips}</h3>
            <div className="space-y-2">
              {result.tips.map((tip, i) => (
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

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-lg">🔑</div>
        <div>
          <h2 className="text-lg font-bold">{t?.keywords?.title}</h2>
          <p className="text-xs text-gray-400">{t?.keywords?.subtitle}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.keywords?.product} *</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="örn: kablosuz kulaklık, yoga matı, protein tozu..."
            value={product} onChange={e => setProduct(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.newListing?.category}</label>
          <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">...</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.keywords?.platform}</label>
          <div className="flex gap-2">
            {[{ id: 'all', name: t?.common?.all }, ...(platforms || [])].map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border-2 transition ${platform === p.id ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-gray-200 text-gray-400'}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSearch} disabled={!product.trim()}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 text-base">
        🔍 {t?.keywords?.research}
      </button>
    </div>
  )
}
