import Image from "next/image"
import Link from "next/link"

export default function ComboLandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#05070c]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Voltar para a página inicial da G•Lab Cursos">
          <Image
            src="/logo-glab-neon-transparent.png"
            alt="G•Lab Cursos"
            width={100}
            height={34}
            className="h-7 w-auto object-contain opacity-80"
            priority
          />
        </Link>

        <Link
          href="https://app.kirvano.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          Entrar
        </Link>
      </div>
    </header>
  )
}
