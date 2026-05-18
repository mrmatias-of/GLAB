import { Smartphone, Monitor, Apple, type LucideIcon } from "lucide-react"

export type Modulo = {
  titulo: string
  topicos: string[]
}

export type Curso = {
  slug: string
  tag: string
  titulo: string
  subtitulo: string
  descricao: string
  descricaoLonga: string
  icon: LucideIcon
  destaque: boolean
  preco: string
  precoOriginal?: string
  modulos: Modulo[]
  aprendizados: string[]
  cta: string
  ctaHref: string
  accentColor: string
}

export const cursos: Curso[] = [
  {
    slug: "iphone",
    tag: "iPhone",
    titulo: "Reparo de iPhone",
    subtitulo: "Do diagnóstico à entrega — tudo que você precisa para reparar qualquer iPhone.",
    descricao:
      "Troca de tela, bateria, conector de carga, diagnóstico de software e muito mais. Técnicas validadas nos modelos mais recentes.",
    descricaoLonga:
      "Um guia técnico completo criado para quem quer dominar o reparo de iPhones de forma profissional. Abordamos desde a abertura segura dos aparelhos até procedimentos avançados de microssoldagem, cobrindo os modelos iPhone 8 até o iPhone 15 Pro Max.",
    icon: Apple,
    destaque: true,
    preco: "R$ 47",
    precoOriginal: "R$ 97",
    modulos: [
      {
        titulo: "Fundamentos & Ferramentas",
        topicos: [
          "Kit de ferramentas essencial",
          "Segurança elétrica e ESD",
          "Identificação de modelos",
          "Organização do bancada",
        ],
      },
      {
        titulo: "Troca de Tela",
        topicos: [
          "Remoção sem danos",
          "Troca em iPhone 11, 12, 13, 14",
          "Troca em iPhone 15 e 15 Pro",
          "Calibração de Face ID",
        ],
      },
      {
        titulo: "Bateria & Carga",
        topicos: [
          "Diagnóstico de bateria",
          "Troca de bateria segura",
          "Limpeza do conector Lightning/USB-C",
          "Troca do flex de carga",
        ],
      },
      {
        titulo: "Diagnóstico de Software",
        topicos: [
          "Modo DFU e Recovery",
          "Restauração via iTunes / Finder",
          "Erros comuns e soluções",
          "Desbloqueio de iCloud (legal)",
        ],
      },
      {
        titulo: "Recuperação de Dados",
        topicos: [
          "Backup antes do reparo",
          "Recuperação de fotos e contatos",
          "Ferramentas de recuperação profissional",
          "Prevenção de perda de dados",
        ],
      },
    ],
    aprendizados: [
      "Trocar tela, bateria e conector de carga em qualquer iPhone",
      "Diagnosticar e resolver falhas de software",
      "Usar ferramentas profissionais com segurança",
      "Recuperar dados antes e após reparos",
      "Precificar e cobrar corretamente pelos serviços",
      "Evitar os erros mais comuns na bancada",
    ],
    cta: "Quero Acessar o Guia",
    ctaHref: "https://glabcursos.com.br",
    accentColor: "#00d4c8",
  },
  {
    slug: "android",
    tag: "Android",
    titulo: "Reparo de Android",
    subtitulo: "Samsung, Motorola, Xiaomi e muito mais — procedimentos precisos para o mercado brasileiro.",
    descricao:
      "Samsung, Motorola, Xiaomi e outros. Procedimentos precisos para os modelos mais vendidos do mercado brasileiro.",
    descricaoLonga:
      "O mercado Android representa mais de 80% dos aparelhos no Brasil. Este guia cobre os modelos mais vendidos com procedimentos detalhados, incluindo técnicas de flashing, microssoldagem e troca de display OLED e LCD.",
    icon: Smartphone,
    destaque: false,
    preco: "R$ 47",
    precoOriginal: "R$ 97",
    modulos: [
      {
        titulo: "Fundamentos Android",
        topicos: [
          "Diferenças entre fabricantes",
          "Kit de ferramentas por modelo",
          "Segurança e ESD",
          "Identificando versões de hardware",
        ],
      },
      {
        titulo: "Troca de Display",
        topicos: [
          "LCD vs OLED — cuidados diferentes",
          "Troca em Samsung Galaxy S e A",
          "Troca em Motorola Moto G",
          "Troca em Xiaomi Redmi e Note",
        ],
      },
      {
        titulo: "Problemas de Carga",
        topicos: [
          "Limpeza e troca do conector USB-C",
          "Substituição da flex de carga",
          "Diagnóstico de bateria inchada",
          "Troca de bateria com adesivo",
        ],
      },
      {
        titulo: "Flashing de Firmware",
        topicos: [
          "O que é e quando usar",
          "Flashing via Odin (Samsung)",
          "Flashing via QFIL (Qualcomm)",
          "Recuperação de soft-brick",
        ],
      },
      {
        titulo: "Microssoldagem Básica",
        topicos: [
          "Equipamentos necessários",
          "Troca de conector de carga soldado",
          "Recuperação de trilhas danificadas",
          "Identificação de componentes SMD",
        ],
      },
    ],
    aprendizados: [
      "Reparar os modelos mais vendidos no Brasil",
      "Trocar displays LCD e OLED sem danos",
      "Fazer flashing de firmware de forma segura",
      "Executar microssoldagem básica na bancada",
      "Diagnosticar falhas de carga e bateria",
      "Montar um estoque estratégico de peças",
    ],
    cta: "Quero Acessar o Guia",
    ctaHref: "https://glabcursos.com.br",
    accentColor: "#00d4c8",
  },
  {
    slug: "windows",
    tag: "Windows",
    titulo: "Formatação Windows",
    subtitulo: "Formatação profissional, rápida e limpa — entregue o computador do jeito certo.",
    descricao:
      "Formatação profissional com backup completo, instalação de drivers, otimização de performance e segurança.",
    descricaoLonga:
      "Formatação vai além de apertar 'Formatar'. Este guia ensina o processo completo — do backup inteligente à otimização pós-instalação — para você entregar um computador rápido, seguro e sem problemas para o cliente.",
    icon: Monitor,
    destaque: false,
    preco: "R$ 37",
    precoOriginal: "R$ 67",
    modulos: [
      {
        titulo: "Antes de Formatar",
        topicos: [
          "Conversa com o cliente — o que perguntar",
          "Inventário de programas instalados",
          "Backup completo e seguro",
          "Verificação de hardware antes da formatação",
        ],
      },
      {
        titulo: "Instalação Limpa",
        topicos: [
          "Criando pendrive bootável",
          "BIOS / UEFI — configurações essenciais",
          "Instalação Windows 10 e 11",
          "Particionamento de disco correto",
        ],
      },
      {
        titulo: "Drivers & Atualizações",
        topicos: [
          "Identificação automática de drivers",
          "Instalação manual de drivers críticos",
          "Windows Update — o que instalar",
          "Drivers de placa de vídeo e som",
        ],
      },
      {
        titulo: "Otimização de Performance",
        topicos: [
          "Desativando serviços desnecessários",
          "Configuração de inicialização",
          "Limpeza pós-formatação",
          "Configuração do SSD vs HDD",
        ],
      },
      {
        titulo: "Segurança & Entrega",
        topicos: [
          "Configuração do Windows Defender",
          "Criação de ponto de restauração",
          "Checklist de entrega profissional",
          "Como precificar o serviço",
        ],
      },
    ],
    aprendizados: [
      "Fazer backup completo sem perder dados do cliente",
      "Instalar o Windows de forma limpa e segura",
      "Identificar e instalar todos os drivers corretos",
      "Otimizar a performance pós-formatação",
      "Entregar o computador com checklist profissional",
      "Cobrar corretamente pelo serviço de formatação",
    ],
    cta: "Quero Acessar o Guia",
    ctaHref: "https://glabcursos.com.br",
    accentColor: "#00d4c8",
  },
]

export function getCursoBySlug(slug: string): Curso | undefined {
  return cursos.find((c) => c.slug === slug)
}
