'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n/context'

function CopyBtn({ text, t }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-brand-500 hover:bg-brand-50">
      {copied ? '✓' : t.common.copy}
    </button>
  )
}

export default function TopluPage() {
  const { t, platforms } = useI18n()
  const [platform, setPlatform] = useState('trendyol')
  const [products, setProducts] = useState([{ name: '', brand: '', features: '' }])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [expandedIdx, setExpandedIdx] = useState(null)

  const addProduct = () => {
    if (products.length >= 10) return
    setProducts([...products, { name: '', brand: '', features: '' }])
  }

  const removeProduct = (idx) => {
    if (products.length <= 1) return
    setProducts(products.filter((_, i) => i !== idx))
  }

  const updateProduct = (idx, field, value) => {
    const updated = [...products]
    updated[idx] = { ...updated[idx], [field]: value }
    setProducts(updated)
  }

  const validProducts = products.filter(p => p.name.trim())

  const handleGenerate = async () => {
    if (!validProducts.length) return
    setLoading(true); setError(''); setResults(null)
    setProgress({ current: 0, total: validProducts.length })

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers = { 'Content-Type': 'application/json' }
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`

      const res = await fetch('/api/bulk-generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ products: validProducts, platform }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!results?.results) return
    const successResults = results.results.filter(r => r.status === 'success')
    const headers = [t.bulk.productName, t.newListing.brand, t.bulk.title, 'Özellik 1', 'Özellik 2', 'Özellik 3', 'Özellik 4', 'Özellik 5', t.bulk.description, 'SEO Skoru']
    const rows = successResults.map(r => [
      r.product_name, r.brand, r.title,
      ...(r.bullets || []).slice(0, 5).concat(Array(5).fill('')).slice(0, 5),
      r.description, r.seo_score
    ])
    const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `toplu-listing-${platform}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin-slow" />
        <p className="font-semibold">{validProducts.length} {t.bulk.generating}</p>
        <p className="text-sm text-gray-400">{t.bulk.patience}</p>
      </div>
    )
  }

  if (results) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold">{t.bulk.completed}</h2>
            <p className="text-sm text-gray-500">{results.success}/{results.total} {t.bulk.successCount}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-4 py-2 text-sm font-semibold bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition">
              📥 {t.common.export}
            </button>
            <button onClick={() => setResults(null)} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              ← {t.bulk.newBulk}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {results.results.map((r, i) => (
            <div key={i} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${r.status === 'success' ? 'border-gray-100' : 'border-red-200'}`}>
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}>
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${r.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {r.status === 'success' ? '✓' : '✕'}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{r.product_name}</div>
                    {r.brand && <div className="text-xs text-gray-400">{r.brand}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {r.seo_score && (
                    <span className={`text-sm font-bold ${r.seo_score >= 80 ? 'text-green-600' : r.seo_score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                      SEO: {r.seo_score}
                    </span>
                  )}
                  <span className="text-gray-400">{expandedIdx === i ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedIdx === i && r.status === 'success' && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-500">{t.bulk.title}</span>
                      <CopyBtn text={r.title} t={t} />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-sm">{r.title}</div>
                  </div>
                  {r.bullets?.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-500">{t.bulk.features}</span>
                        <CopyBtn text={r.bullets.join('\n')} t={t} />
                      </div>
                      <div className="space-y-1">
                        {r.bullets.map((b, j) => (
                          <div key={j} className="bg-gray-50 rounded-lg px-3 py-2 text-sm">• {b}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-500">{t.bulk.description}</span>
                      <CopyBtn text={r.description} t={t} />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-sm leading-relaxed">{r.description}</div>
                  </div>
                </div>
              )}

              {expandedIdx === i && r.status === 'error' && (
                <div className="px-5 pb-5 border-t border-red-100 pt-4">
                  <p className="text-sm text-red-600">{r.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-lg">📦</div>
        <div>
          <h2 className="text-lg font-bold">{t.bulk.title}</h2>
          <p className="text-xs text-gray-400">{t.bulk.subtitle}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">{t.common.platform}</label>
        <div className="flex gap-2">
          {platforms.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border-2 transition ${platform === p.id ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-gray-200 text-gray-400'}`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {products.map((product, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-500">{t.bulk.product} {idx + 1}</span>
              {products.length > 1 && (
                <button onClick={() => removeProduct(idx)} className="text-xs text-red-400 hover:text-red-600">{t.bulk.remove}</button>
              )}
            </div>
            <div className="space-y-2">
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder={t.bulk.productName + ' *'} value={product.name} onChange={e => updateProduct(idx, 'name', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder={t.newListing.brand} value={product.brand} onChange={e => updateProduct(idx, 'brand', e.target.value)} />
                <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder={t.bulk.shortFeatures} value={product.features} onChange={e => updateProduct(idx, 'features', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length < 10 && (
        <button onClick={addProduct} className="w-full mt-3 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-brand-300 hover:text-brand-500 transition">
          + {t.bulk.addProduct} ({products.length}/10)
        </button>
      )}

      <button onClick={handleGenerate} disabled={!validProducts.length}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 text-base">
        ⚡ {validProducts.length} {t.bulk.generateFor}
      </button>
    </div>
  )
}
