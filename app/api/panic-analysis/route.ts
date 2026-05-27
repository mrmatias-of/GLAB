import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Base de conhecimento de panicfull patterns - EXPANDIDA
const panicPatterns = {
  overheating: {
    keywords: [
      'thermal', 'temperature', 'overheat', 'termico', 'temp', 'heat',
      'cltm', 'throttle', 'hot', 'celsius', 'shutdown cause: 5'
    ],
    falha: {
      titulo: 'Superaquecimento do Dispositivo',
      descricao: 'Problema detectado em thermal management. Processador pode estar com mau contato ou dissipador danificado.',
      solucao: 'Limpar poeira do sistema de dissipação. Verificar contato da placa com dissipador. Trocar pasta térmica se necessário.'
    }
  },
  memoryFault: {
    keywords: [
      'memory', 'ram', 'dram', 'memória', 'heap', 'stack', 'zone', 
      'kalloc', 'alloc', 'free', 'malloc', 'zalloc', 'vm_', 'pmap',
      'kernel memory', 'bad magic', 'corruption', 'oom', 'jetsam'
    ],
    falha: {
      titulo: 'Falha de Memória RAM',
      descricao: 'Problema detectado no módulo de RAM. Possível solda fria ou componente danificado.',
      solucao: 'Reflow do módulo NAND/RAM. Se persistir, substituir módulo de memória.'
    }
  },
  cpuFault: {
    keywords: [
      'cpu', 'processor', 'arm', 'soc', 'application processor', 'processador',
      'watchdog', 'wdt', 'timeout', 'hang', 'stuck', 'deadlock', 'spinlock',
      'panic', 'kernel', 'exc_', 'exception', 'trap', 'abort', 'fault',
      'ecc', 'parity', 'assert', 'mach_kernel'
    ],
    falha: {
      titulo: 'Problema do Processador/Kernel',
      descricao: 'CPU com possível falha de solda ou contato. Watchdog timeout ou kernel panic detectado.',
      solucao: 'Tentar reflow do processador. Se não resolver, avaliar substituição de SoC.'
    }
  },
  batteryFault: {
    keywords: [
      'battery', 'power', 'bateria', 'energia', 'low battery', 'charging',
      'pmu', 'smu', 'voltage', 'current', 'charger', 'usb', 'lightning',
      'shutdown cause: 3', 'brownout', 'undervolt', 'tristar', 'tigris', 'hydra'
    ],
    falha: {
      titulo: 'Falha do Sistema de Energia',
      descricao: 'Problema detectado no power management. Bateria com mau contato ou carregador danificado.',
      solucao: 'Substituir bateria. Verificar conector de carregamento. Testar Tristar/Hydra IC.'
    }
  },
  storageIssue: {
    keywords: [
      'storage', 'nand', 'flash', 'io', 'filesystem', 'armazenamento',
      'disk', 'apfs', 'hfs', 'nvme', 'iosurface', 'read error', 'write error',
      'ans', 'asp', 'data abort', 'i/o error', 'mount', 'corruption'
    ],
    falha: {
      titulo: 'Problema de Armazenamento NAND',
      descricao: 'NAND com possível solda fria ou setores danificados. Filesystem corrompido.',
      solucao: 'Reflow da placa. Tentar DFU Restore. Se não funcionar, substituir NAND.'
    }
  },
  modemIssue: {
    keywords: [
      'baseband', 'modem', 'cellular', 'signal', 'telefonia', 'rede',
      'radio', 'sim', 'imei', 'carrier', 'network', 'wireless', 'commcenter',
      'coretelephony', 'no service', 'searching'
    ],
    falha: {
      titulo: 'Problema do Modem/Baseband',
      descricao: 'Circuito de baseband com possível problema de solda ou firmware corrompido.',
      solucao: 'Restaurar firmware. Limpar conectores de antena. Se persistir, reflow do modem.'
    }
  },
  displayIssue: {
    keywords: [
      'display', 'lcd', 'oled', 'screen', 'backlight', 'touch', 'digitizer',
      'framebuffer', 'gpu', 'graphics', 'clcd', 'hdmi', 'mipi', 'dsi', 'tcon'
    ],
    falha: {
      titulo: 'Problema de Display/GPU',
      descricao: 'Falha no controlador de display ou GPU. Possível mau contato ou chip danificado.',
      solucao: 'Verificar flex do display. Testar outro display. Se persistir, verificar GPU/TCON.'
    }
  },
  bootIssue: {
    keywords: [
      'boot', 'iboot', 'llb', 'bootrom', 'sep', 'sepos', 'restore', 'dfu',
      'recovery', '4013', '4014', '9', '14', '21', '40', '56', 'error',
      'update', 'firmware', 'activation', 'brick'
    ],
    falha: {
      titulo: 'Problema de Boot/Firmware',
      descricao: 'Falha no processo de boot. Firmware corrompido ou problema de hardware no boot chain.',
      solucao: 'Entrar em DFU mode e restaurar. Se der erro, verificar NAND e CPU. Pode precisar de programador.'
    }
  },
  sensorIssue: {
    keywords: [
      'sensor', 'accelerometer', 'gyro', 'compass', 'proximity', 'ambient',
      'barometer', 'gps', 'location', 'motion', 'coremotionm', 'faceid', 'touchid'
    ],
    falha: {
      titulo: 'Problema de Sensores',
      descricao: 'Falha em um ou mais sensores do dispositivo. Pode afetar funcionalidades específicas.',
      solucao: 'Verificar flex dos sensores. Testar cada sensor individualmente. Substituir se danificado.'
    }
  }
}

