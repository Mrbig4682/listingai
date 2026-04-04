'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
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

export default function ListingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t } = useI18n()
  const h = t?.history || {}
  const c = t?.common || {}
  const nl = t?.newListing || {}

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    async function loadListing() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/giris')
          return
        }

        const { data, error: fetchError } = await supabase
          .from('listings')
          .select('*, listing_results(*)')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (fetchError) throw fetchError
        if (!data) {
          setError('İlan bulunamadı')
          return
        }
        setListing(data)
      } catch (err) {
        console.error('Listing yükleme hatası:', err)
        setError('İlan yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }
    if (id) loadListing()
  }, [id])

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-5xl mb-2">⚠️</div>
        <h3 className="text-lg font-bold text-gray-800">{error}</h3>
        <Link href="/dashboard/gecmis" className="text-brand-600 hover:text-brand-700 font-semibold transition">
          ← Geçmişe Dön
        </Link>
      </div>
    )
  }

  if (!listing) return null

  const results = listing.listing_results || []
  const currentResult = results[activeTab] || null

  return (
    <div>
      {/* Back button */}
      <Link href="/dashboard/gecmis"
        className="flex items-center gap-2 text-base text-gray-500 hover:text-brand-600 mb-5 transition font-medium">
        ← Listeye Dön
      </Link>

      {/* Product Info Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md mb-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{listing.product_name}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {listing.brand && (
                <span className="text-sm text-gray-600">
                  <span className="font-semibold">Marka:</span> {listing.brand}
                </span>
              )}
              {listing.category && (
                <span className="text-sm text-gray-600">
                  <span className="font-semibold">Kategori:</span> {listing.category}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {new Date(listing.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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

        {listing.features && (
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
            <span className="font-semibold text-gray-700">Özellikler:</span> {listing.features}
          </div>
        )}
        {listing.keywords && (
          <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
            <span className="font-semibold text-gray-700">Anahtar Kelimeler:</span> {listing.keywords}
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
                    copied === 'desc' ? 'bg-green-100 text-green-600' : 'bg-gr!y-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600'
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
