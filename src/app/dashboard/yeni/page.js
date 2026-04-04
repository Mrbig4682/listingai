'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

function SeoScoreCircle({ score, t }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const labelMap = {
    perfect: t?.newListing?.seoScore?.perfect || 'Mükemmel',
    good: t?.newListing?.seoScore?.good || 'İyi',
    low: t?.newListing?.seoScore?.low || 'Düşük'
  }
  const label = score >= 80 ? labelMap.perfect : score >= 60 ? labelMap.good : labelMap.low
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
        <div className="font-semibold text-sm">{t?.newListing?.seoScore || 'SEO Skoru'}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

function CopyButton({ text, label, t }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy}
      className="px-3 py-1 text-xs font-semibold border border-gray-200 rounded-lg text-brand-500 hover:bg-brand-50 transition">
      {copied ? `✓ ${t?.common?.copied || 'Kopyalandı!'}` : label || t?.common?.copy || 'Kopyala'}
    </button>
  )
}

function ResultCard({ platform, result, t }) {
  const platformColors = { trendyol: 'text-orange-500', hepsiburada: 'text-orange-600', n11: 'text-purple-600' }

  return (
    <div className="space-y-5">
      {/* SEO Score */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <SeoScoreCircle score={result.seo_score} t={t} />
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
          <span className="font-bold text-sm">🎯 {t?.newListing?.productTitle || 'Ürün Başlığı'}</span>
          <CopyButton text={result.title} t={t} />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-sm leading-relaxed font-medium">{result.title}</div>
        <div className="text-xs text-gray-400 mt-2">{result.title.length} {t?.newListing?.chars || 'karakter'}</div>
      </div>

      {/* Bullets */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm">📋 {t?.newListing?.highlights || 'Öne Çıkan Özellikler'}</span>
          <CopyButton text={result.bullets.join('\n')} label={t?.common?.copyAll || 'Tümünü Kopyala'} t={t} />
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
          <span className="font-bold text-sm">📝 {t?.newListing?.description || 'Ürün Açıklaması'}</span>
          <CopyButton text={result.description} t={t} />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-sm leading-relaxed">{result.description}</div>
      </div>
    </div>
  )
}

export default function YeniListingPage() {
  const { t, locale, platforms } = useI18n()
  const categories = t?.categories || []

  const marketplaceGroups = {
    tr: { label: '🇹🇷 Türkiye', platforms: ['trendyol', 'hepsiburada', 'n11'] },
    us: { label: '🇺🇸 ABD / Global', platforms: ['amazon', 'ebay', 'etsy', 'shopify', 'walmart'] },
    eu: { label: '🇪🇺 Avrupa', platforms: ['otto', 'cdiscount'] },
    latam: { label: '🌎 Latin Amerika', platforms: ['mercadolibre'] },
  }

  const languageOptions = [
    { code: 'tr', label: '🇹🇷 Türkçe', flag: '🇹🇷' },
    { code: 'en', label: '🇺🇸 English', flag: '🇺🇸' },
    { code: 'de', label: '🇩🇪 Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: '🇫🇷 Français', flag: '🇫🇷' },
    { code: 'es', label: '🇪🇸 Español', flag: '🇪🇸' },
    { code: 'pt', label: '🇧🇷 Português', flag: '🇧🇷' },
  ]

  const [form, setForm] = useState({
    name: '', brand: '', category: categories[0] || '',
    features: '', keywords: '', platforms: [platforms[0]?.id || 'trendyol'],
    resultLanguage: locale || 'tr',
    marketplace: 'tr'
  })
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState(platforms[0]?.id || 'trendyol')
  const [error, setError] = useState('')
  const [quotaExceeded, setQuotaExceeded] = useState(false)

  // Update default marketplace based on locale
  useEffect(() => {
    const marketMap = { tr: 'tr', en: 'us', de: 'eu', fr: 'eu', es: 'latam', pt: 'latam' }
    const defaultMarket = marketMap[locale] || 'tr'
    const defaultPlatforms = marketplaceGroups[defaultMarket]?.platforms || ['trendyol']
    setForm(prev => ({
      ...prev,
      marketplace: defaultMarket,
      platforms: [defaultPlatforms[0]],
      resultLanguage: locale || 'tr'
    }))
    setActiveTab(defaultPlatforms[0])
  }, [locale])

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
      // Auth token al
      const { data: { session } } = await supabase.auth.getSession()
      const headers = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...form,
          resultLanguage: form.resultLanguage || locale || 'tr',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.quotaExceeded) {
          setQuotaExceeded(true)
        }
        throw new Error(data.error || 'Bir hata oluştu')
      }

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
      { icon: '🔍', text: t?.newListing?.analyzing || 'Ürün özellikleri analiz ediliyor...', detail: t?.newListing?.analyzingDetail || 'Ürününüzün temel özelliklerini ve benzersiz satış noktalarını belirliyorum.' },
      { icon: '🎯', text: t?.newListing?.seoKeywords || 'SEO anahtar kelimeleri belirleniyor...', detail: t?.newListing?.seoDetail || 'Platformdaki en çok aranan kelimeleri listing\'inize entegre ediyorum.' },
      { icon: '⚙️', text: t?.newListing?.formatting || 'Platform formatları uygulanıyor...', detail: t?.newListing?.formattingDetail || 'Her platformun kurallarına uygun başlık ve açıklama formatı hazırlıyorum.' },
      { icon: '✍️', text: t?.newListing?.generating || 'Başlık ve açıklamalar üretiliyor...', detail: t?.newListing?.generatingDetail || 'Satış odaklı, ikna edici ve SEO uyumlu içerikler oluşturuyorum.' },
      { icon: '📊', text: t?.newListing?.scoring || 'SEO skoru hesaplanıyor...', detail: t?.newListing?.scoringDetail || 'Listing\'inizin arama sıralamasındaki performansını değerlendiriyorum.' },
    ]
    const tips = [
      t?.newListing?.tip1 || '💡 Detaylı ürün özellikleri, SEO skorunu %40\'a kadar artırabilir.',
      t?.newListing?.tip2 || '💡 Doğru anahtar kelimeler satışları 3 kata kadar artırabilir.',
      t?.newListing?.tip3 || '💡 Profesyonel listing\'ler, dönüşüm oranını %60 artırır.',
      t?.newListing?.tip4 || '💡 Her platformun kendine özel algoritması ve kuralları vardır.',
      t?.newListing?.tip5 || '💡 AI ile optimize edilmiş listing\'ler organik trafiği artırır.',
    ]
    const progress = ((loadingStep + 1) / steps.length) * 100
    const tipIndex = Math.floor(Date.now() / 4000) % tips.length

    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 px-4">
        {/* AI Working Animation */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/30 animate-pulse">
            <span className="text-3xl">{steps[loadingStep]?.icon || '🤖'}</span>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-ping" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
        </div>

        {/* Current Step Title */}
        <div className="text-center max-w-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{steps[loadingStep]?.text}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{steps[loadingStep]?.detail}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-gray-400">{t?.newListing?.step || 'Adım'} {loadingStep + 1}/{steps.length}</span>
            <span className="text-xs text-brand-500 font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mt-2">
          {steps.map((s, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              i < loadingStep ? 'bg-green-500 text-white scale-90' :
              i === loadingStep ? 'bg-brand-500 text-white scale-110 shadow-lg shadow-brand-500/40' :
              'bg-gray-100 text-gray-400 scale-90'
            }`}>
              {i < loadingStep ? '✓' : s.icon}
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-4 bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 rounded-2xl px-5 py-3.5 max-w-sm w-full">
          <p className="text-xs text-brand-700 leading-relaxed text-center font-medium">{tips[tipIndex]}</p>
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
            <h2 className="text-xl font-bold">✅ {t?.newListing?.ready || 'Listingler Hazır!'}</h2>
            <p className="text-gray-500 text-sm">{form.platforms.length} {t?.newListing?.optimizedFor || 'platform için optimize edildi.'}</p>
          </div>
          <button onClick={() => { setResults(null); setForm({ ...form, name: '', brand: '', features: '', keywords: '' }) }}
            className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition">
            ← {t?.newListing?.newListingBtn || 'Yeni Listing'}
          </button>
        </div>

        {/* Platform tabs */}
        {form.platforms.length > 1 && (
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {form.platforms.map(pid => {
              const plat = platforms.find(p => p.id === pid)
              return (
                <button key={pid} onClick={() => setActiveTab(pid)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${activeTab === pid ? 'bg-white shadow-sm text-brand-500' : 'text-gray-500'}`}>
                  {plat?.name || ''}
                </button>
              )
            })}
          </div>
        )}

        {results[activeTab] && <ResultCard platform={activeTab} result={results[activeTab]} t={t} />}
      </div>
    )
  }

  // Form screen
  return (
    <div>
      <h2 className="text-xl font-bold mb-1">📦 {t?.newListing?.title || 'Ürün Bilgilerini Gir'}</h2>
      <p className="text-gray-500 text-sm mb-6">{t?.newListing?.subtitle || 'Ne kadar detay verirsen, listing o kadar güçlü olur.'}</p>

      {error && (
        <div className={`text-sm p-4 rounded-xl mb-4 ${quotaExceeded ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-600'}`}>
          <p>{error}</p>
          {quotaExceeded && (
            <Link href="/dashboard/odeme" className="inline-block mt-2 px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition">
              {t?.newListing?.upgradePlan || 'Planı Yükselt'}
            </Link>
          )}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.newListing?.productName || 'Ürün Adı'} *</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="örn: Samsung Galaxy Buds2 Pro"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.newListing?.brand || 'Marka'}</label>
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="örn: Samsung"
              value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.newListing?.category || 'Kategori'}</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
              value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.newListing?.features || 'Ürün Özellikleri'} *</label>
          <textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[100px] resize-y"
            placeholder={t?.newListing?.featuresPlaceholder || "Her özelliği yeni satıra yaz:\n- Aktif gürültü önleme\n- IPX7 su geçirmez\n- 29 saat pil ömrü"}
            value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t?.newListing?.targetKeywords || 'Hedef Anahtar Kelimeler'} (opsiyonel)</label>
          <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="örn: kablosuz kulaklık, bluetooth kulaklık"
            value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} />
        </div>

        {/* Sonuç Dili Seçimi */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">🌍 {t?.newListing?.resultLanguage || 'Sonuç Dili'}</label>
          <p className="text-xs text-gray-400 mb-2">{t?.newListing?.resultLanguageDesc || 'Listing içeriği hangi dilde oluşturulsun?'}</p>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map(lang => (
              <button key={lang.code} onClick={() => setForm({ ...form, resultLanguage: lang.code })} type="button"
                className={`py-2 px-3.5 rounded-xl text-sm font-medium border-2 transition ${form.resultLanguage === lang.code ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pazar Yeri Seçimi */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">🏪 {t?.newListing?.marketplace || 'Pazar Yeri'} *</label>
          <p className="text-xs text-gray-400 mb-2">{t?.newListing?.marketplaceDesc || 'Hangi pazarda satış yapacaksınız?'}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(marketplaceGroups).map(([key, group]) => (
              <button key={key} onClick={() => {
                const firstPlatform = group.platforms[0]
                setForm({ ...form, marketplace: key, platforms: [firstPlatform] })
                setActiveTab(firstPlatform)
              }} type="button"
                className={`py-2 px-4 rounded-xl text-sm font-medium border-2 transition ${form.marketplace === key ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {group.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Seçimi (seçilen pazara göre filtrelenmiş) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">📦 {t?.newListing?.platformSelect || 'Platform Seçimi'} *</label>
          <p className="text-xs text-gray-400 mb-2">{t?.newListing?.platformDesc || 'Birden fazla platform seçebilirsiniz. Her platform için ayrı optimize edilmiş listing oluşturulur.'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {(marketplaceGroups[form.marketplace]?.platforms || []).map(pid => {
              const plat = platforms.find(p => p.id === pid)
              if (!plat) return null
              return (
                <button key={pid} onClick={() => togglePlatform(pid)} type="button"
                  className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-sm font-medium border-2 transition text-left ${form.platforms.includes(pid) ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <span className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center text-[10px] ${form.platforms.includes(pid) ? 'border-brand-500 bg-brand-500 text-white' : 'border-gray-300'}`}>
                    {form.platforms.includes(pid) && '✓'}
                  </span>
                  {plat.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!canSubmit}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-base">
        ✨ {t?.newListing?.generate || 'Listing Oluştur'}
      </button>
    </div>
  )
}
