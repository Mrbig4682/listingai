export async function GET() {
  return Response.json({
    status: 'ok',
    time: new Date().toISOString(),
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    keyLength: process.env.ANTHROPIC_API_KEY?.length || 0
  })
}

export async function POST(request) {
  const body = await request.json()
  return Response.json({
    status: 'ok',
    received: body,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    keyLength: process.env.ANTHROPIC_API_KEY?.length || 0
  })
}
