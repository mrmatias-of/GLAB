/**
 * Mapa de sinônimos para busca.
 * Cada entrada mapeia um termo técnico (ou gíria) para o slug do curso correspondente.
 * Quando o usuário digitar qualquer uma das palavras-chave, o curso aparece nos resultados.
 */
export const synonymMap: Record<string, string[]> = {
  "guia-troca-de-tela": [
    "troca de tela", "frontal", "display", "lcd", "oled", "touch", "touch screen",
    "troca de vidro", "tela quebrada", "tela trincada", "display quebrado",
    "screen replacement", "reparo de tela", "manutenção de tela", "front assembly",
    "display mobile", "touch queimado", "imagem falhando", "sem imagem", "tela preta",
    "troca frontal",
  ],
  "guia-troca-de-bateria": [
    "bateria", "battery", "troca de bateria", "saúde da bateria", "bateria inchada",
    "drenagem", "autonomia", "celular descarregando", "power", "bateria viciada",
    "sem carga", "troca battery", "manutenção de bateria", "consumo alto",
    "queda de carga", "retenção de carga",
  ],
  "guia-conectores-carga": [
    "dock", "conector", "carga", "charging", "usb", "usb-c", "lightning", "tipo c",
    "celular não carrega", "falha de carga", "charging port", "carga lenta",
    "sem carregar", "conector oxidado",
  ],
  "guia-otimizacao-pc-gamer": [
    "fps", "desempenho", "performance", "low fps", "travamentos", "gargalo",
    "otimização windows", "reduzir input lag", "latency", "benchmark", "boost fps",
    "gaming", "pc lento", "tuning", "hardware", "overclock", "stuttering",
  ],
  "guia-consumo-eletrico": [
    "consumo", "amperagem", "corrente", "linha principal", "análise de consumo",
    "fonte assimétrica", "curto consumo", "corrente alta", "consumo iphone",
    "consumo android", "power draw", "diagnóstico elétrico", "alimentação", "linha vbat",
  ],
  "guia-radiofrequencia": [
    "rf", "radiofrequência", "sinal", "sem sinal", "baseband", "modem", "antena",
    "rede móvel", "imei", "sem serviço", "searching", "chip não reconhece",
    "telecom", "gsm", "lte", "5g", "comunicação",
  ],
  "guia-diagnostico-avancado": [
    "diagnóstico", "análise técnica", "troubleshooting", "defeito oculto",
    "reparo avançado", "análise eletrônica", "engenharia reversa",
    "solução de defeitos", "manutenção avançada", "bancada técnica",
  ],
  "guia-falhas-intermitentes": [
    "defeito intermitente", "funciona às vezes", "reinício aleatório", "loop",
    "liga e desliga", "falha esporádica", "problema aleatório", "freeze",
    "congelamento", "aquecimento", "instabilidade",
  ],
  "guia-pmic-alimentacao": [
    "pmic", "power ic", "ci de carga", "gerenciamento de energia", "alimentação",
    "power management", "linha principal", "vbat", "power rail", "sem ligar",
    "sem consumo", "power supply", "energia da placa",
  ],
  "guia-curto-em-placa": [
    "curto", "curto circuito", "linha em curto", "baixa resistência", "aquecimento",
    "capacitor em curto", "curto na placa", "curto vbat", "análise de curto",
    "thermal", "hunting short", "injeção de tensão",
  ],
  "guia-perifericos": [
    "câmera", "face id", "biometria", "sensor", "auto falante", "microfone",
    "vibra call", "flex", "bluetooth", "wifi", "componentes periféricos",
    "acessórios internos",
  ],
  "guia-precificacao-profissional": [
    "orçamento", "lucro", "margem", "precificação", "preço técnico", "valor serviço",
    "gestão financeira", "custo de manutenção", "cálculo de lucro", "ticket médio",
  ],
  "guia-padronizacao-bancada": [
    "bancada técnica", "organização", "fluxo técnico", "assistência técnica",
    "produtividade", "padrão técnico", "processos", "workflow",
    "setup bancada", "organização oficina",
  ],
  "guia-esquema-eletrico": [
    "schematic", "bitmap", "boardview", "zxw", "layout placa", "trilha",
    "diagrama elétrico", "esquema iphone", "leitura de esquema",
    "board schematic", "eletrônica celular",
  ],
  "guia-software-celular": [
    "flash", "firmware", "rom", "desbloqueio", "hard reset", "atualização",
    "software iphone", "software android", "reinstalação sistema", "bootloop",
    "recovery", "root", "jailbreak",
  ],
  "combo-iniciante-mobile": [
    "curso iniciante", "manutenção básica", "reparo básico", "técnico iniciante",
    "troca de conector", "assistência técnica", "celular básico", "manutenção celular",
    "combo",
  ],
}

/**
 * Dado um termo de busca, retorna os slugs que possuem match por sinônimo.
 */
export function resolveSlugsBySynonym(query: string): string[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const matched: string[] = []
  for (const [slug, keywords] of Object.entries(synonymMap)) {
    if (keywords.some((kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()))) {
      matched.push(slug)
    }
  }
  return matched
}
