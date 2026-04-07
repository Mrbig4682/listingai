import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
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
  try {
    const formData = await request.formData()

    const res = formData.get('res') || ''
    const hash = formData.get('hash') || ''

    console.log('Shopier OSB received:', { resLength: res.length, hashLength: hash.length })

    const apiKey = process.env.SHOPIER_API_KEY
    const apiSecret = process.env.SHOPIER_API_SECRET

    if (!apiKey || !apiSecret) {
      console.error('Shopier API credentials not configured')
      return Response.json({ status: 'error', message: 'Server config error' }, { status: 500 })
    }

    // Verify hash: hash_hmac('sha256', res + username, key, false)
    const expectedHash = crypto
      .createHmac('sha256', apiSecret)
      .update(res + apiKey)
      .digest('hex')

    if (expectedHash !== hash) {
      console.error('Invalid OSB hash', { expected: expectedHash.substring(0, 10), received: hash.substring(0, 10) })
      return Response.json({ status: 'error', message: 'Invalid hash' }, { status: 400 })
    }

    // Decode res (base64 JSON)
    let orderData
    try {
      const decoded = Buffer.from(res, 'base64').toString('utf-8')
      orderData = JSON.parse(decoded)
    } catch (e) {
      console.error('Failed to decode OSB res:', e)
      return Response.json({ status: 'error', message: 'Invalid res data' }, { status: 400 })
    }

    console.log('OSB order data:', orderData)

    const platformOrderId = orderData.platform_order_id || orderData.orderid || ''
    const paymentId = orderData.payment_id || orderData.paymentid || ''

    if (!platformOrderId) {
      console.error('No platform_order_id in OSB data')
      return Response.json({ status: 'error', message: 'Missing order ID' }, { status: 400 })
    }

    // Parse platformOrderId: userId__plan__timestamp
    const parts = platformOrderId.split('__')
    if (parts.length < 2) {
      console.error('Invalid platform_order_id format:', platformOrderId)
      return Response.json({ status: 'error', message: 'Invalid order format' }, { status: 400 })
    }

    const userId = parts[0]
    const plan = parts[1]
    const planDetails = getPlanDetails(plan)

    if (!planDetails) {
      console.error('Unknown plan from OSB:', plan)
      return Response.json({ status: 'error', message: 'Invalid plan' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Update payment record
    await supabase
      .from('shopier_payments')
      .update({
        status: 'completed',
        payment_id: paymentId,
        completed_at: new Date().toISOString(),
        osb_verified: true,
      })
      .eq('platform_order_id', platformOrderId)

    // Calculate plan expiry
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

    // Update user profile with new plan
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
      console.error('CRITICAL: OSB payment received but profile update failed!', {
        userId, plan, paymentId, error: updateError,
      })
      return Response.json({ status: 'error', message: 'Profile update failed' }, { status: 500 })
    }

    console.log('OSB payment processed successfully:', {
      userId, plan, paymentId, planExpiresAt,
    })

    return Response.json({ status: 'success', message: 'Payment processed' })

  } catch (error) {
    console.error('Shopier OSB error:', error)
    return Response.json({ status: 'error', message: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({ status: 'ok', message: 'Shopier OSB endpoint active' })
}
