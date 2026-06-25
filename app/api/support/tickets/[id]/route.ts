import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTicketById, updateTicket } from '@/lib/support'
import { isVendedor, isAdmin, canChangeTicketStatus } from '@/lib/permissions'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const ticket = await getTicketById(Number(params.id))

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    // Verificar permissão: usuário comum só vê seu ticket, admin/vendedor veem todos
    if (ticket.usuario_id !== user.id && !isAdmin(user) && !isVendedor(user)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Erro ao buscar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ticket' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const ticket = await getTicketById(Number(params.id))
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    // Verificar permissão para mudar status
    if (!canChangeTicketStatus(user, ticket.responsavel_id)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { status, prioridade, responsavel_id } = await request.json()

    const updates: Partial<typeof ticket> = {}
    if (status) updates.status = status
    if (prioridade) updates.prioridade = prioridade
    if (responsavel_id !== undefined) updates.responsavel_id = responsavel_id

    const updatedTicket = await updateTicket(Number(params.id), updates)
    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar ticket' },
      { status: 500 }
    )
  }
}
