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

function getPlanDetails(planName) {
  const plans = {
    starter: { limit: 2, duration: 0 },
    pro: { limit: 100, duration: 30 },
    business: { limit: 999999, duration: 30 },
  }
  return plans[planName] || null
}

export async function POST(request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.listingai.store'

  try {
    const formData = await request.formData()
    const token = formData.get('token')

    if (!token) {
      return redirectWithStatus(baseUrl, 'error', 'Token bulunamadı')
    }

    const apiKey = process.env.IYZICO_API_KEY
    const secretKey = process.env.IYZICO_SECRET_KEY
    const baseUrlApi = process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com'

    if (!apiKey || !secretKey) {
      return redirectWithStatus(baseUrl, 'error', 'Sunucu yapılandırma hatası')
    }

    // iyzico'dan ödeme detayını çek
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
    console.log('iyzico callback result status:', result.status, 'paymentStatus:', result.paymentStatus)

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // basketId format: userId__plan__timestamp
      const basketId = result.basketId || ''
      const parts = basketId.split('__')

      if (parts.length < 2) {
        console.error('Invalid basketId format:', basketId)
        return redirectWithStatus(baseUrl, 'error', 'Geçersiz sipariş formatı')
      }

      const userId = parts[0]
      const plan = parts[1]
      const planDetails = getPlanDetails(plan)

      if (!planDetails) {
        console.error('Unknown plan:', plan)
        return redirectWithStatus(baseUrl, 'error', 'Geçersiz plan')
      }

      const supabase = getSupabase()

      // Ödeme kaydını güncelle
      await supabase
        .from('shopier_payments')
        .update({
          status: 'completed',
          payment_id: result.paymentId?.toString() || '',
          completed_at: new Date().toISOString(),
        })
        .eq('platform_order_id', basketId)

      // Plan süresini hesapla
      let planExpiresAt = null
      if (planDetails.duration > 0) {
        const expiry = new Date()
        expiry.setDate(expiry.getDate() + planDetails.duration)
        planExpiresAt = expiry.toISOString()
      } else {
        // Starter: 1 yıl
        const expiry = new Date()
        expiry.setFullYear(expiry.getFullYear() + 1)
        planExpiresAt = expiry.toISOString()
      }

      // User profile güncelle
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          plan: plan,
          listings_limit: planDetails.limit,
          listings_used: 0,
          plan_started_at: new Date().toISOString(),
          plan_expires_at: planExpiresAt,
        })
        .eq('id', userId)

      if (updateError) {
        console.error('CRITICAL: iyzico payment received but profile update failed!', {
          userId, plan, paymentId: result.paymentId, error: updateError,
        })
      }

      console.log('iyzico payment successful:', {
        userId, plan, paymentId: result.paymentId, planExpiresAt,
      })

      return redirectWithStatus(baseUrl, 'success', plan)
    } else {
      const errorMsg = result.errorMessage || 'Ödeme başarısız oldu'
      console.log('iyzico payment failed:', errorMsg)
      return redirectWithStatus(baseUrl, 'failed', errorMsg)
    }
  } catch (error) {
    console.error('iyzico callback error:', error)
    return redirectWithStatus(baseUrl, 'error', 'Sunucu hatası')
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.listingai.store'
  return redirectWithStatus(baseUrl, 'error', 'Geçersiz istek')
}

function redirectWithStatus(baseUrl, status, message) {
  const url = `${baseUrl}/dashboard/odeme/sonuc?status=${status}&message=${encodeURIComponent(message)}`
  return Response.redirect(url, 303)
}
