'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Admin e-posta adresi - sadece bu kişi erişebilir
const ADMIN_EMAIL = 'kerem.buyuk903@gmail.com'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [requests, setRequests] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pro: 0, business: 0, revenue: 0 })

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== ADMIN_EMAIL) {
      setIsAdmin(false)
      setLoading(false)
      return
    }
    setUser(user)
    setIsAdmin(true)
    await loadData()
    setLoading(false)
  }

  async function loadData() {
    // Ödeme taleplerini al
    const { data: paymentData } = await supabase
      .from('payment_requests')
      .select('*')
      .order('created_at', { ascending: false })

    setRequests(paymentData || [])

    // Kullanıcı profillerini al
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    setUsers(profileData || [])

    // İstatistikler
    if (profileData) {
      const pro = profileData.filter(u => u.plan === 'pro').length
      const biz = profileData.filter(u => u.plan === 'business').length
      setStats({
        total: profileData.length,
        pro,
        business: biz,
        revenue: (pro * 299) + (biz * 799)
      })
    }
  }

  async function handleApprove(request) {
    try {
      // 1. Ödeme talebini onayla
      await supabase
        .from('payment_requests')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', request.id)

      // 2. Kullanıcının planını yükselt
      const newLimit = request.plan === 'pro' ? 200 : 999999
      const expiry = new Date()
      expiry.setMonth(expiry.getMonth() + 1)

      await supabase
        .from('user_profiles')
        .update({
          plan: request.plan,
          listings_limit: newLimit,
          listings_used: 0,
          plan_started_at: new Date().toISOString(),
          plan_expires_at: expiry.toISOString(),
        })
        .eq('id', request.user_id)

      await loadData()
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  async function handleReject(request) {
    await supabase
      .from('payment_requests')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', request.id)

    await loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold">Erişim Engellendi</h1>
          <p className="text-gray-500 mt-2">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    )
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const allRequests = requests

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">🛡️ Admin Paneli</h1>
            <p className="text-sm text-gray-500">ListingAI Yönetim</p>
          </div>
          <a href="/dashboard/yeni" className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 transition">
            ← Dashboard
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Toplam Kullanıcı', value: stats.total, icon: '👥', color: 'bg-blue-50 text-blue-600' },
            { label: 'Pro Abone', value: stats.pro, icon: '⭐', color: 'bg-purple-50 text-purple-600' },
            { label: 'Business Abone', value: stats.business, icon: '💎', color: 'bg-amber-50 text-amber-600' },
            { label: 'Aylık Gelir', value: `₺${stats.revenue.toLocaleString('tr-TR')}`, icon: '💰', color: 'bg-green-50 text-green-600' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="text-xs opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => setTab('pending')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${tab === 'pending' ? 'bg-white shadow-sm text-indigo-500' : 'text-gray-500'}`}>
            Bekleyen ({pendingRequests.length})
          </button>
          <button onClick={() => setTab('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${tab === 'all' ? 'bg-white shadow-sm text-indigo-500' : 'text-gray-500'}`}>
            Tüm Talepler
          </button>
          <button onClick={() => setTab('users')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${tab === 'users' ? 'bg-white shadow-sm text-indigo-500' : 'text-gray-500'}`}>
            Kullanıcılar
          </button>
        </div>

        {/* Pending Requests */}
        {tab === 'pending' && (
          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                <p>Bekleyen ödeme talebi yok</p>
              </div>
            ) : (
              pendingRequests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{req.sender_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${req.plan === 'pro' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'}`}>
                          {req.plan === 'pro' ? 'Pro' : 'Business'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        ₺{req.amount} • {new Date(req.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {req.transfer_note && (
                        <div className="text-xs text-gray-400 mt-1">Not: {req.transfer_note}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(req)}
                        className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition">
                        ✓ Onayla
                      </button>
                      <button onClick={() => handleReject(req)}
                        className="px-4 py-2 bg-red-100 text-red-500 text-xs font-bold rounded-lg hover:bg-red-200 transition">
                        ✕ Reddet
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* All Requests */}
        {tab === 'all' && (
          <div className="space-y-2">
            {allRequests.map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold">{req.sender_name}</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span>{req.plan === 'pro' ? 'Pro' : 'Business'}</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span>₺{req.amount}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  req.status === 'approved' ? 'bg-green-100 text-green-600' :
                  req.status === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {req.status === 'approved' ? 'Onaylandı' : req.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold">{u.email || 'E-posta yok'}</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-500">Kullanım: {u.listings_used}/{u.listings_limit}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  u.plan === 'pro' ? 'bg-purple-100 text-purple-600' :
                  u.plan === 'business' ? 'bg-amber-100 text-amber-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {u.plan === 'pro' ? 'Pro' : u.plan === 'business' ? 'Business' : 'Ücretsiz'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
