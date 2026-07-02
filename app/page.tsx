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

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-40" />
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30">
              <span className="text-sm font-medium text-pink-400">Aprenda com profissionais</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Domine <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">assistência técnica</span> em celulares
            </h1>
            <p className="text-lg text-gray-400 max-w-lg mb-10 leading-relaxed">
              Guias práticos e cursos profissionais. Do básico ao avançado, aprenda com quem pratica na bancada todos os dias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all transform hover:scale-105">
                Explorar Guias
              </a>
              <a href="#" className="px-8 py-3 border border-gray-700 text-white rounded-lg font-semibold hover:border-pink-500/50 hover:bg-pink-500/5 transition-all">
                Ver Cursos
              </a>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="w-full h-96 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl border border-pink-500/30 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-gray-400">Imagem ilustrativa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-y border-pink-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {[
              { num: '500+', label: 'Guias técnicos' },
              { num: '10k+', label: 'Técnicos ativos' },
              { num: '99%', label: 'Taxa de sucesso' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">{item.num}</div>
                <p className="text-gray-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* We Help Brands */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Nós ajudamos técnicos a crescer</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Conteúdo de qualidade, ferramentas profissionais e comunidade ativa</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📚', title: 'Guias Técnicos', desc: 'Passo a passo detalhado para todos os tipos de reparo e diagnóstico' },
              { icon: '🎓', title: 'Cursos Práticos', desc: 'Aprenda do básico ao avançado com profissionais da bancada' },
              { icon: '👥', title: 'Comunidade', desc: 'Conecte-se, compartilhe experiências e evolua junto a outros técnicos' },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 border-y border-pink-500/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Serviços que Impulsionam Crescimento</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Social Media', desc: 'Conteúdo técnico para suas redes' },
              { title: 'Consultoria', desc: 'Orientação profissional para sua bancada' },
              { title: 'Educação', desc: 'Formação contínua de qualidade' },
              { title: 'Comunidade', desc: 'Rede ativa de profissionais' },
            ].map((item, i) => (
              <a key={i} href="#" className="p-8 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-pink-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
                  </div>
                  <div className="text-2xl group-hover:translate-x-2 transition-transform">→</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-16 rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4">Pronto para começar?</h2>
              <p className="text-gray-400 mb-10 text-lg">Junte-se a milhares de técnicos que estão evoluindo com G•Lab</p>
              <a href="#" className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all transform hover:scale-105">
                Criar Conta Grátis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-500/20 bg-black/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="font-black mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">G•Lab</div>
              <p className="text-gray-400 text-sm">Aprenda assistência técnica com qualidade e profissionalismo.</p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Produto</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Guias</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Cursos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Comunidade</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Empresa</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Sobre</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Contato</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Legal</div>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 G•Lab. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
