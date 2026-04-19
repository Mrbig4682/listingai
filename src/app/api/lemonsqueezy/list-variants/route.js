// GECICI DEBUG ROUTE — monthly variant ID'lerini almak icin
// Bu route'u kullanimdan sonra SILMEK GEREKLI
export async function GET(request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  // Basit koruma — token eslesmeli
  if (token !== process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'No API key' }, { status: 500 })
  }

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/variants?include=product', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    const data = await response.json()

    const simplified = (data.data || []).map(v => ({
      id: v.id,
      name: v.attributes?.name,
      price: v.attributes?.price,
      price_formatted: v.attributes?.price_formatted,
      interval: v.attributes?.interval,
      interval_count: v.attributes?.interval_count,
      product_id: v.attributes?.product_id,
      status: v.attributes?.status,
    }))

    return Response.json({ variants: simplified, total: simplified.length })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
