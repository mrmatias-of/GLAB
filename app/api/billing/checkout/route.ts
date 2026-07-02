import { NextRequest, NextResponse } from 'next/server'
import { createAsaasSubscription } from '@/lib/asaas'

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  bronze: 39.98,
  prata: 59.98,
  ouro: 99.98,
}

export async function POST(request: NextRequest) {
  try {
    const { plan, customerId, billingType } = await request.json()

    if (!plan || !customerId || !billingType) {
      return NextResponse.json(
        { error: 'Missing required fields: plan, customerId, billingType' },
        { status: 400 }
      )
    }

    if (!PLAN_PRICES[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    const price = PLAN_PRICES[plan]

    // Se é FREE, não precisa de pagamento
    if (price === 0) {
      return NextResponse.json({
        success: true,
        message: 'FREE plan activated',
        plan,
      })
    }

    // Criar subscription no Asaas para planos pagos
    const nextDueDate = new Date()
    nextDueDate.setMonth(nextDueDate.getMonth() + 1)

    const subscription = await createAsaasSubscription({
      customerId,
      billingType: billingType as 'BOLETO' | 'PIX' | 'CREDIT_CARD',
      value: price,
      nextDueDate: nextDueDate.toISOString().split('T')[0],
      description: `G•Lab Cursos - Plano ${plan.toUpperCase()}`,
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Failed to create subscription in Asaas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription,
      checkoutUrl: `https://app.asaas.com/subscription/${subscription.id}`,
    })
  } catch (error) {
    console.error('[Checkout] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}
