'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Crown, Users, BookOpen, Bell, MessageCircle, Lightbulb, Megaphone, FileText, Wrench, Check } from 'lucide-react'

const benefits = [
  {
    number: '01',
    icon: Lightbulb,
    title: 'Dicas Práticas',
    description: 'Conteúdos rápidos e objetivos para aplicar na bancada.'
  },
  {
    number: '02',
    icon: Megaphone,
    title: 'Avisos de Cursos',
    description: 'Receba novidades e lançamentos antes de todo mundo.'
  },
  {
    number: '03',
    icon: FileText,
    title: 'Materiais e Cursos',
    description: 'Acesso a apostilas, checklists e materiais de apoio.'
  },
  {
    number: '04',
    icon: Wrench,
    title: 'Bastidores Reais',
    description: 'Veja manutenções, testes e processos do dia a dia.'
  },
  {
    number: '05',
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Aprenda junto, tire dúvidas e cresça mais rápido.'
  }
]

const checkList = [
  'Evite erros comuns',
  'Mais segurança na bancada',
  'Aprenda com quem vive isso',
  'Transforme conhecimento em renda'
]

export default function GrupoVIPPage() {
  const whatsappLink = 'https://chat.whatsapp.com/KiK2TDOf1HzGlkgH8IEL4B' // Substituir pelo link real

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-background to-background" />
        
        {/* Glow effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-purple-400 uppercase tracking-wider">
                  Quer aprender do jeito certo e evitar erros desde o início?
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-7xl font-black mb-4">
                <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                  GRUPO
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  VIP
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-white mb-2">
                Para iniciantes na
              </p>
              <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                MANUTENÇÃO DE CELULARES!
              </p>

              <p className="text-zinc-400 text-lg mb-8 max-w-md">
                Conteúdos, dicas e novidades para quem quer começar do jeito certo na{' '}
                <span className="text-cyan-400">assistência técnica</span>.
              </p>

              {/* Price badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full px-6 py-3 mb-8">
                <span className="text-green-400 font-bold text-2xl">GRATUITO</span>
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
            </div>

            {/* Right content - Logo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow behind logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-full blur-3xl scale-110" />
                <Image
                  src="/grupo-vip-iniciantes.png"
                  alt="Grupo VIP Iniciantes"
                  width={450}
                  height={450}
                  className="relative z-10 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side badges - Desktop */}
      <section className="py-8 border-y border-zinc-800/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-bold text-white">Novidades em primeira mão!</p>
                <p className="text-sm text-zinc-500">Fique por dentro de tudo</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-white">Materiais e conteúdos exclusivos!</p>
                <p className="text-sm text-zinc-500">Acesso direto no grupo</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="w-12 h-12 rounded-full bg-cyan-600/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="font-bold text-white">Troque ideia com quem está começando!</p>
                <p className="text-sm text-zinc-500">Comunidade ativa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-white mb-4">
            O que você vai encontrar no grupo
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Tudo que um iniciante precisa para começar com o pé direito na manutenção de celulares
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.number}
                className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-purple-500/50 transition-colors group"
              >
                {/* Number */}
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                  {benefit.number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 text-purple-400" />
                </div>

                {/* Title */}
                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>

                {/* Description */}
                <p className="text-sm text-zinc-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't start alone section */}
      <section className="py-16 lg:py-24 bg-zinc-900/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-white">
                  NÃO COMECE
                </h2>
                <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  SOZINHO.
                </h2>
              </div>
            </div>

            {/* Right */}
            <div>
              <p className="text-lg text-zinc-300 mb-6">
                Com o <span className="text-cyan-400 font-semibold">caminho certo</span>, você aprende mais rápido, erra menos e ganha mais confiança para{' '}
                <span className="text-purple-400 font-semibold">evoluir de verdade</span>!
              </p>

              <ul className="space-y-3">
                {checkList.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-600/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/30 via-emerald-950/20 to-green-950/30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* WhatsApp icon */}
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>

            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
              ENTRE NO GRUPO VIP
            </h2>
            <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-8">
              É GRATUITO!
            </p>

            <p className="text-zinc-400 mb-8">
              Conteúdo de qualidade para te ajudar a chegar mais longe!
            </p>

            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-green-500/30"
            >
              <Users className="w-6 h-6" />
              CLIQUE NO LINK E ENTRE AGORA!
            </Link>

            {/* Footer brand */}
            <div className="mt-16 flex items-center justify-center gap-3">
              <Image
                src="/logo-glab-neon.png"
                alt="G-LAB"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div className="text-left">
                <p className="text-white font-bold text-sm">GUILHERME JULIÃO</p>
                <p className="text-zinc-500 text-xs">ASSISTÊNCIA TÉCNICA</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
