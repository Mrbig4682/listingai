'use client'
import Link from 'next/link'

const features = [
  { icon: '🎯', title: 'SEO Uyumlu Başlıklar', desc: 'Platform algoritmalarına özel, arama sıralamasını yükselten başlıklar üretir.' },
  { icon: '📝', title: 'AI Açıklama Üretici', desc: 'Ürün özelliklerinden otomatik profesyonel açıklama ve bullet point oluşturur.' },
  { icon: '📷', title: 'Görsel Analiz', desc: 'Ürün fotoğrafından otomatik özellik çıkarma ve açıklama üretme. (Yakında)' },
  { icon: '📊', title: 'Rakip Analizi', desc: 'Rakip listinglerini analiz et, eksiklerini bul, öne geç. (Yakında)' },
]

const plans = [
  { name: 'Ücretsiz', price: '₺0', period: '/ay', features: ['10 listing/ay', 'Tek platform', 'Temel SEO skoru'], cta: 'Hemen Başla', highlight: false },
  { name: 'Pro', price: '₺299', period: '/ay', features: ['200 listing/ay', '3 platform', 'Görsel analiz', 'Gelişmiş SEO'], cta: "Pro'ya Geç", highlight: true, href: '/dashboard/odeme' },
  { name: 'Business', price: '₺799', period: '/ay', features: ['Sınırsız listing', 'Toplu CSV', 'Rakip analizi', 'Öncelikli destek'], cta: 'Business\'a Geç', highlight: false, href: '/dashboard/odeme' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50 px-4 py-20 text-center">
        <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16">
          <div className="text-2xl font-extrabold text-brand-500">🚀 ListingAI</div>
          <div className="flex gap-3">
            <Link href="/giris" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition">Giriş Yap</Link>
            <Link href="/kayit" className="px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition">Ücretsiz Başla</Link>
          </div>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-900 leading-tight">
          AI ile Ürün Listinglerini<br />
          <span className="text-brand-500">Saniyeler İçinde</span> Optimize Et
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          Trendyol, Hepsiburada ve N11 için SEO uyumlu, dönüşüm odaklı
          profesyonel listingler oluştur. Satışlarını artır.
        </p>
        <Link href="/kayit" className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-brand-500 to-purple-500 text-white text-lg font-bold rounded-xl hover:shadow-lg transition transform hover:-translate-y-0.5">
          Hemen Dene — Ücretsiz →
        </Link>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-14 flex-wrap">
          {[{ num: '50.000+', label: 'Listing Oluşturuldu' }, { num: '3.200+', label: 'Aktif Satıcı' }, { num: '%34', label: 'Ort. Satış Artışı' }].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-brand-500">{s.num}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-center text-brand-900 mb-12">Neler Yapabilirsin?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-brand-900 mb-12">Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Ürün Bilgilerini Gir', desc: 'Ürün adı, marka, kategori ve özellikleri yaz.' },
              { step: '2', title: 'AI Üretsin', desc: 'Yapay zeka saniyeler içinde optimize edilmiş listing oluşturur.' },
              { step: '3', title: 'Kopyala & Yapıştır', desc: 'Hazır listingi platforma kopyala, satışlarını artır.' },
            ].map(s => (
              <div key={s.step}>
                <div className="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">{s.step}</div>
                <h3 className="font-bold mt-4">{s.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-center text-brand-900 mb-12">Fiyatlandırma</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.name} className={`bg-white rounded-2xl p-7 shadow-sm border-2 relative ${p.highlight ? 'border-brand-500' : 'border-gray-100'}`}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">En Popüler</span>
              )}
              <h3 className="font-bold text-lg mt-2">{p.name}</h3>
              <div className="mt-3">
                <span className="text-4xl font-extrabold text-brand-900">{p.price}</span>
                <span className="text-gray-400 text-sm">{p.period}</span>
              </div>
              <div className="mt-5 space-y-3">
                {p.features.map(f => (
                  <div key={f} className="text-sm text-gray-600">✓ {f}</div>
                ))}
              </div>
              <Link href={p.href || '/kayit'} className={`block text-center mt-6 py-3 rounded-xl font-semibold transition ${p.highlight ? 'bg-brand-500 text-white hover:bg-brand-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-brand-900 text-white px-4 py-10 text-center">
        <div className="text-xl font-bold mb-2">🚀 ListingAI</div>
        <p className="text-brand-100 text-sm">Türk e-ticaret satıcıları için AI destekli listing optimizasyonu.</p>
        <p className="text-brand-100 text-xs mt-4">© 2026 ListingAI. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}
