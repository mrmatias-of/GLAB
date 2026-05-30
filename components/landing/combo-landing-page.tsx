import Image from "next/image"

interface ComboLandingPageProps {
  curso: {
    titulo: string
    ctaHref: string
    imagem: string
    preco: string
    headline: string
    headlineSub: string
  }
}

export default function ComboLandingPage({ curso }: ComboLandingPageProps) {
  return (
    <main className="min-h-screen bg-[#05070c] text-white">
      <section className="py-16 px-5 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">{curso.titulo}</h1>
        <p className="mt-4 text-zinc-400">{curso.headlineSub}</p>
        <Image
          src={curso.imagem}
          width={700}
          height={700}
          alt={curso.titulo}
          className="mt-8 rounded-2xl"
        />
        <a
          href={curso.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 px-6 py-3 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 transition-colors"
        >
          Comprar Agora
        </a>
      </section>
    </main>
  )
}
