'use client'
import Link from 'next/link'

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-8">
          ← Kontrol Paneli
        </Link>
        <h1 className="text-2xl font-bold text-trust-dark mb-2">Gizlilik Politikası</h1>
        <p className="text-sm text-trust-light mb-8">Son güncelleme: 4 Nisan 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-trust-medium">
          <section>
            <h2 className="text-lg font-semibold text-trust-dark">1. Toplanan Veriler</h2>
            <p>ListingAI, hizmet sunumu için aşağıdaki verileri toplar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>E-posta adresi ve hesap bilgileri</li>
              <li>Oluşturulan ilan verileri (ürün adı, açıklama, anahtar kelimeler)</li>
              <li>Platform tercihleri ve dil seçimi</li>
              <li>Ödeme bilgileri (güvenli ödeme altyapısı üzerinden işlenir, tarafımızca saklanmaz)</li>
              <li>Kullanım istatistikleri ve performans verileri</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">2. Verilerin Kullanım Amacı</h2>
            <p>Toplanan veriler yalnızca hizmet sunumu, performans iyileştirmesi, kullanıcı deneyiminin geliştirilmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">3. Veri Güvenliği</h2>
            <p>Kullanıcı verileri, Supabase altyapısı üzerinde endüstri standardı şifreleme yöntemleriyle korunur. Tüm iletişimler SSL/TLS protokolü ile şifrelenir. Ödeme bilgileri PCI DSS uyumlu güvenli ödeme altyapısında işlenir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">4. Üçüncü Taraf Paylaşımı</h2>
            <p>Kullanıcı verileri, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. AI analiz hizmetleri için ürün verileri Anthropic Claude API'sine gönderilir; bu veriler Anthropic tarafından model eğitiminde kullanılmaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">5. Çerezler</h2>
            <p>ListingAI, oturum yönetimi ve kullanıcı tercihleri için gerekli çerezleri kullanır. Analitik veya reklam amaçlı üçüncü taraf çerezleri kullanılmaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">6. KVKK Kapsamında Haklarınız</h2>
            <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında verilerinizin işlenip işlenmediğini öğrenme, düzeltme veya silme talebinde bulunma hakkınız saklıdır. Taleplerinizi destek e-posta adresimiz üzerinden iletebilirsiniz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-trust-dark">7. İletişim</h2>
            <p>Gizlilik politikamız hakkında sorularınız için: <strong>destek@listingai.com</strong></p>
          </section>
        </div>
      </div>
    </div>
  )
}
