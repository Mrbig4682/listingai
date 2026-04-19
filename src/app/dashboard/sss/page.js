'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

const faqData = {
  tr: [
    { q: 'ListingAI nedir?', a: 'ListingAI, yapay zeka destekli e-ticaret ilan optimizasyonu platformudur. Amazon, eBay, Etsy, Trendyol ve daha birçok platform için SEO uyumlu ürün ilanları oluşturmanıza yardımcı olur.' },
    { q: 'Hangi platformları destekliyorsunuz?', a: 'Amazon, eBay, Etsy, Shopify, Walmart, Trendyol, Hepsiburada, N11, Mercado Libre, Otto ve Cdiscount dahil 11 büyük e-ticaret platformunu destekliyoruz.' },
    { q: 'Ücretsiz plan neleri içerir?', a: 'Ücretsiz plan ile ayda 10 ilan oluşturabilir, temel SEO analizi yapabilir ve AI asistanı kullanabilirsiniz.' },
    { q: 'Marka DNA analizi nasıl çalışır?', a: 'Web sitenizin URL\'sini girin, AI sitenizi tarayarak marka kişiliğinizi, hedef kitlenizi, pazar konumunuzu ve ilan stratejinizi analiz eder.' },
    { q: 'Rakip analizi ne işe yarar?', a: 'Ürününüzün bulunduğu pazardaki rakipleri, fiyat aralıklarını, anahtar kelime boşluklarını ve farklılaşma fırsatlarını keşfetmenizi sağlar.' },
    { q: 'A/B testi nasıl yapılır?', a: 'İki farklı ilan versiyonunuzu yapıştırın, AI her iki versiyonu SEO, okunabilirlik, dönüşüm ve anahtar kelime açısından karşılaştırır ve en iyi birleştirilmiş versiyonu oluşturur.' },
    { q: 'Aboneliğimi nasıl iptal edebilirim?', a: 'Aboneliğinizi istediğiniz zaman hesap ayarlarından iptal edebilirsiniz. Mevcut dönemin sonuna kadar hizmet almaya devam edersiniz.' },
    { q: 'Verilerim güvende mi?', a: 'Evet. Tüm verileriniz SSL şifreleme ile korunur. Ödeme bilgileri PCI DSS uyumlu Lemon Squeezy altyapısında güvenle işlenir, tarafımızca saklanmaz.' },
  ],
  en: [
    { q: 'What is ListingAI?', a: 'ListingAI is an AI-powered e-commerce listing optimization platform. It helps you create SEO-optimized product listings for Amazon, eBay, Etsy, Trendyol and many more platforms.' },
    { q: 'Which platforms do you support?', a: 'We support 11 major e-commerce platforms including Amazon, eBay, Etsy, Shopify, Walmart, Trendyol, Hepsiburada, N11, Mercado Libre, Otto and Cdiscount.' },
    { q: 'What does the free plan include?', a: 'With the free plan you can create up to 10 listings per month, perform basic SEO analysis, and use the AI assistant.' },
    { q: 'How does Brand DNA analysis work?', a: 'Enter your website URL and AI will analyze your brand personality, target audience, market positioning and listing strategy.' },
    { q: 'What is competitor analysis for?', a: 'It helps you discover competitors, price ranges, keyword gaps and differentiation opportunities in your product\'s market.' },
    { q: 'How does A/B testing work?', a: 'Paste two different listing versions, and AI compares both in terms of SEO, readability, conversion and keywords, then creates the best merged version.' },
    { q: 'How can I cancel my subscription?', a: 'You can cancel your subscription anytime from account settings. You continue to receive service until the end of the current period.' },
    { q: 'Is my data secure?', a: 'Yes. All data is protected with SSL encryption. Payment information is securely processed via PCI DSS compliant Lemon Squeezy infrastructure.' },
  ],
}

export default function SSSPage() {
  const { locale } = useI18n()
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = faqData[locale] || faqData.tr

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{locale === 'tr' ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}</h1>
        <p className="text-sm text-gray-500 mt-1">{locale === 'tr' ? 'ListingAI hakkında merak ettikleriniz' : 'Everything you need to know about ListingAI'}</p>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl border border-surface-200 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition"
            >
              <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
              <span className={`text-gray-400 text-lg flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
