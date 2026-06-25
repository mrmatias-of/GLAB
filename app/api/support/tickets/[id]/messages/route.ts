import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTicketById, getMessagesByTicket, createMessage } from '@/lib/support'
import { canReplyToTicket, isVendedor, isAdmin } from '@/lib/permissions'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const ticket = await getTicketById(Number(params.id))
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    // Verificar permissão
    if (ticket.usuario_id !== user.id && !isAdmin(user) && !isVendedor(user)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const messages = await getMessagesByTicket(Number(params.id))
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const ticket = await getTicketById(Number(params.id))
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    // Verificar permissão para responder
    if (!canReplyToTicket(user, ticket.usuario_id)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { mensagem } = await request.json()

    if (!mensagem || !mensagem.trim()) {
      return NextResponse.json(
        { error: 'Mensagem vazia' },
        { status: 400 }
      )
    }

    const message = await createMessage(Number(params.id), user.id, mensagem)
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao criar mensagem' },
      { status: 500 }
    )
  }
}
