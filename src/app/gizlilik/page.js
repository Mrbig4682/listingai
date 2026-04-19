'use client'
import Link from 'next/link'

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-8">
          ← Kontrol Paneli
        </Link>
        <h1 className="text-2xl font-bold text-trust-dark mb-2">Gizlilik Politikası ve Kişisel Verilerin Korunması</h1>
        <p className="text-sm text-trust-light mb-8">Son güncelleme: 16 Nisan 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-trust-medium">

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">1. Giriş</h2>
            <p><strong>1.1</strong> İşbu Gizlilik Politikası, https://www.listingai.store adresinde yayın yapan ListingAI platformunun (&quot;Platform&quot;) kullanıcılarına ait kişisel verilerin nasıl toplandığını, işlendiğini, saklandığını ve korunduğunu açıklar.</p>
            <p><strong>1.2</strong> Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;), Avrupa Birliği Genel Veri Koruma Tüzüğü (&quot;GDPR&quot;) ve ilgili mevzuat hükümleri doğrultusunda hazırlanmıştır.</p>
            <p><strong>1.3</strong> Platformu kullanan her kişi işbu Gizlilik Politikasını okuduğunu, anladığını ve kabul ettiğini beyan eder.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">2. Veri Sorumlusu</h2>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>Unvan:</strong> ListingAI</li>
              <li><strong>Web Sitesi:</strong> https://www.listingai.store</li>
              <li><strong>E-posta:</strong> destek@listingai.store</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">3. Toplanan Kişisel Veriler</h2>
            <p><strong>3.1 Doğrudan Toplanan Veriler:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad (Google OAuth ile kayıt durumunda)</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi</li>
              <li><strong>Hesap Bilgileri:</strong> Kullanıcı ID, kayıt tarihi, seçilen plan, abonelik durumu</li>
              <li><strong>İlan Verileri:</strong> Ürün adı, açıklama, anahtar kelimeler, kategori, hedef platform, hedef dil</li>
              <li><strong>Tercih Bilgileri:</strong> Dil seçimi, platform tercihleri, arayüz tercihleri</li>
            </ul>
            <p className="mt-3"><strong>3.2 Otomatik Toplanan Veriler:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Kullanım İstatistikleri:</strong> Oluşturulan ilan sayısı, kullanılan özellikler, oturum süresi</li>
              <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgisi, işletim sistemi, cihaz türü</li>
              <li><strong>Çerez Verileri:</strong> Oturum çerezleri, tercih çerezleri</li>
            </ul>
            <p className="mt-3"><strong>3.3 Toplanmayan Veriler:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kredi kartı numarası ve CVV bilgileri (ödeme altyapısında işlenir, tarafımızca saklanmaz)</li>
              <li>TC Kimlik numarası</li>
              <li>Banka hesap bilgileri</li>
              <li>Biyometrik veriler</li>
              <li>Sağlık verileri</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">4. Verilerin İşlenme Amaçları</h2>
            <p>Kişisel veriler aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Üyelik hesabının oluşturulması ve yönetimi</li>
              <li>Hizmet sunumu ve dijital içerik üretimi</li>
              <li>Abonelik ve ödeme işlemlerinin yürütülmesi</li>
              <li>Kullanıcı destek taleplerinin karşılanması</li>
              <li>Platformun iyileştirilmesi ve performans analizi</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>İstatistiksel analiz (anonim ve toplu veriler)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">5. Verilerin Hukuki Dayanağı</h2>
            <p>Kişisel veriler, KVKK&apos;nın 5. maddesi kapsamında aşağıdaki hukuki sebeplerle işlenir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Sözleşmenin ifası:</strong> Hizmetin sunulabilmesi için gerekli verilerin işlenmesi</li>
              <li><strong>Meşru menfaat:</strong> Platform güvenliği, hizmet iyileştirme ve analiz</li>
              <li><strong>Açık rıza:</strong> Pazarlama ve bildirim tercihleri</li>
              <li><strong>Yasal yükümlülük:</strong> Vergi, muhasebe ve denetim gereksinimleri</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">6. Veri Güvenliği</h2>
            <p><strong>6.1 Teknik Önlemler:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tüm iletişimler SSL/TLS (256-bit) şifreleme ile korunur</li>
              <li>Veritabanı şifrelemesi (Supabase AES-256 encryption at rest)</li>
              <li>Ödeme işlemleri PCI DSS uyumlu Lemon Squeezy altyapısında gerçekleştirilir</li>
              <li>Kullanıcı şifreleri bcrypt algoritmasıyla hashlenir</li>
              <li>Row Level Security (RLS) ile veritabanı erişim kontrolü</li>
              <li>API istekleri rate limiting ile korunur</li>
              <li>CSRF ve XSS saldırı koruması aktif</li>
            </ul>
            <p className="mt-3"><strong>6.2 İdari Önlemler:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verilere erişim minimum yetki prensibiyle sınırlandırılmıştır</li>
              <li>Düzenli güvenlik değerlendirmesi ve güncelleme</li>
              <li>Veri ihlali durumunda bildirim prosedürü</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">7. Üçüncü Taraf Paylaşımı</h2>
            <p><strong>7.1</strong> Kişisel veriler, yasal zorunluluklar dışında üçüncü taraflarla pazarlama amacıyla paylaşılmaz ve satılmaz.</p>
            <p><strong>7.2</strong> Hizmet sunumu için aşağıdaki üçüncü taraf hizmet sağlayıcıları ile veri paylaşımı yapılır:</p>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-brand-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Hizmet Sağlayıcı</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Amaç</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-trust-dark">Paylaşılan Veri</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Supabase</td>
                    <td className="border border-gray-200 px-4 py-2">Veritabanı ve kimlik doğrulama</td>
                    <td className="border border-gray-200 px-4 py-2">E-posta, hesap bilgileri, ilan verileri</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">Anthropic (Claude API)</td>
                    <td className="border border-gray-200 px-4 py-2">AI ile içerik üretimi</td>
                    <td className="border border-gray-200 px-4 py-2">Ürün bilgileri (anonim)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Lemon Squeezy</td>
                    <td className="border border-gray-200 px-4 py-2">Ödeme işlemleri (Merchant of Record)</td>
                    <td className="border border-gray-200 px-4 py-2">E-posta, ödeme tutarı, fatura bilgileri</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">Vercel</td>
                    <td className="border border-gray-200 px-4 py-2">Web hosting ve CDN</td>
                    <td className="border border-gray-200 px-4 py-2">IP adresi, teknik veriler</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Google (OAuth)</td>
                    <td className="border border-gray-200 px-4 py-2">Sosyal giriş</td>
                    <td className="border border-gray-200 px-4 py-2">Ad, e-posta (kullanıcı onayıyla)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2"><strong>7.3</strong> Anthropic Claude API&apos;sine gönderilen ürün verileri, Anthropic tarafından model eğitiminde kullanılmaz (Anthropic API veri politikası gereği).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">8. Çerezler (Cookies)</h2>
            <p><strong>8.1</strong> ListingAI aşağıdaki çerez türlerini kullanır:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Zorunlu Çerezler:</strong> Oturum yönetimi ve kimlik doğrulama için gereklidir. Devre dışı bırakılamaz.</li>
              <li><strong>Tercih Çerezleri:</strong> Dil seçimi ve arayüz tercihlerinin hatırlanması için kullanılır.</li>
            </ul>
            <p><strong>8.2</strong> ListingAI, analitik veya reklam amaçlı üçüncü taraf çerezleri kullanmaz.</p>
            <p><strong>8.3</strong> Kullanıcılar, tarayıcı ayarlarından çerezleri yönetebilir. Zorunlu çerezlerin devre dışı bırakılması halinde Platform düzgün çalışmayabilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">9. Veri Saklama Süreleri</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Hesap Verileri:</strong> Hesap aktif olduğu süre boyunca + hesap kapanışından sonra 6 ay</li>
              <li><strong>İlan Verileri:</strong> Hesap aktif olduğu süre boyunca</li>
              <li><strong>Ödeme Kayıtları:</strong> Yasal zorunluluk gereği 10 yıl (Vergi Usul Kanunu)</li>
              <li><strong>Log Kayıtları:</strong> 5651 sayılı Kanun gereği 2 yıl</li>
              <li><strong>Çerez Verileri:</strong> Oturum çerezleri: oturum sonuna kadar / Tercih çerezleri: 1 yıl</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">10. KVKK Kapsamında Haklarınız</h2>
            <p>6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmiş ise buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
              <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
              <li>Düzeltme ve silme işlemlerinin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğranması halinde zararın giderilmesini talep etme</li>
            </ul>
            <p className="mt-2"><strong>Başvuru Yöntemi:</strong> KVKK kapsamındaki taleplerinizi <strong>destek@listingai.store</strong> adresine, kimliğinizi doğrulayan bilgilerle birlikte e-posta ile iletebilirsiniz. Talepler en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">11. Uluslararası Veri Aktarımı</h2>
            <p><strong>11.1</strong> Hizmet sunumu gereği, kişisel veriler aşağıdaki ülkelere aktarılabilir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>ABD:</strong> Supabase (veritabanı), Vercel (hosting), Anthropic (AI API)</li>
            </ul>
            <p><strong>11.2</strong> Uluslararası veri aktarımı, KVKK&apos;nın 9. maddesi kapsamında yeterli koruma sağlayan veya uygun güvencelerin mevcut olduğu ülkelere yapılır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">12. Politika Değişiklikleri</h2>
            <p><strong>12.1</strong> ListingAI, işbu Gizlilik Politikasını güncelleme hakkını saklı tutar.</p>
            <p><strong>12.2</strong> Önemli değişiklikler, kayıtlı e-posta adresi veya platform içi bildirim yoluyla kullanıcılara duyurulur.</p>
            <p><strong>12.3</strong> Güncel politika her zaman bu sayfada yayınlanır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">13. İletişim</h2>
            <p>Gizlilik politikası ve kişisel verileriniz hakkındaki tüm sorularınız için:</p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>E-posta:</strong> destek@listingai.store</li>
              <li><strong>Web Sitesi:</strong> https://www.listingai.store</li>
            </ul>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link href="/kullanim-sartlari" className="text-sm text-brand-600 hover:text-brand-700">
              ← Kullanım Şartları
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
