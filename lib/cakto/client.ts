/**
 * Cliente Cakto OAuth2 para integração de produtos e páginas de vendas
 */

const CAKTO_API_BASE = 'https://api.cakto.com.br'
const CAKTO_AUTH_URL = 'https://oauth.cakto.com.br/oauth/authorize'
const CAKTO_TOKEN_URL = 'https://oauth.cakto.com.br/oauth/token'

interface CaktoTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

interface CaktoProductResponse {
  id: string
  name: string
  description: string
  price: number
  checkout_url: string
  affiliate_url: string
}

class CaktoClient {
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  /**
   * Obter token de acesso OAuth2
   */
  async getAccessToken(): Promise<string> {
    // Se token ainda é válido, retorna direto
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(CAKTO_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }).toString(),
      })

      if (!response.ok) {
        throw new Error(`Cakto auth failed: ${response.status}`)
      }

      const data: CaktoTokenResponse = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1min antes
      return this.accessToken
    } catch (error) {
      console.error('[Cakto] Token error:', error)
      throw error
    }
  }

  /**
   * Criar produto no Cakto
   */
  async createProduct(data: {
    name: string
    description: string
    price: number
    image_url?: string
  }): Promise<CaktoProductResponse> {
    const token = await this.getAccessToken()

    try {
      const response = await fetch(`${CAKTO_API_BASE}/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: data.price,
          image_url: data.image_url,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Cakto product creation failed: ${JSON.stringify(error)}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[Cakto] Product creation error:', error)
      throw error
    }
  }

  /**
   * Atualizar produto no Cakto
   */
  async updateProduct(
    productId: string,
    data: {
      name?: string
      description?: string
      price?: number
      image_url?: string
    }
  ): Promise<CaktoProductResponse> {
    const token = await this.getAccessToken()

    try {
      const response = await fetch(`${CAKTO_API_BASE}/v1/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Cakto product update failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[Cakto] Product update error:', error)
      throw error
    }
  }

  /**
   * Obter produto do Cakto
   */
  async getProduct(productId: string): Promise<CaktoProductResponse> {
    const token = await this.getAccessToken()

    try {
      const response = await fetch(`${CAKTO_API_BASE}/v1/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error(`Cakto product fetch failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[Cakto] Product fetch error:', error)
      throw error
    }
  }
}

// Export singleton
let caktoClient: CaktoClient | null = null

export function getCaktoClient(): CaktoClient {
  if (!caktoClient) {
    const clientId = process.env.CAKTO_CLIENT_ID
    const clientSecret = process.env.CAKTO_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Cakto credentials not configured')
    }

    caktoClient = new CaktoClient(clientId, clientSecret)
  }

  return caktoClient
}

export type { CaktoProductResponse, CaktoTokenResponse }
