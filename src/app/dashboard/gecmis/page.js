'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function GecmisPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin-slow" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">📋 Listing Geçmişi</h2>

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="font-bold text-lg">Henüz listing yok</h3>
          <p className="text-gray-500 text-sm mt-1">İlk listingini oluşturmak için "Yeni Listing" sayfasına git.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{listing.product_name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(listing.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex gap-2">
                  {listing.platforms?.map(p => (
                    <span key={p} className="text-xs font-semibold px-2 py-1 bg-brand-50 text-brand-500 rounded-lg">{p}</span>
                  ))}
                  {listing.listing_results?.[0]?.seo_score && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${listing.listing_results[0].seo_score >= 80 ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                      SEO {listing.listing_results[0].seo_score}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
