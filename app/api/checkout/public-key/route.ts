import { NextResponse } from 'next/server'
import { getPagBankPublicKey } from '@/lib/pagbank'

export async function GET() {
  try {
    return NextResponse.json({ publicKey: await getPagBankPublicKey() })
  } catch (error) {
    console.error('[v0] Failed to fetch PagBank public key', error)
    return NextResponse.json({ error: 'Não foi possível preparar o pagamento.' }, { status: 502 })
  }
}
