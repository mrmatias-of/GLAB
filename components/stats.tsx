const ITEMS = [
  { value: '+10 anos', label: 'De experiência',    wide: false },
  { value: 'Direto',   label: 'Sem enrolação, conteúdo objetivo', wide: false },
  { value: 'Trabalhamos\ncirurgicamente', label: 'Precisão técnica em cada guia. Sem atalhos, sem achismos.', wide: true },
  { value: '+10 anos', label: 'De experiência',      wide: false },
  { value: '2 horas', label: 'Tempo médio por módulo', wide: false },
]

export default function Stats() {
  return (
    <section className="px-6 py-16" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-7xl mx-auto">
        <p className="eyebrow mb-8">A biblioteca prática do técnico de celulares</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Stat 1 */}
          <div className="card p-6 rounded-2xl">
            <p className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">+10 anos</p>
            <p className="text-xs font-medium tracking-wide" style={{ color: '#71717a' }}>De experiência</p>
          </div>

          {/* Stat 2 */}
          <div className="card p-6 rounded-2xl">
            <p className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">Direto</p>
            <p className="text-xs font-medium tracking-wide" style={{ color: '#71717a' }}>Sem enrolação, conteúdo objetivo</p>
          </div>

          {/* Bloco texto — ocupa 1 coluna mobile, 2 cols em sm+, 2 em lg */}
          <div
            className="sm:col-span-2 lg:col-span-2 rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#18181b 100%)', border: '1px solid #27272a' }}
          >
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white leading-tight uppercase tracking-tight mb-3">
                Procedimentos precisos para reduzir erros na bancada
              </p>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#71717a', maxWidth: '36ch' }}>
                Guias diretos ao ponto, com protocolos práticos para você executar reparos com mais segurança e consistência.
              </p>
            </div>
            <a href="#cursos" className="btn-primary mt-5 self-start text-xs py-2 px-5">
              Ver Guias
            </a>
          </div>

          {/* Stat 3 */}
          <div className="card p-6 rounded-2xl">
            <p className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">+10 anos</p>
            <p className="text-xs font-medium tracking-wide" style={{ color: '#71717a' }}>De experiência</p>
          </div>

          {/* Stat 4 */}
          <div className="card p-6 rounded-2xl">
            <p className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">2 horas</p>
            <p className="text-xs font-medium tracking-wide" style={{ color: '#71717a' }}>Tempo médio por módulo</p>
          </div>
        </div>
      </div>
    </section>
  )
}
