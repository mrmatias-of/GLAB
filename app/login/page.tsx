import { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Login | G•Lab Cursos - Neon PostgreSQL Edition',
  description: 'Faça login na plataforma de cursos G•Lab',
}

export default async function SignInPage() {
  // Verifica sessão existente
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">G•Lab</h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Fazer Login</h2>
          <p className="text-slate-600">Plataforma de Cursos Online</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <AuthForm mode="sign-in" />
          
          <div className="pt-4 border-t border-slate-200 text-center text-sm text-slate-600">
            Não tem uma conta?{' '}
            <a href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-700">
              Criar conta
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Powered by Neon PostgreSQL + Better Auth
        </p>
      </div>
    </div>
  )
}
