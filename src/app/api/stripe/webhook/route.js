import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

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
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig) {
      console.error('Missing stripe-signature header')
      return Response.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event

    try {
      const stripe = getStripe()
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return Response.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      const userId = session.metadata?.userId
      const plan = session.metadata?.plan
      const userName = session.metadata?.userName

      if (!userId || !plan) {
        console.error('Missing userId or plan in session metadata:', session.metadata)
        return Response.json(
          { error: 'Missing required metadata' },
          { status: 400 }
        )
      }

      const planDetails = getPlanDetails(plan)

      if (!planDetails) {
        console.error('Unknown plan:', plan)
        return Response.json(
          { error: 'Invalid plan' },
          { status: 400 }
        )
      }

      const supabase = getSupabase()

      // Calculate plan expiry date
      let planExpiresAt = null
      if (planDetails.duration > 0) {
        const expiry = new Date()
        expiry.setDate(expiry.getDate() + planDetails.duration)
        planExpiresAt = expiry.toISOString()
      } else {
        // One-time payment (starter) - expires in 1 year
        const expiry = new Date()
        expiry.setFullYear(expiry.getFullYear() + 1)
        planExpiresAt = expiry.toISOString()
      }

      // Update shopier_payments table (reuse existing table for payment history)
      await supabase
        .from('shopier_payments')
        .insert({
          user_id: userId,
          user_email: session.customer_email,
          plan: plan,
          amount: session.amount_total / 100, // Convert from cents
          platform_order_id: session.id,
          status: 'completed',
          payment_id: session.payment_intent,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })

      // Update user_profiles table
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
          userId,
          plan,
          paymentIntent: session.payment_intent,
          error: updateError,
        })
        return Response.json(
          { error: 'Database update failed' },
          { status: 500 }
        )
      }

      console.log('Stripe payment successful:', {
        userId,
        plan,
        paymentIntent: session.payment_intent,
        planExpiresAt,
      })

      return Response.json({ received: true })
    }

    // Return 200 for other event types
    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}
