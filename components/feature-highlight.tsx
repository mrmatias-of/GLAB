import Image from "next/image"

export default function FeatureHighlight() {
  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[500px]">
          {/* Background image */}
          <Image
            src="https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=1200&q=80"
            alt="Profissional trabalhando em assistencia tecnica"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/80 via-purple-600/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-10 md:p-16 flex flex-col justify-center min-h-[500px] max-w-xl">
            <p className="text-violet-200 text-xs uppercase tracking-widest mb-4">Experiencia</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Aprenda com quem ja fez
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Nossos guias sao criados por tecnicos com anos de experiencia real em bancada. 
              Cada metodo foi testado e validado em milhares de reparos antes de chegar ate voce.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-4xl font-black text-white">20K+</p>
                <p className="text-white/50 text-sm">Reparos realizados</p>
              </div>
              <div>
                <p className="text-4xl font-black text-white">10+</p>
                <p className="text-white/50 text-sm">Anos de experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
