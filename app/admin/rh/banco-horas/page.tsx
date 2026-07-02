'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BancoHoras {
  id: number
  funcionario_id: number
  mes_ano: string
  saldo_anterior: string
  horas_trabalhadas: string
  horas_devidas: string
  horas_gozadas: string
  faltas_justificadas: string
  faltas_injustificadas: string
  saldo_atual: string
}

export default function BancoHorasPage() {
  const [registros, setRegistros] = useState<BancoHoras[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/rh/banco-horas')
        if (response.ok) {
          const data = await response.json()
          setRegistros(data.data || [])
        }
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const saldoColor = (saldo: string) => {
    const num = parseFloat(saldo)
    if (num > 0) return 'text-green-400'
    if (num < 0) return 'text-red-400'
    return 'text-slate-300'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Banco de Horas</h1>
        <Link href="/admin/rh" className="text-blue-400 hover:text-blue-300">
          ← Voltar
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : registros.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400">Sem registros de banco de horas</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr className="text-left text-xs font-semibold text-slate-300">
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3">Saldo Anterior</th>
                <th className="px-4 py-3">Trabalhadas</th>
                <th className="px-4 py-3">Devidas</th>
                <th className="px-4 py-3">Gozadas</th>
                <th className="px-4 py-3">Faltas (J)</th>
                <th className="px-4 py-3">Faltas (I)</th>
                <th className="px-4 py-3 font-bold">Saldo Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {registros.map(r => (
                <tr key={r.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-4 py-3 font-medium">{r.mes_ano}</td>
                  <td className="px-4 py-3">{parseFloat(r.saldo_anterior).toFixed(1)}h</td>
                  <td className="px-4 py-3">{parseFloat(r.horas_trabalhadas).toFixed(1)}h</td>
                  <td className="px-4 py-3">{parseFloat(r.horas_devidas).toFixed(1)}h</td>
                  <td className="px-4 py-3">{parseFloat(r.horas_gozadas).toFixed(1)}h</td>
                  <td className="px-4 py-3">{parseFloat(r.faltas_justificadas).toFixed(1)}h</td>
                  <td className="px-4 py-3">{parseFloat(r.faltas_injustificadas).toFixed(1)}h</td>
                  <td className={`px-4 py-3 font-bold ${saldoColor(r.saldo_atual)}`}>
                    {parseFloat(r.saldo_atual).toFixed(1)}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Legenda</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <p className="font-medium">J = Faltas Justificadas</p>
            <p className="font-medium">I = Faltas Injustificadas</p>
          </div>
          <div>
            <p className="text-green-400">Saldo positivo: horas a receber</p>
            <p className="text-red-400">Saldo negativo: horas a compensar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
