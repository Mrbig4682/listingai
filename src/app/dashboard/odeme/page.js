'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const PLANS = {
  pro: { name: 'Pro', price: 299, features: ['200 listing/ay', '3 platform desteği', 'Görsel analiz', 'Gelişmiş SEO skoru'] },
  business: { name: 'Business', price: 799, features: ['Sınırsız listing', 'Toplu CSV yükleme', 'Rakip analizi', 'Öncelikli destek'] },
}

const BANK_INFO = {
  bankName: 'Ziraat Bankası',
  accountHolder: 'KEREM BÜYÜK',
  iban: 'TR00 0000 0000 0000 0000 0000 00',
  description: 'ListingAI Pro/Business ödemesi',
}

export default function OdemePage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [senderName, setSenderName] = useState('')
  const [transferNote, setTransferNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [currentPlan, setCurrentPlan] = useState('free')
  const [pendingRequest, setPendingRequest] = useState(null)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Profil bilgisini al
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setCurrentPlan(profile.plan)
    }

    // Bekleyen ödeme talebi var mı?
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

  async function handleSubmit(e) {
    e.preventDefault()
    if (!senderName.trim()) {
      setError('Gönderen isim alanı zorunludur.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      const { error: insertError } = await supabase
        .from('payment_requests')
        .insert({
          user_id: user.id,
          plan: selectedPlan,
          amount: PLANS[selectedPlan].price,
          sender_name: senderName,
          transfer_note: transferNote,
        })

      if (insertError) throw insertError

      setSuccess(true)
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

  // Bekleyen talep varsa
  if (pendingRequest) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold mb-2">Ödeme Talebin İnceleniyor</h2>
        <p className="text-gray-500 mb-6">
          {PLANS[pendingRequest.plan]?.name} plan için ₺{pendingRequest.amount} tutarındaki ödeme talebin inceleniyor.
          Onaylandığında hesabın otomatik yükseltilecek.
        </p>
        <div className="bg-amber-50 text-amber-700 rounded-xl p-4 text-sm">
          <strong>Talep Tarihi:</strong> {new Date(pendingRequest.created_at).toLocaleDateString('tr-TR')}
          <br />
          <strong>Gönderen:</strong> {pendingRequest.sender_name}
          <br />
          <strong>Durum:</strong> Onay Bekliyor
        </div>
      </div>
    )
  }

  // Başarılı ödeme talebi
  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Ödeme Talebin Alındı!</h2>
        <p className="text-gray-500 mb-4">
          Havale/EFT işlemini yaptıktan sonra en geç 24 saat içinde hesabın yükseltilecek.
        </p>
        <div className="bg-green-50 text-green-700 rounded-xl p-4 text-sm text-left">
          <p><strong>Plan:</strong> {PLANS[selectedPlan].name}</p>
          <p><strong>Tutar:</strong> ₺{PLANS[selectedPlan].price}</p>
          <p><strong>Gönderen:</strong> {senderName}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-1">💎 Planını Yükselt</h2>
      <p className="text-gray-500 text-sm mb-6">Havale/EFT ile ödeme yap, hesabın 24 saat içinde yükseltilsin.</p>

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

      {/* Banka Bilgileri */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-sm mb-3 text-brand-500">🏦 Banka Bilgileri</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Banka:</span>
            <span className="font-semibold">{BANK_INFO.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Hesap Sahibi:</span>
            <span className="font-semibold">{BANK_INFO.accountHolder}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">IBAN:</span>
            <span className="font-mono font-semibold text-xs">{BANK_INFO.iban}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tutar:</span>
            <span className="font-bold text-brand-500 text-lg">₺{PLANS[selectedPlan].price}</span>
          </div>
        </div>
        <div className="mt-3 p-2 bg-white/60 rounded-lg">
          <p className="text-xs text-gray-500">📌 Açıklama kısmına "<strong>ListingAI {PLANS[selectedPlan].name}</strong>" ve e-posta adresinizi yazın.</p>
        </div>
      </div>

      {/* Ödeme Bildirim Formu */}
      <form onSubmit={handleSubmit}>
        <h3 className="font-bold text-sm mb-3">📝 Ödeme Bildirim Formu</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Gönderen İsim *</label>
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Havaleyi yapan kişinin adı soyadı"
              value={senderName} onChange={e => setSenderName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Not (opsiyonel)</label>
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Ek bilgi veya açıklama"
              value={transferNote} onChange={e => setTransferNote(e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={loading || !senderName.trim()}
          className="w-full mt-5 py-3.5 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 text-sm">
          {loading ? 'Gönderiliyor...' : `Ödeme Bildirimini Gönder — ₺${PLANS[selectedPlan].price}`}
        </button>
      </form>
    </div>
  )
}
