'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n/context'

export default function GecmisPage() {
  const { t } = useI18n()
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('listings')
      .select('*, listing_results(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setListings(data || [])
    setLoading(false)
  }

  const filteredListings = listings.filter(l => {
    const matchSearch = !search || l.product_name?.toLowerCase().includes(search.toLowerCase()) || l.brand?.toLowerCase().includes(search.toLowerCase())
    const matchPlatform = filterPlatform === 'all' || l.platforms?.includes(filterPlatform)
    return matchSearch && matchPlatform
  })

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
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
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `listingai-gecmis-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin-slow" />
      </div>
    )
  }

  // Detay görünümü
  if (selectedListing) {
    const results = selectedListing.listing_results || []
    const currentResult = results[activeTab]

    return (
      <div>
        <button onClick={() => { setSelectedListing(null); setActiveTab(0) }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition">
          &larr; {t.common.backToList}
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{selectedListing.product_name}</h2>
              <div className="flex gap-3 mt-2 text-sm text-gray-500">
                {selectedListing.brand && <span>Marka: <strong>{selectedListing.brand}</strong></span>}
                {selectedListing.category && <span>Kategori: <strong>{selectedListing.category}</strong></span>}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(selectedListing.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {currentResult?.seo_score && (
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white ${currentResult.seo_score >= 80 ? 'bg-green-500' : currentResult.seo_score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}>
                {currentResult.seo_score}
              </div>
            )}
          </div>

          {selectedListing.features && (
            <div className="mt-3 text-sm text-gray-600">
              <span className="font-semibold">Özellikler:</span> {selectedListing.features}
            </div>
          )}
          {selectedListing.keywords && (
            <div className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">Anahtar Kelimeler:</span> {selectedListing.keywords}
            </div>
          )}
        </div>

        {/* Platform tabları */}
        {results.length > 1 && (
          <div className="flex gap-2 mb-4">
            {results.map((r, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === i ? 'bg-brand-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {r.platform}
              </button>
            ))}
          </div>
        )}

        {currentResult ? (
          <div className="space-y-4">
            {/* Başlık */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm text-gray-700">{t.newListing.productTitle}</h3>
                <button onClick={() => copyToClipboard(currentResult.title, 'title')} className={`text-xs px-3 py-1 rounded-lg transition ${copied === 'title' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {copied === 'title' ? t.common.copied : t.common.copy}
                </button>
              </div>
              <p className="text-sm">{currentResult.title}</p>
              <div className="text-xs text-gray-400 mt-1">{currentResult.title?.length || 0} {t.newListing.chars}</div>
            </div>

            {/* Bullet Points */}
            {currentResult.bullets && currentResult.bullets.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-gray-700">{t.newListing.highlights}</h3>
                  <button onClick={() => copyToClipboard(currentResult.bullets.join('\n'), 'bullets')} className={`text-xs px-3 py-1 rounded-lg transition ${copied === 'bullets' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {copied === 'bullets' ? t.common.copied : t.common.copyAll}
                  </button>
                </div>
                <ul className="space-y-2">
                  {currentResult.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-brand-500 mt-0.5">•</span>
                      <span className="flex-1">{b}</span>
                      <button onClick={() => copyToClipboard(b, `bullet-${i}`)} className={`text-xs px-2 py-0.5 rounded transition shrink-0 ${copied === `bullet-${i}` ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`} title={t.common.copy}>
                        {copied === `bullet-${i}` ? '✓' : '⧉'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Açıklama */}
            {currentResult.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-gray-700">{t.newListing.description}</h3>
                  <button onClick={() => copyToClipboard(currentResult.description, 'desc')} className={`text-xs px-3 py-1 rounded-lg transition ${copied === 'desc' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {copied === 'desc' ? t.common.copied : t.common.copy}
                  </button>
                </div>
                <p className="text-sm whitespace-pre-line text-gray-700 leading-relaxed">{currentResult.description}</p>
              </div>
            )}

            {/* SEO İpuçları */}
            {currentResult.seo_tips && currentResult.seo_tips.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5">
                <h3 className="font-bold text-sm text-green-700 mb-3">{t.history.seoTips}</h3>
                <ul className="space-y-1.5">
                  {currentResult.seo_tips.map((tip, i) => (
                    <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                      <span>✅</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
            <p className="text-gray-500 text-sm">Bu listing için sonuç bulunamadı.</p>
          </div>
        )}
      </div>
    )
  }

  // Liste görünümü
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-bold">📋 {t.history.title}</h2>
        {listings.length > 0 && (
          <button onClick={exportCSV} className="text-xs px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition font-semibold">
            📥 {t.common.export} ({filteredListings.length})
          </button>
        )}
      </div>

      {/* Arama ve Filtre */}
      {listings.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder={t.history.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-brand-300">
            <option value="all">{t.common.all}</option>
            <option value="trendyol">Trendyol</option>
            <option value="hepsiburada">Hepsiburada</option>
            <option value="n11">N11</option>
          </select>
        </div>
      )}

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="font-bold text-lg">{t.history.noResults}</h3>
          <p className="text-gray-500 text-sm mt-1">İlk listingini oluşturmak için "Yeni Listing" sayfasına git.</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-bold">{t.history.noResults}</h3>
          <p className="text-gray-500 text-sm mt-1">Farklı bir arama terimi veya filtre deneyin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredListings.map(listing => {
            const avgScore = listing.listing_results?.length > 0
              ? Math.round(listing.listing_results.reduce((s, r) => s + (r.seo_score || 0), 0) / listing.listing_results.length)
              : null

            return (
              <div key={listing.id} onClick={() => setSelectedListing(listing)}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold group-hover:text-brand-500 transition truncate">{listing.product_name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      {listing.brand && <span className="text-xs text-gray-400">{listing.brand}</span>}
                      <span className="text-xs text-gray-300">
                        {new Date(listing.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ml-3 shrink-0">
                    {listing.platforms?.map(p => (
                      <span key={p} className="text-xs font-semibold px-2 py-1 bg-brand-50 text-brand-500 rounded-lg">{p}</span>
                    ))}
                    {avgScore && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${avgScore >= 80 ? 'bg-green-50 text-green-600' : avgScore >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                        {avgScore}
                      </span>
                    )}
                    <span className="text-gray-300 group-hover:text-brand-400 transition">&rarr;</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filteredListings.length > 0 && (
        <div className="text-center text-xs text-gray-400 mt-4">
          {t.history.total} {filteredListings.length} listing
        </div>
      )}
    </div>
  )
}
