'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

function CopyBtn({ text, t }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-brand-500 hover:bg-brand-50">
      {copied ? '✓' : t?.common?.copy || 'Copy'}
    </button>
  )
}

function ScoreCompare({ label, scoreA, scoreB }) {
  const winnerA = scoreA > scoreB
  const winnerB = scoreB > scoreA
  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 text-right ${winnerA ? 'font-bold text-green-600' : 'text-gray-500'}`}>
        <span className="text-sm">{scoreA}</span>
      </div>
      <div className="w-24 text-center text-xs text-gray-400 font-medium">{label}</div>
      <div className={`flex-1 text-left ${winnerB ? 'font-bold text-green-600' : 'text-gray-500'}`}>
        <span className="text-sm">{scoreB}</span>
      </div>
    </div>
  )
}

export default function AbTestPage() {
  const { t, platforms } = useI18n()
  const ab = t?.abTest || {}
  const [platform, setPlatform] = useState(platforms?.[0]?.id || 'amazon')
  const [titleA, setTitleA] = useState('')
  const [titleB, setTitleB] = useState('')
  const [bulletsA, setBulletsA] = useState('')
  const [bulletsB, setBulletsB] = useState('')
  const [descA, setDescA] = useState('')
  const [descB, setDescB] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const canSubmit = (titleA.trim() || bulletsA.trim() || descA.trim()) && (titleB.trim() || bulletsB.trim() || descB.trim())

  const handleCompare = async () => {
    if (!canSubmit) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleA, titleB, bulletsA, bulletsB, descA, descB, platform }),
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
        <p className="font-semibold">{ab.comparing || 'Comparing listings...'}</p>
        <p className="text-sm text-gray-400">{ab.comparingDesc || 'AI is analyzing both versions in detail...'}</p>
      </div>
    )
  }

  if (result) {
    const va = result.version_a || {}
    const vb = result.version_b || {}
    const comp = result.comparison || {}
    const winner = comp.winner

    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold">{ab.results || 'A/B Test Results'}</h2>
            <p className="text-sm text-gray-500">{ab.winnerIs || 'Winner'}: <span className="font-bold text-green-600">{ab.version || 'Version'} {winner}</span></p>
          </div>
          <button onClick={() => setResult(null)} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition">
            ← {ab.newTest || 'New Test'}
          </button>
        </div>

        {/* Score Comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className={`text-sm font-bold px-3 py-1 rounded-lg ${winner === 'A' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {ab.versionA || 'Version A'} ({va.overall_score})
            </span>
            <span className="text-xs text-gray-400 font-bold">VS</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-lg ${winner === 'B' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {ab.versionB || 'Version B'} ({vb.overall_score})
            </span>
          </div>
          <div className="space-y-2">
            <ScoreCompare label="SEO" scoreA={va.seo_score} scoreB={vb.seo_score} />
            <ScoreCompare label={ab.readability || 'Readability'} scoreA={va.readability_score} scoreB={vb.readability_score} />
            <ScoreCompare label={ab.conversion || 'Conversion'} scoreA={va.conversion_score} scoreB={vb.conversion_score} />
            <ScoreCompare label={ab.keywords || 'Keywords'} scoreA={va.keyword_density} scoreB={vb.keyword_density} />
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={`bg-white rounded-2xl border p-6 shadow-sm ${winner === 'A' ? 'border-green-200' : 'border-gray-100'}`}>
            <h3 className="font-bold text-sm mb-3">{ab.versionA || 'Version A'}</h3>
            <div className="mb-3">
              <span className="text-[10px] text-green-600 font-semibold">{ab.strengths || 'Strengths'}</span>
              {(va.strengths || []).map((s, i) => (
                <div key={i} className="text-xs text-gray-600 flex gap-1 mt-0.5"><span className="text-green-500">✓</span>{s}</div>
              ))}
            </div>
            <div>
              <span className="text-[10px] text-red-600 font-semibold">{ab.weaknesses || 'Weaknesses'}</span>
              {(va.weaknesses || []).map((w, i) => (
                <div key={i} className="text-xs text-gray-600 flex gap-1 mt-0.5"><span className="text-red-500">✕</span>{w}</div>
              ))}
            </div>
          </div>
          <div className={`bg-white rounded-2xl border p-6 shadow-sm ${winner === 'B' ? 'border-green-200' : 'border-gray-100'}`}>
            <h3 className="font-bold text-sm mb-3">{ab.versionB || 'Version B'}</h3>
            <div className="mb-3">
              <span className="text-[10px] text-green-600 font-semibold">{ab.strengths || 'Strengths'}</span>
              {(vb.strengths || []).map((s, i) => (
                <div key={i} className="text-xs text-gray-600 flex gap-1 mt-0.5"><span className="text-green-500">✓</span>{s}</div>
              ))}
            </div>
            <div>
              <span className="text-[10px] text-red-600 font-semibold">{ab.weaknesses || 'Weaknesses'}</span>
              {(vb.weaknesses || []).map((w, i) => (
                <div key={i} className="text-xs text-gray-600 flex gap-1 mt-0.5"><span className="text-red-500">✕</span>{w}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Category comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="font-bold text-sm mb-3">{ab.detailedComp || 'Detailed Comparison'}</h3>
          <div className="space-y-3">
            {(comp.detailed_comparison || []).map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${c.winner === 'A' ? 'bg-blue-500' : 'bg-purple-500'}`}>{c.winner}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{c.category}</div>
                  <div className="text-xs text-gray-500">{c.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Merged Best Version */}
        {result.merged_best && (
          <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">✨ {ab.bestVersion || 'Best Combined Version'}</h3>
            </div>
            {result.merged_best.title && (
              <div className="bg-white/70 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-500">{t?.newListing?.productTitle || 'Title'}</span>
                  <CopyBtn text={result.merged_best.title} t={t} />
                </div>
                <p className="text-sm font-medium">{result.merged_best.title}</p>
              </div>
            )}
            {result.merged_best.bullets?.length > 0 && (
              <div className="bg-white/70 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-500">{t?.newListing?.highlights || 'Bullets'}</span>
                  <CopyBtn text={result.merged_best.bullets.join('\n')} t={t} />
                </div>
                <div className="space-y-1">
                  {result.merged_best.bullets.map((b, i) => (
                    <div key={i} className="text-sm flex gap-2"><span className="text-brand-500">•</span>{b}</div>
                  ))}
                </div>
              </div>
            )}
            {result.merged_best.description && (
              <div className="bg-white/70 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-500">{t?.newListing?.description || 'Description'}</span>
                  <CopyBtn text={result.merged_best.description} t={t} />
                </div>
                <p className="text-sm leading-relaxed">{result.merged_best.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3">💡 {ab.recommendations || 'Recommendations'}</h3>
            <div className="space-y-2">
              {result.recommendations.map((r, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-brand-500 font-bold">{i + 1}.</span>
                  <span className="text-gray-700">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Input Form
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-lg">⚖️</div>
        <div>
          <h2 className="text-lg font-bold">{ab.title || 'A/B Test'}</h2>
          <p className="text-xs text-gray-400">{ab.subtitle || 'Compare two listing versions and find the winner'}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      {/* Platform */}
      <div className="mb-4">
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

      <div className="grid md:grid-cols-2 gap-4">
        {/* Version A */}
        <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
          <h3 className="font-bold text-sm text-blue-600 mb-3">{ab.versionA || 'Version A'}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold">{t?.newListing?.productTitle || 'Title'}</label>
              <textarea className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y min-h-[60px]"
                placeholder={ab.titlePlaceholder || 'Paste listing title...'} value={titleA} onChange={e => setTitleA(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold">{t?.newListing?.highlights || 'Bullets'}</label>
              <textarea className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y min-h-[80px]"
                placeholder={ab.bulletsPlaceholder || 'Paste bullet points...'} value={bulletsA} onChange={e => setBulletsA(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold">{t?.newListing?.description || 'Description'}</label>
              <textarea className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y min-h-[80px]"
                placeholder={ab.descPlaceholder || 'Paste description...'} value={descA} onChange={e => setDescA(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Version B */}
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
          <h3 className="font-bold text-sm text-purple-600 mb-3">{ab.versionB || 'Version B'}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold">{t?.newListing?.productTitle || 'Title'}</label>
              <textarea className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y min-h-[60px]"
                placeholder={ab.titlePlaceholder || 'Paste listing title...'} value={titleB} onChange={e => setTitleB(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold">{t?.newListing?.highlights || 'Bullets'}</label>
              <textarea className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y min-h-[80px]"
                placeholder={ab.bulletsPlaceholder || 'Paste bullet points...'} value={bulletsB} onChange={e => setBulletsB(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold">{t?.newListing?.description || 'Description'}</label>
              <textarea className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y min-h-[80px]"
                placeholder={ab.descPlaceholder || 'Paste description...'} value={descB} onChange={e => setDescB(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleCompare} disabled={!canSubmit}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-base">
        ⚖️ {ab.compare || 'Compare Listings'}
      </button>
    </div>
  )
}
