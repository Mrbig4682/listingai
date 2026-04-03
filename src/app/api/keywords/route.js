import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function POST(request) {
  try {
    const { product, category, platform } = await request.json()

    if (!product) {
      return Response.json({ error: 'Ürün bilgisi gerekli.' }, { status: 400 })
    }

    const platformName = platform === 'all' ? 'Trendyol, Hepsiburada ve N11' :
      platform === 'hepsiburada' ? 'Hepsiburada' : platform === 'n11' ? 'N11' : 'Trendyol'

    const prompt = `Sen bir Türk e-ticaret SEO ve anahtar kelime uzmanısın. Aşağıdaki ürün için ${platformName} platformunda anahtar kelime araştırması yap.

Ürün: ${product}
${category ? `Kategori: ${category}` : ''}

Şu bilgileri üret:
1. primary_keywords: En önemli 5 ana anahtar kelime (yüksek arama hacmi)
2. long_tail: 8 adet uzun kuyruklu anahtar kelime (daha spesifik, daha düşük rekabet)
3. trending: 4 adet trend olan / yükselen arama terimleri
4. negative: 5 adet negatif anahtar kelime (başlıkta kullanılmaması gerekenler)
5. title_suggestion: Bu anahtar kelimeleri kullanarak örnek bir başlık önerisi
6. tips: 3 adet SEO ipucu (bu ürün/kategori özelinde)

Her anahtar kelime için:
- keyword: kelime
- volume: tahmini aylık arama hacmi (düşük/orta/yüksek)
- competition: rekabet seviyesi (düşük/orta/yüksek)
- relevance: uygunluk skoru (1-10)

SADECE aşağıdaki JSON formatında yanıt ver:
{"primary_keywords": [{"keyword": "...", "volume": "yüksek", "competition": "yüksek", "relevance": 9}], "long_tail": [...], "trending": [...], "negative": ["..."], "title_suggestion": "...", "tips": ["..."]}`

    const message = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text.trim()
    let parsed
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch {
      return Response.json({ error: 'AI yanıtı işlenemedi.' }, { status: 500 })
    }

    return Response.json({ result: parsed })
  } catch (error) {
    console.error('Keywords error:', error)
    return Response.json({ error: 'Anahtar kelime araştırmasında hata oluştu.' }, { status: 500 })
  }
}
