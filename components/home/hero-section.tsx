import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Subtitle */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/30 text-blue-300 text-sm font-medium">
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
              Bem-vindo à G•Lab
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-50">
              Conhecimento Técnico
              <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                ao Seu Alcance
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed">
              Plataforma de aprendizado com guias técnicos detalhados e cursos práticos sobre reparo e manutenção de dispositivos eletrônicos.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/login"
              className="group px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-600/30 flex items-center gap-2"
            >
              Começar Agora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#courses"
              className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition-colors border border-slate-700 hover:border-slate-600"
            >
              Explorar Cursos
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-16 border-t border-slate-800/50">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">50+</div>
              <p className="text-sm text-slate-400 mt-1">Guias Técnicos</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">15+</div>
              <p className="text-sm text-slate-400 mt-1">Cursos Práticos</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">24/7</div>
              <p className="text-sm text-slate-400 mt-1">Disponível</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
