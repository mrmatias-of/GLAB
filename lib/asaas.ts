// Utilitário para integração com Asaas
// Documentação: https://asaas.com/

const ASAAS_API_KEY = process.env.ASAAS_API_KEY
const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3'

if (!ASAAS_API_KEY) {
  console.warn('[Asaas] ASAAS_API_KEY not configured')
}

interface AsaasCustomer {
  id: string
  name: string
  email: string
  cpfCnpj: string
}

interface AsaasSubscription {
  id: string
  customerId: string
  billingType: 'BOLETO' | 'PIX' | 'CREDIT_CARD'
  value: number
  nextDueDate: string
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELED'
}

export async function createAsaasCustomer(data: {
  name: string
  email: string
  cpfCnpj: string
}): Promise<AsaasCustomer | null> {
  if (!ASAAS_API_KEY) {
    console.warn('[Asaas] Cannot create customer: API key not configured')
    return null
  }

  try {
    const response = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[Asaas] Error creating customer:', error)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('[Asaas] Error creating customer:', error)
    return null
  }
}

export async function createAsaasSubscription(data: {
  customerId: string
  billingType: 'BOLETO' | 'PIX' | 'CREDIT_CARD'
  value: number
  nextDueDate: string
  description: string
}): Promise<AsaasSubscription | null> {
  if (!ASAAS_API_KEY) {
    console.warn('[Asaas] Cannot create subscription: API key not configured')
    return null
  }

  try {
    const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[Asaas] Error creating subscription:', error)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('[Asaas] Error creating subscription:', error)
    return null
  }
}

export async function getAsaasSubscription(subscriptionId: string): Promise<AsaasSubscription | null> {
  if (!ASAAS_API_KEY) {
    console.warn('[Asaas] Cannot fetch subscription: API key not configured')
    return null
  }

  try {
    const response = await fetch(`${ASAAS_API_URL}/subscriptions/${subscriptionId}`, {
      headers: {
        'access_token': ASAAS_API_KEY,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[Asaas] Error fetching subscription:', error)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('[Asaas] Error fetching subscription:', error)
    return null
  }
}

export async function cancelAsaasSubscription(subscriptionId: string): Promise<boolean> {
  if (!ASAAS_API_KEY) {
    console.warn('[Asaas] Cannot cancel subscription: API key not configured')
    return false
  }

  try {
    const response = await fetch(`${ASAAS_API_URL}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'access_token': ASAAS_API_KEY,
      },
    })

    return response.ok
  } catch (error) {
    console.error('[Asaas] Error canceling subscription:', error)
    return false
  }
}
