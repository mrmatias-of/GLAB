'use client'

import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'

export default function ConfigImpostosPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    ano: new Date().getFullYear(),
    inss_aliquota_base: 8.0,
    inss_maximo_mensal: 1751.15,
    irpf_faixa_1_ate: 2826.65,
    irpf_faixa_2_ate: 3751.05,
    irpf_faixa_3_ate: 4664.68,
    irpf_faixa_4_ate: 5555.48,
    irpf_faixa_1_aliquota: 0.0,
    irpf_faixa_2_aliquota: 7.5,
    irpf_faixa_3_aliquota: 15.0,
    irpf_faixa_4_aliquota: 22.5,
    irpf_faixa_5_aliquota: 27.5,
    fgts_aliquota: 8.0,
    deducao_dependente: 189.59,
  })

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await fetch('/api/rh/config-impostos')
        if (response.ok) {
          const data = await response.json()
          if (data.data) {
            setConfig(prev => ({ ...prev, ...data.data }))
          }
        }
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig(prev => ({
      ...prev,
      [name]: isNaN(parseFloat(value)) ? value : parseFloat(value)
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/rh/config-impostos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!response.ok) throw new Error('Erro ao salvar')
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuração de Impostos</h1>
        <Link href="/admin/rh" className="text-blue-400 hover:text-blue-300">
          ← Voltar
        </Link>
      </div>

      <div className="bg-blue-500/20 border border-blue-400 text-blue-300 px-6 py-4 rounded-lg">
        <p className="text-sm">
          <strong>Atenção:</strong> Estas configurações afetarão todos os contracheques gerados. Use com cuidado!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* INSS */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">INSS (Contribuição Previdenciária)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Alíquota Base (%)</label>
              <input
                type="number"
                name="inss_aliquota_base"
                value={config.inss_aliquota_base}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Máximo Mensal (R$)</label>
              <input
                type="number"
                name="inss_maximo_mensal"
                value={config.inss_maximo_mensal}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* IRPF */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">IRPF (Imposto de Renda)</h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map(faixa => (
              <div key={faixa} className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Faixa {faixa} - Até (R$)
                  </label>
                  <input
                    type="number"
                    name={`irpf_faixa_${faixa}_ate`}
                    value={config[`irpf_faixa_${faixa}_ate` as keyof typeof config]}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Alíquota (%)</label>
                  <input
                    type="number"
                    name={`irpf_faixa_${faixa}_aliquota`}
                    value={config[`irpf_faixa_${faixa}_aliquota` as keyof typeof config]}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
                  />
                </div>
              </div>
            ))}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Faixa 5 - Alíquota (%)</label>
              <input
                type="number"
                name="irpf_faixa_5_aliquota"
                value={config.irpf_faixa_5_aliquota}
                onChange={handleChange}
                step="0.01"
                className="w-full max-w-xs px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* Outros */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Outros Impostos e Deduções</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">FGTS (%)</label>
              <input
                type="number"
                name="fgts_aliquota"
                value={config.fgts_aliquota}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Deução por Dependente (R$)</label>
              <input
                type="number"
                name="deducao_dependente"
                value={config.deducao_dependente}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded font-medium"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
          <Link href="/admin/rh" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
