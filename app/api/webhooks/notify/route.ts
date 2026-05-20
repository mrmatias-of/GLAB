import { NextRequest, NextResponse } from "next/server"

// Este endpoint é chamado pelo Zapier para testar a conexão
// e receber eventos do site (trigger)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log do evento recebido (útil para debug)
    console.log("[v0] Webhook notify received:", body)
    
    // Zapier envia um challenge para verificar o endpoint
    if (body.challenge) {
      return NextResponse.json({ challenge: body.challenge })
    }

    // Retorna sucesso
    return NextResponse.json({ 
      success: true, 
      message: "Evento recebido com sucesso",
      received_at: new Date().toISOString()
    })
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    )
  }
}

// GET para Zapier testar a conexão
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "G•Lab Cursos Webhook",
    timestamp: new Date().toISOString(),
  })
}
