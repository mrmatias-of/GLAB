import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/30">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Junte-se a milhares de técnicos que já estão aprendendo com G•Lab. Comece sua jornada hoje mesmo.
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-600/30"
          >
            Acessar Plataforma
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Footer Info */}
          <p className="text-sm text-slate-500 pt-8 border-t border-slate-800/50">
            Sem cartão de crédito necessário • Acesso imediato • Suporte 24/7
          </p>
        </div>
      </div>
    </section>
  )
}
