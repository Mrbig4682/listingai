'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n/context'

export default function ProfilPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t } = useI18n()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUser(user)

    const { data: p } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (p) setProfile(p)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    )
  }

  const plan = profile?.plan || 'free'
  const used = profile?.listings_used || 0
  const limit = profile?.listings_limit || 10
  const planStarted = profile?.plan_started_at ? new Date(profile.plan_started_at) : null
  const planExpires = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null
  const daysLeft = planExpires ? Math.max(0, Math.ceil((planExpires - new Date()) / (1000 * 60 * 60 * 24))) : null

  const planInfo = {
    free: { name: 'Starter (Free)', icon: '🚀', color: 'from-gray-500 to-gray-600', badge: 'bg-gray-100 text-gray-700', price: '$0' },
    starter: { name: 'Starter', icon: '🚀', color: 'from-green-500 to-emerald-600', badge: 'bg-green-100 text-green-700', price: '$0' },
    pro: { name: 'Pro', icon: '⚡', color: 'from-brand-500 to-purple-600', badge: 'bg-purple-100 text-purple-700', price: '$1/mo' },
    business: { name: 'Business', icon: '👑', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-100 text-amber-700', price: '$2/mo' },
  }

  const current = planInfo[plan] || planInfo.free

  return (
    <div className="pb-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profil & Üyelik</h1>
          <p className="text-sm text-gray-500 mt-1">Hesap bilgilerin ve üyelik durumun</p>
        </div>

        {/* Account Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Hesap Bilgileri</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {(user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.user_metadata?.full_name || 'Kullanıcı'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${current.badge}`}>
                {current.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium">Kayıt Tarihi</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium">Giriş Yöntemi</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {user?.app_metadata?.provider === 'google' ? '🔵 Google' : user?.app_metadata?.provider === 'apple' ? '⚫ Apple' : '📧 E-posta'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className={`bg-gradient-to-r ${current.color} px-6 py-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Aktif Plan</p>
                <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                  <span className="text-2xl">{current.icon}</span>
                  {current.name}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{current.price}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">İlan Kullanımı</p>
                <p className="text-sm font-bold text-gray-900">
                  {used} / {limit >= 999999 ? '∞' : limit}
                </p>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${current.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${limit >= 999999 ? 10 : Math.min(100, (used / limit) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {limit >= 999999 ? 'Sınırsız ilan hakkı' : `${Math.max(0, limit - used)} ilan hakkı kaldı`}
              </p>
            </div>

            {/* Subscription Details */}
            {plan !== 'free' && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium">Başlangıç Tarihi</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {planStarted ? planStarted.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium">Bitiş Tarihi</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {planExpires ? planExpires.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </p>
                </div>
                {daysLeft !== null && (
                  <div className="col-span-2 bg-green-50 rounded-xl p-3 border border-green-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-sm font-medium text-green-700">
                        Üyeliğiniz aktif — {daysLeft} gün kaldı
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              {plan === 'free' ? (
                <a
                  href="/dashboard/odeme"
                  className="flex-1 py-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all text-center"
                >
                  Planı Yükselt
                </a>
              ) : plan !== 'business' ? (
                <a
                  href="/dashboard/odeme"
                  className="flex-1 py-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all text-center"
                >
                  Business'a Yükselt
                </a>
              ) : null}
              <a
                href="mailto:listingai.official@gmail.com"
                className="flex-1 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all text-center"
              >
                Destek Al
              </a>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <PaymentHistory userId={user?.id} />
      </div>
    </div>
  )
}

function PaymentHistory({ userId }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('shopier_payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setPayments(data || [])
        setLoading(false)
      })
  }, [userId])

  if (loading) return null

  const statusMap = {
    completed: { label: 'Tamamlandı', class: 'bg-green-100 text-green-700' },
    pending: { label: 'Beklemede', class: 'bg-yellow-100 text-yellow-700' },
    failed: { label: 'Başarısız', class: 'bg-red-100 text-red-700' },
  }

  const planLabels = { starter: 'Starter', pro: 'Pro', business: 'Business' }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Ödeme Geçmişi</h2>
      </div>
      {payments.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-400">Henüz ödeme kaydı yok</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {payments.map((p) => {
            const status = statusMap[p.status] || statusMap.pending
            return (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <span className="text-lg">{p.plan === 'business' ? '👑' : p.plan === 'pro' ? '⚡' : '🚀'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{planLabels[p.plan] || p.plan} Plan</p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-bold text-gray-900">${p.amount}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.class}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
