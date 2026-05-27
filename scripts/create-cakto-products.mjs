/**
 * Script para criar produtos Cakto para cursos existentes
 * Execute com: node --env-file=/vercel/share/.env.project scripts/create-cakto-products.mjs
 */

const CAKTO_TOKEN_URL = 'https://oauth.cakto.com.br/oauth/token'
const CAKTO_API_BASE = 'https://api.cakto.com.br'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const cursos = [
  {
    id: 'a1065e84-11a0-48b7-adcf-ae559460c583',
    titulo: 'Guia Mestre: Troca de Tela',
    descricao: 'Guia completo para executar trocas de tela com qualidade e zero retorno. Aprenda técnicas de desmontagem, tipos de telas e comunicação profissional.',
    preco: 7.97
  },
  {
    id: 'd310f81a-cf3c-4fe0-8b69-1f54b545c53f',
    titulo: 'Guia Mestre: Conectores & Carga',
    descricao: 'Guia técnico completo para diagnosticar e reparar problemas de carga. Aprenda a identificar falhas, trocar conectores e entregar serviço de excelência.',
    preco: 7.97
  }
]

async function getAccessToken() {
  const clientId = process.env.CAKTO_CLIENT_ID
  const clientSecret = process.env.CAKTO_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('CAKTO_CLIENT_ID e CAKTO_CLIENT_SECRET não configurados')
  }

  console.log('Autenticando na Cakto...')
  
  const response = await fetch(CAKTO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Erro ao autenticar: ${response.status} - ${text}`)
  }

  const data = await response.json()
  console.log('Token obtido com sucesso!')
  return data.access_token
}

async function createProduct(token, curso) {
  console.log(`\nCriando produto: ${curso.titulo}`)
  
  const response = await fetch(`${CAKTO_API_BASE}/v1/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: curso.titulo,
      description: curso.descricao,
      price: curso.preco,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error(`Erro ao criar produto: ${response.status} - ${text}`)
    return null
  }

  const product = await response.json()
  console.log(`Produto criado! ID: ${product.id}`)
  console.log(`Checkout URL: ${product.checkout_url}`)
  return product
}

async function updateCurso(cursoId, checkoutUrl, caktoProductId) {
  console.log(`Atualizando curso ${cursoId} com link de checkout...`)
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/cursos?id=eq.${cursoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      cta_href: checkoutUrl,
      cakto_product_id: caktoProductId
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error(`Erro ao atualizar curso: ${response.status} - ${text}`)
    return false
  }

  console.log('Curso atualizado com sucesso!')
  return true
}

async function main() {
  console.log('=== Criando Produtos Cakto ===\n')
  
  try {
    const token = await getAccessToken()
    
    for (const curso of cursos) {
      const product = await createProduct(token, curso)
      
      if (product && product.checkout_url) {
        await updateCurso(curso.id, product.checkout_url, product.id)
      }
    }
    
    console.log('\n=== Processo finalizado ===')
  } catch (error) {
    console.error('Erro fatal:', error.message)
    process.exit(1)
  }
}

main()
