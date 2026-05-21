import { NextRequest, NextResponse } from "next/server"
import { sendMessage } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer, userAgent } = body

    // Pegar IP do visitante
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "IP desconhecido"

    // Pegar info do user agent
    const isMobile = userAgent?.includes("Mobile") ? "Mobile" : "Desktop"
    const browser = detectBrowser(userAgent || "")

    // Formatar mensagem
    const message = [
      `<b>Novo visitante no site</b>`,
      ``,
      `<b>IP:</b> <code>${ip}</code>`,
      `<b>Pagina:</b> ${page || "/"}`,
      `<b>Dispositivo:</b> ${isMobile}`,
      `<b>Navegador:</b> ${browser}`,
      referrer ? `<b>Origem:</b> ${referrer}` : null,
      ``,
      `<i>${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</i>`,
    ].filter(Boolean).join("\n")

    // Enviar notificacao no Telegram
    await sendMessage(message)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Erro ao registrar visitante:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

function detectBrowser(ua: string): string {
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome"
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari"
  if (ua.includes("Firefox")) return "Firefox"
  if (ua.includes("Edg")) return "Edge"
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera"
  return "Outro"
}
