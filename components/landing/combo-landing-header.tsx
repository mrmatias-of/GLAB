import Link from "next/link"
import Image from "next/image"

export default function ComboLandingHeader() {
  return (
    <header className="sticky top-0 bg-[#05070c]/95 border-b border-white/10 backdrop-blur-xl z-50">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-5">
        <Link href="/">
          <Image src="/logo-glab-neon-transparent.png" width={132} height={44} alt="G•Lab Cursos" />
        </Link>
        <a
          href="https://pay.kirvano.com/d910bfe5-d8cb-460c-97a6-4af98346b660"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-white/10 text-xs font-semibold text-zinc-300 rounded-full hover:bg-white/5 transition-colors"
        >
          Acessar conteúdo
        </a>
      </div>
    </header>
  )
}
