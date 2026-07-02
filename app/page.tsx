import Image from 'next/image'
import Link from 'next/link'

const guides = [
  {
    tag: 'Tela',
    level: 'Iniciante',
    title: 'Troca de Tela — iPhone 14',
    desc: 'Guia completo para substituição de display OLED com passo a passo fotográfico e lista de ferramentas.',
    duration: '25 min',
    img: '/images/guide-screen.png',
  },
  {
    tag: 'Bateria',
    level: 'Iniciante',
    title: 'Substituição de Bateria — Samsung S23',
    desc: 'Como remover e instalar a bateria corretamente, incluindo recalibração do BMS após o reparo.',
    duration: '20 min',
    img: '/images/guide-battery.png',
  },
  {
    tag: 'Software',
    level: 'Avançado',
    title: 'Diagnóstico de placa-mãe com Multímetro',
    desc: 'Aprenda a identificar curto-circuitos, medir tensões e localizar componentes defeituosos na placa.',
    duration: '45 min',
    img: '/images/guide-diag.png',
  },
]

const steps = [
  {
    num: '01',
    title: 'Escolha seu nível',
    desc: 'Iniciante ou avançado, temos trilhas de aprendizado para cada etapa da sua carreira.',
  },
  {
    num: '02',
    title: 'Acesse o conteúdo',
    desc: 'Guias em texto e vídeo, com fotos de cada etapa do reparo para nunca ficar em dúvida.',
  },
  {
    num: '03',
    title: 'Pratique na bancada',
    desc: 'Conteúdo prático criado por quem trabalha na assistência técnica todos os dias.',
  },
  {
    num: '04',
    title: 'Evolua com a comunidade',
    desc: 'Tire dúvidas, compartilhe reparos e conecte-se com técnicos de todo o Brasil.',
  },
]

const testimonials = [
  {
    name: 'Carlos R.',
    role: 'Técnico — São Paulo',
    text: 'Com o G•Lab consegui resolver reparos que antes eu mandava para terceiros. Os guias de placa mudaram meu negócio completamente.',
    stars: 5,
  },
  {
    name: 'Fernanda M.',
    role: 'Proprietária de assistência — BH',
    text: 'A comunidade é incrível. Resolvi um problema de curto em menos de 1 hora com a ajuda de outros técnicos. Nunca vi isso em outro lugar.',
    stars: 5,
  },
  {
    name: 'Diego S.',
    role: 'Autônomo — Curitiba',
    text: 'Saí do zero para cobrar R$120 por troca de tela em 3 meses. O conteúdo é muito bem explicado, sem enrolação.',
    stars: 5,
  },
]

