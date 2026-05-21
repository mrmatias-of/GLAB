export default function Stats() {
  return (
    <section className="py-12 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-2xl p-6">
            <p className="text-4xl font-bold text-white mb-1">30</p>
            <p className="text-sm text-gray-400">Guias</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6">
            <p className="text-4xl font-bold text-white mb-1">1000+</p>
            <p className="text-sm text-gray-400">Alunos ativos</p>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/30 rounded-2xl p-6 col-span-2 md:col-span-1">
            <p className="text-2xl font-bold text-white mb-1">24/7</p>
            <p className="text-sm text-gray-400">Suporte</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6">
            <p className="text-2xl font-bold text-white mb-1">5 anos</p>
            <p className="text-sm text-gray-400">Experiência</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6">
            <p className="text-2xl font-bold text-white mb-1">2 h</p>
            <p className="text-sm text-gray-400">Por módulo</p>
          </div>
        </div>
      </div>
    </section>
  )
}
