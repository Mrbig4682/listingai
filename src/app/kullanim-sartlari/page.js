'use client'
import Link from 'next/link'

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-8">
          ← Kontrol Paneli
        </Link>
        <h1 className="text-2xl font-bold text-trust-dark mb-2">Kullanım Şartları ve Koşulları</h1>
        <p className="text-sm text-trust-light mb-8">Son güncelleme: 16 Nisan 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-trust-medium">

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">1. Genel Hükümler</h2>
            <p><strong>1.1</strong> İşbu Kullanım Şartları (&quot;Şartlar&quot;), https://www.listingai.store adresinde yayın yapan ListingAI platformunun (&quot;Platform&quot;) kullanım koşullarını düzenler.</p>
            <p><strong>1.2</strong> Platforma erişen, kayıt olan veya hizmetten yararlanan her kişi (&quot;Kullanıcı&quot;) işbu Şartları okuduğunu, anladığını ve kabul ettiğini beyan eder.</p>
            <p><strong>1.3</strong> ListingAI, işbu Şartları önceden bildirimde bulunarak tek taraflı olarak değiştirme hakkını saklı tutar. Değişiklikler, web sitesinde yayınlandığı tarihte yürürlüğe girer.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">2. Hizmet Tanımı</h2>
            <p><strong>2.1</strong> ListingAI, yapay zeka destekli e-ticaret ilan optimizasyonu hizmeti sunan bir SaaS (Software as a Service — Hizmet Olarak Yazılım) platformudur.</p>
            <p><strong>2.2</strong> Platform aracılığıyla sunulan hizmetler şunlardır:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Yapay zeka ile ürün ilan başlığı, açıklaması ve anahtar kelime üretimi</li>
              <li>SEO skoru analizi ve optimizasyon önerileri</li>
              <li>Rakip analizi ve karşılaştırma araçları</li>
              <li>Marka DNA analizi</li>
              <li>A/B test oluşturma ve karşılaştırma</li>
              <li>Çoklu e-ticaret platformu desteği (Amazon, eBay, Trendyol, Hepsiburada, Etsy, Shopify, N11, GittiGidiyor vb.)</li>
              <li>Çoklu dil desteği (Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Portekizce vb.)</li>
              <li>Toplu ilan üretimi (bulk generation)</li>
              <li>AI asistan (yapay zeka destekli sohbet)</li>
            </ul>
            <p><strong>2.3</strong> ListingAI, sunduğu hizmetlerin kapsamını genişletme, daraltma veya değiştirme hakkını saklı tutar.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">3. Üyelik ve Hesap</h2>
            <p><strong>3.1</strong> Platforma kayıt olmak için geçerli bir e-posta adresi gereklidir. Kullanıcılar e-posta veya Google hesabı ile kayıt olabilir.</p>
            <p><strong>3.2</strong> Kullanıcı, hesap bilgilerinin doğruluğundan ve güncelliğinden sorumludur.</p>
            <p><strong>3.3</strong> Kullanıcı, hesap şifresinin güvenliğinden bizzat sorumludur. Şifrenin üçüncü kişilerle paylaşılması halinde oluşacak zararlardan ListingAI sorumlu tutulamaz.</p>
            <p><strong>3.4</strong> Her Kullanıcı yalnızca bir hesap oluşturabilir. Birden fazla hesap tespit edilmesi halinde hesaplar askıya alınabilir veya kapatılabilir.</p>
            <p><strong>3.5</strong> 18 yaşından küçük kişiler Platformu kullanamazlar.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">4. Abonelik Planları ve Ödeme</h2>
            <p><strong>4.1</strong> ListingAI üç farklı abonelik planı sunar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Starter (Ücretsiz):</strong> 0,00 ₺ — Aylık 2 ilan, temel özellikler</li>
              <li><strong>Pro:</strong> 19,90 ₺/ay — Aylık 100 ilan, gelişmiş analiz araçları, rakip analizi, A/B test</li>
              <li><strong>Business:</strong> 49,90 ₺/ay — Sınırsız ilan, tüm premium özellikler, marka DNA, AI asistan, VIP destek</li>
            </ul>
            <p><strong>4.2</strong> Tüm fiyatlar Türk Lirası (TRY) cinsinden olup KDV dahildir.</p>
            <p><strong>4.3</strong> Ücretli abonelikler aylık olarak otomatik yenilenir. Ödeme, her dönem başında kredi kartı veya banka kartı ile tahsil edilir.</p>
            <p><strong>4.4</strong> Ödemeler PayTR güvenli sanal POS altyapısı üzerinden işlenir. Kredi kartı bilgileri ListingAI sunucularında saklanmaz.</p>
            <p><strong>4.5</strong> ListingAI, fiyatlandırmada değişiklik yapma hakkını saklı tutar. Değişiklikler mevcut abonelik döneminin bitiminden itibaren uygulanır ve önceden bildirilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">5. İptal ve İade</h2>
            <p><strong>5.1</strong> Kullanıcı, ücretli aboneliğini istediği zaman iptal edebilir.</p>
            <p><strong>5.2</strong> İptal durumunda mevcut ödeme döneminin sonuna kadar hizmet kullanılmaya devam edilir. Bir sonraki dönemde ücret tahsil edilmez.</p>
            <p><strong>5.3</strong> Kısmi dönem iadesi yapılmaz.</p>
            <p><strong>5.4</strong> İptal sonrası hesap Ücretsiz (Starter) plana düşürülür. Veriler korunur.</p>
            <p><strong>5.5</strong> Detaylı iade koşulları için <Link href="/iade-politikasi" className="text-brand-600 underline">İade ve İptal Politikası</Link> sayfasına bakınız.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">6. Kabul Edilebilir Kullanım</h2>
            <p><strong>6.1</strong> Kullanıcı, Platformu yalnızca yasal amaçlarla kullanmayı kabul eder.</p>
            <p><strong>6.2</strong> Aşağıdaki eylemler kesinlikle yasaktır:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Platformun tersine mühendislik (reverse engineering) yapılması, kaynak kodunun çözülmeye çalışılması</li>
              <li>Otomatik botlar, scriptler veya crawlerlar ile sisteme aşırı yük bindirilmesi</li>
              <li>Sahte, yanıltıcı, yasa dışı veya telif hakkı ihlali içeren ürün ilanları oluşturulması</li>
              <li>Üçüncü kişilerin fikri mülkiyet haklarının ihlal edilmesi</li>
              <li>Platform güvenliğini tehlikeye atacak herhangi bir eylemde bulunulması</li>
              <li>Birden fazla hesap oluşturularak ücretsiz plan kota sınırlarının aşılmaya çalışılması</li>
              <li>API&apos;nin izinsiz kullanılması veya verilerin izinsiz toplanması (scraping)</li>
            </ul>
            <p><strong>6.3</strong> Yasak eylemlerin tespiti halinde ListingAI, Kullanıcı hesabını bildirimde bulunmaksızın askıya alma veya kapatma hakkını saklı tutar.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">7. Yapay Zeka İçerik Sorumluluğu</h2>
            <p><strong>7.1</strong> ListingAI tarafından üretilen tüm yapay zeka içerikleri (ilan başlıkları, açıklamalar, anahtar kelimeler, analiz sonuçları) tavsiye niteliğindedir.</p>
            <p><strong>7.2</strong> Kullanıcı, AI tarafından üretilen içerikleri kullanmadan önce kontrol etmekle yükümlüdür.</p>
            <p><strong>7.3</strong> AI içeriklerinin e-ticaret platformlarının kural ve politikalarına uygunluğu tamamen Kullanıcı&apos;nın sorumluluğundadır.</p>
            <p><strong>7.4</strong> ListingAI, AI tarafından üretilen içeriklerden kaynaklanan doğrudan veya dolaylı zararlardan sorumlu tutulamaz.</p>
            <p><strong>7.5</strong> AI tarafından üretilen içerikler, herhangi bir kar, satış artışı veya performans garantisi içermez.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">8. Fikri Mülkiyet</h2>
            <p><strong>8.1</strong> ListingAI platformunun tasarımı, kodu, algoritmaları, logosu, markası ve tüm görsel unsurları ListingAI&apos;ye ait tescilli fikri mülkiyettir.</p>
            <p><strong>8.2</strong> Kullanıcının Platform aracılığıyla oluşturduğu ilan içerikleri (başlık, açıklama, anahtar kelimeler) Kullanıcı&apos;ya aittir.</p>
            <p><strong>8.3</strong> ListingAI, kullanıcı tarafından oluşturulan içerikler üzerinde hizmet iyileştirme amacıyla anonim ve toplu analiz yapma hakkını saklı tutar.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">9. Hizmet Değişiklikleri ve Kesintiler</h2>
            <p><strong>9.1</strong> ListingAI, hizmet kapsamını, özelliklerini ve fiyatlandırmasını önceden bildirimde bulunarak değiştirme hakkını saklı tutar.</p>
            <p><strong>9.2</strong> Planlı bakım çalışmaları mümkün olduğunca önceden duyurulur.</p>
            <p><strong>9.3</strong> ListingAI, mücbir sebepler (doğal afet, savaş, siber saldırı, internet altyapısı arızaları vb.) nedeniyle oluşan hizmet kesintilerinden sorumlu tutulamaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">10. Sorumluluk Sınırlandırması</h2>
            <p><strong>10.1</strong> Platform &quot;olduğu gibi&quot; (as-is) sunulmaktadır. ListingAI, hizmetin kesintisiz veya hatasız olacağını garanti etmez.</p>
            <p><strong>10.2</strong> ListingAI&apos;nin toplam sorumluluğu, hiçbir durumda Kullanıcı&apos;nın son 3 ayda ödediği abonelik bedelini aşamaz.</p>
            <p><strong>10.3</strong> ListingAI; kar kaybı, veri kaybı, itibar kaybı veya dolaylı zararlardan sorumlu tutulamaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">11. Gizlilik ve Kişisel Veriler</h2>
            <p><strong>11.1</strong> Kullanıcı verileri, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında işlenir ve korunur.</p>
            <p><strong>11.2</strong> Detaylı bilgi için <Link href="/gizlilik" className="text-brand-600 underline">Gizlilik Politikası</Link> sayfasına bakınız.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">12. Hesap Kapatma</h2>
            <p><strong>12.1</strong> Kullanıcı, hesabını istediği zaman destek@listingai.store adresine başvurarak kapatabilir.</p>
            <p><strong>12.2</strong> Hesap kapatıldığında Kullanıcı&apos;ya ait veriler yasal saklama süreleri dışında silinir.</p>
            <p><strong>12.3</strong> Aktif aboneliği olan bir hesap kapatıldığında, mevcut dönemin sonuna kadar abonelik aktif kalır ve sonraki dönemde ücret alınmaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">13. Uygulanacak Hukuk ve Yetkili Mahkemeler</h2>
            <p><strong>13.1</strong> İşbu Şartlar, Türkiye Cumhuriyeti kanunlarına tabidir.</p>
            <p><strong>13.2</strong> Uyuşmazlık halinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">14. İletişim</h2>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>E-posta:</strong> destek@listingai.store</li>
              <li><strong>Web Sitesi:</strong> https://www.listingai.store</li>
            </ul>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link href="/mesafeli-satis" className="text-sm text-brand-600 hover:text-brand-700">
              ← Mesafeli Satış Sözleşmesi
            </Link>
            <Link href="/gizlilik" className="text-sm text-brand-600 hover:text-brand-700">
              Gizlilik Politikası →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
