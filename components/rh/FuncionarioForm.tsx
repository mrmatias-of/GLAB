'use client'

import { useState, FormEvent } from 'react'
import { AlertCircle, Check } from 'lucide-react'

interface FuncionarioFormProps {
  onSubmit?: (data: any) => void
  isLoading?: boolean
}

export function FuncionarioForm({ onSubmit, isLoading = false }: FuncionarioFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    cargo: '',
    departamento: '',
    salario_base: '',
    tipo_contrato: 'CLT',
    regime_jornada: 'normal',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      if (!formData.nome || !formData.email || !formData.cpf || !formData.cargo || !formData.salario_base) {
        setError('Preencha todos os campos obrigatórios')
        return
      }

      const salary = parseFloat(formData.salario_base)
      if (isNaN(salary) || salary <= 0) {
        setError('Salário inválido')
        return
      }

      if (onSubmit) {
        await onSubmit(formData)
      }

      setSuccess(true)
      setFormData({
        nome: '',
        email: '',
        cpf: '',
        data_nascimento: '',
        cargo: '',
        departamento: '',
        salario_base: '',
        tipo_contrato: 'CLT',
        regime_jornada: 'normal',
        telefone: '',
        endereco: '',
        cidade: '',
        estado: '',
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Erro ao criar funcionário')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">Funcionário criado com sucesso!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="João Silva"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="joao@empresa.com"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            CPF *
          </label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="123.456.789-00"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Data de Nascimento
          </label>
          <input
            type="date"
            name="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cargo *
          </label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            placeholder="Desenvolvedor"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Departamento
          </label>
          <input
            type="text"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            placeholder="TI"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Salário Base (R$) *
          </label>
          <input
            type="number"
            name="salario_base"
            value={formData.salario_base}
            onChange={handleChange}
            placeholder="3000.00"
            step="0.01"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Contrato
          </label>
          <select
            name="tipo_contrato"
            value={formData.tipo_contrato}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
            <option value="Prestador">Prestador</option>
            <option value="Estagiário">Estagiário</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Regime de Jornada
          </label>
          <select
            name="regime_jornada"
            value={formData.regime_jornada}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            <option value="normal">Normal (8h)</option>
            <option value="turno">Turno (6h+2h)</option>
            <option value="integral">Integral (12h)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(11) 9999-9999"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Endereço
          </label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Rua X, 123"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cidade
          </label>
          <input
            type="text"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            placeholder="São Paulo"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estado
          </label>
          <input
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            placeholder="SP"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
      >
        {isLoading ? 'Salvando...' : 'Criar Funcionário'}
      </button>
    </form>
  )
}
