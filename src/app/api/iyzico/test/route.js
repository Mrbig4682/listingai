import crypto from 'crypto'

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

export async function GET() {
  const apiKey = process.env.IYZICO_API_KEY
  const secretKey = process.env.IYZICO_SECRET_KEY
  const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

  const results = {}

  // Test 1: BIN numarası sorgulama (en basit API çağrısı)
  try {
    const uri1 = '/payment/bin/check'
    const body1 = { locale: 'tr', binNumber: '552879' }
    const rnd1 = Date.now().toString() + 'abc'
    const auth1 = generateAuthHeaderV2(apiKey, secretKey, uri1, body1, rnd1)

    const res1 = await fetch(`${baseUrl}${uri1}`, {
      method: 'POST',
      headers: {
        'Authorization': auth1,
        'x-iyzi-rnd': rnd1,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body1),
    })
    results.binCheck = await res1.json()
  } catch (e) {
    results.binCheck = { error: e.message }
  }

  // Test 2: Checkout form initialize (asıl çağrımız)
  try {
    const uri2 = '/payment/iyzipos/checkoutform/initialize/auth/ecom'
    const body2 = {
      locale: 'tr',
      conversationId: 'test_' + Date.now(),
      price: '1.0',
      paidPrice: '1.0',
      currency: 'TRY',
      basketId: 'TEST_' + Date.now(),
      paymentGroup: 'PRODUCT',
      callbackUrl: 'https://listingai-gamma.vercel.app/api/iyzico/callback',
      enabledInstallments: [1],
      buyer: {
        id: 'testbuyer1',
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905350000000',
        email: 'test@test.com',
        identityNumber: '11111111111',
        registrationAddress: 'Istanbul Turkey',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: 'John Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul Turkey',
      },
      billingAddress: {
        contactName: 'John Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul Turkey',
      },
      basketItems: [{
        id: 'test1',
        name: 'Test',
        category1: 'Test',
        itemType: 'VIRTUAL',
        price: '1.0',
      }],
    }
    const rnd2 = Date.now().toString() + 'def'
    const auth2 = generateAuthHeaderV2(apiKey, secretKey, uri2, body2, rnd2)

    const res2 = await fetch(`${baseUrl}${uri2}`, {
      method: 'POST',
      headers: {
        'Authorization': auth2,
        'x-iyzi-rnd': rnd2,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body2),
    })
    results.checkoutForm = await res2.json()
  } catch (e) {
    results.checkoutForm = { error: e.message }
  }

  // Debug bilgileri
  results.debug = {
    apiKeyFirst10: apiKey?.substring(0, 10),
    secretKeyFirst10: secretKey?.substring(0, 10),
    baseUrl: baseUrl,
    apiKeyLength: apiKey?.length,
    secretKeyLength: secretKey?.length,
  }

  return Response.json(results, { status: 200 })
}
