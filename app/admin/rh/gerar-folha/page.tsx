'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GerarFolhaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/rh/gerar-folha-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Erro ao gerar folha')

      const data = await response.json()
      setSuccess(`Folha de ${formData.mes}/${formData.ano} gerada com sucesso! ${data.contracheques_gerados} contracheques criados.`)
      
      setTimeout(() => {
        router.push('/admin/rh/contracheques')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar folha')
    } finally {
      setLoading(false)
    }
  }

  const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerar Folha de Pagamento</h1>
        <Link href="/admin/rh/contracheques" className="text-blue-400 hover:text-blue-300">
          ← Voltar
        </Link>
      </div>

      <div className="bg-blue-500/20 border border-blue-400 text-blue-300 px-6 py-4 rounded-lg">
        <p className="text-sm">
          <strong>Atenção:</strong> Este processo irá gerar contracheques para todos os funcionários ativos no mês selecionado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Mês *</label>
          <select
            name="mes"
            value={formData.mes}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
          >
            {meses.map((mes, idx) => idx > 0 && <option key={idx} value={idx}>{mes}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Ano *</label>
          <select
            name="ano"
            value={formData.ano}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
          >
            {[2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {error && <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded text-sm">{error}</div>}
        {success && <div className="bg-green-500/20 border border-green-400 text-green-300 px-4 py-2 rounded text-sm">{success}</div>}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium flex-1"
          >
            {loading ? 'Gerando...' : 'Gerar Folha'}
          </button>
          <Link href="/admin/rh/contracheques" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium">
            Cancelar
          </Link>
        </div>
      </form>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Informações Importantes</h3>
        <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
          <li>Serão processados apenas funcionários com status "ativo"</li>
          <li>Os cálculos de impostos (INSS, IRPF) serão aplicados automaticamente</li>
          <li>FGTS será calculado em 8% sobre o salário</li>
          <li>Eventos do mês (horas extras, adicionais, etc) serão inclusos</li>
          <li>Você poderá visualizar os contracheques após a geração</li>
        </ul>
      </div>
    </div>
  )
}
