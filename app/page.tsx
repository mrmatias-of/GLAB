export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-40 border-b border-pink-500/20 sticky top-0 backdrop-blur-md bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            G•Lab
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#" className="text-sm text-gray-300 hover:text-pink-400 transition-colors">Guias</a>
            <a href="#" className="text-sm text-gray-300 hover:text-pink-400 transition-colors">Cursos</a>
            <a href="#" className="text-sm text-gray-300 hover:text-pink-400 transition-colors">Comunidade</a>
          </div>
          <div className="flex gap-3">
            <a href="/login" className="text-sm text-gray-300 hover:text-pink-400 transition-colors">Entrar</a>
            <a href="/sign-in" className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-pink-500/40 transition-all">
              Começar
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/40 bg-pink-500/10">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-pink-300">Aprenda com profissionais</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
              Domine<br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">assistência técnica</span><br />
              em celulares
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
              Guias técnicos, cursos profissionais e comunidade ativa. Aprenda com quem pratica na bancada todos os dias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative px-8 py-4 font-bold text-lg rounded-2xl overflow-hidden bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-2xl hover:shadow-pink-500/50 transition-all hover:-translate-y-1">
                <span className="relative z-10">Explorar Guias</span>
              </button>
              <button className="px-8 py-4 font-bold text-lg rounded-2xl border-2 border-pink-500/50 text-white hover:bg-pink-500/10 hover:border-pink-500 transition-all">
                Ver Cursos
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-pink-500/50 to-purple-500/50 rounded-3xl blur-3xl opacity-50" />
            <div className="relative p-12 rounded-3xl border border-pink-500/40 bg-gradient-to-br from-pink-500/20 to-purple-500/10 backdrop-blur-xl">
              <div className="space-y-6">
                <div className="text-6xl">📱</div>
                <div>
                  <p className="text-pink-400 text-sm font-bold mb-2">APRENDA DIFERENTE</p>
                  <h3 className="text-2xl font-black mb-4">Com quem entende</h3>
                  <p className="text-gray-300 leading-relaxed">Técnicos experientes compartilhando conhecimento real da bancada.</p>
                </div>
                <div className="flex gap-2 pt-4">
                  {['Prático', 'Real', 'Profissional'].map((tag) => (
                    <span key={tag} className="px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-500/40 text-xs font-bold text-pink-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-pink-500/20 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
          {[
            { num: '500+', label: 'Guias' },
            { num: '10k+', label: 'Técnicos' },
            { num: '99%', label: 'Sucesso' }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {item.num}
              </div>
              <p className="text-gray-400 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-pink-500/20 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-pink-400 font-bold text-sm mb-4 tracking-widest">O QUE OFERECEMOS</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6">Tudo que você precisa</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Conteúdo técnico de qualidade, ferramentas profissionais e comunidade ativa</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📚', title: 'Guias Técnicos', desc: 'Passo a passo detalhado para reparos, diagnóstico e troubleshooting' },
              { icon: '🎓', title: 'Cursos Online', desc: 'Formação profissional com certificação e suporte de instrutores' },
              { icon: '👥', title: 'Comunidade', desc: 'Rede ativa de técnicos para compartilhar experiências e conhecimento' }
            ].map((item) => (
              <div key={item.title} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/50 to-purple-600/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                <div className="relative p-8 rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/5 hover:border-pink-500/60 transition-all">
                  <div className="text-4xl mb-4 group-hover:scale-125 group-hover:-rotate-12 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black mb-3">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-pink-500/20 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-600/40 to-purple-600/40 rounded-3xl blur-3xl" />
            <div className="relative p-16 md:p-20 rounded-3xl border-2 border-pink-500/60 bg-gradient-to-br from-pink-500/20 to-purple-500/10 backdrop-blur-xl text-center">
              <p className="text-pink-400 font-bold text-sm mb-6 tracking-widest">COMECE HOJE</p>
              <h2 className="text-5xl md:text-6xl font-black mb-8">
                Pronto para<br />
                <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">dominar assistência técnica?</span>
              </h2>
              <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto">
                Junte-se a milhares de técnicos evoluindo e gerando mais renda com G•Lab
              </p>
              <button className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/60 transition-all hover:-translate-y-1">
                Criar Conta Grátis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-500/20 py-16 px-6 bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
                G•Lab
              </div>
              <p className="text-sm text-gray-400">Aprenda assistência técnica com qualidade e profissionalismo.</p>
            </div>
            <div>
              <p className="font-black text-sm mb-4 tracking-widest">PRODUTO</p>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Guias</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Cursos</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Comunidade</a></li>
              </ul>
            </div>
            <div>
              <p className="font-black text-sm mb-4 tracking-widest">EMPRESA</p>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Sobre</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <p className="font-black text-sm mb-4 tracking-widest">LEGAL</p>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-pink-500/20 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 G•Lab. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
