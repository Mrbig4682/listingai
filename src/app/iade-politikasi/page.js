'use client'
import Link from 'next/link'

export default function IadePolitikasiPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-8">
          ← Kontrol Paneli
        </Link>
        <h1 className="text-2xl font-bold text-trust-dark mb-2">İade ve İptal Politikası</h1>
        <p className="text-sm text-trust-light mb-8">Son güncelleme: 16 Nisan 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-trust-medium">
          <section>
            <h2 className="text-lg font-semibold text-trust-dark">1. Genel Bilgi</h2>
            <p>ListingAI, dijital ortamda sunulan bir SaaS (Hizmet Olarak Yazılım) platformudur. Tüm hizmetler çevrimiçi olarak anlık erişim ile sağlanır. Bu politika, ödeme ve iade süreçlerine ilişkin kullanıcılarımızın haklarını ve koşullarını açıklar.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">2. Ücretsiz Plan</h2>
            <p>ListingAI&apos;nin Ücretsiz (Starter) planı herhangi bir ödeme gerektirmez. Kullanıcılar istedikleri zaman ücretsiz planı kullanabilir ve hesaplarını kapatabilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">3. Ücretli Abonelikler</h2>
            <p>Pro ve Business planları aylık abonelik modeli ile çalışır. Abonelik bedeli, her dönem başında tahsil edilir.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Pro Plan:</strong> Aylık 19,90₺</li>
              <li><strong>Business Plan:</strong> Aylık 49,90₺</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">4. İptal Koşulları</h2>
            <p>Kullanıcılar, aboneliklerini istedikleri zaman iptal edebilir. İptal işlemi gerçekleştirildiğinde:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mevcut ödeme döneminin sonuna kadar hizmet kullanımı devam eder.</li>
              <li>Bir sonraki dönemde ücret tahsil edilmez.</li>
              <li>İptal sonrası hesap otomatik olarak Ücretsiz plana düşürülür.</li>
              <li>Kullanıcının mevcut verileri korunur ve Ücretsiz plan kapsamında erişilebilir kalır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">5. İade Koşulları</h2>
            <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 53. maddesi uyarınca, elektronik ortamda anında ifa edilen dijital içerik ve hizmetlerde cayma hakkı, hizmetin ifasına başlanması ile birlikte ortadan kalkar.</p>
            <p>Bununla birlikte, ListingAI aşağıdaki durumlarda iade değerlendirmesi yapar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Teknik Arıza:</strong> Platformda kullanıcıdan kaynaklanmayan teknik bir sorun nedeniyle hizmetin hiç kullanılamaması durumunda, ilgili dönem bedeli iade edilir.</li>
              <li><strong>Mükerrer Ödeme:</strong> Aynı dönem için birden fazla ödeme alınması halinde, fazla alınan tutar iade edilir.</li>
              <li><strong>İlk 24 Saat Garantisi:</strong> Ücretli plana geçtikten sonraki ilk 24 saat içinde hiç hizmet kullanılmamışsa ve kullanıcı iptal talep ederse, ödeme tam olarak iade edilir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">6. İade Süreci</h2>
            <p>İade talebinde bulunmak için:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>destek@listingai.store</strong> adresine e-posta ile başvurunuzu iletin.</li>
              <li>Başvurunuzda kayıtlı e-posta adresinizi, ödeme tarihinizi ve iade nedeninizi belirtin.</li>
              <li>İade talepleri en geç 5 iş günü içinde değerlendirilir.</li>
              <li>Onaylanan iadeler, ödemenin yapıldığı yöntem üzerinden 7-14 iş günü içinde gerçekleştirilir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">7. Kısmi İade</h2>
            <p>Abonelik döneminin ortasında yapılan iptallerde kısmi dönem iadesi yapılmaz. Kullanıcı, iptal tarihinden itibaren mevcut dönemin sonuna kadar hizmetten faydalanmaya devam eder.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">8. Ödeme Güvenliği</h2>
            <p>Tüm ödemeler, PCI DSS uyumlu güvenli ödeme altyapısı üzerinden işlenir. Kredi kartı bilgileri ListingAI sunucularında saklanmaz. Ödeme işlemleri SSL/TLS şifreleme ile korunur.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">9. Uyuşmazlık Çözümü</h2>
            <p>İade ve iptal süreçlerine ilişkin uyuşmazlıklarda 6502 sayılı Tüketicinin Korunması Hakkında Kanun hükümleri uygulanır. Uyuşmazlık halinde tüketici hakem heyetleri ve tüketici mahkemeleri yetkilidir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">10. İletişim</h2>
            <p>İade ve iptal talepleriniz için:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>E-posta:</strong> destek@listingai.store</li>
              <li><strong>Web sitesi:</strong> www.listingai.store</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <Link href="/dashboard" className="text-sm text-brand-600 hover:text-brand-700">
            ← Kontrol Paneline Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
