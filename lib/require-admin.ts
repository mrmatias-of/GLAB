import 'server-only'

import { redirect } from 'next/navigation'
import { currentPlatformUser, isPlatformAdmin } from '@/lib/learning-platform'

/** Garante que o usuário atual é admin; caso contrário, redireciona para o login.
 *  Uso exclusivo em Server Actions e Route Handlers da área /admin. */
export async function requireAdmin() {
  const user = await currentPlatformUser()
  if (!user || !isPlatformAdmin(user.email)) redirect('/sign-in')
  return user
}
