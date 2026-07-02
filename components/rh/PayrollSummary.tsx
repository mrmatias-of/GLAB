interface PayrollSummaryProps {
  mes: number
  ano: number
  totalFuncionarios: number
  totalProventos: number
  totalDescontos: number
  totalLiquido: number
  totalFGTS: number
  totalINSS: number
  totalIRPF: number
}

export default function PayrollSummary({
  mes,
  ano,
  totalFuncionarios,
  totalProventos,
  totalDescontos,
  totalLiquido,
  totalFGTS,
  totalINSS,
  totalIRPF,
}: PayrollSummaryProps) {
  const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const mesNome = meses[mes]

  const formatMoney = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Resumo da Folha de Pagamento</h2>
        <p className="text-slate-400">{mesNome} de {ano}</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
          <p className="text-blue-300/70 text-sm font-medium mb-1">Funcionários</p>
          <p className="text-3xl font-bold text-blue-300">{totalFuncionarios}</p>
        </div>

        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
          <p className="text-green-300/70 text-sm font-medium mb-1">Total Proventos</p>
          <p className="text-2xl font-bold text-green-300">{formatMoney(totalProventos)}</p>
        </div>

        <div className="bg-red-500/20 border border-red-400 rounded-lg p-4">
          <p className="text-red-300/70 text-sm font-medium mb-1">Total Descontos</p>
          <p className="text-2xl font-bold text-red-300">{formatMoney(totalDescontos)}</p>
        </div>

        <div className="bg-amber-500/20 border border-amber-400 rounded-lg p-4">
          <p className="text-amber-300/70 text-sm font-medium mb-1">Total Líquido</p>
          <p className="text-2xl font-bold text-amber-300">{formatMoney(totalLiquido)}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-300 font-medium mb-3">Descontos por Impostos</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">INSS</span>
              <span className="font-medium">{formatMoney(totalINSS)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IRPF</span>
              <span className="font-medium">{formatMoney(totalIRPF)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">FGTS</span>
              <span className="font-medium">{formatMoney(totalFGTS)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2 mt-2 font-bold">
              <span>Total</span>
              <span>{formatMoney(totalINSS + totalIRPF + totalFGTS)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-300 font-medium mb-3">Média por Funcionário</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Proventos</span>
              <span className="font-medium">{formatMoney(totalFuncionarios > 0 ? totalProventos / totalFuncionarios : 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Descontos</span>
              <span className="font-medium">{formatMoney(totalFuncionarios > 0 ? totalDescontos / totalFuncionarios : 0)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2 mt-2 font-bold">
              <span>Líquido</span>
              <span>{formatMoney(totalFuncionarios > 0 ? totalLiquido / totalFuncionarios : 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-300 font-medium mb-3">Encargos (Empresa)</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">FGTS (8%)</span>
              <span className="font-medium">{formatMoney(totalFGTS)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">INSS Empresa (12%)</span>
              <span className="font-medium">{formatMoney(totalProventos * 0.12)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2 mt-2 font-bold">
              <span>Total Encargos</span>
              <span>{formatMoney(totalFGTS + totalProventos * 0.12)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
