import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

const PLANS = {
  starter: {
    name: 'ListingAI Starter - One-time',
    amount: 100, // $1.00 in cents
    currency: 'usd',
    limit: 2,
  },
  pro: {
    name: 'ListingAI Pro - Monthly',
    amount: 1900, // $19.00 in cents
    currency: 'usd',
    limit: 100,
  },
  business: {
    name: 'ListingAI Business - Monthly',
    amount: 4900, // $49.00 in cents
    currency: 'usd',
    limit: 999999,
  },
}

export async function POST(request) {
  try {
    const { plan, userId, userEmail, userName } = await request.json()

    if (!plan || !PLANS[plan]) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (!userId || !userEmail) {
      return Response.json({ error: 'Missing user information' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.listingai.store'
    const selectedPlan = PLANS[plan]
    const mode = plan === 'starter' ? 'payment' : 'subscription'

    // Create line item based on plan
    let lineItem = {
      price_data: {
        currency: selectedPlan.currency,
        product_data: {
          name: selectedPlan.name,
          description: `${selectedPlan.limit} listings per month`,
          metadata: {
            plan: plan,
          },
        },
        unit_amount: selectedPlan.amount,
      },
      quantity: 1,
    }

    // For subscriptions, create or use a price object
    if (mode === 'subscription') {
      lineItem = {
        price_data: {
          currency: selectedPlan.currency,
          product_data: {
            name: selectedPlan.name,
            description: `${selectedPlan.limit} listings per month`,
            metadata: {
              plan: plan,
            },
          },
          unit_amount: selectedPlan.amount,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      }
    }

    // Create Stripe Checkout session
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: mode,
      success_url: `${appUrl}/dashboard/odeme/sonuc?status=success&message=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/odeme?cancelled=true`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        plan: plan,
        userName: userName || userEmail.split('@')[0],
      },
    })

    return Response.json({
      success: true,
      url: session.url,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return Response.json({
      error: 'Server error: ' + error.message
    }, { status: 500 })
  }
}
