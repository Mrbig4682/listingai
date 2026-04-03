'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'
import { marketPlatforms, getMarketFromLocale } from '@/lib/i18n/translations'

function CopyBtn({ text, copiedText }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-brand-500 hover:bg-brand-50 transition">
      {copied ? '✓' : copiedText}
    </button>
  )
}

export default function OptimizerPage() {
  const { t, locale, platforms } = useI18n()
  const [platform, setPlatform] = useState('trendyol')
  const [title, setTitle] = useState('')
  const [bullets, setBullets] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleOptimize = async () => {
    if (!title && !description) { setError(t.common.error || 'Başlık veya açıklama girin.'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, bullets, description, platform }),
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

  const scoreColor = (s) => s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-500'
  const scoreBg = (s) => s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500'

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin-slow" />
        <div className="text-center">
          <p className="font-semibold">{t.common.loading || "AI listing'inizi analiz ediyor..."}</p>
          <p className="text-sm text-gray-400 mt-1">Sorunlar tespit ediliyor, optimize ediliyor</p>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t.optimizer.result}</h2>
          <button onClick={() => setResult(null)} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition">
            ← {t.optimizer.newAnalysis}
          </button>
        </div>

        {/* Skor karşılaştırması */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className={`text-4xl font-extrabold ${scoreColor(result.current_score)}`}>{result.current_score}</div>
              <div className="text-xs text-gray-500 mt-1">{t.optimizer.currentScore}</div>
            </div>
            <div className="text-3xl text-gray-300">→</div>
            <div className="text-center">
              <div className={`text-4xl font-extrabold ${scoreColor(result.new_score)}`}>{result.new_score}</div>
              <div className="text-xs text-gray-500 mt-1">{t.optimizer.newScore}</div>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
              +{result.new_score - result.current_score} {t.optimizer.points}
            </div>
          </div>
          {result.summary && <p className="text-sm text-gray-600 text-center mt-4">{result.summary}</p>}
        </div>

        {/* Sorunlar */}
        {result.issues?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <h3 className="font-bold text-sm mb-3">{t.optimizer.issues}</h3>
            <div className="space-y-3">
              {result.issues.map((issue, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">!</div>
                  <div>
                    <div className="font-semibold text-gray-800">{issue.problem}</div>
                    <div className="text-gray-500 mt-0.5">💡 {issue.suggestion}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimize edilmiş başlık */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">{t.optimizer.optimizedTitle}</h3>
            <CopyBtn text={result.optimized_title} copiedText={t.common.copied} />
          </div>
          {title && (
            <div className="bg-red-50 rounded-xl p-3 text-sm text-gray-500 mb-2 line-through">{title}</div>
          )}
          <div className="bg-green-50 rounded-xl p-3 text-sm font-medium text-gray-800">{result.optimized_title}</div>
        </div>

        {/* Optimize edilmiş bullet points */}
        {result.optimized_bullets?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">{t.optimizer.optimizedBullets}</h3>
              <CopyBtn text={result.optimized_bullets.join('\n')} copiedText={t.common.copied} />
            </div>
            <div className="space-y-2">
              {result.optimized_bullets.map((b, i) => (
                <div key={i} className="bg-green-50 rounded-xl px-4 py-2.5 text-sm flex gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimize edilmiş açıklama */}
        {result.optimized_description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">{t.optimizer.optimizedDesc}</h3>
              <CopyBtn text={result.optimized_description} copiedText={t.common.copied} />
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-sm leading-relaxed">{result.optimized_description}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-lg">⚡</div>
        <div>
          <h2 className="text-lg font-bold">{t.optimizer.title}</h2>
          <p className="text-xs text-gray-400">{t.optimizer.subtitle}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Platform</label>
          <div className="flex gap-2">
            {platforms.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border-2 transition ${platform === p.id ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-gray-200 text-gray-400'}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t.optimizer.currentTitle}</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Mevcut ürün başlığını yapıştırın..."
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t.optimizer.currentBullets}</label>
          <textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[80px] resize-y"
            placeholder="Her özelliği yeni satıra yazın..."
            value={bullets} onChange={e => setBullets(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t.optimizer.currentDesc}</label>
          <textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[100px] resize-y"
            placeholder="Mevcut ürün açıklamasını yapıştırın..."
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>

      <button onClick={handleOptimize} disabled={!title && !description}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 text-base">
        ⚡ {t.optimizer.optimize}
      </button>
    </div>
  )
}
