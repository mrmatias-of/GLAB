import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// Validar webhook usando secret do banco ou env var
async function validateWebhook(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization")
  const secretHeader = request.headers.get("x-webhook-secret")
  
  if (!authHeader && !secretHeader) return false
  
  const token = authHeader?.replace("Bearer ", "") || secretHeader || ""
  
  // Primeiro tenta env var (para Vercel)
  const envSecret = process.env.WEBHOOK_SECRET
  if (envSecret && token === envSecret) return true
  
  // Depois tenta buscar do banco de dados
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("config")
      .select("webhook_secret")
      .eq("id", "site")
      .single()
    
    if (data?.webhook_secret && token === data.webhook_secret) return true
  } catch {
    // Ignora erro de conexão
  }
  
  return false
}

// POST /api/webhooks/cursos - Criar novo curso via Zapier
export async function POST(request: NextRequest) {
  if (!(await validateWebhook(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Validar campos obrigatórios
    if (!body.titulo || !body.slug) {
      return NextResponse.json(
        { error: "Campos obrigatórios: titulo, slug" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    const cursoData = {
      slug: body.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      tag: body.tag || "Guia",
      titulo: body.titulo,
      subtitulo: body.subtitulo || "",
      descricao: body.descricao || "",
      descricao_longa: body.descricao_longa || "",
      preco: body.preco || "R$ 0",
      preco_original: body.preco_original || null,
      cta: body.cta || "Quero Acessar o Guia",
      cta_href: body.cta_href || "#",
      destaque: body.destaque || false,
      ativo: body.ativo ?? true,
      ordem: body.ordem || 99,
      modulos: body.modulos || [],
      aprendizados: body.aprendizados || [],
    }

    const { data, error } = await supabase
      .from("cursos")
      .insert(cursoData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Notificar webhook externo (se configurado)
    await notifyExternalWebhook("curso_criado", data)

    return NextResponse.json({ success: true, curso: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    )
  }
}

// PUT /api/webhooks/cursos - Atualizar curso existente via Zapier
export async function PUT(request: NextRequest) {
  if (!(await validateWebhook(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    if (!body.id && !body.slug) {
      return NextResponse.json(
        { error: "Necessário informar id ou slug do curso" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Remove campos que não devem ser atualizados
    const { id, slug, created_at, ...updateData } = body
    
    let query = supabase.from("cursos").update(updateData)
    
    if (id) {
      query = query.eq("id", id)
    } else if (slug) {
      query = query.eq("slug", slug)
    }

    const { data, error } = await query.select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await notifyExternalWebhook("curso_atualizado", data)

    return NextResponse.json({ success: true, curso: data })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    )
  }
}

// GET /api/webhooks/cursos - Listar cursos (para Zapier polling)
export async function GET(request: NextRequest) {
  if (!(await validateWebhook(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get("limit") || "10")
    const ativo = searchParams.get("ativo")
    
    let query = supabase
      .from("cursos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
    
    if (ativo !== null) {
      query = query.eq("ativo", ativo === "true")
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ cursos: data })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    )
  }
}

// Função auxiliar para notificar webhook externo (Zapier)
async function notifyExternalWebhook(event: string, data: unknown) {
  try {
    // Primeiro tenta env var
    let webhookUrl = process.env.ZAPIER_WEBHOOK_URL
    
    // Se não tiver, busca do banco
    if (!webhookUrl) {
      const supabase = await createClient()
      const { data: config } = await supabase
        .from("config")
        .select("zapier_webhook_url")
        .eq("id", "site")
        .single()
      
      webhookUrl = config?.zapier_webhook_url
    }
    
    if (!webhookUrl) return

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data,
      }),
    })
  } catch {
    // Ignora erros de webhook externo
  }
}
