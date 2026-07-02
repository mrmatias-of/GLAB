'use client'

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-pink-500/20 sticky top-0 z-50 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">G•Lab</div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Guias</a>
            <a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Cursos</a>
            <a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Comunidade</a>
            <a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Serviços</a>
          </div>
          <div className="flex gap-3 items-center">
            <a href="/login" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Entrar</a>
            <a href="/sign-in" className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all">Começar</a>
          </div>
        </div>
      </nav>

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40 backdrop-blur-sm">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">Aprenda com profissionais</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
                Domine
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">assistência técnica</span>
                <br />
                em celulares
              </h1>
              
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed font-light">
                Guias práticos, cursos profissionais e comunidade ativa. Do básico ao avançado, aprenda com quem pratica todos os dias.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#" className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 hover:-translate-y-1">
                  <span className="relative z-10">Explorar Guias</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                <a href="#" className="px-8 py-4 border-2 border-pink-500/50 text-white font-bold rounded-xl hover:bg-pink-500/10 hover:border-pink-500 transition-all duration-300 backdrop-blur-sm">
                  Ver Cursos
                </a>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-pink-500/20">
                {[
                  { num: '500+', label: 'Guias' },
                  { num: '10k+', label: 'Técnicos' },
                  { num: '99%', label: 'Sucesso' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{item.num}</div>
                    <p className="text-sm text-gray-400 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden md:block">
              <div className="relative">
                {/* Background Glow */}
                <div className="absolute -inset-8 bg-gradient-to-br from-pink-500/40 to-purple-500/40 rounded-3xl blur-2xl opacity-60" />
                
                {/* Main Card */}
                <div className="relative p-8 rounded-3xl border border-pink-500/40 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-black backdrop-blur-xl shadow-2xl">
                  <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-20 blur-xl" />
                  <div className="absolute bottom-6 left-6 w-16 h-16 bg-pink-500 rounded-full opacity-10 blur-lg" />
                  
                  <div className="relative z-10 space-y-8">
                    <div className="text-7xl">📱</div>
                    <div>
                      <p className="text-sm text-pink-400 font-semibold mb-2">PRÓXIMA GERAÇÃO</p>
                      <h3 className="text-2xl font-black text-white mb-3">Aprenda de verdade</h3>
                      <p className="text-gray-300 leading-relaxed">Com técnicos experientes que entendem do mercado e compartilham conhecimento real.</p>
                    </div>
                    <div className="flex gap-3 pt-6">
                      {['Prático', 'Profissional', 'Produtivo'].map((tag, i) => (
                        <span key={i} className="px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-500/40 text-sm text-pink-300 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6 border-t border-pink-500/20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-pink-400 font-bold text-sm mb-4 tracking-widest">NOSSOS SERVIÇOS</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6">Nós ajudamos técnicos a crescer</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">Conteúdo de qualidade profissional, ferramentas especializadas e comunidade ativa para você evoluir</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📚', title: 'Guias Técnicos', desc: 'Passo a passo detalhado para todos os tipos de reparo, substituição e diagnóstico de componentes' },
              { icon: '🎓', title: 'Cursos Práticos', desc: 'Aprenda do básico ao avançado com profissionais experientes direto da bancada' },
              { icon: '👥', title: 'Comunidade', desc: 'Conecte-se com técnicos, compartilhe experiências e evolua junto a outros profissionais' },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                <div className="relative p-8 rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/5 hover:bg-pink-500/15 transition-all duration-300 backdrop-blur-sm">
                  <div className="text-5xl mb-6 transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300">{item.icon}</div>
                  <h3 className="text-xl font-black mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                  <div className="mt-6 flex items-center text-pink-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2">
                    Explorar <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-32 px-6 border-t border-pink-500/20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="text-pink-400 font-bold text-sm mb-4 tracking-widest">SOLUÇÕES COMPLETAS</p>
            <h2 className="text-5xl md:text-6xl font-black">Serviços que Impulsionam Crescimento</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                num: '01',
                title: 'Guias & Tutoriais', 
                desc: 'Conteúdo técnico detalhado com passo a passo completo para todos os tipos de reparos',
                icon: '📖'
              },
              { 
                num: '02',
                title: 'Cursos Online', 
                desc: 'Formação profissional estruturada com certificação e acompanhamento de instrutores',
                icon: '🎥'
              },
              { 
                num: '03',
                title: 'Comunidade', 
                desc: 'Rede ativa de profissionais para compartilhar experiências e resolver dúvidas',
                icon: '🤝'
              },
              { 
                num: '04',
                title: 'Ferramentas', 
                desc: 'Recursos especializados, planilhas e documentação essencial para trabalho',
                icon: '🛠️'
              },
            ].map((item, i) => (
              <a key={i} href="#" className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/50 to-purple-500/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                <div className="relative p-10 rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-black backdrop-blur-xl hover:border-pink-500/60 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="text-5xl flex-shrink-0 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-pink-400 tracking-widest mb-2">{item.num}</div>
                      <h3 className="text-2xl font-black group-hover:text-pink-300 transition-colors mb-2">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-pink-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2">
                    <span>Saiba mais</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-2000" />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl opacity-30 blur-3xl" />
            <div className="relative p-16 md:p-20 rounded-3xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-black backdrop-blur-xl text-center">
              <p className="text-pink-400 font-bold text-sm mb-6 tracking-widest">COMECE HOJE</p>
              <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Pronto para dominar<br />
                <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">assistência técnica?</span>
              </h2>
              <p className="text-gray-300 mb-12 text-lg max-w-2xl mx-auto leading-relaxed">
                Junte-se a milhares de técnicos que já estão evoluindo e gerando mais renda com G•Lab
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#" className="group relative px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/70 hover:-translate-y-2">
                  <span className="relative z-10">Criar Conta Grátis</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                <a href="#" className="px-10 py-4 border-2 border-pink-500/50 text-white font-bold rounded-xl hover:bg-pink-500/10 hover:border-pink-500 transition-all duration-300">
                  Saiba Mais
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-500/20 bg-gradient-to-b from-black via-black to-black py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <div className="text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">G•Lab</div>
              <p className="text-gray-400 text-sm leading-relaxed">Aprenda assistência técnica com qualidade, profissionalismo e apoio de experts.</p>
              <div className="flex gap-4 pt-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center hover:bg-pink-500/40 transition-colors">
                  <span className="text-xs">f</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center hover:bg-pink-500/40 transition-colors">
                  <span className="text-xs">𝕏</span>
                </a>
              </div>
            </div>
            
            <div>
              <div className="font-black text-sm mb-6 text-white tracking-widest">PRODUTO</div>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Guias Técnicos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Cursos Online</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Comunidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Ferramentas</a></li>
              </ul>
            </div>
            
            <div>
              <div className="font-black text-sm mb-6 text-white tracking-widest">EMPRESA</div>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Sobre Nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Parcerias</a></li>
              </ul>
            </div>
            
            <div>
              <div className="font-black text-sm mb-6 text-white tracking-widest">LEGAL</div>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Termos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-300 transition-colors text-sm font-medium">Suporte</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-pink-500/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
            <p>&copy; 2024 G•Lab. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-pink-400 transition-colors">Status</a>
              <a href="#" className="hover:text-pink-400 transition-colors">Roadmap</a>
              <a href="#" className="hover:text-pink-400 transition-colors">Changelog</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
