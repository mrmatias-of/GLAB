export const dynamic = 'force-dynamic'

export default function VendasPage() {
  return (
    <div className="p-8" style={{ background: '#050510' }}>
      <h1 className="text-3xl font-black text-white mb-6">Vendas</h1>
      <div className="border border-cyan-500/30 rounded-lg p-6" style={{ background: 'rgba(0,212,200,0.03)' }}>
        <p className="text-white/60">Acompanhar vendas e métricas de receita</p>
      </div>
    </div>
  )
}
