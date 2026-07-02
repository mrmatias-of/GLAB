'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'

interface Funcionario {
  id: number
  nome: string
  email: string
  cpf: string
  cargo: string
  salario_base: number
  status: string
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  async function fetchFuncionarios() {
    try {
      const response = await fetch('/api/rh/funcionarios')
      const data = await response.json()
      setFuncionarios(data)
    } catch (error) {
      console.error('Error fetching funcionários:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtrados = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      f.email.toLowerCase().includes(filtro.toLowerCase()) ||
      f.cpf.includes(filtro)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Funcionários</h1>
        <Link
          href="/admin/rh/funcionarios/novo"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Novo Funcionário
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou CPF..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="flex-1 outline-none text-slate-700"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-slate-600 font-semibold">Nome</th>
                <th className="px-4 py-3 text-left text-slate-600 font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-slate-600 font-semibold">CPF</th>
                <th className="px-4 py-3 text-left text-slate-600 font-semibold">Cargo</th>
                <th className="px-4 py-3 text-left text-slate-600 font-semibold">Salário</th>
                <th className="px-4 py-3 text-left text-slate-600 font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-slate-600 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((func) => (
                <tr key={func.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{func.nome}</td>
                  <td className="px-4 py-3 text-slate-600">{func.email}</td>
                  <td className="px-4 py-3 text-slate-600">{func.cpf}</td>
                  <td className="px-4 py-3 text-slate-600">{func.cargo}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">
                    R$ {Number(func.salario_base).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        func.status === 'ativo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {func.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/admin/rh/funcionarios/${func.id}`}>
                        <Edit2 className="w-4 h-4 text-blue-600 hover:text-blue-700 cursor-pointer" />
                      </Link>
                      <button
                          if (confirm('Tem certeza?')) {
                            await fetch(`/api/rh/funcionarios/${func.id}`, { method: 'DELETE' })
                            fetchFuncionarios()
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
