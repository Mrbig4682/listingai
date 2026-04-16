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
            <p><strong>1.1</strong> İşbu İade ve İptal Politikası, https://www.listingai.store adresinde yayın yapan ListingAI platformu tarafından sunulan dijital hizmetlerin ödeme, iade ve iptal süreçlerini düzenler.</p>
            <p><strong>1.2</strong> ListingAI, dijital ortamda sunulan bir SaaS (Hizmet Olarak Yazılım) platformudur. Tüm hizmetler çevrimiçi olarak anlık erişim ile sağlanır.</p>
            <p><strong>1.3</strong> Bu politika, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine uygun olarak hazırlanmıştır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">2. Abonelik Planları ve Ücretlendirme</h2>
            <p>Tüm fiyatlar Türk Lirası (TRY) cinsinden olup KDV dahildir.</p>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-brand-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Plan</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Aylık Ücret</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Ödeme Tipi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Starter (Ücretsiz)</td>
                    <td className="border border-gray-200 px-4 py-2">0,00 ₺</td>
                    <td className="border border-gray-200 px-4 py-2">Ücretsiz — Ödeme alınmaz</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">Pro</td>
                    <td className="border border-gray-200 px-4 py-2 font-semibold">19,90 ₺</td>
                    <td className="border border-gray-200 px-4 py-2">Aylık otomatik yenilenen abonelik</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Business</td>
                    <td className="border border-gray-200 px-4 py-2 font-semibold">49,90 ₺</td>
                    <td className="border border-gray-200 px-4 py-2">Aylık otomatik yenilenen abonelik</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">3. Ücretsiz Plan (Starter)</h2>
            <p><strong>3.1</strong> Starter planı herhangi bir ödeme gerektirmez.</p>
            <p><strong>3.2</strong> Kullanıcılar istedikleri zaman ücretsiz planı kullanabilir.</p>
            <p><strong>3.3</strong> Ücretsiz plan kullanıcıları, istedikleri zaman ücretli plana yükseltme yapabilir veya hesaplarını kapatabilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">4. Abonelik İptal Koşulları</h2>
            <p><strong>4.1</strong> Kullanıcılar, ücretli aboneliklerini istedikleri zaman iptal edebilir.</p>
            <p><strong>4.2</strong> İptal işlemi gerçekleştirildiğinde:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mevcut ödeme döneminin sonuna kadar tüm ücretli özellikler kullanılmaya devam eder.</li>
              <li>Bir sonraki dönemde otomatik ödeme tahsil edilmez.</li>
              <li>İptal sonrası hesap otomatik olarak Ücretsiz (Starter) plana düşürülür.</li>
              <li>Kullanıcının mevcut verileri (oluşturulmuş ilanlar, analizler vb.) korunur ve Ücretsiz plan kapsamında erişilebilir kalır.</li>
            </ul>
            <p><strong>4.3</strong> İptal talebi, dashboard üzerinden veya destek@listingai.store adresine e-posta ile iletilebilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">5. Cayma Hakkı ve İade Koşulları</h2>
            <p><strong>5.1 Yasal Dayanak:</strong></p>
            <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 53/ı maddesi ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/ğ maddesi uyarınca; elektronik ortamda anında ifa edilen hizmetlerde ve dijital içeriklerin sunulmasında, tüketicinin önceden onayı ile hizmetin ifasına başlanması halinde <strong>cayma hakkı kullanılamaz.</strong></p>

            <p className="mt-3"><strong>5.2 İade Yapılan Durumlar:</strong></p>
            <p>Bununla birlikte, ListingAI aşağıdaki hallerde iade değerlendirmesi yapar:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Teknik Arıza:</strong> ListingAI&apos;dan kaynaklanan teknik bir sorun nedeniyle hizmetin hiç kullanılamaması durumunda, ilgili dönem bedeli tam olarak iade edilir. Teknik arızanın tespiti ListingAI tarafından yapılır.
              </li>
              <li>
                <strong>Mükerrer Ödeme:</strong> Aynı abonelik dönemi için birden fazla ödeme tahsil edilmesi halinde, fazla alınan tutar otomatik olarak veya talep üzerine iade edilir.
              </li>
              <li>
                <strong>İlk 24 Saat Garantisi:</strong> Ücretli plana ilk kez geçtikten sonraki 24 saat içinde hizmet hiç kullanılmamışsa (ilan oluşturma, analiz çalıştırma vb.) ve kullanıcı bu süre içinde iptal talep ederse, ödeme tam olarak iade edilir.
              </li>
            </ul>

            <p className="mt-3"><strong>5.3 İade Yapılmayan Durumlar:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hizmetin kullanılmaya başlanmasından sonra yapılan iptal talepleri (cayma hakkı sona ermiştir)</li>
              <li>Abonelik döneminin ortasında yapılan iptallerde kısmi dönem iadesi</li>
              <li>Kullanıcıdan kaynaklanan teknik sorunlar (internet bağlantısı, tarayıcı uyumsuzluğu vb.)</li>
              <li>Kullanıcının platform kurallarını ihlal etmesi nedeniyle hesabının askıya alınması</li>
              <li>AI tarafından üretilen içeriklerin beklentileri karşılamaması (içerikler tavsiye niteliğindedir)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">6. İade Süreci</h2>
            <p><strong>6.1 Başvuru:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>destek@listingai.store</strong> adresine e-posta ile başvurunuzu iletin.</li>
              <li>Başvurunuzda aşağıdaki bilgileri belirtin:
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Kayıtlı e-posta adresiniz</li>
                  <li>Ödeme tarihi</li>
                  <li>İade nedeni</li>
                  <li>Varsa ekran görüntüleri veya teknik hata detayları</li>
                </ul>
              </li>
            </ul>
            <p className="mt-2"><strong>6.2 Değerlendirme:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>İade talepleri en geç <strong>5 iş günü</strong> içinde değerlendirilir.</li>
              <li>Değerlendirme sonucu, başvuruda belirtilen e-posta adresine bildirilir.</li>
            </ul>
            <p className="mt-2"><strong>6.3 Ödeme İadesi:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Onaylanan iadeler, <strong>ödemenin yapıldığı yöntem</strong> (kredi kartı/banka kartı) üzerinden gerçekleştirilir.</li>
              <li>İade tutarının hesaba yansıması <strong>7-14 iş günü</strong> sürebilir. Bu süre banka/kredi kartı kuruluşuna göre değişiklik gösterebilir.</li>
              <li>İade işlemi tamamlandığında kullanıcıya e-posta ile bildirim yapılır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">7. Ödeme Güvenliği</h2>
            <p><strong>7.1</strong> Tüm ödemeler, PCI DSS (Payment Card Industry Data Security Standard) uyumlu PayTR güvenli sanal POS altyapısı üzerinden işlenir.</p>
            <p><strong>7.2</strong> Kredi kartı ve banka kartı bilgileri ListingAI sunucularında <strong>hiçbir şekilde saklanmaz.</strong></p>
            <p><strong>7.3</strong> Ödeme işlemleri SSL/TLS şifreleme ile korunur.</p>
            <p><strong>7.4</strong> 3D Secure doğrulama desteklenir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">8. Otomatik Yenileme</h2>
            <p><strong>8.1</strong> Ücretli abonelikler her ay otomatik olarak yenilenir.</p>
            <p><strong>8.2</strong> Yenileme öncesinde kullanıcıya bildirim gönderilir.</p>
            <p><strong>8.3</strong> Otomatik yenileme, abonelik iptal edilene kadar devam eder.</p>
            <p><strong>8.4</strong> Ödeme başarısız olması halinde hizmet erişimi askıya alınabilir. Kullanıcı, ödeme yöntemini güncelleyerek hizmetine devam edebilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">9. Uyuşmazlık Çözümü</h2>
            <p><strong>9.1</strong> İade ve iptal süreçlerine ilişkin uyuşmazlıklarda 6502 sayılı Tüketicinin Korunması Hakkında Kanun hükümleri uygulanır.</p>
            <p><strong>9.2</strong> Uyuşmazlık halinde Gümrük ve Ticaret Bakanlığı&apos;nca ilan edilen değere kadar Tüketici Hakem Heyetleri, bu değerin üzerindeki uyuşmazlıklarda Tüketici Mahkemeleri yetkilidir.</p>
            <p><strong>9.3</strong> Şikayetler ayrıca ALO 175 Tüketici Şikayet Hattı veya e-Devlet üzerinden TÜBİS aracılığıyla iletilebilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">10. İletişim</h2>
            <p>İade ve iptal talepleriniz dahil tüm sorularınız için:</p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>E-posta:</strong> destek@listingai.store</li>
              <li><strong>Web Sitesi:</strong> https://www.listingai.store</li>
            </ul>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link href="/gizlilik" className="text-sm text-brand-600 hover:text-brand-700">
              ← Gizlilik Politikası
            </Link>
            <Link href="/mesafeli-satis" className="text-sm text-brand-600 hover:text-brand-700">
              Mesafeli Satış Sözleşmesi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
