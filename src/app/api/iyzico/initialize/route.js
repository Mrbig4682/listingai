import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

// iyzico V2 auth - HMAC-SHA256 tabanlı
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

function formatPrice(price) {
  const result = parseFloat(price).toString()
  if (result.indexOf('.') === -1) return result + '.0'
  return result
}

const PLANS = {
  pro: { name: 'Pro Plan', price: '299.00' },
  business: { name: 'Business Plan', price: '799.00' },
}

export async function POST(request) {
  try {
    const { plan, userId, userEmail } = await request.json()

    if (!plan || !PLANS[plan]) {
      return Response.json({ error: 'Geçersiz plan' }, { status: 400 })
    }

    if (!userId || !userEmail) {
      return Response.json({ error: 'Kullanıcı bilgisi eksik' }, { status: 400 })
    }

    const apiKey = process.env.IYZICO_API_KEY
    const secretKey = process.env.IYZICO_SECRET_KEY
    const baseUrlApi = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

    if (!apiKey || !secretKey) {
      return Response.json({ error: 'Ödeme sistemi yapılandırma hatası' }, { status: 500 })
    }

    const selectedPlan = PLANS[plan]
    const basketId = `LISTINGAI_${plan.toUpperCase()}_${Date.now()}`
    const conversationId = `${userId.substring(0, 8)}_${Date.now()}`
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://listingai-gamma.vercel.app'
    const buyerName = userEmail.split('@')[0]

    const requestBody = {
      locale: 'tr',
      conversationId: conversationId,
      price: formatPrice(selectedPlan.price),
      basketId: basketId,
      paymentGroup: 'PRODUCT',
      buyer: {
        id: userId,
        name: buyerName,
        surname: 'User',
        gsmNumber: '+905350000000',
        email: userEmail,
        identityNumber: '11111111111',
        registrationAddress: 'Istanbul Turkey',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: buyerName + ' User',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul Turkey',
      },
      billingAddress: {
        contactName: buyerName + ' User',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul Turkey',
      },
      basketItems: [
        {
          id: plan,
          name: selectedPlan.name,
          category1: 'SaaS',
          itemType: 'VIRTUAL',
          price: formatPrice(selectedPlan.price),
        },
      ],
      callbackUrl: `${baseUrl}/api/iyzico/callback`,
      currency: 'TRY',
      paidPrice: formatPrice(selectedPlan.price),
      enabledInstallments: [1, 2, 3, 6],
    }

    // Supabase'e ödeme kaydı oluştur
    const supabase = getSupabase()
    await supabase.from('payment_requests').insert({
      user_id: userId,
      plan: plan,
      amount: parseFloat(selectedPlan.price),
      sender_name: userEmail,
      transfer_note: `iyzico - ${basketId}`,
      status: 'pending',
    })

    // iyzico V2 API çağrısı
    const uri = '/payment/iyzipos/checkoutform/initialize/auth/ecom'
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

    console.log('iyzico response status:', result.status)
    if (result.status !== 'success') {
      console.error('iyzico error:', JSON.stringify(result))
    }

    if (result.status === 'success') {
      return Response.json({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
        tokenExpireTime: result.tokenExpireTime,
      })
    } else {
      console.error('iyzico error:', JSON.stringify(result))
      return Response.json({
        error: result.errorMessage || 'iyzico ödeme başlatılamadı',
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Initialize error:', error)
    return Response.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 })
  }
}
