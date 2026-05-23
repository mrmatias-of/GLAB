import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Base de conhecimento de panicfull patterns
const panicPatterns = {
  overheating: {
    keywords: ['thermal', 'temperature', 'overheat', 'termico'],
    falha: {
      titulo: 'Superaquecimento do Dispositivo',
      descricao: 'Problema detectado em thermal management. Processador pode estar com mau contato ou dissipador danificado.',
      solucao: 'Limpar poeira do sistema de dissipação. Verificar contato da placa com dissipador. Trocar pasta térmica se necessário.'
    }
  },
  memoryFault: {
    keywords: ['memory', 'ram', 'dram', 'memória', 'heap', 'stack'],
    falha: {
      titulo: 'Falha de Memória RAM',
      descricao: 'Problema detectado no módulo de RAM. Possível solda fria ou componente danificado.',
      solucao: 'Reflow do módulo NAND/RAM. Se persistir, substituir módulo de memória.'
    }
  },
  cpuFault: {
    keywords: ['cpu', 'processor', 'arm', 'soc', 'application processor', 'processador'],
    falha: {
      titulo: 'Problema do Processador',
      descricao: 'CPU com possível falha de solda ou contato. Watchdog timeout detectado.',
      solucao: 'Tentar reflow do processador. Se não resolver, avaliar substituição de SoC.'
    }
  },
  batteryFault: {
    keywords: ['battery', 'power', 'bateria', 'energia', 'low battery', 'charging'],
    falha: {
      titulo: 'Falha do Sistema de Energia',
      descricao: 'Problema detectado no power management. Bateria com mau contato ou carregador danificado.',
      solucao: 'Substituir bateria. Verificar conector de carregamento. Testar power ic.'
    }
  },
  storageIssue: {
    keywords: ['storage', 'nand', 'flash', 'io', 'filesystem', 'armazenamento'],
    falha: {
      titulo: 'Problema de Armazenamento',
      descricao: 'NAND com possível solda fria ou setores danificados. Filesystem corrompido.',
      solucao: 'Reflow da placa. Tentar DFU Restore. Se não funcionar, substituir NAND.'
    }
  },
  modemIssue: {
    keywords: ['baseband', 'modem', 'cellular', 'signal', 'telefonia', 'rede'],
    falha: {
      titulo: 'Problema do Modem/Baseband',
      descricao: 'Circuito de baseband com possível problema de solda ou firmware corrompido.',
      solucao: 'Restaurar firmware. Limpar conectores de antena. Se persistir, reflow do modem.'
    }
  }
}

function extractDeviceModel(content: string): string | null {
  const modelMatch = content.match(/iPhone\s*(\d+[A-Za-z]*|[A-Z]+)/i)
  return modelMatch ? `iPhone ${modelMatch[1]}` : null
}

function extractIOSVersion(content: string): string | null {
  const versionMatch = content.match(/(?:OS Version|iOS)\s*:?\s*(\d+\.\d+(?:\.\d+)?)/i)
  return versionMatch ? versionMatch[1] : null
}

function extractPanicType(content: string): string | null {
  const panicMatch = content.match(/Exception Type:\s*(.+?)(?:\n|$)/i)
  if (panicMatch) return panicMatch[1].trim()
  
  const codeMatch = content.match(/0x[0-9A-Fa-f]+/i)
  return codeMatch ? codeMatch[0] : null
}

function analyzeWithPatterns(content: string): { falha_1: any; falha_2: any; falha_3: any } {
  const contentLower = content.toLowerCase()
  
  // Score each pattern based on keywords found
  const scores: { [key: string]: number } = {}
  
  for (const [patternName, pattern] of Object.entries(panicPatterns)) {
    let score = 0
    for (const keyword of pattern.keywords) {
      const regex = new RegExp(keyword, 'gi')
      const matches = contentLower.match(regex)
      score += matches ? matches.length * 10 : 0
    }
    scores[patternName] = score
  }
  
  // Get top 3 patterns
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
  
  // Map to falha objects
  const falhas: { [key: string]: any } = {}
  const priorities = ['falha_1', 'falha_2', 'falha_3']
  
  sorted.forEach((item, index) => {
    const [patternName] = item
    const pattern = panicPatterns[patternName as keyof typeof panicPatterns]
    falhas[priorities[index]] = {
      ...pattern.falha,
      probabilidade: 90 - (index * 20)
    }
  })
  
  // Fallback se não encontrou nada específico
  if (!falhas.falha_1) {
    falhas.falha_1 = {
      titulo: 'Possível Problema de Hardware',
      descricao: 'Panic detectado. Pode ser problema de solda, componente danificado ou mau contato.',
      probabilidade: 65,
      solucao: 'Fazer diagnóstico completo da placa. Verificar integrity com ferramenta de diagnóstico.'
    }
  }
  if (!falhas.falha_2) {
    falhas.falha_2 = {
      titulo: 'Possível Problema de Software',
      descricao: 'Corrupção de firmware ou sistema operacional danificado.',
      probabilidade: 55,
      solucao: 'Tentar DFU Restore ou atualização do iOS.'
    }
  }
  if (!falhas.falha_3) {
    falhas.falha_3 = {
      titulo: 'Possível Problema de Firmware',
      descricao: 'Bootloader ou firmware corrompido durante atualizacao.',
      probabilidade: 45,
      solucao: 'Restaurar firmware limpo. Usar ferramenta de recuperação específica do modelo.'
    }
  }
  
  return falhas as { falha_1: any; falha_2: any; falha_3: any }
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

    // Extrair informações
    const deviceModel = extractDeviceModel(content)
    const iosVersion = extractIOSVersion(content)
    const panicType = extractPanicType(content)
    
    console.log('[v0] Analisando panic log:', { deviceModel, iosVersion, panicType })

    // Analisar com base em padrões (sem IA)
    const analysis = analyzeWithPatterns(content)

    // Salvar no banco de dados
    const { data, error } = await supabase
      .from('panic_analysis')
      .insert({
        filename,
        file_content: content,
        file_size: fileSize,
        device_model: deviceModel,
        ios_version: iosVersion,
        panic_type: panicType,
        falha_1: analysis.falha_1,
        falha_2: analysis.falha_2,
        falha_3: analysis.falha_3,
        status: 'completed'
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Erro ao salvar:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar análise' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      analysis: {
        deviceModel,
        iosVersion,
        panicType,
        falha_1: analysis.falha_1,
        falha_2: analysis.falha_2,
        falha_3: analysis.falha_3
      }
    })
  } catch (error) {
    console.error('[v0] Erro na análise:', error)
    return NextResponse.json(
      { error: 'Erro ao processar arquivo. Tente novamente.' },
      { status: 500 }
    )
  }
}
