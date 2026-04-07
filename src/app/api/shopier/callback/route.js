import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

function verifyShopierSignature(platformOrderId, randomNr, signature, apiSecret) {
  try {
    const decodedSignature = Buffer.from(signature, 'base64')
    const expectedSignature = crypto
      .createHmac('sha256', apiSecret)
      .update(randomNr + platformOrderId)
      .digest()
    return crypto.timingSafeEqual(decodedSignature, expectedSignature)
  } catch (err) {
    console.error('Signature verification error:', err)
    return false
  }
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

    const platformOrderId = formData.get('platform_order_id') || ''
    const apiKey = formData.get('API_key') || ''
    const status = formData.get('status') || ''
    const installment = formData.get('installment') || '0'
    const paymentId = formData.get('payment_id') || ''
    const randomNr = formData.get('random_nr') || ''
    const signature = formData.get('signature') || ''

    console.log('Shopier callback received:', {
      platformOrderId, status, paymentId, randomNr, installment,
    })

    const apiSecret = process.env.SHOPIER_API_SECRET

    if (!apiSecret) {
      console.error('SHOPIER_API_SECRET is not configured')
      return redirectWithStatus(baseUrl, 'error', 'Sunucu yapilandirma hatasi')
    }

    const isValid = verifyShopierSignature(platformOrderId, randomNr, signature, apiSecret)

    if (!isValid) {
      console.error('Invalid Shopier signature for order:', platformOrderId)
      return redirectWithStatus(baseUrl, 'error', 'Gecersiz imza - odeme dogrulanamadi')
    }

    if (status !== 'success') {
      console.log('Payment failed for order:', platformOrderId)
      return redirectWithStatus(baseUrl, 'failed', 'Odeme basarisiz oldu')
    }

    const parts = platformOrderId.split('__')
    if (parts.length < 2) {
      console.error('Invalid platform_order_id format:', platformOrderId)
      return redirectWithStatus(baseUrl, 'error', 'Gecersiz siparis formati')
    }

    const userId = parts[0]
    const plan = parts[1]
    const planDetails = getPlanDetails(plan)

    if (!planDetails) {
      console.error('Unknown plan:', plan)
      return redirectWithStatus(baseUrl, 'error', 'Gecersiz plan')
    }

    const supabase = getSupabase()

    await supabase
      .from('shopier_payments')
      .update({
        status: 'completed',
        payment_id: paymentId,
        installment: parseInt(installment),
        completed_at: new Date().toISOString(),
      })
      .eq('platform_order_id', platformOrderId)

    let planExpiresAt = null
    if (planDetails.duration > 0) {
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + planDetails.duration)
      planExpiresAt = expiry.toISOString()
    } else {
      const expiry = new Date()
      expiry.setFullYear(expiry.getFullYear() + 1)
      planExpiresAt = expiry.toISOString()
    }

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
      console.error('CRITICAL: Payment received but profile update failed!', {
        userId, plan, paymentId, error: updateError,
      })
    }

    console.log('Shopier payment successful:', {
      userId, plan, paymentId, planExpiresAt,
    })

    return redirectWithStatus(baseUrl, 'success', plan)

  } catch (error) {
    console.error('Shopier callback error:', error)
    return redirectWithStatus(baseUrl, 'error', 'Sunucu hatasi')
  }
}

export async function GET(request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.listingai.store'
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  if (status) {
    return redirectWithStatus(baseUrl, status, searchParams.get('message') || '')
  }

  return redirectWithStatus(baseUrl, 'error', 'Gecersiz istek')
}

function redirectWithStatus(baseUrl, status, message) {
  const url = `${baseUrl}/dashboard/odeme/sonuc?status=${status}&message=${encodeURIComponent(message)}`
  return Response.redirect(url, 303)
}
