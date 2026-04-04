'use client'
import Link from 'next/link'

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-8">
          ← Kontrol Paneli
        </Link>
        <h1 className="text-2xl font-bold text-trust-dark mb-2">Kullanım Şartları</h1>
        <p className="text-sm text-trust-light mb-8">Son güncelleme: 4 Nisan 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-trust-medium">
          <section>
            <h2 className="text-lg font-semibold text-trust-dark">1. Hizmet Tanımı</h2>
            <p>ListingAI, yapay zeka destekli e-ticaret ilan optimizasyonu hizmeti sunan bir SaaS platformudur. Platform; ilan oluşturma, marka DNA analizi, rakip analizi, A/B test, anahtar kelime araştırması ve AI asistan gibi araçlar içerir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">2. Hesap Oluşturma</h2>
            <p>Platforma kayıt olmak için geçerli bir e-posta adresi gereklidir. Kullanıcı, hesap güvenliğinden kendisi sorumludur. Hesap bilgilerinin üçüncü kişilerle paylaşılmaması esastır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">3. Kabul Edilebilir Kullanım</h2>
            <p>Kullanıcı, platformu yalnızca yasal amaçlarla kullanmayı kabul eder. Aşağıdaki eylemler yasaktır:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Platformun kötüye kullanılması veya reverse engineering yapılması</li>
              <li>Sahte, yanıltıcı veya yasa dışı ürün ilanları oluşturulması</li>
              <li>Otomatik botlar veya scriptlerle sisteme yük bindirilmesi</li>
              <li>Fikri mülkiyet haklarının ihlal edilmesi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">4. AI İçerik Sorumluluğu</h2>
            <p>ListingAI tarafından üretilen yapay zeka içerikleri tavsiye niteliğindedir. Oluşturulan ilan metinlerinin doğruluğu, uygunluğu ve platform kurallarına uyumu kullanıcının sorumluluğundadır. ListingAI, AI tarafından üretilen içeriklerden doğan zararlardan sorumlu tutulamaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">5. Abonelik ve İptal</h2>
            <p>Ücretli planlar aylık abonelik modeliyle çalışır. Kullanıcı, aboneliğini istediği zaman iptal edebilir. İptal durumunda mevcut dönemin sonuna kadar hizmet almaya devam edilir. Kısmi dönem iadesi yapılmaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">6. Fikri Mülkiyet</h2>
            <p>ListingAI platformunun tasarımı, kodu, logosu ve markası tescilli fikri mülkiyettir. Kullanıcının platform aracılığıyla oluşturduğu içerikler kullanıcıya aittir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">7. Hizmet Değişiklikleri</h2>
            <p>ListingAI, önceden bildirimde bulunarak hizmet kapsamında, fiyatlandırmada ve kullanım şartlarında değişiklik yapma hakkını saklı tutar.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">8. Sorumluluk Sınırları</h2>
            <p>ListingAI, hizmet kesintileri, veri kaybı veya AI tarafından üretilen içeriklerden kaynaklanan dolaylı zararlardan sorumlu tutulamaz. Platform &quot;olduğu gibi&quot; sunulmaktadır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">9. Uygulanacak Hukuk</h2>
            <p>İşbu şartlar Türkiye Cumhuriyeti kanunlarına tabidir.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
