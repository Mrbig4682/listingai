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

function formatPrice(price) {
  const result = parseFloat(price).toString()
  if (result.indexOf('.') === -1) return result + '.0'
  return result
}

const PLANS = {
  starter: { name: 'ListingAI Starter', price: '0.00', limit: 2, duration: 0 },       // Ücretsiz
  pro: { name: 'ListingAI Pro', price: '19.90', limit: 100, duration: 30 },          // 19.90 TL
  business: { name: 'ListingAI Business', price: '49.90', limit: 999999, duration: 30 }, // 49.90 TL
}

export async function POST(request) {
  try {
    const { plan, userId, userEmail, userName } = await request.json()

    if (!plan || !PLANS[plan]) {
      return Response.json({ error: 'Geçersiz plan' }, { status: 400 })
    }

    if (!userId || !userEmail) {
      return Response.json({ error: 'Kullanıcı bilgisi eksik' }, { status: 400 })
    }

    const apiKey = process.env.IYZICO_API_KEY
    const secretKey = process.env.IYZICO_SECRET_KEY
    const baseUrlApi = process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com'

    if (!apiKey || !secretKey) {
      return Response.json({ error: 'Ödeme sistemi yapılandırma hatası' }, { status: 500 })
    }

    const selectedPlan = PLANS[plan]
    // basketId format: userId__plan__timestamp — callback'te parse edilecek
    const basketId = `${userId}__${plan}__${Date.now()}`
    const conversationId = `${userId.substring(0, 8)}_${Date.now()}`
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.listingai.store'

    const nameParts = (userName || userEmail.split('@')[0] || 'Musteri').split(' ')
    const buyerName = nameParts[0] || 'Musteri'
    const buyerSurname = nameParts.slice(1).join(' ') || '.'

    const requestBody = {
      locale: 'tr',
      conversationId: conversationId,
      price: formatPrice(selectedPlan.price),
      paidPrice: formatPrice(selectedPlan.price),
      basketId: basketId,
      paymentGroup: 'PRODUCT',
      currency: 'USD',
      enabledInstallments: [1],
      buyer: {
        id: userId,
        name: buyerName,
        surname: buyerSurname,
        gsmNumber: '+905350000000',
        email: userEmail,
        identityNumber: '11111111111',
        registrationAddress: 'Digital Product',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: `${buyerName} ${buyerSurname}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Digital Product',
      },
      billingAddress: {
        contactName: `${buyerName} ${buyerSurname}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Digital Product',
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
    }

    // Supabase'e ödeme kaydı oluştur
    const supabase = getSupabase()
    await supabase.from('shopier_payments').insert({
      user_id: userId,
      user_email: userEmail,
      plan: plan,
      amount: parseFloat(selectedPlan.price),
      platform_order_id: basketId,
      status: 'pending',
      created_at: new Date().toISOString(),
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
        errorCode: result.errorCode || '',
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Initialize error:', error)
    return Response.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 })
  }
}
