'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'

// Confetti Animation Component
function Confetti() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      size: 4 + Math.random() * 8,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: ['#7c3aed', '#a855f7', '#e879f9', '#fbbf24', '#10b981'][Math.floor(Math.random() * 5)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animation: `confetti ${particle.duration}s ease-in forwards`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          to {
            transform: translate(${(Math.random() - 0.5) * 200}px, 100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Skeleton Loading Component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse" />
              <div className="h-6 bg-gray-200 rounded-lg w-full animate-pulse" />
              <div className="h-6 bg-gray-200 rounded-lg w-5/6 mx-auto animate-pulse" />
            </div>
            <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-xl w-2/3 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Success Screen Component
function SuccessScreen({ planName, message }) {
  const planConfig = {
    starter: { duration: 'Tek Seferlik', features: ['2 Ilan Optimizasyonu', 'SEO Baslik & Aciklama', '10+ Platform Destegi'] },
    pro: { duration: '30 gun', features: ['100 Ilan/Ay', 'Toplu Ilan Uretimi', 'Oncelikli Destek'] },
    business: { duration: '30 gun', features: ['Sinirsiz Ilan', '7/24 VIP Destek', 'AI E-Ticaret Asistani'] },
    pro_annual: { duration: '365 gun (1 Yil)', features: ['100 Ilan/Ay', 'Toplu Ilan Uretimi', 'Oncelikli Destek', 'Yillik %30 Tasarruf'] },
    business_annual: { duration: '365 gun (1 Yil)', features: ['Sinirsiz Ilan', '7/24 VIP Destek', 'AI E-Ticaret Asistani', 'Yillik %30 Tasarruf'] },
  }
  const config = planConfig[message] || planConfig.pro
  const planDuration = config.duration
  const planFeatures = config.features

  return (
    <>
      <Confetti />
      <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] via-white to-[#f5f0ff] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-50 rounded-full blur-3xl opacity-40 -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-pink-50 rounded-full blur-3xl opacity-40 -z-10" />

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white bg-opacity-20 rounded-full mb-6 animate-bounce">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Odeme Basarili!</h1>
              <p className="text-purple-100 text-lg md:text-xl">Tebrikler! {planName} planiniz aktive edildi.</p>
            </div>

            <div className="p-8 md:p-12">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500 bg-opacity-20">
                      <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 100 2H3a1 1 0 000 2h12a1 1 0 100-2h-3a1 1 0 100-2 2 2 0 00-2-2H4zm14.707 3.707a1 1 0 00-1.414-1.414L12 8.586 9.707 6.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Plan Aktif</h3>
                    <p className="text-gray-600 font-medium">{planName} Paketi</p>
                    <p className="text-sm text-gray-500 mt-2">Aktivasyon: Hemen</p>
                    <p className="text-sm text-gray-500">Sure: {planDuration}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-green-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Paket Ozellikleri:</p>
                  <ul className="space-y-2">
                    {planFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <p className="text-xs md:text-sm font-semibold text-gray-600 text-center mb-4">GUVENLI ODEME SISTEMI</p>
                <div className="flex justify-center items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">SSL Guvenli</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.372a3.066 3.066 0 01-2.812 3.062 3.066 3.066 0 01-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 01-1.745-.723 3.066 3.066 0 01-2.812-3.062V6.517a3.066 3.066 0 012.812-3.062z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Lemon Squeezy</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">24/7 Destek</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link href="/dashboard/yeni"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-center text-lg">
                  Ilan Olusturmaya Basla
                </Link>
                <Link href="/dashboard"
                  className="block w-full px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 text-center">
                  Panele Don
                </Link>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Bilgi:</span> Odeme makbuzunuz e-posta adresinize gonderilmistir. Herhangi bir sorun yasanirsa destek ekibimizle iletisime gecebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Error/Failed Screen Component
function ErrorScreen({ status, message }) {
  const isError = status === 'error'
  const title = isError ? 'Bir Hata Olustu' : 'Odeme Basarisiz'
  const description = isError
    ? 'Islem sirasinda beklenmeyen bir hata meydana geldi. Lutfen daha sonra tekrar deneyin.'
    : 'Odeme islemi tamamlanamadi. Kartinizi kontrol ederek tekrar deneyin.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] via-white to-[#f5f0ff] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100 to-pink-50 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-100 to-yellow-50 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white bg-opacity-20 rounded-full mb-6 animate-pulse">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">{title}</h1>
            <p className="text-red-100 text-lg md:text-xl">{description}</p>
          </div>

          <div className="p-8 md:p-12">
            {message && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Hata Detaylari</h3>
                    <p className="text-red-800 text-sm">{decodeURIComponent(message)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-50 rounded-2xl p-6 md:p-8 mb-8 border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Ipuclari
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">\u2022</span>
                  <span>Kartinizin gecerlilik tarihini kontrol edin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">\u2022</span>
                  <span>CVV kodunun dogru oldugundan emin olun</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">\u2022</span>
                  <span>Bankanizin 3D Secure onayini kontrol edin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">\u2022</span>
                  <span>Yeterli bakiyeniz oldugundan emin olun</span>
                </li>
              </ul>
            </div>

            {/* Support Contact */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 md:p-8 mb-8 border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-4">Yardima mi Ihtiyaciniz var?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-[#7c3aed] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm font-medium">E-posta: listingai.official@gmail.com</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link href="/dashboard/odeme"
                className="block w-full px-6 py-4 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-center text-lg">
                Tekrar Dene
              </Link>
              <Link href="/dashboard"
                className="block w-full px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 text-center">
                Panele Don
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Content Component
function SonucContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const message = searchParams.get('message')

  if (status === 'success') {
    const planNames = {
      starter: 'Starter',
      pro: 'Pro',
      business: 'Business',
      pro_annual: 'Pro Yillik',
      business_annual: 'Business Yillik',
    }
    const planName = planNames[message] || message || 'Pro'
    return <SuccessScreen planName={planName} message={message} />
  }

  if (status === 'failed' || status === 'error') {
    return <ErrorScreen status={status} message={message} />
  }

  return <LoadingSkeleton />
}

export default function SonucPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SonucContent />
    </Suspense>
  )
}
