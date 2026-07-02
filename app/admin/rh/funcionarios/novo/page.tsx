'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NovoFuncionarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    cargo: '',
    departamento: '',
    salario_base: '',
    data_admissao: new Date().toISOString().split('T')[0],
    telefone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/rh/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Erro ao criar funcionário')

      router.push('/admin/rh/funcionarios')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Novo Funcionário</h1>
        <Link href="/admin/rh/funcionarios" className="text-blue-400 hover:text-blue-300">
          ← Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">CPF *</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Cargo *</label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Departamento</label>
            <input
              type="text"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Salário Base (R$) *</label>
            <input
              type="number"
              name="salario_base"
              value={formData.salario_base}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Data de Admissão *</label>
            <input
              type="date"
              name="data_admissao"
              value={formData.data_admissao}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              required
            />
          </div>
        </div>

        {error && <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded">{error}</div>}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded font-medium"
          >
            {loading ? 'Salvando...' : 'Salvar Funcionário'}
          </button>
          <Link href="/admin/rh/funcionarios" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
