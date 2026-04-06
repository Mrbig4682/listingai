'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const PLANS = {
  starter: {
    name: 'Starter',
    price: 1,
    description: 'ListingAI\'yi test etmek isteyenler icin',
    features: [
      '2 ilan optimizasyonu',
      'AI destekli SEO baslik ve aciklama',
      '10+ platform destegi',
      '6 dil destegi',
      'Anahtar kelime onerisi'
    ]
  },
  pro: {
    name: 'Pro',
    price: 149,
    description: 'Profesyonel e-ticaret saticilari icin ideal',
    features: [
      'Ayda 100 ilan optimizasyonu',
      'AI destekli SEO baslik ve aciklama',
      '10+ platform destegi',
      '6 dil destegi',
      'Anahtar kelime onerisi',
      'Toplu ilan uretimi',
      'Rakip analizi',
      'Oncelikli destek'
    ]
  },
  business: {
    name: 'Business',
    price: 349,
    description: 'Isletmeler icin sinirsiz optimizasyon',
    badge: 'Tavsiye Edilen',
    features: [
      'Sinirsiz ilan optimizasyonu',
      'AI destekli SEO baslik ve aciklama',
      '10+ platform destegi',
      '6 dil destegi',
      'Anahtar kelime onerisi',
      'Toplu ilan uretimi',
      'Rakip analizi',
      'Marka DNA analizi',
      'AI e-ticaret asistani',
      '7/24 VIP destek'
    ]
  },
}

const COMPARISON_FEATURES = [
  { name: 'Aylik AI Ilan', starter: '2', pro: '100', business: 'Sinirsiz' },
  { name: 'Platform Destegi', starter: '10+', pro: '10+', business: '10+' },
  { name: 'SEO Baslik & Aciklama', starter: '\u2713', pro: '\u2713', business: '\u2713' },
  { name: 'Coklu Dil Destegi', starter: '\u2713', pro: '\u2713', business: '\u2713' },
  { name: 'Anahtar Kelime Onerisi', starter: '\u2713', pro: '\u2713', business: '\u2713' },
  { name: 'Toplu Ilan Uretimi', starter: '\u2717', pro: '\u2713', business: '\u2713' },
  { name: 'Rakip Analizi', starter: '\u2717', pro: '\u2713', business: '\u2713' },
  { name: 'A/B Test', starter: '\u2717', pro: '\u2713', business: '\u2713' },
  { name: 'Marka DNA Analizi', starter: '\u2717', pro: '\u2717', business: '\u2713' },
  { name: 'AI E-Ticaret Asistani', starter: '\u2717', pro: '\u2717', business: '\u2713' },
  { name: '7/24 VIP Destek', starter: '\u2717', pro: '\u2717', business: '\u2713' },
]

// Confetti effect component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            animation: `fall ${2 + Math.random() * 1}s linear infinite`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        >
          <div className={`text-2xl ${['\ud83c\udf89', '\u2728', '\ud83c\udf8a', '\u2b50'][Math.floor(Math.random() * 4)]}`} />
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Trust badge
function TrustBadge() {
  return (
    <div className="bg-gradient-to-r from-brand-50 to-purple-50 rounded-2xl border border-brand-200 p-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl mb-2">\ud83d\udd12</div>
          <p className="text-xs font-semibold text-gray-700">256-bit SSL</p>
          <p className="text-xs text-gray-500 mt-1">Sifreleme</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">\u2713</div>
          <p className="text-xs font-semibold text-gray-700">Shopier</p>
          <p className="text-xs text-gray-500 mt-1">Guvenli Odeme</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">\ud83d\udcb0</div>
          <p className="text-xs font-semibold text-gray-700">30 Gun</p>
          <p className="text-xs text-gray-500 mt-1">Para Iade</p>
        </div>
      </div>
    </div>
  )
}

