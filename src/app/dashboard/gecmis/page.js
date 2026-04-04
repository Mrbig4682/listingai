'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n/context'

const PLATFORM_COLORS = {
  amazon: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  ebay: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  etsy: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  shopify: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  walmart: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
  trendyol: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  hepsiburada: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  n11: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  'mercado libre': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  otto: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  cdiscount: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
}

function getPlatformStyle(platform) {
  const key = platform?.toLowerCase()
  return PLATFORM_COLORS[key] || { bg: 'bg-brand-50', text: 'text-brand-600', border: 'border-brand-200' }
}

export default function GecmisPage() {
  const { t, platforms } = useI18n()
  const h = t?.history || {}
  const c = t?.common || {}
  const nl = t?.newListing || {}

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [selectedListing, setSelectedListing] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data, error } = await supabase
        .from('listings')
        .select('*, listing_results(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (err) {
      console.error('Listing yükleme hatası:', err)
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  const allPlatforms = [...new Set(listings.flatMap(l => l.platforms || []))]

  const filteredListings = listings.filter(l => {
    const matchSearch = !search ||
      l.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.brand?.toLowerCase().includes(search.toLowerCase())
    const matchPlatform = filterPlatform === 'all' || l.platforms?.includes(filterPlatform)
    return matchSearch && matchPlatform
  })

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const exportCSV = () => {
    if (filteredListings.length === 0) return
    const rows = [['Ürün Adı', 'Marka', 'Kategori', 'Platformlar', 'SEO Skor', 'Tarih', 'Başlık', 'Açıklama']]
    filteredListings.forEach(l => {
      const result = l.listing_results?.[0]
      rows.push([
        l.product_name || '',
        l.brand || '',
        l.category || '',
        (l.platforms || []).join(', '),
        result?.seo_score || '',
        new Date(l.created_at).toLocaleDateString('tr-TR'),
        result?.title || '',
        result?.description || '',
      ])
    })
    const csv = rows.map(r => r.map(col => `"${String(col).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `listingai-gecmis-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-3 h-10 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
        <p className="text-lg font-semibold text-gray-700">Yükleniyor...</p>
      </div>
    )
  }

  // Detail View
  if (selectedListing) {
    const results = selectedListing.listing_results || []
    const currentResult = results[activeTab] || null

    return (
      <div>
        {/* Back button */}
        <button onClick={() => { setSelectedListing(null); setActiveTab(0) }}
          className="flex items-center gap-2 text-base text-gray-500 hover:text-brand-600 mb-5 transition font-medium">
          ← Listeye Dön
        </button>

        {/* Product Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md mb-5">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{selectedListing.product_name}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {selectedListing.brand && (
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold">Marka:</span> {selectedListing.brand}
                  </span>
                )}
                {selectedListing.category && (
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold">Kategori:</span> {selectedListing.category}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {new Date(selectedListing.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {currentResult?.seo_score != null && (
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg ${
                currentResult.seo_score >= 80 ? 'bg-gradient-to-br from-green-400 to-green-600' :
                currentResult.seo_score >= 60 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                'bg-gradient-to-br from-red-400 to-red-600'
              }`}>
                {currentResult.seo_score}
              </div>
            )}
          </div>

          {selectedListing.features && (
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              <span className="font-semibold text-gray-700">Özellikler:</span> {selectedListing.features}
            </div>
          )}
          {selectedListing.keywords && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              <span className="font-semibold text-gray-700">Anahtar Kelimeler:</span> {selectedListing.keywords}
            </div>
          )}
        </div>

        {/* Platform Tabs */}
        {results.length > 1 && (
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {results.map((r, i) => {
              const style = getPlatformStyle(r.platform)
              return (
                <button key={i} onClick={() => setActiveTab(i)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === i
                      ? 'bg-brand-500 text-white shadow-md scale-105'
                      : `bg-white border-2 ${style.border} ${style.text} hover:shadow-sm`
                  }`}>
                  {r.platform}
                </button>
              )
            })}
          </div>
        )}

        {currentResult ? (
          <div className="space-y-5">
            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-base text-gray-900">{nl?.productTitle || 'Ürün Başlığı'}</h3>
                <button onClick={() => copyToClipboard(currentResult.title, 'title')}
                  className={`text-sm px-4 py-1.5 rounded-xl transition font-semibold ${
                    copied === 'title' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600'
                  }`}>
                  {copied === 'title' ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
              </div>
              <p className="text-base text-gray-800 leading-relaxed">{currentResult.title}</p>
              <div className="text-sm text-gray-400 mt-2">{currentResult.title?.length || 0} karakter</div>
            </div>

            {/* Bullet Points */}
            {currentResult.bullets?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-base text-gray-900">{nl?.highlights || 'Öne Çıkan Özellikler'}</h3>
                  <button onClick={() => copyToClipboard(currentResult.bullets.join('\n'), 'bullets')}
                    className={`text-sm px-4 py-1.5 rounded-xl transition font-semibold ${
                      copied === 'bullets' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600'
                    }`}>
                    {copied === 'bullets' ? '✓ Kopyalandı' : (c?.copyAll || 'Tümünü Kopyala')}
                  </button>
                </div>
                <ul className="space-y-3">
                  {currentResult.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <span className="text-brand-500 mt-0.5 text-lg">•</span>
                      <span className="flex-1 text-base text-gray-700 leading-relaxed">{b}</span>
                      <button onClick={() => copyToClipboard(b, `bullet-${i}`)}
                        className={`text-sm px-2 py-1 rounded-lg transition shrink-0 opacity-0 group-hover:opacity-100 ${
                          copied === `bullet-${i}` ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-brand-600 hover:bg-brand-50'
                        }`}>
                        {copied === `bullet-${i}` ? '✓' : '⧉'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {currentResult.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-base text-gray-900">{nl?.description || 'Ürün Açıklaması'}</h3>
                  <button onClick={() => copyToClipboard(currentResult.description, 'desc')}
                    className={`text-sm px-4 py-1.5 rounded-xl transition font-semibold ${
                      copied === 'desc' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600'
                    }`}>
                    {copied === 'desc' ? '✓ Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
                <p className="text-base whitespace-pre-line text-gray-700 leading-relaxed">{currentResult.description}</p>
              </div>
            )}

            {/* SEO Tips */}
            {currentResult.seo_tips?.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                <h3 className="font-bold text-base text-green-800 mb-4">{h?.seoTips || 'SEO İpuçları'}</h3>
                <ul className="space-y-2.5">
                  {currentResult.seo_tips.map((tip, i) => (
                    <li key={i} className="text-base text-green-800 flex items-start gap-3">
                      <span className="text-green-500 mt-0.5">✅</span>
                      <span>{typeof tip === 'string' ? tip : tip?.tip || tip?.text || JSON.stringify(tip)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 text-base">Bu listing için sonuç bulunamadı.</p>
          </div>
        )}
      </div>
    )
  }

  // List View
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📋 {h?.title || 'Geçmiş İlanlar'}</h2>
          {listings.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">Toplam {listings.length} ilan</p>
          )}
        </div>
        {listings.length > 0 && (
          <button onClick={exportCSV} className="text-sm px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition font-semibold shadow-sm">
            📥 {c?.export || 'CSV İndir'} ({filteredListings.length})
          </button>
        )}
      </div>

      {/* Search and Filter */}
      {listings.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder={h?.search || 'Ürün adı veya marka ara...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white"
            />
          </div>
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:border-brand-400 font-medium min-w-[160px]">
            <option value="all">{c?.all || 'Tümü'}</option>
            {allPlatforms.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center shadow-sm">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-bold text-xl text-gray-800">{h?.noResults || 'Henüz ilan oluşturmadınız'}</h3>
          <p className="text-gray-500 text-base mt-2">İlk listingini oluşturmak için "Yeni Listing" sayfasına git.</p>
          <a href="/dashboard" className="inline-block mt-5 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition text-base">
            ✨ Listing Oluştur
          </a>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-lg text-gray-800">Sonuç bulunamadı</h3>
          <p className="text-gray-500 text-base mt-2">Farklı bir arama terimi veya filtre deneyin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredListings.map(listing => {
            const avgScore = listing.listing_results?.length > 0
              ? Math.round(listing.listing_results.reduce((s, r) => s + (r.seo_score || 0), 0) / listing.listing_results.length)
              : null

            return (
              <div key={listing.id} onClick={() => setSelectedListing(listing)}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-brand-300 hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg text-gray-800 group-hover:text-brand-600 transition truncate">
                      {listing.product_name}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {listing.brand && (
                        <span className="text-sm text-gray-500 font-medium">{listing.brand}</span>
                      )}
                      <span className="text-sm text-gray-400">
                        {new Date(listing.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ml-4 shrink-0">
                    {listing.platforms?.map(p => {
                      const style = getPlatformStyle(p)
                      return (
                        <span key={p} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${style.bg} ${style.text} ${style.border}`}>
                          {p}
                        </span>
                      )
                    })}
                    {avgScore != null && (
                      <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                        avgScore >= 80 ? 'bg-green-50 text-green-600 border border-green-200' :
                        avgScore >= 60 ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {avgScore}
                      </span>
                    )}
                    <span className="text-gray-300 group-hover:text-brand-500 transition text-xl ml-1">→</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
