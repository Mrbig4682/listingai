'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const PLANS = {
  pro: { name: 'Pro', price: 299, features: ['200 listing/ay', '3 platform desteği', 'Görsel analiz', 'Gelişmiş SEO skoru'] },
  business: { name: 'Business', price: 799, features: ['Sınırsız listing', 'Toplu CSV yükleme', 'Rakip analizi', 'Öncelikli destek'] },
}

export default function OdemePage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPlan, setCurrentPlan] = useState('free')
  const [pendingRequest, setPendingRequest] = useState(null)
  const [checkoutForm, setCheckoutForm] = useState(null)
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

  // Zaten Pro/Business ise
  if (currentPlan !== 'free') {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">
          {currentPlan === 'pro' ? 'Pro' : 'Business'} Plan Aktif!
        </h2>
        <p className="text-gray-500">Planın aktif, tüm özelliklerin kullanımında.</p>
        <div className="mt-6 bg-green-50 text-green-700 rounded-xl p-4 text-sm">
          Plan: <strong>{currentPlan === 'pro' ? 'Pro — ₺299/ay' : 'Business — ₺799/ay'}</strong>
        </div>
      </div>
    )
  }

  // iyzico checkout formu gösteriliyorsa
  if (checkoutForm) {
    return (
      <div className="max-w-lg mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">💳 Ödeme</h2>
          <button onClick={() => setCheckoutForm(null)}
            className="text-sm text-gray-500 hover:text-gray-700">
            ← Geri
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-1 shadow-sm">
          <div ref={checkoutRef} id="iyzipay-checkout-form" />
        </div>
      </div>
    )
  }

  // Bekleyen talep varsa — iptal edip yeni ödeme yapabilsin
  if (pendingRequest && !checkoutForm) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold mb-2">Ödeme Talebin İnceleniyor</h2>
        <p className="text-gray-500 mb-6">
          {PLANS[pendingRequest.plan]?.name} plan için ₺{pendingRequest.amount} tutarındaki ödeme talebin inceleniyor.
        </p>
        <div className="bg-amber-50 text-amber-700 rounded-xl p-4 text-sm mb-6">
          <strong>Talep Tarihi:</strong> {new Date(pendingRequest.created_at).toLocaleDateString('tr-TR')}
          <br />
          <strong>Durum:</strong> Onay Bekliyor
        </div>
        <button
          onClick={async () => {
            await supabase
              .from('payment_requests')
              .update({ status: 'cancelled' })
              .eq('id', pendingRequest.id)
            setPendingRequest(null)
          }}
          className="px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition text-sm"
        >
          Kredi Kartı ile Yeni Ödeme Yap
        </button>
        <p className="text-xs text-gray-400 mt-2">Eski talep iptal edilip kredi kartı ile ödeme yapabilirsin.</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-1">💎 Planını Yükselt</h2>
      <p className="text-gray-500 text-sm mb-6">Kredi kartı veya banka kartı ile güvenli ödeme yap.</p>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      {/* Plan Seçimi */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Object.entries(PLANS).map(([key, plan]) => (
          <button key={key} onClick={() => setSelectedPlan(key)}
            className={`p-4 rounded-xl border-2 text-left transition ${selectedPlan === key ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="font-bold text-sm">{plan.name}</div>
            <div className="text-2xl font-extrabold text-brand-500 mt-1">₺{plan.price}<span className="text-xs text-gray-400 font-normal">/ay</span></div>
            <div className="mt-2 space-y-1">
              {plan.features.map(f => (
                <div key={f} className="text-xs text-gray-500">✓ {f}</div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Güvenlik Bilgisi */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-xl">🔒</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-brand-500">Güvenli Ödeme</h3>
            <p className="text-xs text-gray-500">iyzico altyapısı ile 256-bit SSL korumalı</p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">Visa</div>
          <div className="bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">Mastercard</div>
          <div className="bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">Troy</div>
          <div className="bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">Taksit</div>
        </div>
      </div>

      {/* Ödeme Butonu */}
      <button onClick={handlePayment} disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 text-sm">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Yükleniyor...
          </span>
        ) : (
          `Ödemeye Geç — ₺${PLANS[selectedPlan].price}`
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        Ödeme işlemi iyzico güvenli altyapısı üzerinden gerçekleştirilir.
      </p>
    </div>
  )
}