export default function OdemePage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPlan, setCurrentPlan] = useState('free')
  const [showComparison, setShowComparison] = useState(false)
  const formContainerRef = useRef(null)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setCurrentPlan(profile.plan)
    }
  }

  async function handlePayment() {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadi. Lutfen giris yapin.')

      // Kullanici profil bilgilerini al
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const res = await fetch('/api/shopier/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          userId: user.id,
          userEmail: user.email,
          userName: profile?.full_name || user.email.split('@')[0],
        }),
      })

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.formHtml && formContainerRef.current) {
        // Shopier odeme formunu render et ve auto-submit
        formContainerRef.current.innerHTML = data.formHtml
        // Script'leri calistir
        const scripts = formContainerRef.current.querySelectorAll('script')
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script')
          newScript.textContent = oldScript.textContent
          oldScript.parentNode.replaceChild(newScript, oldScript)
        })
      } else if (data.formParams) {
        // Fallback: Manuel form olustur ve submit et
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.paymentUrl || 'https://www.shopier.com/ShowProduct/api_pay4.php'

        for (const [key, value] of Object.entries(data.formParams)) {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        }

        document.body.appendChild(form)
        form.submit()
      }
    } catch (err) {
      setError(err.message || 'Bir hata olustu.')
    } finally {
      setLoading(false)
    }
  }

  // Premium active plan screen
  if (currentPlan !== 'free') {
    const activePlan = PLANS[currentPlan]
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50 pt-12 pb-12">
        <Confetti />
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block">
              <div className="bg-gradient-to-br from-brand-400 to-purple-600 rounded-full p-4 mb-4">
                <span className="text-5xl">\ud83c\udf89</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {activePlan?.name || currentPlan} Plani Aktif!
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Tum premium ozelliklere erisim sahibi oldunuz. Artik ListingAI'nin tum gucunu kullanabilirsiniz.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-brand-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-brand-500 to-purple-600 px-8 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">Aktif Plan</p>
                  <h2 className="text-4xl font-bold text-white mt-2">
                    {activePlan?.name || currentPlan}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">{currentPlan === 'starter' ? 'Tek Seferlik' : 'Aylik'}</p>
                  <p className="text-5xl font-bold text-white">
                    ₺{activePlan?.price || '0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Ozellikler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(activePlan?.features || []).map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-gradient-to-br from-brand-400 to-purple-500">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upgrade CTA for Starter/Pro users */}
          {currentPlan !== 'business' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Planinizi Yukseltin</h3>
              <p className="text-gray-600 mb-6">
                Daha fazla ilan optimizasyonu icin planinizi yukseltebilirsiniz.
              </p>
              <button
                onClick={() => {
                  setCurrentPlan('free') // Pricing ekranina don
                }}
                className="inline-block px-8 py-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
              >
                Planlari Gor
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mt-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Destek</h3>
            <p className="text-gray-600 mb-6">
              Sorulariniz icin bize ulasin.
            </p>
            <a href="mailto:listingai.official@gmail.com" className="inline-block px-8 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition">
              Destek Iletisimi
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Premium pricing plans screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50 pt-12 pb-16">
      {/* Hidden form container for Shopier redirect */}
      <div ref={formContainerRef} style={{ display: 'none' }} />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 bg-white border border-brand-200 rounded-full text-sm font-semibold text-brand-600">
              ✨ Sadece ₺1'den başlayan fiyatlar
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
            Basit, Saydam Fiyatlandirma
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Isinizi buyutmek icin gerekli tum araclari alin. Gizli ucret yok.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`relative group cursor-pointer transition-all duration-300 ${
                key === 'business' ? 'md:scale-105' : ''
              }`}
            >
              {/* Glow background */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                key === 'business'
                  ? 'from-brand-500 via-purple-500 to-pink-500'
                  : 'from-brand-200 to-purple-200'
              } rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10`}
              />

              <div className={`relative bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 h-full flex flex-col ${
                selectedPlan === key ? 'ring-2 ring-brand-500 shadow-2xl' : 'ring-1 ring-gray-100'
              }`}>
                {/* Badge */}
                {key === 'business' && (
                  <div className="absolute top-6 right-6">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-bold rounded-full">
                      Tavsiye Edilen
                    </div>
                  </div>
                )}

                {key === 'starter' && (
                  <div className="absolute top-6 right-6">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full">
                      Dene
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className={`px-8 pt-8 pb-4 bg-gradient-to-br ${
                  key === 'business'
                    ? 'from-brand-50 via-purple-50 to-pink-50'
                    : key === 'starter'
                    ? 'from-green-50 to-emerald-50'
                    : 'from-gray-50 to-gray-50'
                }`}>
                  <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="text-gray-600 mt-1 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="px-8 pt-4 pb-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                      ₺{plan.price}
                    </span>
                    <span className="text-gray-500 font-semibold">
                      {key === 'starter' ? '' : '/ay'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {key === 'starter' ? 'Tek seferlik odeme' : 'Tum vergiler dahil'}
                  </p>
                </div>

                {/* Features List */}
                <div className="px-8 py-6 space-y-3 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`flex items-center justify-center h-5 w-5 rounded-lg bg-gradient-to-br ${
                          key === 'starter' ? 'from-green-400 to-emerald-500' : 'from-brand-400 to-purple-500'
                        }`}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-gray-700 font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="px-8 pb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlan(key)
                      setTimeout(() => handlePayment(), 100)
                    }}
                    disabled={loading && selectedPlan === key}
                    className={`w-full py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      selectedPlan === key
                        ? 'bg-gradient-to-r from-brand-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } ${(loading && selectedPlan === key) ? 'opacity-75' : ''}`}
                  >
                    {loading && selectedPlan === key ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Shopier'a Yonlendiriliyor...
                      </>
                    ) : (
                      <>
                        <span>{key === 'starter' ? 'Hemen Dene — ₺1' : `₺${plan.price}/ay — Başla`}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Plan Footer */}
                <div className={`px-8 py-4 border-t ${
                  key === 'business' ? 'bg-gradient-to-r from-brand-50 to-purple-50 border-brand-100' : 'bg-gray-50 border-gray-100'
                }`}>
                  <p className="text-xs text-gray-600">
                    {key === 'starter'
                      ? 'Kredi karti ile guvenli odeme'
                      : <><strong>30 Gun</strong> — Para iade garantisi</>
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Bir hata olustu</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="mb-16">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full text-center py-6 hover:bg-white/40 rounded-2xl transition"
          >
            <p className="text-gray-600 font-semibold flex items-center justify-center gap-2">
              <span>{showComparison ? '\u25bc' : '\u25b6'} Ozellik Karsilastirmasi</span>
            </p>
          </button>

          {showComparison && (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-brand-50 to-purple-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Ozellik</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Starter</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Pro</th>
                      <th className="px-6 py-4 text-center text-sm font-bold bg-gradient-to-r from-brand-100 to-purple-100">Business</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {COMPARISON_FEATURES.map((feature, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{feature.name}</td>
                        {['starter', 'pro', 'business'].map((planKey) => (
                          <td key={planKey} className={`px-6 py-4 text-center text-sm text-gray-600 ${
                            planKey === 'business' ? 'bg-gradient-to-r from-brand-50/50 to-purple-50/50' : ''
                          }`}>
                            {feature[planKey] === '\u2713' ? (
                              <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : feature[planKey] === '\u2717' ? (
                              <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="text-gray-900 font-semibold">{feature[planKey]}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <TrustBadge />

        {/* Payment Methods */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 font-semibold mb-4">Kabul edilen odeme yontemleri</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['\ud83d\udcb3 Visa', '\ud83d\udcb3 Mastercard', '\ud83c\udfe6 Troy', '\ud83d\udcf1 Taksit'].map((method) => (
              <div key={method} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm">
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            <strong>Sorulariniz mi var?</strong> Destek ekibimize ulasin:{' '}
            <a href="mailto:listingai.official@gmail.com" className="text-brand-600 hover:text-brand-700 font-semibold">
              listingai.official@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
