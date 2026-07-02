interface ContrachequeViewerProps {
  funcionarioNome: string
  mes: number
  ano: number
  salarioBase: number
  proventos: {
    horas_extras_50: number
    horas_extras_100: number
    adicional_noturno: number
    adicional_insalubridade: number
    adicional_periculosidade: number
    bonus: number
    comissao: number
  }
  descontos: {
    inss: number
    irpf: number
    fgts: number
    sindicato: number
  }
  valorLiquido: number
}

export default function ContrachequeViewer({
  funcionarioNome,
  mes,
  ano,
  salarioBase,
  proventos,
  descontos,
  valorLiquido,
}: ContrachequeViewerProps) {
  const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const mesNome = meses[mes]

  const totalProventos = salarioBase + Object.values(proventos).reduce((a, b) => a + b, 0)
  const totalDescontos = Object.values(descontos).reduce((a, b) => a + b, 0)

  const formatMoney = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b border-slate-700">
        <div>
          <h2 className="text-2xl font-bold">{funcionarioNome}</h2>
          <p className="text-slate-400">{mesNome} de {ano}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm"
        >
          🖨️ Imprimir
        </button>
      </div>

      {/* Proventos */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-green-300">PROVENTOS</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Salário Base</span>
            <span className="font-medium">{formatMoney(salarioBase)}</span>
          </div>
          {proventos.horas_extras_50 > 0 && (
            <div className="flex justify-between">
              <span>Horas Extras 50%</span>
              <span>{formatMoney(proventos.horas_extras_50)}</span>
            </div>
          )}
          {proventos.horas_extras_100 > 0 && (
            <div className="flex justify-between">
              <span>Horas Extras 100%</span>
              <span>{formatMoney(proventos.horas_extras_100)}</span>
            </div>
          )}
          {proventos.adicional_noturno > 0 && (
            <div className="flex justify-between">
              <span>Adicional Noturno</span>
              <span>{formatMoney(proventos.adicional_noturno)}</span>
            </div>
          )}
          {proventos.adicional_insalubridade > 0 && (
            <div className="flex justify-between">
              <span>Adicional Insalubridade</span>
              <span>{formatMoney(proventos.adicional_insalubridade)}</span>
            </div>
          )}
          {proventos.bonus > 0 && (
            <div className="flex justify-between">
              <span>Bônus</span>
              <span>{formatMoney(proventos.bonus)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-slate-700 pt-2 mt-2">
            <span>Total Proventos</span>
            <span className="text-green-400">{formatMoney(totalProventos)}</span>
          </div>
        </div>
      </div>

      {/* Descontos */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-red-300">DESCONTOS</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>INSS</span>
            <span>{formatMoney(descontos.inss)}</span>
          </div>
          <div className="flex justify-between">
            <span>IRPF</span>
            <span>{formatMoney(descontos.irpf)}</span>
          </div>
          <div className="flex justify-between">
            <span>FGTS</span>
            <span>{formatMoney(descontos.fgts)}</span>
          </div>
          {descontos.sindicato > 0 && (
            <div className="flex justify-between">
              <span>Sindicato</span>
              <span>{formatMoney(descontos.sindicato)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-slate-700 pt-2 mt-2">
            <span>Total Descontos</span>
            <span className="text-red-400">{formatMoney(totalDescontos)}</span>
          </div>
        </div>
      </div>

      {/* Líquido */}
      <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">VALOR LÍQUIDO</span>
          <span className="text-3xl font-bold text-blue-300">{formatMoney(valorLiquido)}</span>
        </div>
      </div>
    </div>
  )
}
