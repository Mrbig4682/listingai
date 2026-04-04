'use client'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

function LanguageSelector() {
  const { locale, setLocale, translations, locales } = useI18n()
  return (
    <div className="flex items-center gap-0.5 bg-white/80 rounded-full px-1.5 py-1 border border-surface-200 backdrop-blur-sm">
      {locales.map(loc => (
        <button key={loc} onClick={() => setLocale(loc)}
          className={`px-2 py-1 rounded-full text-[11px] font-semibold tracking-wide transition ${locale === loc ? 'bg-brand-600 text-white shadow-sm' : 'text-trust-light hover:text-trust-medium hover:bg-surface-100'}`}>
          {translations[loc].code}
        </button>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const { t, platforms, market, locale } = useI18n()
  const l = t.landing

  const features = [
    { icon: '✦', title: l.feat1Title, desc: l.feat1Desc, color: 'from-violet-500 to-purple-600', iconBg: 'bg-violet-100 text-violet-600' },
    { icon: '◎', title: l.feat2Title, desc: l.feat2Desc, color: 'from-cyan-500 to-blue-600', iconBg: 'bg-cyan-100 text-cyan-600' },
    { icon: '◈', title: l.feat3Title, desc: l.feat3Desc, color: 'from-emerald-500 to-green-600', iconBg: 'bg-emerald-100 text-emerald-600' },
    { icon: '⬡', title: l.feat4Title, desc: l.feat4Desc, color: 'from-amber-500 to-orange-600', iconBg: 'bg-amber-100 text-amber-600' },
  ]

  // Detailed, enticing plan descriptions per language
  const planDetails = {
    tr: {
      free: {
        subtitle: 'Başlangıç için mükemmel',
        features: [
          { text: 'Ayda 10 AI ilan', highlight: false },
          { text: '1 platform desteği', highlight: false },
          { text: 'SEO skor analizi', highlight: false },
          { text: 'Temel anahtar kelime', highlight: false },
        ]
      },
      pro: {
        subtitle: 'Büyüyen satıcılar için',
        badge: 'En Popüler',
        features: [
          { text: 'Ayda 200 AI ilan', highlight: true },
          { text: '11 platform desteği', highlight: true },
          { text: 'AI ilan optimize edici', highlight: false },
          { text: 'Gelişmiş anahtar kelime', highlight: false },
          { text: 'Toplu ilan üretimi', highlight: false },
          { text: 'Rakip analizi', highlight: true },
          { text: 'A/B test', highlight: false },
        ]
      },
      business: {
        subtitle: 'Profesyonel e-ticaret markaları için',
        features: [
          { text: 'Sınırsız AI ilan', highlight: true },
          { text: '11 platform desteği', highlight: true },
          { text: 'Marka DNA analizi', highlight: true },
          { text: 'AI e-ticaret asistanı', highlight: true },
          { text: 'Öncelikli destek', highlight: false },
          { text: 'API erişimi', highlight: false },
          { text: 'Tüm Pro özellikleri', highlight: false },
        ]
      }
    },
    en: {
      free: {
        subtitle: 'Perfect to get started',
        features: [
          { text: '10 AI listings/month', highlight: false },
          { text: '1 platform support', highlight: false },
          { text: 'SEO score analysis', highlight: false },
          { text: 'Basic keywords', highlight: false },
        ]
      },
      pro: {
        subtitle: 'For growing sellers',
        badge: 'Most Popular',
        features: [
          { text: '200 AI listings/month', highlight: true },
          { text: 'All 11 platforms', highlight: true },
          { text: 'AI listing optimizer', highlight: false },
          { text: 'Advanced keyword research', highlight: false },
          { text: 'Bulk generation', highlight: false },
          { text: 'Competitor analysis', highlight: true },
          { text: 'A/B testing', highlight: false },
        ]
      },
      business: {
        subtitle: 'For professional e-commerce brands',
        features: [
          { text: 'Unlimited AI listings', highlight: true },
          { text: 'All 11 platforms', highlight: true },
          { text: 'Brand DNA analysis', highlight: true },
          { text: 'AI e-commerce assistant', highlight: true },
          { text: 'Priority support', highlight: false },
          { text: 'API access', highlight: false },
          { text: 'All Pro features', highlight: false },
        ]
      }
    }
  }

  const lang = planDetails[locale] ? locale : 'en'
  const pd = planDetails[lang]

  const plans = [
    {
      name: l.priceFree, price: '$0', period: `/ ${t.common.month}`,
      ...pd.free, highlight: false, href: '/kayit',
    },
    {
      name: l.pricePro, price: '$29', period: `/ ${t.common.month}`,
      ...pd.pro, highlight: true, href: '/dashboard/odeme',
    },
    {
      name: l.priceBusiness, price: '$79', period: `/ ${t.common.month}`,
      ...pd.business, highlight: false, href: '/dashboard/odeme',
    },
  ]

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-5">
        <div className="text-xl font-bold tracking-tight text-trust-dark">
          <span className="gradient-text">listing</span><span className="text-trust-dark">AI</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:block"><LanguageSelector /></div>
          <Link href="/giris" className="px-4 py-2 text-sm font-medium text-trust-medium hover:text-trust-dark transition">{l.login}</Link>
          <Link href="/kayit" className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl hover:shadow-glow transition">
            {l.cta}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-violet-200 to-purple-300 rounded-full blur-3xl opacity-40 animate-pulse-soft" />
          <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-200 to-pink-300 rounded-full blur-3xl opacity-30 animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[-10%] left-[40%] w-[350px] h-[350px] bg-gradient-to-br from-cyan-200 to-blue-300 rounded-full blur-3xl opacity-30 animate-pulse-soft" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/90 border border-brand-200 rounded-full text-xs font-semibold text-brand-600 shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Powered by Claude AI
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-gray-900">{l.hero}</span><br />
            <span className="bg-gradient-to-r from-brand-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">{l.heroHighlight}</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {l.heroSub}
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/kayit" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 via-purple-600 to-fuchsia-600 text-white text-base font-bold rounded-2xl hover:shadow-glow hover:scale-[1.02] transition-all shadow-lg">
              {l.cta} →
            </Link>
            <span className="text-sm text-gray-400">{l.ctaSub}</span>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mt-14 flex-wrap">
            {[
              { num: '50K+', label: 'Listings', color: 'text-brand-600' },
              { num: '3.2K+', label: 'Sellers', color: 'text-emerald-600' },
              { num: '34%', label: 'Avg. Sales Lift', color: 'text-fuchsia-600' }
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl md:text-3xl font-extrabold ${s.color}`}>{s.num}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Platform logos */}
          <div className="mt-12">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-4">{l.trustedBy}</p>
            <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
              {platforms.map(p => (
                <div key={p.id} className="px-3 py-1.5 bg-white/80 border border-gray-100 rounded-lg text-xs font-medium text-gray-500 backdrop-blur-sm hover:border-brand-200 hover:text-brand-600 transition">
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900">{l.features}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {features.map((f, i) => (
            <div key={i} className="group bg-white rounded-2xl p-6 md:p-7 border border-gray-100 hover:border-brand-200 hover:shadow-glow transition-all">
              <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base md:text-lg mt-4">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-b from-white to-[#faf8ff] px-6 py-20 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-14">
            {locale === 'tr' ? 'Nasıl Çalışır?' : locale === 'es' ? '¿Cómo Funciona?' : locale === 'pt' ? 'Como Funciona?' : locale === 'de' ? 'Wie funktioniert es?' : locale === 'fr' ? 'Comment ça marche ?' : 'How It Works'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: '01', color: 'bg-gradient-to-br from-brand-500 to-purple-500 text-white', line: true },
              { step: '02', color: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white', line: true },
              { step: '03', color: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white', line: false },
            ].map((s, i) => {
              const titles = {
                tr: ['Ürün Bilgilerini Gir', 'AI Üretsin', 'Kopyala & Yapıştır'],
                en: ['Enter Product Details', 'AI Generates', 'Copy & Paste'],
                es: ['Ingresa Datos del Producto', 'IA Genera', 'Copia y Pega'],
                pt: ['Insira os Dados', 'IA Gera', 'Copie e Cole'],
                de: ['Produktdaten Eingeben', 'KI Generiert', 'Kopieren & Einfügen'],
                fr: ['Entrez les Détails', 'L\'IA Génère', 'Copiez & Collez'],
              }
              const descs = {
                tr: ['Ürün adı, marka ve özellikleri gir.', 'AI saniyeler içinde optimize edilmiş listing oluşturur.', 'Hazır listingi platforma kopyala, satışlarını artır.'],
                en: ['Enter product name, brand, and features.', 'AI creates optimized listings in seconds.', 'Copy the ready listing to your platform and boost sales.'],
                es: ['Ingresa nombre, marca y características.', 'La IA crea listings optimizados en segundos.', 'Copia el listing a tu plataforma y aumenta ventas.'],
                pt: ['Insira nome, marca e características.', 'A IA cria listings otimizados em segundos.', 'Copie o listing para sua plataforma e aumente vendas.'],
                de: ['Produktname, Marke und Eigenschaften eingeben.', 'KI erstellt optimierte Listings in Sekunden.', 'Kopiere das fertige Listing und steigere Verkäufe.'],
                fr: ['Entrez nom, marque et caractéristiques.', 'L\'IA crée des listings optimisés en secondes.', 'Copiez le listing et augmentez vos ventes.'],
              }
              const la = locale || 'en'
              return (
                <div key={i} className="text-center relative">
                  <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-lg font-bold mx-auto shadow-lg`}>{s.step}</div>
                  <h3 className="font-bold text-gray-900 mt-5">{(titles[la] || titles.en)[i]}</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{(descs[la] || descs.en)[i]}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pricing — Completely redesigned */}
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900">{l.pricing}</h2>
          <p className="text-gray-400 text-sm mt-3">{locale === 'tr' ? '14 gün ücretsiz deneyin. İstediğiniz zaman iptal edin.' : '14-day free trial. Cancel anytime.'}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-start">
          {plans.map((p, i) => (
            <div key={i} className={`relative rounded-2xl md:rounded-3xl transition-all ${
              p.highlight
                ? 'bg-gradient-to-b from-brand-600 via-purple-600 to-fuchsia-600 text-white p-[2px] shadow-glow md:scale-105 md:-my-3'
                : 'bg-white border border-gray-100 shadow-soft'
            }`}>
              {p.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md">
                    {p.badge || l.pricePopular}
                  </span>
                </div>
              )}
              <div className={`${p.highlight ? 'bg-gray-900 rounded-[22px] md:rounded-[22px]' : ''} p-6 md:p-8`}>
                <div className={`text-sm font-semibold ${p.highlight ? 'text-brand-300' : 'text-gray-400'}`}>{p.name}</div>
                <div className={`text-[11px] mt-1 ${p.highlight ? 'text-gray-400' : 'text-gray-400'}`}>{p.subtitle}</div>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className={`text-4xl md:text-5xl font-extrabold ${p.highlight ? 'text-white' : 'text-gray-900'}`}>{p.price}</span>
                  <span className={`text-sm ${p.highlight ? 'text-gray-400' : 'text-gray-400'}`}>{p.period}</span>
                </div>

                <div className={`mt-6 pt-6 border-t ${p.highlight ? 'border-gray-700' : 'border-gray-100'} space-y-3`}>
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        p.highlight
                          ? (f.highlight ? 'bg-brand-500 text-white' : 'bg-gray-700 text-gray-300')
                          : (f.highlight ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400')
                      }`}>✓</span>
                      <span className={`text-sm ${
                        p.highlight
                          ? (f.highlight ? 'text-white font-medium' : 'text-gray-300')
                          : (f.highlight ? 'text-gray-900 font-medium' : 'text-gray-500')
                      }`}>{f.text}</span>
                    </div>
                  ))}
                </div>

                <Link href={p.href || '/kayit'}
                  className={`block text-center mt-7 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    p.highlight
                      ? 'bg-gradient-to-r from-brand-500 to-fuchsia-500 text-white hover:shadow-glow hover:scale-[1.02]'
                      : i === 2
                        ? 'bg-gray-900 text-white hover:bg-brand-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {p.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-lg font-bold tracking-tight">
            <span className="gradient-text">listing</span><span className="text-gray-900">AI</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400 flex-wrap justify-center">
            <span>© 2026 ListingAI</span>
            <Link href="/gizlilik" className="hover:text-gray-700 transition">{t?.sidebar?.privacy || 'Gizlilik'}</Link>
            <Link href="/kullanim-sartlari" className="hover:text-gray-700 transition">{t?.sidebar?.terms || 'Kullanım Şartları'}</Link>
            <Link href="/mesafeli-satis" className="hover:text-gray-700 transition">{t?.sidebar?.distanceSales || 'Mesafeli Satış'}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