const categories = [
  { icon: '🖥️', label: 'Tela & Display' },
  { icon: '🔋', label: 'Bateria' },
  { icon: '📡', label: 'Conectividade' },
  { icon: '🔌', label: 'Carregamento' },
  { icon: '📷', label: 'Câmera' },
  { icon: '🔊', label: 'Áudio' },
  { icon: '🧠', label: 'Placa-mãe' },
  { icon: '💧', label: 'Dano por Água' },
]

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white">

      {/* Background ambient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
            G•Lab
          </span>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="#" className="text-sm text-gray-300 hover:text-pink-400 transition-colors font-medium">Guias</Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-pink-400 transition-colors font-medium">Cursos</Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-pink-400 transition-colors font-medium">Comunidade</Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-pink-400 transition-colors font-medium">Preços</Link>
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">Entrar</Link>
            <Link href="/sign-in" className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-pink-500/40 transition-all hover:-translate-y-0.5">
              Começar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/40 bg-pink-500/10 w-fit">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-pink-300">+10.000 técnicos aprendendo</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-balance">
              Domine{' '}
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                assistência técnica
              </span>{' '}
              em celulares
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              Guias técnicos com passo a passo fotográfico, cursos profissionais e uma comunidade ativa de técnicos. Do básico ao avançado — aprenda com quem pratica na bancada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#"
                className="px-8 py-4 font-bold text-base rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-2xl hover:shadow-pink-500/50 transition-all hover:-translate-y-1 text-center"
              >
                Explorar Guias Gratis
              </Link>
              <Link
                href="#"
                className="px-8 py-4 font-bold text-base rounded-2xl border-2 border-white/20 text-white hover:border-pink-500/60 hover:bg-pink-500/10 transition-all text-center"
              >
                Ver Cursos
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex gap-8 pt-4 border-t border-white/10">
              {[
                { num: '500+', label: 'Guias publicados' },
                { num: '10k+', label: 'Técnicos ativos' },
                { num: 'Gratis', label: 'Para começar' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{s.num}</div>
                  <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative lg:block">
            <div className="absolute -inset-6 bg-gradient-to-br from-pink-500/40 to-purple-600/40 rounded-3xl blur-3xl opacity-60" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/hero-phone.png"
                alt="Técnico realizando reparo profissional em celular"
                width={680}
                height={480}
                className="w-full object-cover"
                priority
              />
              {/* Overlay card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                    📱
                  </div>
                  <div>
                    <p className="text-xs text-pink-400 font-bold">GUIA EM DESTAQUE</p>
                    <p className="text-sm font-bold text-white">Troca de Tela — iPhone 14 Pro Max</p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <span className="px-3 py-1 rounded-lg bg-pink-500/20 border border-pink-500/40 text-xs font-bold text-pink-300">25 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest text-gray-500 mb-8">CATEGORIAS DE REPARO</p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href="#"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-300 transition-all text-sm font-semibold text-gray-300"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="border-t border-white/10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-pink-400 font-bold text-xs tracking-widest mb-3">GUIAS EM DESTAQUE</p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Conteudo pronto<br />para aplicar hoje
              </h2>
            </div>
            <Link href="#" className="hidden md:block text-sm font-bold text-pink-400 hover:text-pink-300 transition-colors border-b border-pink-400/40 pb-1">
              Ver todos os guias →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link key={guide.title} href="#" className="group block">
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-pink-500/40 hover:bg-white/8 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={guide.img}
                      alt={guide.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-lg bg-pink-500/80 backdrop-blur-sm text-xs font-bold">{guide.tag}</span>
                      <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-bold text-gray-300">{guide.level}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-black text-base leading-snug group-hover:text-pink-300 transition-colors">{guide.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{guide.desc}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500 font-medium">Leitura: {guide.duration}</span>
                      <span className="text-xs font-bold text-pink-400 group-hover:translate-x-1 transition-transform inline-block">Acessar →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-pink-400 font-bold text-xs tracking-widest mb-3">COMO FUNCIONA</p>
            <h2 className="text-4xl md:text-5xl font-black">Do zero ao profissional</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Uma trilha de aprendizado estruturada para você crescer na assistência técnica no seu ritmo</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-pink-500/30 to-purple-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative p-8 rounded-2xl border border-white/10 bg-white/5 h-full">
                  <div className="text-4xl font-black bg-gradient-to-br from-pink-400 to-purple-500 bg-clip-text text-transparent mb-6">
                    {step.num}
                  </div>
                  <h3 className="font-black text-lg mb-3 group-hover:text-pink-300 transition-colors">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / Testimonials */}
      <section className="border-t border-white/10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-pink-400 font-bold text-xs tracking-widest mb-3">DEPOIMENTOS</p>
            <h2 className="text-4xl md:text-5xl font-black">O que dizem os técnicos</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-8 rounded-2xl border border-white/10 bg-white/5 flex flex-col gap-6">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-pink-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-200 leading-relaxed text-sm flex-1">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-black text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-600/40 to-purple-600/40 rounded-3xl blur-3xl" />
            <div className="relative p-12 md:p-20 rounded-3xl border border-pink-500/40 bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-black backdrop-blur-xl text-center">
              <p className="text-pink-400 font-bold text-xs tracking-widest mb-4">COMECE HOJE — E DE GRACA</p>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-balance">
                Pronto para dominar{' '}
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  assistencia tecnica?
                </span>
              </h2>
              <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
                Junte-se a mais de 10.000 tecnicos que ja estao evoluindo, ganhando mais e atendendo melhor com G•Lab.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-pink-500/60 transition-all hover:-translate-y-1 text-lg"
                >
                  Criar Conta Gratis
                </Link>
                <Link
                  href="#"
                  className="px-10 py-4 border-2 border-white/20 text-white font-black rounded-2xl hover:border-pink-500/50 hover:bg-pink-500/10 transition-all text-lg"
                >
                  Ver os Guias
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2 space-y-4">
              <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                G•Lab
              </span>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                A plataforma de referencia para tecnicos de assistencia tecnica mobile no Brasil. Conteudo real, pratico e profissional.
              </p>
            </div>
            <div>
              <p className="font-black text-xs mb-5 tracking-widest text-gray-500">PRODUTO</p>
              <ul className="space-y-3">
                {['Guias Tecnicos', 'Cursos Online', 'Comunidade', 'Ferramentas'].map((l) => (
                  <li key={l}><Link href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors font-medium">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-black text-xs mb-5 tracking-widest text-gray-500">EMPRESA</p>
              <ul className="space-y-3">
                {['Sobre Nos', 'Blog', 'Contato', 'Parcerias'].map((l) => (
                  <li key={l}><Link href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors font-medium">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-black text-xs mb-5 tracking-widest text-gray-500">LEGAL</p>
              <ul className="space-y-3">
                {['Privacidade', 'Termos de Uso', 'Cookies'].map((l) => (
                  <li key={l}><Link href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors font-medium">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; 2025 G•Lab. Todos os direitos reservados.</p>
            <p>Feito com dedicacao para tecnicos de todo o Brasil.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
