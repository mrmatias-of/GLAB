export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-slate-900 sticky top-0 z-50 bg-slate-950/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">G•Lab</div>
          <div className="hidden md:flex items-center gap-12">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Guias</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Cursos</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Comunidade</a>
          </div>
          <div className="flex gap-3 items-center">
            <a href="/login" className="text-sm text-slate-400 hover:text-slate-50 transition-colors">Entrar</a>
            <a href="/sign-in" className="px-5 py-2 rounded-lg bg-blue-600 text-sm font-medium hover:bg-blue-700 transition-colors">Começar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Domine assistência técnica em celulares
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Guias práticos e cursos profissionais. Do básico ao avançado, aprenda com quem pratica na bancada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Explorar Guias
            </a>
            <a href="#" className="px-8 py-3 border border-slate-700 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors">
              Ver Cursos
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-900 bg-slate-900/30 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <p className="text-slate-400 text-sm">Guias técnicos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">10k+</div>
              <p className="text-slate-400 text-sm">Técnicos aprendendo</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">99%</div>
              <p className="text-slate-400 text-sm">Taxa de sucesso</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa</h2>
            <p className="text-slate-400 text-lg">Conteúdo e ferramentas para dominar a assistência técnica</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Guias Técnicos', desc: 'Passo a passo detalhado para todos os tipos de reparo e diagnóstico' },
              { title: 'Cursos Práticos', desc: 'Aprenda do básico ao avançado com profissionais da bancada' },
              { title: 'Comunidade', desc: 'Conecte-se com técnicos, compartilhe experiências e tire dúvidas' },
              { title: 'Recursos', desc: 'Planilhas, ferramentas e documentação essencial para o trabalho' },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/70 transition-all">
                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-16 rounded-2xl border border-slate-800 bg-slate-900/50 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-slate-400 mb-8 text-lg">Junte-se a milhares de técnicos evoluindo com G•Lab</p>
            <a href="#" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Criar Conta Grátis
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-900/30 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="font-semibold mb-4">G•Lab</div>
              <p className="text-slate-400 text-sm">Aprenda assistência técnica com qualidade e profissionalismo.</p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Produto</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Guias</a></li>
                <li><a href="#" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Cursos</a></li>
                <li><a href="#" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Comunidade</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Empresa</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Sobre</a></li>
                <li><a href="#" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Contato</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Legal</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Privacidade</a></li>
                <li><a href="#" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex justify-between items-center text-slate-400 text-sm">
            <p>&copy; 2024 G•Lab. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
