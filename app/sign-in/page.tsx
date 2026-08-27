import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { isPlatformAdmin } from '@/lib/learning-platform'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user?.email) redirect(isPlatformAdmin(session.user.email) ? '/admin' : '/aluno')
  return <AuthForm mode="sign-in" />
}
