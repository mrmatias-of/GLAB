'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:border-red-400/50 hover:text-red-300 disabled:opacity-50 sm:px-3"
      aria-label="Sair da conta"
    >
      <LogOut size={17} />
      <span className="hidden text-xs font-bold sm:inline">Sair</span>
    </button>
  )
}
