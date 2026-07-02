'use client'

export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-50">
      {/* Navigation */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-semibold text-lg tracking-tight">G•Lab</div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Guias</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Cursos</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Comunidade</a>
          </nav>
          <div className="flex gap-3">
            <a href="/login" className="px-4 py-2 text-sm text-slate-400 hover:text-slate-50 transition-colors">Entrar</a>
            <a href="/sign-in" className="px-5 py-2 bg-blue-600 text-slate-50 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">Começar</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-40 relative z-10 text-center">
          <div className="inline-block mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">Aprenda com profissionais</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 text-balance">
            Domine assistência técnica em celulares
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Guias técnicos práticos e cursos profissionais. Do básico ao avançado, aprenda com quem pratica na bancada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="px-8 py-3 bg-blue-600 text-slate-50 rounded-lg font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
              Explorar Guias
            </a>
            <a href="#" className="px-8 py-3 border border-slate-700 text-slate-50 rounded-lg font-medium hover:bg-slate-900 transition-colors">
              Ver Cursos
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">500+</div>
              <p className="text-sm text-slate-400">Guias técnicos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">10k+</div>
              <p className="text-sm text-slate-400">Técnicos ativos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">99%</div>
              <p className="text-sm text-slate-400">Taxa de sucesso</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Tudo o que você precisa</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">Conteúdo e ferramentas para dominar a assistência técnica mobile</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Guias Técnicos', desc: 'Passo a passo para troca de componentes, diagnóstico e reparos completos.' },
            { title: 'Cursos Práticos', desc: 'Aprenda do básico ao avançado com profissionais experientes.' },
            { title: 'Comunidade', desc: 'Conecte-se com técnicos, compartilhe experiências e tire dúvidas.' },
            { title: 'Ferramentas', desc: 'Acesso a recursos, planilhas e documentação essencial para trabalho.' },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center mb-4 group-hover:bg-blue-500/25 transition-colors">
                <div className="w-5 h-5 bg-blue-400 rounded-sm" />
              </div>
              <h3 className="font-semibold mb-2 text-base">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="p-12 md:p-16 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-blue-900/20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Junte-se a milhares de técnicos que estão aprendendo e evoluindo com G•Lab</p>
          <a href="#" className="inline-block px-8 py-3 bg-blue-600 text-slate-50 rounded-lg font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
            Criar Conta Grátis
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="font-semibold mb-3">G•Lab</div>
              <p className="text-sm text-slate-400">Aprenda assistência técnica com qualidade e profissionalismo.</p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Produto</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Guias</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Cursos</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Comunidade</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Empresa</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Sobre</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Legal</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Termos</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2024 G•Lab. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-50 transition-colors">Twitter</a>
              <a href="#" className="hover:text-slate-50 transition-colors">GitHub</a>
              <a href="#" className="hover:text-slate-50 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
