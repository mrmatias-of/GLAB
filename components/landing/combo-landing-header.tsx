import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function ComboLandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070c]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Voltar para a página inicial da G•Lab Cursos">
          <Image
            src="/logo-glab-neon-transparent.png"
            alt="G•Lab Cursos"
            width={132}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <Link
          href="https://app.kirvano.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300 transition hover:border-cyan-400/40 hover:text-white"
        >
          Acessar conteúdo
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
