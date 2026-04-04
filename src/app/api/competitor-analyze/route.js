import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function POST(request) {
  try {
    const { product, platform, category, competitors, language = 'en', country = 'Global' } = await request.json()

    if (!product) {
      return Response.json({ error: 'Product info required.' }, { status: 400 })
    }

    const anthropic = getAnthropic()

    const prompt = `IMPORTANT: Respond entirely in ${language === 'tr' ? 'Turkish' : 'English'} language.

You are a competitive intelligence expert for e-commerce. Analyze the competitive landscape for the following product.

Product: ${product}
Platform: ${platform || 'Amazon'}
Category: ${category || 'General'}
Market/Country: ${country}
${competitors ? `Known Competitors: ${competitors}` : ''}

Provide a comprehensive competitive analysis. Return ONLY valid JSON:
{
  "market_overview": {
    "market_size": "estimated market size description",
    "growth_trend": "growing/stable/declining",
    "saturation_level": "low/medium/high",
    "opportunity_score": 78
  },
  "top_competitors": [
    {
      "name": "Competitor brand/product name",
      "website_url": "https://example.com",
      "estimated_price": "$XX.XX",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "estimated_rating": 4.2,
      "estimated_reviews": "1000+",
      "threat_level": "high/medium/low"
    }
  ],
  "price_analysis": {
    "lowest": "$XX",
    "highest": "$XX",
    "average": "$XX",
    "sweet_spot": "$XX",
    "recommendation": "Price recommendation text"
  },
  "keyword_gaps": [
    {
      "keyword": "keyword text",
      "difficulty": "easy/medium/hard",
      "opportunity": "high/medium/low",
      "tip": "How to use this keyword"
    }
  ],
  "differentiation_opportunities": [
    {
      "area": "Feature/benefit area",
      "description": "What you can do differently",
      "impact": "high/medium/low"
    }
  ],
  "listing_strategy": {
    "title_tips": ["tip1", "tip2", "tip3"],
    "description_focus": ["focus1", "focus2", "focus3"],
    "image_recommendations": ["rec1", "rec2", "rec3"],
    "pricing_strategy": "detailed pricing recommendation"
  },
  "risk_factors": [
    {
      "risk": "Risk description",
      "severity": "high/medium/low",
      "mitigation": "How to mitigate"
    }
  ],
  "action_plan": [
    {
      "priority": 1,
      "action": "What to do",
      "expected_impact": "Impact description",
      "timeline": "immediate/short-term/long-term"
    }
  ],
  "overall_score": {
    "market_opportunity": 75,
    "competition_intensity": 60,
    "entry_barrier": 40,
    "profit_potential": 80
  }
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')

    const result = JSON.parse(jsonMatch[0])
    return Response.json({ result })
  } catch (error) {
    console.error('Competitor analyze error:', error)
    return Response.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
}
