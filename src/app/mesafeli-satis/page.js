'use client'
import Link from 'next/link'

export default function MesafeliSatisPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-8">
          ← Kontrol Paneli
        </Link>
        <h1 className="text-2xl font-bold text-trust-dark mb-2">Mesafeli Satış Sözleşmesi</h1>
        <p className="text-sm text-trust-light mb-8">Son güncelleme: 4 Nisan 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-trust-medium">
          <section>
            <h2 className="text-lg font-semibold text-trust-dark">1. Taraflar</h2>
            <p><strong>Satıcı:</strong> ListingAI - AI Destekli E-ticaret İlan Optimizasyonu Platformu</p>
            <p><strong>Alıcı:</strong> İşbu sözleşmeyi kabul ederek hizmet satın alan kullanıcı.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">2. Sözleşmenin Konusu</h2>
            <p>İşbu sözleşme, ListingAI platformu üzerinden sunulan yapay zeka destekli e-ticaret ilan optimizasyonu, marka DNA analizi, rakip analizi, A/B test ve diğer dijital hizmetlerin mesafeli satış yoluyla satışına ilişkin tarafların hak ve yükümlülüklerini düzenler.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">3. Hizmet Bilgileri</h2>
            <p>ListingAI, aşağıdaki plan seçeneklerini sunar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ücretsiz Plan:</strong> Aylık 10 ilan hakkı, temel özellikler</li>
              <li><strong>Pro Plan:</strong> Aylık 100 ilan hakkı, gelişmiş analiz araçları</li>
              <li><strong>Business Plan:</strong> Sınırsız ilan hakkı, tüm premium özellikler</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">4. Hizmet Bedeli ve Ödeme</h2>
            <p>Hizmet bedelleri, seçilen plan türüne göre belirlenir. Ödemeler iyzico güvenli ödeme altyapısı üzerinden işlenir. Ücretli planlara ait ödemeler aylık abonelik modeli ile tahsil edilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">5. Cayma Hakkı</h2>
            <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun gereğince, dijital içerik ve hizmet aboneliklerinde cayma hakkı, hizmetin ifasına başlanmasıyla birlikte ortadan kalkar. Kullanıcı, aboneliğini istediği zaman iptal edebilir; mevcut dönemin sonuna kadar hizmet almaya devam eder.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">6. Teslimat</h2>
            <p>Hizmet, dijital ortamda anlık olarak sağlanır. Ödeme onayının ardından kullanıcı ilgili plana anında erişim sağlar.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">7. Genel Hükümler</h2>
            <p>Kullanıcı, platformu yasa dışı veya üçüncü şahısların haklarını ihlal edecek şekilde kullanamaz. ListingAI, yapay zeka tarafından üretilen içeriklerin doğruluğunu garanti etmez; içerikler tavsiye niteliğindedir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">8. Uyuşmazlık Çözümü</h2>
            <p>İşbu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır. Tüketici hakem heyetleri ve tüketici mahkemeleri yetkilidir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">9. Yürürlük</h2>
            <p>İşbu sözleşme, kullanıcının hizmeti satın alması veya ücretsiz plana kaydolmasıyla yürürlüğe girer.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