function extractDeviceModel(content: string): string | null {
  // Tentar vários padrões de modelo
  const patterns = [
    /iPhone\s*(\d+,\d+)/i,
    /iPhone(\d+[A-Za-z]*)/i,
    /product:\s*(iPhone[^\n]+)/i,
    /hardware model:\s*([^\n]+)/i,
    /model:\s*(N\d+[A-Za-z]*)/i,
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return match[1].trim()
  }
  return null
}

function extractIOSVersion(content: string): string | null {
  const patterns = [
    /(?:OS Version|iOS)\s*:?\s*(\d+\.\d+(?:\.\d+)?)/i,
    /(?:System Version|Version)\s*:?\s*(\d+\.\d+(?:\.\d+)?)/i,
    /(?:release|version).*?(\d+\.\d+(?:\.\d+)?)/i,
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractPanicType(content: string): string | null {
  const patterns = [
    /Exception Type:\s*(.+?)(?:\n|$)/i,
    /panic\(cpu \d+ caller ([^\)]+)\)/i,
    /Kernel panic -\s*(.+?)(?:\n|$)/i,
    /Bug Type:\s*(.+?)(?:\n|$)/i,
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return match[1].trim()
  }
  
  // Procurar códigos hexadecimais de erro
  const hexMatch = content.match(/0x[0-9A-Fa-f]{8,}/i)
  return hexMatch ? hexMatch[0] : 'panic'
}

function analyzeWithPatterns(content: string): { falha_1: any; falha_2: any; falha_3: any } {
  const contentLower = content.toLowerCase()
  
  // Score each pattern based on keywords found
  const scores: { [key: string]: number } = {}
  
  for (const [patternName, pattern] of Object.entries(panicPatterns)) {
    let score = 0
    for (const keyword of pattern.keywords) {
      const regex = new RegExp(keyword.toLowerCase(), 'gi')
      const matches = contentLower.match(regex)
      if (matches) {
        // Peso maior para keywords mais específicas (maiores)
        score += matches.length * (keyword.length > 5 ? 15 : 10)
      }
    }
    scores[patternName] = score
  }
  
  console.log('[v0] Scores de análise:', scores)
  
  // Get top 3 patterns with score > 0
  const sorted = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
  
  console.log('[v0] Top patterns encontrados:', sorted.length)
  
  // Se não encontrou nada, usar fallback baseado no conteúdo
  if (sorted.length === 0) {
    // Verificar se é um panic log válido
    const isPanicLog = contentLower.includes('panic') || 
                       contentLower.includes('exception') ||
                       contentLower.includes('crash') ||
                       contentLower.includes('fault') ||
                       contentLower.includes('error') ||
                       contentLower.includes('kernel')
    
    if (isPanicLog) {
      return {
        falha_1: {
          titulo: 'Kernel Panic Detectado',
          descricao: 'O sistema detectou um panic no kernel. Análise detalhada necessária para identificar causa raiz.',
          probabilidade: 80,
          solucao: 'Fazer diagnóstico completo da placa. Verificar CPU, RAM e NAND. Tentar DFU restore primeiro.'
        },
        falha_2: {
          titulo: 'Possível Problema de Hardware',
          descricao: 'Panic pode indicar mau contato, solda fria ou componente danificado na placa.',
          probabilidade: 65,
          solucao: 'Inspecionar placa visualmente. Testar com outra bateria. Verificar conectores.'
        },
        falha_3: {
          titulo: 'Possível Corrupção de Firmware',
          descricao: 'Sistema operacional ou bootloader pode estar corrompido.',
          probabilidade: 50,
          solucao: 'Entrar em modo DFU e restaurar iOS. Se der erro, problema é hardware.'
        }
      }
    } else {
      return {
        falha_1: {
          titulo: 'Arquivo Analisado',
          descricao: 'O arquivo foi processado mas não contém padrões típicos de panic log iOS.',
          probabilidade: 70,
          solucao: 'Verifique se o arquivo é um panic log válido (.ips ou .panic). Tente exportar novamente do dispositivo.'
        },
        falha_2: {
          titulo: 'Formato Não Reconhecido',
          descricao: 'O conteúdo não corresponde ao formato esperado de logs de diagnóstico iOS.',
          probabilidade: 60,
          solucao: 'Acesse Ajustes > Privacidade > Análises > Dados de Análise e exporte o arquivo correto.'
        },
        falha_3: {
          titulo: 'Diagnóstico Manual Necessário',
          descricao: 'Recomendamos análise manual do arquivo ou uso de ferramenta especializada.',
          probabilidade: 50,
          solucao: 'Use 3uTools, iMazing ou software similar para extrair logs de diagnóstico completos.'
        }
      }
    }
  }
  
  // Map to falha objects
  const falhas: any = {}
  const priorities = ['falha_1', 'falha_2', 'falha_3']
  const maxScore = sorted[0]?.[1] || 100
  
  sorted.forEach((item, index) => {
    const [patternName, score] = item
    const pattern = panicPatterns[patternName as keyof typeof panicPatterns]
    // Calcular probabilidade baseada no score relativo
    const probabilidade = Math.min(95, Math.round((score / maxScore) * 85) + 10)
    falhas[priorities[index]] = {
      ...pattern.falha,
      probabilidade: Math.max(probabilidade - (index * 15), 30)
    }
  })
  
  // Preencher falhas faltantes com genéricas
  if (!falhas.falha_2) {
    falhas.falha_2 = {
      titulo: 'Verificar Hardware Relacionado',
      descricao: 'Componentes adjacentes ao problema principal podem estar afetados.',
      probabilidade: 45,
      solucao: 'Inspecionar área ao redor do componente principal identificado.'
    }
  }
  if (!falhas.falha_3) {
    falhas.falha_3 = {
      titulo: 'Restauração de Software',
      descricao: 'Sempre vale tentar restore antes de intervenção em hardware.',
      probabilidade: 35,
      solucao: 'DFU restore com iTunes/Finder antes de abrir o aparelho.'
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

    // Salvar no banco de dados (opcional - não bloqueia resposta)
    try {
      await supabase
        .from('panic_analysis')
        .insert({
          filename,
          file_content: content.substring(0, 1000),
          file_size: fileSize,
          device_model: deviceModel,
          ios_version: iosVersion,
          panic_type: panicType,
          falha_1: analysis.falha_1,
          falha_2: analysis.falha_2,
          falha_3: analysis.falha_3,
          status: 'completed'
        })
    } catch (dbError) {
      console.error('[v0] Erro ao salvar no banco (não bloqueia):', dbError)
      // Continua mesmo se banco falhar
    }

    console.log('[v0] Análise completada com sucesso')
    
    // Retornar resultado
    return NextResponse.json({
      device_model: deviceModel,
      ios_version: iosVersion,
      panic_type: panicType,
      falha_1: analysis.falha_1,
      falha_2: analysis.falha_2,
      falha_3: analysis.falha_3
    })
  } catch (error) {
    console.error('[v0] Erro na análise:', error)
    return NextResponse.json(
      { error: 'Erro ao processar arquivo. Tente novamente.' },
      { status: 500 }
    )
  }
}
