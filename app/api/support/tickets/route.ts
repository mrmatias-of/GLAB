import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTicket, getTicketsByUser, getTicketsByResponsavel, getAllTickets } from '@/lib/support'
import { isVendedor, isAdmin } from '@/lib/permissions'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const type = request.nextUrl.searchParams.get('type')

    if (type === 'user') {
      // Usuários comuns veem apenas seus tickets
      const tickets = await getTicketsByUser(user.id)
      return NextResponse.json(tickets)
    } else if (type === 'assigned') {
      // Vendedores veem tickets atribuídos a eles
      if (!isVendedor(user)) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
      }
      const tickets = await getTicketsByResponsavel(user.id)
      return NextResponse.json(tickets)
    } else if (type === 'all') {
      // Admins veem todos os tickets
      if (!isAdmin(user)) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
      }
      const tickets = await getAllTickets()
      return NextResponse.json(tickets)
    } else {
      // Por padrão, usuário comum vê seus tickets
      const tickets = await getTicketsByUser(user.id)
      return NextResponse.json(tickets)
    }
  } catch (error) {
    console.error('Erro ao buscar tickets:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { titulo, descricao, categoria_id, prioridade = 'media' } = await request.json()

    if (!titulo || !descricao || !categoria_id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const ticket = await createTicket(titulo, descricao, categoria_id, user.id, prioridade)
    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao criar ticket' },
      { status: 500 }
    )
  }
}
