'use client'
import { useState } from 'react'

const CATEGORIES = [
  'Elektronik', 'Moda - Kadın', 'Moda - Erkek', 'Ev & Yaşam', 'Kozmetik',
  'Spor & Outdoor', 'Kitap & Hobi', 'Anne & Bebek', 'Gıda & İçecek', 'Oto & Bahçe'
]

const PLATFORMS = [
  { id: 'trendyol', name: 'Trendyol', color: 'orange' },
  { id: 'hepsiburada', name: 'Hepsiburada', color: 'orange' },
  { id: 'n11', name: 'N11', color: 'purple' },
]

function SeoScoreCircle({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const label = score >= 80 ? 'Mükemmel' : score >= 60 ? 'İyi' : 'Düşük'
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
          <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${score}, 100`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color }}>{score}</span>
      </div>
      <div>
        <div className="font-semibold text-sm">SEO Skoru</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy}
      className="px-3 py-1 text-xs font-semibold border border-gray-200 rounded-lg text-brand-500 hover:bg-brand-50 transition">
      {copied ? '✓ Kopyalandı!' : label || 'Kopyala'}
    </button>
  )
}

function ResultCard({ platform, result }) {
  const platformColors = { trendyol: 'text-orange-500', hepsiburada: 'text-orange-600', n11: 'text-purple-600' }

  return (
    <div className="space-y-5">
      {/* SEO Score */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <SeoScoreCircle score={result.seo_score} />
        {result.seo_tips && (
          <div className="mt-4 space-y-1">
            {result.seo_tips.map((tip, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className={tip.ok ? 'text-green-500' : 'text-amber-500'}>{tip.ok ? '✓' : '!'}</span>
                <span className="text-gray-600">{tip.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm">🎯 Ürün Başlığı</span>
          <CopyButton text={result.title} />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-sm leading-relaxed font-medium">{result.title}</div>
        <div className="text-xs text-gray-400 mt-2">{result.title.length} karakter</div>
      </div>

      {/* Bullets */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm">📋 Öne Çıkan Özellikler</span>
          <CopyButton text={result.bullets.join('\n')} label="Tümünü Kopyala" />
        </div>
        <div className="space-y-2">
          {result.bullets.map((b, i) => (
            <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-sm leading-relaxed flex gap-2">
              <span className="text-brand-500 font-bold">•</span>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm">📝 Ürün Açıklaması</span>
          <CopyButton text={result.description} />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-sm leading-relaxed">{result.description}</div>
      </div>
    </div>
  )
}

export default function YeniListingPage() {
  const [form, setForm] = useState({
    name: '', brand: '', category: CATEGORIES[0],
    features: '', keywords: '', platforms: ['trendyol']
  })
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('trendyol')
  const [error, setError] = useState('')

  const togglePlatform = (id) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter(p => p !== id)
        : [...prev.platforms, id]
    }))
  }

  const canSubmit = form.name.trim() && form.features.trim() && form.platforms.length > 0

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setLoadingStep(0)

    const steps = 5
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => prev < steps - 1 ? prev + 1 : prev)
    }, 800)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')

      setResults(data.results)
      setActiveTab(form.platforms[0])
    } catch (err) {
      setError(err.message)
    } finally {
      clearInterval(stepInterval)
      setLoading(false)
    }
  }

  // Loading screen
  if (loading) {
    const steps = [
      'Ürün özellikleri analiz ediliyor...',
      'SEO anahtar kelimeleri belirleniyor...',
      'Platform formatları uygulanıyor...',
      'Başlık ve açıklamalar üretiliyor...',
      'SEO skoru hesaplanıyor...'
    ]
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin-slow" />
        <div className="space-y-3 min-w-[280px]">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 transition-opacity ${i <= loadingStep ? 'opacity-100' : 'opacity-20'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i < loadingStep ? 'bg-green-500' : i === loadingStep ? 'bg-brand-500' : 'bg-gray-300'}`}>
                {i < loadingStep ? '✓' : i + 1}
              </span>
              <span className="text-sm">{s}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Results screen
  if (results) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold">✅ Listingler Hazır!</h2>
            <p className="text-gray-500 text-sm">{form.platforms.length} platform için optimize edildi.</p>
          </div>
          <button onClick={() => { setResults(null); setForm({ ...form, name: '', brand: '', features: '', keywords: '' }) }}
            className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition">
            ← Yeni Listing
          </button>
        </div>

        {/* Platform tabs */}
        {form.platforms.length > 1 && (
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {form.platforms.map(pid => {
              const plat = PLATFORMS.find(p => p.id === pid)
              return (
                <button key={pid} onClick={() => setActiveTab(pid)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${activeTab === pid ? 'bg-white shadow-sm text-brand-500' : 'text-gray-500'}`}>
                  {plat.name}
                </button>
              )
            })}
          </div>
        )}

        {results[activeTab] && <ResultCard platform={activeTab} result={results[activeTab]} />}
      </div>
    )
  }

  // Form screen
  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-1">📦 Ürün Bilgilerini Gir</h2>
      <p className="text-gray-500 text-sm mb-6">Ne kadar detay verirsen, listing o kadar güçlü olur.</p>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Ürün Adı *</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="örn: Samsung Galaxy Buds2 Pro"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Marka</label>
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="örn: Samsung"
              value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
              value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Ürün Özellikleri *</label>
          <textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[100px] resize-y"
            placeholder={"Her özelliği yeni satıra yaz:\n- Aktif gürültü önleme\n- IPX7 su geçirmez\n- 29 saat pil ömrü"}
            value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Hedef Anahtar Kelimeler (opsiyonel)</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="örn: kablosuz kulaklık, bluetooth kulaklık"
            value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Platform Seçimi *</label>
          <div className="flex gap-2 mt-1">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => togglePlatform(p.id)} type="button"
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition ${form.platforms.includes(p.id) ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-gray-200 text-gray-400'}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!canSubmit}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-base">
        ✨ Listing Oluştur
      </button>
    </div>
  )
}
