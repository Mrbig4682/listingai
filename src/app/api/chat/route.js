import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

const SYSTEM_PROMPT = `Sen "ListingAI Asistan" adında, Türk e-ticaret satıcılarına yardım eden uzman bir AI asistansın.

Uzmanlık alanların:
- Trendyol, Hepsiburada, N11 platformlarında listing optimizasyonu
- SEO ve anahtar kelime stratejileri
- Ürün fotoğrafı ve açıklama önerileri
- Fiyatlandırma stratejileri
- E-ticaret trendleri ve pazar analizi
- Mağaza yönetimi ipuçları
- Müşteri memnuniyeti ve iade yönetimi

Kurallar:
- Her zaman Türkçe cevap ver
- Kısa, net ve aksiyon odaklı tavsiyelerde bulun
- Somut örnekler ver
- Platform bazlı farklılıkları belirt
- Gerektiğinde madde madde listele
- Kullanıcı bir listing paylaşırsa, onu analiz edip iyileştirme önerileri sun
- Dostça ve profesyonel bir ton kullan`

export async function POST(request) {
  try {
    const { messages } = await request.json()

    if (!messages?.length) {
      return Response.json({ error: 'Mesaj gerekli' }, { status: 400 })
    }

    const anthropic = getAnthropic()

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    })

    const text = response.content[0].text

    return Response.json({ message: text })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json({ error: 'Bir hata oluştu, tekrar deneyin.' }, { status: 500 })
  }
}
