import { NextRequest, NextResponse } from 'next/server'

// Tipos de eventos que o Asaas envia
type AsaasEventType = 
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'SUBSCRIPTION_CANCELED'
  | 'SUBSCRIPTION_ACTIVATED'

interface AsaasWebhookEvent {
  id: string
  event: AsaasEventType
  createdAt: string
  data: {
    subscription?: {
      id: string
      customerId: string
      status: string
      value: number
    }
    payment?: {
      id: string
      subscriptionId?: string
      status: string
      value: number
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const event: AsaasWebhookEvent = await request.json()

    console.log('[Asaas Webhook] Event received:', event.event)

    switch (event.event) {
      case 'PAYMENT_CONFIRMED':
        // Atualizar status de pagamento no banco
        console.log('[Asaas Webhook] Payment confirmed:', event.data.payment?.id)
        break

      case 'PAYMENT_FAILED':
        // Notificar cliente que pagamento falhou
        console.log('[Asaas Webhook] Payment failed:', event.data.payment?.id)
        break

      case 'SUBSCRIPTION_CANCELED':
        // Desativar acesso do tenant
        console.log('[Asaas Webhook] Subscription canceled:', event.data.subscription?.id)
        break

      case 'SUBSCRIPTION_ACTIVATED':
        // Ativar acesso do tenant
        console.log('[Asaas Webhook] Subscription activated:', event.data.subscription?.id)
        break

      default:
        console.log('[Asaas Webhook] Unknown event type:', event.event)
    }

    // Sempre retornar 200 OK para confirmar recebimento
    return NextResponse.json({ success: true, eventId: event.id })
  } catch (error) {
    console.error('[Asaas Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
