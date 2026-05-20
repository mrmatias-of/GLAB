import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export const maxDuration = 60 // 60 segundos de timeout

type GenerateCourseRequest = {
  prompt: string
  nivel?: "iniciante" | "intermediario" | "avancado"
  numModulos?: number
  numAulasPorModulo?: number
}

const systemPrompt = `Você é um especialista em criação de cursos online. 
Seu trabalho é gerar estruturas completas de cursos educacionais.

Sempre responda em JSON válido com a seguinte estrutura:
{
  "titulo": "Título do curso",
  "slug": "titulo-do-curso",
  "subtitulo": "Subtítulo atrativo",
  "descricao": "Descrição curta para cards (max 150 chars)",
  "descricao_longa": "Descrição completa do curso",
  "tag": "Curso ou Guia",
  "nivel": "iniciante | intermediario | avancado",
  "aprendizados": ["O que o aluno vai aprender 1", "Item 2", "Item 3", "Item 4"],
  "modulos": [
    {
      "titulo": "Título do Módulo",
      "descricao": "Descrição do módulo",
      "aulas": [
        {
          "titulo": "Título da Aula",
          "descricao": "Descrição da aula",
          "conteudo": "Conteúdo em markdown da aula",
          "duracao_minutos": 15
        }
      ]
    }
  ],
  "copy_vendas": {
    "headline": "Headline de vendas",
    "subheadline": "Subheadline",
    "beneficios": ["Benefício 1", "Benefício 2", "Benefício 3"],
    "garantia": "Texto de garantia",
    "urgencia": "Texto de urgência/escassez"
  }
}

Seja criativo, detalhado e profissional. O conteúdo das aulas deve ser educativo e completo.`

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  // Verificar se é admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  const body: GenerateCourseRequest = await request.json()
  const { prompt, nivel = "iniciante", numModulos = 4, numAulasPorModulo = 4 } = body

  if (!prompt) {
    return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 })
  }

  // Criar registro de geração
  const { data: generation, error: genError } = await supabase
    .from("ai_generations")
    .insert({
      user_id: user.id,
      type: "course",
      prompt,
      status: "generating"
    })
    .select()
    .single()

  if (genError) {
    return NextResponse.json({ error: "Erro ao criar registro" }, { status: 500 })
  }

  try {
    const userPrompt = `Crie um curso completo sobre: "${prompt}"

Configurações:
- Nível: ${nivel}
- Número de módulos: ${numModulos}
- Aulas por módulo: ${numAulasPorModulo}

Gere o curso completo em JSON conforme a estrutura especificada.
O conteúdo de cada aula deve ter pelo menos 500 palavras em markdown.`

    const { text, usage } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 8000,
    })

    // Parse do JSON
    let courseData
    try {
      // Extrair JSON da resposta
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        courseData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("JSON não encontrado na resposta")
      }
    } catch (parseError) {
      await supabase.from("ai_generations").update({
        status: "failed",
        error_message: "Erro ao parsear resposta da IA",
        completed_at: new Date().toISOString()
      }).eq("id", generation.id)

      return NextResponse.json({ 
        error: "Erro ao processar resposta da IA",
        raw: text 
      }, { status: 500 })
    }

    // Atualizar registro com sucesso
    await supabase.from("ai_generations").update({
      status: "completed",
      result: courseData,
      tokens_used: usage?.totalTokens,
      completed_at: new Date().toISOString()
    }).eq("id", generation.id)

    return NextResponse.json({
      success: true,
      generation_id: generation.id,
      course: courseData
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    
    await supabase.from("ai_generations").update({
      status: "failed",
      error_message: errorMessage,
      completed_at: new Date().toISOString()
    }).eq("id", generation.id)

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
