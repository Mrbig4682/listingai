import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

let Iyzipay = null
function getIyzipay() {
  if (!Iyzipay) {
    Iyzipay = require('iyzipay')
  }
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
  })
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const token = formData.get('token')

    if (!token) {
      return redirectWithStatus('error', 'Token bulunamadı')
    }

    // iyzipay ile ödeme sonucunu sorgula
    const iyzipay = getIyzipay()

    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({
        locale: Iyzipay.LOCALE.TR,
        token: token,
      }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    console.log('iyzico callback result:', JSON.stringify(result, null, 2))

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // Ödeme başarılı!
      const basketId = result.basketId || ''
      const plan = basketId.includes('PRO') ? 'pro' : 'business'

      // payment_requests tablosunda eşleşen kaydı bul ve güncelle
      const supabase = getSupabase()
      const { data: pendingPayments } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      // basketId ile eşleşen kaydı bul
      let matchedPayment = null
      if (pendingPayments) {
        matchedPayment = pendingPayments.find(p =>
          p.transfer_note && p.transfer_note.includes(basketId)
        )
      }

      if (matchedPayment) {
        // Ödeme talebini onayla
        await supabase
          .from('payment_requests')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            admin_note: `iyzico otomatik onay - ${result.paymentId}`,
          })
          .eq('id', matchedPayment.id)

        // Kullanıcının planını yükselt
        const newLimit = plan === 'pro' ? 200 : 999999
        const expiry = new Date()
        expiry.setMonth(expiry.getMonth() + 1)

        await supabase
          .from('user_profiles')
          .update({
            plan: plan,
            listings_limit: newLimit,
            listings_used: 0,
            plan_started_at: new Date().toISOString(),
            plan_expires_at: expiry.toISOString(),
          })
          .eq('id', matchedPayment.user_id)

        return redirectWithStatus('success', plan)
      } else {
        console.error('No matching payment found for basketId:', basketId)
        return redirectWithStatus('success', plan)
      }
    } else {
      const errorMsg = result.errorMessage || 'Ödeme başarısız oldu'
      return redirectWithStatus('failed', errorMsg)
    }
  } catch (error) {
    console.error('Callback error:', error)
    return redirectWithStatus('error', 'Sunucu hatası')
  }
}

function redirectWithStatus(status, message) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://listingai-gamma.vercel.app'
  const url = `${baseUrl}/dashboard/odeme/sonuc?status=${status}&message=${encodeURIComponent(message)}`
  return Response.redirect(url, 303)
}
