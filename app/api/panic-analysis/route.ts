import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateText } from 'ai'
import { gateway } from '@ai-sdk/gateway'

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { filename, content, fileSize } = await request.json()

    if (!content || !filename) {
      return NextResponse.json(
        { error: 'Arquivo ou nome do arquivo não fornecido' },
        { status: 400 }
      )
    }

    // Extrair informações básicas do log
    const deviceModel = extractDeviceModel(content)
    const iosVersion = extractIOSVersion(content)
    const panicType = extractPanicType(content)

    // Limitar conteúdo para análise (primeiros 15000 caracteres)
    const contentForAnalysis = content.slice(0, 15000)

    // Analisar com IA
    const { text } = await generateText({
      model: gateway('anthropic/claude-sonnet-4'),
      system: `Você é um especialista em diagnóstico de dispositivos iOS. Analise logs de panic/crash e identifique as 3 causas mais prováveis do problema.

IMPORTANTE: Responda APENAS com JSON válido, sem markdown, sem explicações adicionais.

Para cada falha, forneça:
- titulo: Nome curto do problema (máx 50 caracteres)
- descricao: Explicação técnica do problema (máx 200 caracteres)
- probabilidade: Número de 1 a 100 indicando a probabilidade
- solucao: Solução recomendada para o técnico (máx 200 caracteres)

Formato de resposta (JSON puro):
{
  "device_model": "iPhone XX" ou null se não identificado,
  "ios_version": "XX.X.X" ou null,
  "panic_type": "tipo do panic" ou null,
  "falha_1": { "titulo": "...", "descricao": "...", "probabilidade": XX, "solucao": "..." },
  "falha_2": { "titulo": "...", "descricao": "...", "probabilidade": XX, "solucao": "..." },
  "falha_3": { "titulo": "...", "descricao": "...", "probabilidade": XX, "solucao": "..." }
}

Problemas comuns em panic logs iOS:
- Kernel panic por temperatura (overheating)
- Falha de memória RAM
- Problema de CPU/processador
- Falha de NAND/storage
- Problema de bateria/power management
- Curto-circuito na placa
- Falha de baseband/modem
- Problema de GPU
- Watchdog timeout
- Falha de sensor`,
      prompt: `Analise este panic log iOS e identifique as 3 causas mais prováveis:

Nome do arquivo: ${filename}
${deviceModel ? `Modelo detectado: ${deviceModel}` : ''}
${iosVersion ? `iOS detectado: ${iosVersion}` : ''}
${panicType ? `Tipo de panic: ${panicType}` : ''}

=== CONTEÚDO DO LOG ===
${contentForAnalysis}
=== FIM DO LOG ===

Responda APENAS com o JSON, sem texto adicional.`,
    })

    // Parse da resposta
    let analysis
    try {
      // Limpar possíveis caracteres extras
      const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysis = JSON.parse(cleanJson)
    } catch {
      // Fallback se a IA não retornar JSON válido
      analysis = {
        device_model: deviceModel,
        ios_version: iosVersion,
        panic_type: panicType,
        falha_1: {
          titulo: 'Erro de análise',
          descricao: 'Não foi possível analisar o arquivo. Verifique se é um panic log válido.',
          probabilidade: 50,
          solucao: 'Tente novamente com outro arquivo ou verifique o formato.',
        },
        falha_2: null,
        falha_3: null,
      }
    }

    // Usar valores extraídos se a IA não identificou
    if (!analysis.device_model && deviceModel) analysis.device_model = deviceModel
    if (!analysis.ios_version && iosVersion) analysis.ios_version = iosVersion
    if (!analysis.panic_type && panicType) analysis.panic_type = panicType

    // Salvar no banco de dados
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const { data: saved, error: dbError } = await supabase
      .from('panic_analysis')
      .insert({
        filename,
        file_content: content.slice(0, 50000), // Limitar tamanho no DB
        file_size: fileSize,
        device_model: analysis.device_model,
        ios_version: analysis.ios_version,
        panic_type: analysis.panic_type,
        falha_1: analysis.falha_1,
        falha_2: analysis.falha_2,
        falha_3: analysis.falha_3,
        user_ip: ip,
        user_agent: userAgent,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Erro ao salvar análise:', dbError)
    }

    return NextResponse.json({
      id: saved?.id || 'temp',
      device_model: analysis.device_model,
      ios_version: analysis.ios_version,
      panic_type: analysis.panic_type,
      falha_1: analysis.falha_1,
      falha_2: analysis.falha_2,
      falha_3: analysis.falha_3,
    })
  } catch (error: any) {
    console.error('Erro na análise:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno ao processar arquivo' },
      { status: 500 }
    )
  }
}

// Funções auxiliares para extrair informações do log
function extractDeviceModel(content: string): string | null {
  // Padrões comuns em panic logs
  const patterns = [
    /Hardware Model:\s*(iPhone\d+,\d+)/i,
    /product:\s*(iPhone\d+,\d+)/i,
    /Model:\s*(iPhone[^\s,]+)/i,
    /"model":\s*"([^"]+)"/i,
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractIOSVersion(content: string): string | null {
  const patterns = [
    /OS Version:\s*(\d+\.\d+(?:\.\d+)?)/i,
    /iPhone OS (\d+\.\d+(?:\.\d+)?)/i,
    /"os_version":\s*"(\d+\.\d+(?:\.\d+)?)"/i,
    /ProductVersion:\s*(\d+\.\d+(?:\.\d+)?)/i,
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractPanicType(content: string): string | null {
  const patterns = [
    /panic\(cpu \d+ caller ([^)]+)\)/i,
    /Kernel panic:\s*([^\n]+)/i,
    /Exception Type:\s*([^\n]+)/i,
    /panic_type:\s*(\d+)/i,
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return match[1].trim()
  }
  
  if (content.toLowerCase().includes('watchdog')) return 'Watchdog Timeout'
  if (content.toLowerCase().includes('thermal')) return 'Thermal Event'
  if (content.toLowerCase().includes('memory')) return 'Memory Fault'
  
  return null
}
