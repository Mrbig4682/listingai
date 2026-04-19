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
        <p className="text-sm text-trust-light mb-8">Son güncelleme: 16 Nisan 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-trust-medium">

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 1 — Taraflar</h2>
            <p><strong>1.1 SATICI BİLGİLERİ</strong></p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>Unvan:</strong> ListingAI</li>
              <li><strong>Adres:</strong> Türkiye</li>
              <li><strong>E-posta:</strong> destek@listingai.store</li>
              <li><strong>Web Sitesi:</strong> https://www.listingai.store</li>
              <li><strong>Telefon:</strong> —</li>
            </ul>
            <p className="mt-4"><strong>1.2 ALICI BİLGİLERİ</strong></p>
            <p>İşbu sözleşmeyi elektronik ortamda onaylayarak hizmet satın alan kullanıcıdır. Alıcının adı, soyadı, e-posta adresi ve diğer bilgileri üyelik sırasında beyan edilmiştir ve sipariş formunda yer almaktadır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 2 — Sözleşmenin Konusu</h2>
            <p>İşbu Mesafeli Satış Sözleşmesi (&quot;Sözleşme&quot;), 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine uygun olarak, Satıcı&apos;nın www.listingai.store internet sitesi üzerinden elektronik ortamda sunduğu dijital hizmetlerin satışına ilişkin tarafların karşılıklı hak ve yükümlülüklerini düzenler.</p>
            <p>Alıcı, işbu sözleşmeyi onaylamadan önce satışa konu hizmetin temel nitelikleri, satış fiyatı, ödeme şekli ve teslimat koşulları dahil tüm ön bilgileri okuduğunu, anladığını ve elektronik ortamda onay verdiğini kabul ve beyan eder.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 3 — Sözleşme Konusu Hizmet Bilgileri</h2>
            <p><strong>3.1 Hizmetin Tanımı</strong></p>
            <p>ListingAI, yapay zeka destekli e-ticaret ilan optimizasyonu hizmeti sunan bir SaaS (Software as a Service — Hizmet Olarak Yazılım) platformudur. Platform aracılığıyla kullanıcılara sunulan başlıca hizmetler şunlardır:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Yapay zeka ile ürün ilan başlığı, açıklaması ve anahtar kelime üretimi</li>
              <li>SEO skoru analizi ve optimizasyon önerileri</li>
              <li>Rakip analizi ve karşılaştırma</li>
              <li>Marka DNA analizi</li>
              <li>A/B test oluşturma</li>
              <li>Çoklu e-ticaret platformu desteği (Amazon, eBay, Trendyol, Hepsiburada, Etsy vb.)</li>
              <li>Çoklu dil desteği (Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Portekizce vb.)</li>
              <li>Toplu ilan üretimi (bulk generation)</li>
              <li>AI asistan (sohbet tabanlı destek)</li>
            </ul>

            <p className="mt-4"><strong>3.2 Plan Seçenekleri ve Fiyatlandırma</strong></p>
            <p>Tüm fiyatlar Türk Lirası (TRY) cinsinden olup KDV dahildir.</p>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-brand-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Plan</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Aylık Ücret</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Ödeme Türü</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">İlan Limiti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Starter (Ücretsiz)</td>
                    <td className="border border-gray-200 px-4 py-2">0,00 ₺</td>
                    <td className="border border-gray-200 px-4 py-2">Ücretsiz</td>
                    <td className="border border-gray-200 px-4 py-2">Aylık 2 ilan</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">Pro</td>
                    <td className="border border-gray-200 px-4 py-2 font-semibold">19,90 ₺</td>
                    <td className="border border-gray-200 px-4 py-2">Aylık Abonelik</td>
                    <td className="border border-gray-200 px-4 py-2">Aylık 100 ilan</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Business</td>
                    <td className="border border-gray-200 px-4 py-2 font-semibold">49,90 ₺</td>
                    <td className="border border-gray-200 px-4 py-2">Aylık Abonelik</td>
                    <td className="border border-gray-200 px-4 py-2">Sınırsız</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-trust-light">Satıcı, fiyatlandırmada değişiklik yapma hakkını saklı tutar. Değişiklikler mevcut abonelik döneminin bitiminde uygulanır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 4 — Ödeme Şekli ve Koşulları</h2>
            <p><strong>4.1</strong> Hizmet bedeli, Alıcı tarafından kredi kartı veya banka kartı ile ödenir. Ödemeler, Lemon Squeezy (Merchant of Record) güvenli altyapısı üzerinden işlenir.</p>
            <p><strong>4.2</strong> Kredi kartı bilgileri Satıcı&apos;nın sunucularında saklanmaz. Tüm ödeme işlemleri PCI DSS uyumlu altyapıda SSL/TLS şifreleme ile korunarak gerçekleştirilir.</p>
            <p><strong>4.3</strong> Ücretli abonelikler her ay otomatik olarak yenilenir. Abonelik bedeli, her dönem başında tahsil edilir.</p>
            <p><strong>4.4</strong> Ödeme başarısız olması durumunda hizmet erişimi askıya alınabilir. Kullanıcı, ödeme yöntemini güncelleyerek hizmetine devam edebilir.</p>
            <p><strong>4.5</strong> Ücretsiz (Starter) plan için herhangi bir ödeme alınmaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 5 — Teslimat Şekli</h2>
            <p><strong>5.1</strong> Satışa konu hizmet, fiziki teslimat gerektirmeyen dijital bir hizmettir.</p>
            <p><strong>5.2</strong> Ödemenin onaylanmasının ardından Alıcı, seçilen plana ve tüm ilgili özelliklere anında erişim sağlar.</p>
            <p><strong>5.3</strong> Hizmete erişim, Alıcı&apos;nın üyelik hesabı üzerinden www.listingai.store adresi üzerinden sağlanır.</p>
            <p><strong>5.4</strong> Dijital hizmetin ifası, ödeme onayı ile eş zamanlı olarak başlar.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 6 — Cayma Hakkı</h2>
            <p><strong>6.1</strong> 6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 53/ı maddesi ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/ğ maddesi uyarınca; elektronik ortamda anında ifa edilen hizmetlerde ve dijital içeriklerin sunulmasında, <strong>hizmetin ifasına başlanmasıyla birlikte cayma hakkı kullanılamaz.</strong></p>
            <p><strong>6.2</strong> Alıcı, işbu sözleşmeyi onaylayarak dijital hizmetin ifasına derhal başlanmasını kabul ettiğini ve cayma hakkından feragat ettiğini beyan eder.</p>
            <p><strong>6.3</strong> Bununla birlikte, Satıcı aşağıdaki hallerde iade değerlendirmesi yapar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Teknik Arıza:</strong> Satıcı&apos;dan kaynaklanan teknik bir sorun nedeniyle hizmetin hiç kullanılamaması durumunda ilgili dönem bedeli iade edilir.</li>
              <li><strong>Mükerrer Ödeme:</strong> Aynı dönem için birden fazla ödeme tahsil edilmesi halinde fazla ödeme iade edilir.</li>
              <li><strong>İlk 24 Saat Garantisi:</strong> Ücretli plana geçtikten sonraki ilk 24 saat içinde hizmet hiç kullanılmamışsa ve Alıcı iptal talep ederse ödeme tam olarak iade edilir.</li>
            </ul>
            <p><strong>6.4</strong> İade talepleri destek@listingai.store adresine e-posta ile iletilir. Onaylanan iadeler, ödemenin yapıldığı yöntem üzerinden 7-14 iş günü içinde gerçekleştirilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 7 — Abonelik İptali</h2>
            <p><strong>7.1</strong> Alıcı, ücretli aboneliğini istediği zaman iptal edebilir.</p>
            <p><strong>7.2</strong> İptal durumunda, mevcut ödeme döneminin sonuna kadar hizmet kullanılmaya devam edilir.</p>
            <p><strong>7.3</strong> Bir sonraki dönemde otomatik ödeme tahsil edilmez.</p>
            <p><strong>7.4</strong> İptal sonrası hesap otomatik olarak Ücretsiz (Starter) plana düşürülür.</p>
            <p><strong>7.5</strong> Kısmi dönem iadesi yapılmaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 8 — Tarafların Hak ve Yükümlülükleri</h2>
            <p><strong>8.1 Satıcı&apos;nın Yükümlülükleri:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hizmeti sözleşme koşullarına uygun olarak sunmak</li>
              <li>Kişisel verileri 6698 sayılı KVKK kapsamında korumak</li>
              <li>Ödeme güvenliğini sağlamak</li>
              <li>Hizmet değişikliklerini önceden bildirmek</li>
              <li>Teknik destek sağlamak</li>
            </ul>
            <p className="mt-3"><strong>8.2 Alıcı&apos;nın Yükümlülükleri:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Doğru ve güncel bilgi beyan etmek</li>
              <li>Hesap güvenliğini korumak ve şifresini üçüncü kişilerle paylaşmamak</li>
              <li>Platformu yasa dışı amaçlarla kullanmamak</li>
              <li>AI tarafından üretilen içeriklerin uygunluğunu kontrol etmek</li>
              <li>Abonelik bedelini zamanında ödemek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 9 — Sorumluluk Sınırlandırması</h2>
            <p><strong>9.1</strong> ListingAI platformu, yapay zeka tarafından üretilen içeriklerin doğruluğunu, eksiksizliğini veya belirli bir amaca uygunluğunu garanti etmez. Üretilen içerikler tavsiye niteliğindedir.</p>
            <p><strong>9.2</strong> Satıcı; mücbir sebepler, internet kesintileri, sunucu arızaları veya üçüncü taraf hizmet sağlayıcılarından kaynaklanan aksaklıklardan dolayı sorumlu tutulamaz.</p>
            <p><strong>9.3</strong> AI tarafından üretilen ilan içeriklerinin e-ticaret platformlarının kurallarına uygunluğu Alıcı&apos;nın sorumluluğundadır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 10 — Kişisel Verilerin Korunması</h2>
            <p><strong>10.1</strong> Alıcı&apos;ya ait kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında işlenir ve korunur.</p>
            <p><strong>10.2</strong> Kişisel verilerin işlenmesine ilişkin detaylı bilgiler <Link href="/gizlilik" className="text-brand-600 underline">Gizlilik Politikası</Link> sayfasında yer almaktadır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 11 — Uyuşmazlık Çözümü</h2>
            <p><strong>11.1</strong> İşbu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır.</p>
            <p><strong>11.2</strong> Uyuşmazlık halinde Gümrük ve Ticaret Bakanlığı&apos;nca ilan edilen değere kadar Tüketici Hakem Heyetleri, bu değerin üzerindeki uyuşmazlıklarda Tüketici Mahkemeleri yetkilidir.</p>
            <p><strong>11.3</strong> Alıcı, şikayetlerini Türkiye Cumhuriyeti Ticaret Bakanlığı Tüketici Şikayet Hattı (ALO 175) veya e-Devlet üzerinden Tüketici Bilgi Sistemi (TÜBİS) aracılığıyla da iletebilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 12 — Yürürlük</h2>
            <p><strong>12.1</strong> İşbu sözleşme, Alıcı tarafından elektronik ortamda onaylanmasıyla yürürlüğe girer.</p>
            <p><strong>12.2</strong> Sözleşme, taraflardan birinin feshi veya Alıcı&apos;nın hesabını kapatmasına kadar yürürlükte kalır.</p>
            <p><strong>12.3</strong> Alıcı, işbu sözleşmenin tüm maddelerini okuduğunu, anladığını ve kabul ettiğini beyan eder.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">Madde 13 — İletişim</h2>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>E-posta:</strong> destek@listingai.store</li>
              <li><strong>Web Sitesi:</strong> https://www.listingai.store</li>
            </ul>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link href="/gizlilik" className="text-sm text-brand-600 hover:text-brand-700">
              Gizlilik Politikası →
            </Link>
            <Link href="/iade-politikasi" className="text-sm text-brand-600 hover:text-brand-700">
              İade Politikası →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
