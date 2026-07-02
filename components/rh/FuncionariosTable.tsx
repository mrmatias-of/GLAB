import Link from 'next/link'

interface Funcionario {
  id: number
  nome: string
  email: string
  cargo: string
  salario_base: string
  status: string
  data_admissao: string
}

interface FuncionariosTableProps {
  funcionarios: Funcionario[]
  loading?: boolean
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

export default function FuncionariosTable({
  funcionarios,
  loading,
  onEdit,
  onDelete,
}: FuncionariosTableProps) {
  const statusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-500/20 text-green-300'
      case 'inativo':
        return 'bg-gray-500/20 text-gray-300'
      case 'demitido':
        return 'bg-red-500/20 text-red-300'
      case 'licenca':
        return 'bg-yellow-500/20 text-yellow-300'
      default:
        return 'bg-blue-500/20 text-blue-300'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  if (funcionarios.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
        <p className="text-slate-400">Nenhum funcionário cadastrado</p>
        <Link href="/admin/rh/funcionarios/novo" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
          Adicionar primeiro funcionário →
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-lg">
      <table className="w-full">
        <thead className="bg-slate-900/50 border-b border-slate-700">
          <tr className="text-left text-sm font-semibold text-slate-300">
            <th className="px-6 py-3">Nome</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Cargo</th>
            <th className="px-6 py-3">Salário Base</th>
            <th className="px-6 py-3">Admissão</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {funcionarios.map(func => (
            <tr key={func.id} className="hover:bg-slate-700/30 transition">
              <td className="px-6 py-4 text-sm font-medium">{func.nome}</td>
              <td className="px-6 py-4 text-sm">{func.email}</td>
              <td className="px-6 py-4 text-sm">{func.cargo}</td>
              <td className="px-6 py-4 text-sm">R$ {parseFloat(func.salario_base).toFixed(2).replace('.', ',')}</td>
              <td className="px-6 py-4 text-sm">{new Date(func.data_admissao).toLocaleDateString('pt-BR')}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded text-xs font-medium ${statusColor(func.status)}`}>
                  {func.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <button
                  onClick={() => onEdit?.(func.id)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete?.(func.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
