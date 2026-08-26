import Link from 'next/link'
import { GraduationCap, LayoutDashboard } from 'lucide-react'
import { redirect } from 'next/navigation'
import { currentPlatformUser } from '@/lib/learning-platform'
import { SignOutButton } from '@/components/aluno/sign-out-button'

export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const user = await currentPlatformUser()
  if (!user) redirect('/sign-in')

  return <main className="min-h-screen bg-[#050712] text-white">
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050712]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/aluno" className="flex items-center gap-3 font-black tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600"><GraduationCap size={19} /></span>G·LAB <span className="text-xs font-bold text-cyan-300">ÁREA DO ALUNO</span></Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-right text-xs text-slate-400 sm:block"><strong className="block text-white">{user.name}</strong>{user.email}</span>
          <Link href="/" className="rounded-xl border border-white/10 p-2.5 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200" aria-label="Voltar ao site"><LayoutDashboard size={17} /></Link>
          <SignOutButton />
        </div>
      </div>
    </header>
    {children}
  </main>
}
