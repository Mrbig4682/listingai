'use client'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

function LanguageSelector() {
  const { locale, setLocale, translations, locales } = useI18n()
  return (
    <div className="flex items-center gap-0.5 bg-white/80 rounded-full px-1.5 py-1 border border-surface-200">
      {locales.map(loc => (
        <button key={loc} onClick={() => setLocale(loc)}
          className={`px-2 py-1 rounded-full text-[11px] font-semibold tracking-wide transition ${locale === loc ? 'bg-trust-dark text-white' : 'text-trust-light hover:text-trust-medium hover:bg-surface-100'}`}>
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
    { icon: '✦', title: l.feat1Title, desc: l.feat1Desc, gradient: 'from-pastel-indigo to-pastel-purple' },
    { icon: '◎', title: l.feat2Title, desc: l.feat2Desc, gradient: 'from-pastel-blue to-pastel-cyan' },
    { icon: '◈', title: l.feat3Title, desc: l.feat3Desc, gradient: 'from-pastel-green to-pastel-emerald' },
    { icon: '⬡', title: l.feat4Title, desc: l.feat4Desc, gradient: 'from-pastel-amber to-pastel-orange' },
  ]

  const plans = [
    {
      name: l.priceFree, price: '$0', period: `/ ${t.common.month}`,
      features: [`10 ${l.listings}/${t.common.month}`, '1 platform', 'SEO score'],
      cta: l.getStarted, highlight: false,
    },
    {
      name: l.pricePro, price: '$29', period: `/ ${t.common.month}`,
      features: [`200 ${l.listings}/${t.common.month}`, `${platforms.length} platforms`, 'AI optimizer', 'Keyword research', 'Bulk generation'],
      cta: l.getStarted, highlight: true, href: '/dashboard/odeme',
    },
    {
      name: l.priceBusiness, price: '$79', period: `/ ${t.common.month}`,
      features: [`${t.common.unlimited} ${l.listings}`, `${platforms.length} platforms`, 'AI assistant', 'Priority support', 'API access'],
      cta: l.getStarted, highlight: false, href: '/dashboard/odeme',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-5">
        <div className="text-xl font-bold tracking-tight text-trust-dark">
          <span className="gradient-text">listing</span><span className="text-trust-dark">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link href="/giris" className="px-4 py-2 text-sm font-medium text-trust-medium hover:text-trust-dark transition">{l.login}</Link>
          <Link href="/kayit" className="px-5 py-2.5 text-sm font-semibold bg-trust-dark text-white rounded-xl hover:bg-brand-600 transition">
            {l.cta}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pastel-indigo rounded-full blur-3xl opacity-40" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-pastel-purple rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pastel-blue rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 bg-white/80 border border-surface-200 rounded-full text-xs font-medium text-trust-medium">
            Powered by Claude AI
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-trust-dark">{l.hero}</span><br />
            <span className="gradient-text">{l.heroHighlight}</span>
          </h1>

          <p className="mt-6 text-lg text-trust-medium max-w-2xl mx-auto leading-relaxed font-light">
            {l.heroSub}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/kayit" className="px-8 py-4 bg-trust-dark text-white text-base font-semibold rounded-2xl hover:bg-brand-600 transition shadow-soft-lg hover:shadow-glow">
              {l.cta} →
            </Link>
            <span className="text-sm text-trust-light">{l.ctaSub}</span>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16 flex-wrap">
            {[{ num: '50K+', label: 'Listings' }, { num: '3.2K+', label: 'Sellers' }, { num: '34%', label: 'Avg. Sales Lift' }].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-trust-dark">{s.num}</div>
                <div className="text-xs text-trust-light font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Platform logos */}
          <div className="mt-12">
            <p className="text-xs text-trust-light font-medium uppercase tracking-wider mb-4">{l.trustedBy}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {platforms.map(p => (
                <div key={p.id} className="px-4 py-2 bg-white/80 border border-surface-200 rounded-xl text-sm font-medium text-trust-medium">
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-trust-dark">{l.features}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={i} className="trust-card bg-white rounded-2xl p-7 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-brand-600 text-lg font-bold`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-trust-dark text-lg mt-4">{f.title}</h3>
              <p className="text-trust-medium text-sm mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-trust-dark mb-16">
            {t.lang === 'Türkçe' ? 'Nasıl Çalışır?' : t.lang === 'Español' ? '¿Cómo Funciona?' : t.lang === 'Português' ? 'Como Funciona?' : t.lang === 'Deutsch' ? 'Wie funktioniert es?' : t.lang === 'Français' ? 'Comment ça marche ?' : 'How It Works'}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', color: 'bg-pastel-indigo text-brand-600' },
              { step: '02', color: 'bg-pastel-green text-emerald-600' },
              { step: '03', color: 'bg-pastel-amber text-amber-600' },
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
              const lang = locale || 'en'
              return (
                <div key={i} className="text-center">
                  <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-lg font-bold mx-auto`}>{s.step}</div>
                  <h3 className="font-semibold text-trust-dark mt-5">{(titles[lang] || titles.en)[i]}</h3>
                  <p className="text-trust-medium text-sm mt-2">{(descs[lang] || descs.en)[i]}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-trust-dark">{l.pricing}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <div key={i} className={`bg-white rounded-2xl p-7 relative transition ${p.highlight ? 'border-2 border-brand-400 shadow-glow' : 'border border-surface-200 shadow-soft'}`}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-4 py-1 rounded-full">{l.pricePopular}</span>
              )}
              <h3 className="font-semibold text-trust-dark text-lg mt-1">{p.name}</h3>
              <div className="mt-3">
                <span className="text-4xl font-bold text-trust-dark">{p.price}</span>
                <span className="text-trust-light text-sm ml-1">{p.period}</span>
              </div>
              <div className="mt-6 space-y-3">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-trust-medium">
                    <span className="text-brand-500">✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href={p.href || '/kayit'}
                className={`block text-center mt-7 py-3 rounded-xl font-semibold text-sm transition ${p.highlight ? 'bg-trust-dark text-white hover:bg-brand-600' : 'bg-surface-100 text-trust-dark hover:bg-surface-200'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-200 px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-lg font-bold tracking-tight">
            <span className="gradient-text">listing</span><span className="text-trust-dark">AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-trust-light">
            <span>© 2026 ListingAI</span>
            <Link href="/gizlilik" className="hover:text-trust-dark transition">{t?.sidebar?.privacy || 'Gizlilik Politikası'}</Link>
            <Link href="/kullanim-sartlari" className="hover:text-trust-dark transition">{t?.sidebar?.terms || 'Kullanım Şartları'}</Link>
            <Link href="/mesafeli-satis" className="hover:text-trust-dark transition">{t?.sidebar?.distanceSales || 'Mesafeli Satış'}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Helper for language matching in "how it works" section
const translations_lang_map = { tr: 'Türkçe', en: 'English', es: 'Español', pt: 'Português', de: 'Deutsch', fr: 'Français' }
