import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export function AuthBrandHeader() {
  return (
    <div className="mb-8 flex w-full max-w-sm flex-col items-center gap-5">
      <Link
        href="/"
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
        aria-label="Voltar para a página inicial"
      >
        <Image
          src="/logo-glab-neon-transparent.png"
          alt="G-LAB Logo"
          width={44}
          height={44}
          className="h-11 w-11 object-contain drop-shadow-[0_0_16px_rgba(59,130,246,.45)]"
        />
        <span>
          <strong className="block text-sm font-black tracking-[.18em] text-white">G·LAB CURSOS</strong>
          <span className="block text-[8px] font-bold uppercase tracking-[.2em] text-cyan-200/45">Tecnologia · Precisão · Confiança</span>
        </span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-slate-400 transition-colors hover:text-cyan-300"
      >
        <ArrowLeft size={14} /> Voltar ao site
      </Link>
    </div>
  )
}
