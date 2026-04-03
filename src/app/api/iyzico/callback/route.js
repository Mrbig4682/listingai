import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

function generateAuthHeaderV2(apiKey, secretKey, uri, body, randomString) {
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(randomString + uri + JSON.stringify(body))
    .digest('hex')

  const authorizationParams = [
    'apiKey:' + apiKey,
    'randomKey:' + randomString,
    'signature:' + signature,
  ]
  return 'IYZWSv2 ' + Buffer.from(authorizationParams.join('&')).toString('base64')
}

function generateRandomString() {
  return process.hrtime.bigint().toString() + Math.random().toString(8).slice(2)
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const token = formData.get('token')

    if (!token) {
      return redirectWithStatus('error', 'Token bulunamadı')
    }

    const apiKey = process.env.IYZICO_API_KEY
    const secretKey = process.env.IYZICO_SECRET_KEY
    const baseUrlApi = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

    const requestBody = {
      locale: 'tr',
      token: token,
    }

    const uri = '/payment/iyzipos/checkoutform/auth/ecom/detail'
    const randomString = generateRandomString()
    const authorization = generateAuthHeaderV2(apiKey, secretKey, uri, requestBody, randomString)

    const response = await fetch(`${baseUrlApi}${uri}`, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'x-iyzi-rnd': randomString,
        'x-iyzi-client-version': 'iyzipay-node-2.0.67',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json()
    console.log('iyzico callback result:', JSON.stringify(result, null, 2))

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      const basketId = result.basketId || ''
      const plan = basketId.includes('PRO') ? 'pro' : 'business'

      const supabase = getSupabase()
      const { data: pendingPayments } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      let matchedPayment = null
      if (pendingPayments) {
        matchedPayment = pendingPayments.find(p =>
          p.transfer_note && p.transfer_note.includes(basketId)
        )
      }

      if (matchedPayment) {
        await supabase
          .from('payment_requests')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            admin_note: `iyzico otomatik onay - ${result.paymentId}`,
          })
          .eq('id', matchedPayment.id)

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
