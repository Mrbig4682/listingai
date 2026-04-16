'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'kerem.buyuk903@gmail.com'

// Mini chart component - CSS tabanlı bar chart
function MiniChart({ data = [65, 45, 75, 35, 85, 55, 90] }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-purple-400 to-purple-300 rounded-t opacity-70 hover:opacity-100 transition"
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

// Avatar component
function Avatar({ name, className = '' }) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  const colors = ['bg-gradient-to-br from-purple-400 to-purple-600', 'bg-gradient-to-br from-blue-400 to-blue-600', 'bg-gradient-to-br from-pink-400 to-pink-600']
  const hash = name?.charCodeAt(0) || 0
  const color = colors[hash % colors.length]

  return (
    <div className={`flex items-center justify-center rounded-full font-bold text-white text-sm ${color} ${className}`}>
      {initials}
    </div>
  )
}

// Skeleton loading component
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 border border-surface-200">
      <div className="space-y-3">
        <div className="h-4 bg-surface-200 rounded w-1/3 animate-pulse" />
        <div className="h-8 bg-surface-200 rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-surface-200 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [requests, setRequests] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pro: 0,
    business: 0,
    revenue: 0,
    newToday: 0,
    pendingPayments: 0,
    activeSubscriptions: 0
  })
  const [expandedRequest, setExpandedRequest] = useState(null)
  const [approvalNotes, setApprovalNotes] = useState({})
  const [searchUser, setSearchUser] = useState('')
  const [userPlanChange, setUserPlanChange] = useState({})

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
      const today = new Date().toISOString().split('T')[0]
      const newToday = profileData.filter(u =>
        u.created_at?.split('T')[0] === today
      ).length
      const activeSubscriptions = pro + biz
      const pendingCount = (paymentData || []).filter(r => r.status === 'pending').length

      setStats({
        total: profileData.length,
        pro,
        business: biz,
        revenue: (pro * 1) + (biz * 2),
        newToday,
        pendingPayments: pendingCount,
        activeSubscriptions
      })
    }
  }

  async function handleApprove(request) {
    try {
      const notes = approvalNotes[request.id] || ''

      await supabase
        .from('payment_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          admin_notes: notes
        })
        .eq('id', request.id)

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

      setApprovalNotes(prev => {
        const newNotes = { ...prev }
        delete newNotes[request.id]
        return newNotes
      })
      setExpandedRequest(null)
      await loadData()
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  async function handleReject(request) {
    try {
      const notes = approvalNotes[request.id] || ''

      await supabase
        .from('payment_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          admin_notes: notes
        })
        .eq('id', request.id)

      setApprovalNotes(prev => {
        const newNotes = { ...prev }
        delete newNotes[request.id]
        return newNotes
      })
      setExpandedRequest(null)
      await loadData()
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  async function changePlan(userId, newPlan) {
    try {
      const newLimit = newPlan === 'pro' ? 200 : newPlan === 'business' ? 999999 : 5
      const expiry = new Date()
      expiry.setMonth(expiry.getMonth() + 1)

      await supabase
        .from('user_profiles')
        .update({
          plan: newPlan,
          listings_limit: newLimit,
          plan_started_at: new Date().toISOString(),
          plan_expires_at: newPlan === 'free' ? null : expiry.toISOString(),
        })
        .eq('id', userId)

      setUserPlanChange({})
      await loadData()
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] to-white flex items-center justify-center">
        <div className="space-y-8 w-full max-w-2xl px-4">
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-pink-100">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h1>
          <p className="text-gray-600 mb-6">Bu sayfaya erişim yetkiniz bulunmamaktadır. Lütfen daha sonra tekrar deneyin.</p>
          <a href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
            ← Dashboard'a Dön
          </a>
        </div>
      </div>
    )
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const allRequests = requests
  const filteredUsers = users.filter(u =>
    (u.email || '').toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(searchUser.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] to-white">
      {/* Header Gradient Bar */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-purple-100">ListingAI Yönetim Paneli</p>
            </div>
            <div className="flex items-center gap-3">
              <Avatar name={user?.email || 'Admin'} className="w-12 h-12" />
              <a href="/dashboard" className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition font-medium text-sm">
                ← Dashboard'a Dön
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">Yeni Kullanıcı (Bugün)</span>
              <span className="text-2xl">👤</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.newToday}</div>
            <div className="text-xs text-gray-500">Son 24 saat</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">Beklenen Ödemeler</span>
              <span className="text-2xl">⏳</span>
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-1">{stats.pendingPayments}</div>
            <div className="text-xs text-gray-500">Acil işlem gerekli</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">Aktif Abonelikler</span>
              <span className="text-2xl">✓</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.activeSubscriptions}</div>
            <div className="text-xs text-gray-500">Pro + Business</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">Aylık Gelir</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">${(stats.revenue / 1000).toFixed(1)}K</div>
            <div className="text-xs text-gray-500">Toplam gelir</div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Toplam Kullanıcı',
              value: stats.total,
              gradient: 'from-blue-500 to-blue-600',
              icon: '👥',
              trend: '+12% bu ay'
            },
            {
              label: 'Pro Abone',
              value: stats.pro,
              gradient: 'from-purple-500 to-purple-600',
              icon: '⭐',
              trend: '+4 yeni'
            },
            {
              label: 'Business Abone',
              value: stats.business,
              gradient: 'from-amber-500 to-amber-600',
              icon: '💎',
              trend: '+2 yeni'
            },
            {
              label: 'Aylık Gelir',
              value: `$${stats.revenue.toLocaleString('en-US')}`,
              gradient: 'from-green-500 to-green-600',
              icon: '💵',
              trend: '+8% artış'
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-surface-200 shadow-sm hover:shadow-lg transition group">
              <div className={`bg-gradient-to-br ${stat.gradient} p-4 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10" />
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded text-white font-semibold">
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Gelir Trendi (Son 7 Gün)</h2>
            <span className="text-sm text-gray-500">Aylık</span>
          </div>
          <MiniChart data={[1200, 1900, 1600, 2400, 1800, 2200, 2800]} />
          <div className="mt-4 text-sm text-gray-600">
            Toplam: <span className="font-bold text-gray-900">₺14,040</span>
          </div>
        </div>

        {/* User Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Son Kullanıcılar</h3>
            <div className="space-y-3">
              {users.slice(0, 3).map(u => (
                <div key={u.id} className="flex items-center gap-3">
                  <Avatar name={u.full_name || u.email} className="w-8 h-8" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{u.full_name || 'Kullanıcı'}</div>
                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Plan Dağılımı</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Pro Abone</span>
                  <span className="font-semibold text-purple-600">{stats.pro}</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                    style={{ width: `${(stats.pro / stats.total) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Business Abone</span>
                  <span className="font-semibold text-amber-600">{stats.business}</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full"
                    style={{ width: `${(stats.business / stats.total) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Ücretsiz Kullanıcı</span>
                  <span className="font-semibold text-gray-600">{stats.total - stats.pro - stats.business}</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-gray-400 to-gray-600 h-2 rounded-full"
                    style={{ width: `${((stats.total - stats.pro - stats.business) / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Sistem Sağlığı</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">API Kullanımı</span>
                  <span className="font-semibold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full w-3/4" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Veritabanı</span>
                  <span className="font-semibold text-gray-900">45%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-5/12" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Depolama</span>
                  <span className="font-semibold text-gray-900">62%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full w-3/5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-0 border-b-2 border-surface-200">
            {[
              { id: 'pending', label: `Beklenen Ödemeler (${pendingRequests.length})`, icon: '⏳' },
              { id: 'all', label: `Tüm Talepler (${allRequests.length})`, icon: '📋' },
              { id: 'users', label: `Kullanıcılar (${filteredUsers.length})`, icon: '👥' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-6 py-4 text-sm font-semibold transition relative ${
                  tab === t.id
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  {t.icon} {t.label}
                </span>
                {tab === t.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pending Requests Tab */}
        {tab === 'pending' && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-surface-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-50 mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Tüm Ödemeler Tamamlandı</h3>
                <p className="text-gray-600">Bekleyen ödeme talebi bulunmamaktadır.</p>
              </div>
            ) : (
              pendingRequests.map(req => (
                <div key={req.id} className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar name={req.sender_name} className="w-12 h-12" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-lg">{req.sender_name}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              req.plan === 'pro'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {req.plan === 'pro' ? '⭐ Pro' : '💎 Business'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{req.email || 'Email yok'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${req.amount.toLocaleString('tr-TR')}</div>
                        <div className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString('tr-TR')}</div>
                      </div>
                    </div>

                    {req.transfer_note && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-900"><strong>Not:</strong> {req.transfer_note}</p>
                      </div>
                    )}

                    {/* Expandable Details */}
                    <button
                      onClick={() => setExpandedRequest(expandedRequest === req.id ? null : req.id)}
                      className="text-sm text-purple-600 font-semibold mb-4 hover:text-purple-700"
                    >
                      {expandedRequest === req.id ? '▼ Ayrıntıları Gizle' : '▶ Ayrıntıları Göster'}
                    </button>

                    {expandedRequest === req.id && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4 border border-surface-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-600 font-semibold mb-1">TALEP NUMARASI</div>
                            <div className="text-sm font-mono text-gray-900">{req.id.slice(0, 8)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 font-semibold mb-1">OLUŞTURULMA TARİHİ</div>
                            <div className="text-sm text-gray-900">{new Date(req.created_at).toLocaleString('tr-TR')}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 font-semibold mb-1">KULLANICI ID</div>
                            <div className="text-sm font-mono text-gray-900">{req.user_id.slice(0, 8)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 font-semibold mb-1">DURUM</div>
                            <div className="text-sm">
                              <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                Beklemede
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Admin Notes */}
                        <div>
                          <label className="text-xs text-gray-600 font-semibold mb-2 block">YÖNETİCİ NOTLARI</label>
                          <textarea
                            placeholder="Onay/Ret sebebini yazınız..."
                            value={approvalNotes[req.id] || ''}
                            onChange={(e) => setApprovalNotes(prev => ({
                              ...prev,
                              [req.id]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="3"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(req)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <span>✓</span> Onayla
                      </button>
                      <button
                        onClick={() => handleReject(req)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-100 to-red-50 text-red-600 font-semibold rounded-lg hover:shadow-lg transition border border-red-200 flex items-center justify-center gap-2"
                      >
                        <span>✕</span> Reddet
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* All Requests Tab */}
        {tab === 'all' && (
          <div className="space-y-2">
            {allRequests.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-surface-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <span className="text-3xl">📋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Talep Bulunmamaktadır</h3>
                <p className="text-gray-600">Henüz bir ödeme talebi oluşturulmamıştır.</p>
              </div>
            ) : (
              allRequests.map(req => (
                <div key={req.id} className="bg-white rounded-lg border border-surface-200 px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar name={req.sender_name} className="w-10 h-10 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900">{req.sender_name}</div>
                      <div className="text-sm text-gray-500">{req.email}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ${req.amount.toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.plan === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {req.plan === 'pro' ? 'Pro' : 'Business'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status === 'approved' ? '✓ Onaylandı' :
                       req.status === 'rejected' ? '✕ Reddedildi' :
                       '⏳ Beklemede'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Kullanıcı ara (email veya ad)..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full px-4 py-3 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-sm">
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Kullanıcı Bulunmamaktadır</h3>
                  <p className="text-gray-600">Arama kriterlerine uygun kullanıcı yok.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-surface-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Kullanıcı</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">İlan Sayısı</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Kullanım</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Plan</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Hızlı İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={u.full_name || u.email} className="w-10 h-10" />
                              <div className="min-w-0">
                                <div className="font-semibold text-gray-900">{u.full_name || 'Kullanıcı'}</div>
                                <div className="text-sm text-gray-500 truncate">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{u.listings_used || 0}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                {u.listings_used || 0}/{u.listings_limit || 5}
                              </div>
                              <div className="w-24 bg-surface-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(((u.listings_used || 0) / (u.listings_limit || 5)) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              u.plan === 'pro' ? 'bg-purple-100 text-purple-700' :
                              u.plan === 'business' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {u.plan === 'pro' ? '⭐ Pro' :
                               u.plan === 'business' ? '💎 Business' :
                               'Ücretsiz'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <select
                                value={userPlanChange[u.id] || u.plan || 'free'}
                                onChange={(e) => {
                                  setUserPlanChange(prev => ({
                                    ...prev,
                                    [u.id]: e.target.value
                                  }))
                                }}
                                className="px-2 py-1 text-xs border border-surface-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="free">Ücretsiz</option>
                                <option value="pro">Pro</option>
                                <option value="business">Business</option>
                              </select>
                              <button
                                onClick={() => changePlan(u.id, userPlanChange[u.id] || u.plan || 'free')}
                                className="px-2 py-1 text-xs font-semibold bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                              >
                                Güncelle
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
