'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SonucContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const message = searchParams.get('message')

  if (status === 'success') {
    const planName = message === 'pro' ? 'Pro' : 'Business'
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Ödeme Başarılı!</h1>
          <p className="text-gray-500 mb-6">
            {planName} planınız aktif edildi. Artık tüm premium özellikleri kullanabilirsiniz!
          </p>
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6">
            <p className="font-semibold">Aktif Plan: {planName}</p>
            <p className="text-sm mt-1">Süre: 1 ay</p>
          </div>
          <Link href="/dashboard/yeni"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition">
            Listing Oluşturmaya Başla
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'failed' || status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Ödeme Başarısız</h1>
          <p className="text-gray-500 mb-6">
            Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.
          </p>
          {message && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6 text-sm">
              {decodeURIComponent(message)}
            </div>
          )}
          <Link href="/dashboard/odeme"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition">
            Tekrar Dene
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )
}

export default function SonucPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <SonucContent />
    </Suspense>
  )
}
