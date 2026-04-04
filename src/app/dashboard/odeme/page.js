'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const PLANS = {
  pro: {
    name: 'Pro',
    price: 299,
    description: 'Küçük ve orta ölçekli işletmeler için ideal',
    features: [
      '200 AI ilan/ay',
      '11 platform desteği',
      'AI ilan optimize edici',
      'Gelişmiş anahtar kelime',
      'Toplu ilan üretimi',
      'Rakip analizi',
      'A/B test'
    ]
  },
  business: {
    name: 'Business',
    price: 799,
    description: 'Kuruluşlar ve ölçekli işletmeler için',
    badge: 'Tavsiye Edilen',
    features: [
      'Sınırsız AI ilan',
      '11 platform desteği',
      'Marka DNA analizi',
      'AI e-ticaret asistanı',
      'Öncelikli destek',
      'API erişimi',
      'Tüm Pro özellikleri'
    ]
  },
}

const COMPARISON_FEATURES = [
  { name: 'Aylık AI İlan', pro: '200', business: 'Sınırsız' },
  { name: 'Platform Desteği', pro: '11', business: '11' },
  { name: 'İlan Optimize Edici', pro: '✓', business: '✓' },
  { name: 'Gelişmiş Anahtar Kelime', pro: '✓', business: '✓' },
  { name: 'Toplu İlan Üretimi', pro: '✓', business: '✓' },
  { name: 'Rakip Analizi', pro: '✓', business: '✓' },
  { name: 'A/B Test', pro: '✓', business: '✓' },
  { name: 'Marka DNA Analizi', pro: '✗', business: '✓' },
  { name: 'AI E-Ticaret Asistanı', pro: '✗', business: '✓' },
  { name: 'Öncelikli Destek', pro: '✗', business: '✓' },
  { name: 'API Erişimi', pro: '✗', business: '✓' },
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
          <div className={`text-2xl ${['🎉', '✨', '🎊', '⭐'][Math.floor(Math.random() * 4)]}`} />
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

// Premium gradient icon
function GradientIcon({ icon, className = '' }) {
  return (
    <div className={`bg-gradient-to-br from-brand-400 to-purple-600 rounded-2xl flex items-center justify-center ${className}`}>
      <span className="text-white text-2xl">{icon}</span>
    </div>
  )
}

// Trust badge
function TrustBadge() {
  return (
    <div className="bg-gradient-to-r from-brand-50 to-purple-50 rounded-2xl border border-brand-200 p-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl mb-2">🔒</div>
          <p className="text-xs font-semibold text-gray-700">256-bit SSL</p>
          <p className="text-xs text-gray-500 mt-1">Şifreleme</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">✓</div>
          <p className="text-xs font-semibold text-gray-700">iyzico</p>
          <p className="text-xs text-gray-500 mt-1">Güvenliği</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">💰</div>
          <p className="text-xs font-semibold text-gray-700">30 Gün</p>
          <p className="text-xs text-gray-500 mt-1">Para İade</p>
        </div>
      </div>
    </div>
  )
}

export default function OdemePage() {
  const [selectedPlan, setSelectedPlan] = useState('business')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPlan, setCurrentPlan] = useState('free')
  const [pendingRequest, setPendingRequest] = useState(null)
  const [checkoutForm, setCheckoutForm] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const checkoutRef = useRef(null)

  useEffect(() => {
    loadUserData()
  }, [])

  // iyzico checkout formunu render et
  useEffect(() => {
    if (checkoutForm && checkoutRef.current) {
      checkoutRef.current.innerHTML = ''
      const div = document.createElement('div')
      div.innerHTML = checkoutForm
      checkoutRef.current.appendChild(div)
      // iyzico script'lerini çalıştır
      const scripts = div.querySelectorAll('script')
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script')
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value)
        })
        newScript.textContent = oldScript.textContent
        oldScript.parentNode.replaceChild(newScript, oldScript)
      })
    }
  }, [checkoutForm])

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

    const { data: pending } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)

    if (pending && pending.length > 0) {
      setPendingRequest(pending[0])
    }
  }

  async function handlePayment() {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      const res = await fetch('/api/iyzico/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          userId: user.id,
          userEmail: user.email,
        }),
      })

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error + (data.errorCode ? ` (${data.errorCode})` : ''))
      }

      if (data.checkoutFormContent) {
        setCheckoutForm(data.checkoutFormContent)
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // Premium active plan screen
  if (currentPlan !== 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50 pt-12 pb-12">
        <Confetti />
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block">
              <div className="bg-gradient-to-br from-brand-400 to-purple-600 rounded-full p-4 mb-4">
                <span className="text-5xl">🎉</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {currentPlan === 'pro' ? 'Pro' : 'Business'} Planı Aktif!
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Tüm premium özelliklere erişim sahibi oldunuz. Artık ListingAI'nin tüm gücünü kullanabilirsiniz.
            </p>
          </div>

          {/* Active Plan Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-brand-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-brand-500 to-purple-600 px-8 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">Aktif Plan</p>
                  <h2 className="text-4xl font-bold text-white mt-2">
                    {currentPlan === 'pro' ? 'Pro' : 'Business'}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">Aylık</p>
                  <p className="text-5xl font-bold text-white">
                    ₺{currentPlan === 'pro' ? '299' : '799'}
                  </p>
                </div>
              </div>
            </div>

            {/* Plan details */}
            <div className="px-8 py-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Özellikler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLANS[currentPlan].features.map((feature, i) => (
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

            {/* Trial indicator */}
            <div className="px-8 py-6 bg-brand-50 border-t border-brand-100">
              <p className="text-sm text-brand-900 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <strong>14 gün ücretsiz deneme</strong> ile başladınız. Bilançonuz her zaman güvende.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Planınızdan Memnun musunuz?</h3>
            <p className="text-gray-600 mb-6">
              Daha yüksek bir plana geçmek veya destek almak istiyorsanız, bize ulaşın.
            </p>
            <a href="mailto:support@listingai.com" className="inline-block px-8 py-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
              Destek İletişimi
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Premium checkout form screen
  if (checkoutForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50 pt-8 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => setCheckoutForm(null)}
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold mb-4 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Geri Dön
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Ödemeyi Tamamla
              </h1>
              <p className="text-gray-600 mt-2">
                {PLANS[selectedPlan]?.name} Plan — <strong>₺{PLANS[selectedPlan]?.price}/ay</strong>
              </p>
            </div>
            <GradientIcon icon="💳" className="w-20 h-20" />
          </div>

          {/* Checkout Form Container */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div ref={checkoutRef} id="iyzipay-checkout-form" className="iyzico-form-container" />
            </div>

            {/* Security Footer */}
            <div className="bg-gradient-to-r from-brand-50 to-purple-50 border-t border-brand-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Güvenli Ödeme</p>
                    <p className="text-xs text-gray-600">iyzico tarafından korunan 256-bit SSL</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">Visa</span>
                  <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">Mastercard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">30 Gün Para İade Garantisi</span> — Hiç bir sorun yok.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Premium pending payment screen
  if (pendingRequest && !checkoutForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50 pt-12 pb-12 flex items-center">
        <div className="max-w-2xl mx-auto px-4 w-full">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-4">
                <span className="text-5xl">⏳</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Ödeme Talebin İnceleniyor</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              {PLANS[pendingRequest.plan]?.name} planı için ₺{pendingRequest.amount} tutarındaki ödeme talebiniz değerlendirilmektedir.
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-8 border-b border-amber-100">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Plan</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{PLANS[pendingRequest.plan]?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tutar</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">₺{pendingRequest.amount}</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
                      <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Durum</p>
                    <p className="text-gray-600">Onay Bekliyor</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Talep Tarihi</p>
                    <p className="text-gray-600">{new Date(pendingRequest.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={async () => {
                await supabase
                  .from('payment_requests')
                  .update({ status: 'cancelled' })
                  .eq('id', pendingRequest.id)
                setPendingRequest(null)
              }}
              className="w-full py-4 bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition"
            >
              Kredi Kartı ile Yeni Ödeme Yap
            </button>
            <p className="text-center text-sm text-gray-500">
              Eski talep iptal edilip hemen kredi kartı ile ödeme yapabilirsin.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Premium pricing plans screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50 pt-12 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 bg-white border border-brand-200 rounded-full text-sm font-semibold text-brand-600">
              ✨ 14 gün ücretsiz deneme
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
            Basit, Saydamlı Fiyatlandırma
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Işınızı büyütmek için gerekli tüm araçları alın. Kurulum masrafı, gizli ücret yok.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
            <button className="px-6 py-2.5 rounded-full font-semibold text-gray-900 transition bg-gradient-to-r from-brand-100 to-purple-100">
              Aylık Ödeme
            </button>
            <button className="px-6 py-2.5 rounded-full font-semibold text-gray-600 hover:text-gray-900 transition">
              Yıllık Ödeme
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`relative group cursor-pointer transition-all duration-300 ${
                key === 'business' ? 'lg:scale-105' : ''
              }`}
            >
              {/* Glow background on hover */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                key === 'business'
                  ? 'from-brand-500 via-purple-500 to-pink-500'
                  : 'from-brand-200 to-purple-200'
              } rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10`}
              />

              <div className={`relative bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ${
                selectedPlan === key ? 'ring-2 ring-brand-500 shadow-2xl' : 'ring-1 ring-gray-100'
              }`}>
                {/* Badge */}
                {key === 'business' && (
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-2 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-bold rounded-full">
                      Tavsiye Edilen
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className={`px-8 pt-8 pb-6 bg-gradient-to-br ${
                  key === 'business'
                    ? 'from-brand-50 via-purple-50 to-pink-50'
                    : 'from-gray-50 to-gray-50'
                }`}>
                  <h2 className="text-3xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="text-gray-600 mt-2 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="px-8 pt-6 pb-8 border-b border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                      ₺{plan.price}
                    </span>
                    <span className="text-gray-500 font-semibold">/ay</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Tüm vergi ve ücretler dahil</p>
                </div>

                {/* CTA Button */}
                <div className="px-8 pt-8 pb-8">
                  <button
                    onClick={handlePayment}
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
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <span>Başla</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Features List */}
                <div className="px-8 pb-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`flex items-center justify-center h-5 w-5 rounded-lg ${
                          key === 'business'
                            ? 'bg-gradient-to-br from-brand-400 to-purple-500'
                            : 'bg-gradient-to-br from-brand-400 to-purple-500'
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

                {/* Plan Footer */}
                <div className={`px-8 py-4 border-t ${
                  key === 'business' ? 'bg-gradient-to-r from-brand-50 to-purple-50 border-brand-100' : 'bg-gray-50 border-gray-100'
                }`}>
                  <p className="text-xs text-gray-600">
                    <strong>30 Gün</strong> — Para iade garantisi
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
                <h3 className="font-semibold text-red-900">Bir hata oluştu</h3>
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
              <span>{showComparison ? '▼' : '▶'} Özellik Karşılaştırması</span>
            </p>
          </button>

          {showComparison && (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-lg animate-in fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-brand-50 to-purple-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-900">Özellik</th>
                      <th className="px-8 py-4 text-center text-sm font-bold text-gray-900">Pro</th>
                      <th className="px-8 py-4 text-center text-sm font-bold bg-gradient-to-r from-brand-100 to-purple-100">Business</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {COMPARISON_FEATURES.map((feature, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-8 py-4 text-sm font-semibold text-gray-900">{feature.name}</td>
                        <td className="px-8 py-4 text-center text-sm text-gray-600">
                          {feature.pro === '✓' ? (
                            <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : feature.pro === '✗' ? (
                            <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-gray-900 font-semibold">{feature.pro}</span>
                          )}
                        </td>
                        <td className="px-8 py-4 text-center text-sm text-gray-600 bg-gradient-to-r from-brand-50 to-purple-50">
                          {feature.business === '✓' ? (
                            <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-gray-900 font-semibold">{feature.business}</span>
                          )}
                        </td>
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
          <p className="text-gray-600 font-semibold mb-4">Kabul edilen ödeme yöntemleri</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['💳 Visa', '💳 Mastercard', '🏦 Troy', '📱 Taksit'].map((method) => (
              <div key={method} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm">
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            <strong>Sorularınız mı var?</strong> Destek ekibimize ulaşın:{' '}
            <a href="mailto:support@listingai.com" className="text-brand-600 hover:text-brand-700 font-semibold">
              support@listingai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
