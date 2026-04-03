import './globals.css'

export const metadata = {
  title: 'ListingAI — Türk E-Ticaret Satıcıları İçin AI Listing Optimizer',
  description: 'Trendyol, Hepsiburada ve N11 için SEO uyumlu, dönüşüm odaklı ürün listingleri oluşturun.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
