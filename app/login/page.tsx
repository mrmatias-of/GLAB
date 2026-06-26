import { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Entrar | G•Lab Cursos',
  description: 'Área de acesso administrativo',
}

export default async function LoginPage() {
  // Se usuário já está logado, redireciona para home
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="text-3xl font-bold text-cyan-600">G•Lab</div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Entrar
          </h1>
          <p className="text-center text-slate-600 mb-8">
            Acesso à plataforma de cursos
          </p>

          <AuthForm mode="sign-in" />

          <div className="mt-6 text-center text-sm text-slate-600">
            Não tem conta?{' '}
            <a href="/sign-up" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Criar conta
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>© 2024 G•Lab Cursos. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
