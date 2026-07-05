export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">G•Lab Cursos</h1>
          <p className="text-xl text-gray-600">Plataforma de aprendizado para assistência técnica</p>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Dominar assistência técnica nunca foi tão fácil
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Guias técnicos profissionais, cursos estruturados e uma comunidade ativa de técnicos. Aprenda do zero ao avançado.
            </p>
            <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
              Começar Agora
            </button>
          </div>
          <div className="bg-blue-200 h-80 rounded-lg"></div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { title: 'Guias Técnicos', desc: '500+ guias com passo a passo fotográfico' },
            { title: 'Cursos Online', desc: 'Conteúdo prático criado por profissionais' },
            { title: 'Comunidade', desc: '10k+ técnicos compartilhando conhecimento' },
          ].map((f) => (
            <div key={f.title} className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-blue-600 text-white text-center py-12 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition">
            Criar Conta Grátis
          </button>
        </div>
      </div>
    </main>
  )
}
