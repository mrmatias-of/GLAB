'use client'

import { useEffect, useState } from 'react'
import { useTenant, useTenantBranding } from '@/lib/hooks/use-tenant'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: number
  numero: string
  cliente_id: number | null
  descricao: string
  equipamento: string | null
  status: string
  prioridade: string
  data_abertura: string
  valor_orcado: number | null
  valor_final: number | null
}

export default function OrdersPage() {
  const { tenant } = useTenant()
  const branding = useTenantBranding()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/tenant/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.data)
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const statusColors: Record<string, string> = {
    aberto: branding.primaryColor,
    em_progresso: branding.secondaryColor,
    finalizado: branding.accentColor,
    cancelado: '#ef4444',
    pausado: '#f59e0b',
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: branding.backgroundColor }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: `${branding.primaryColor}33` }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: branding.textColor }}>
                Ordens de Serviço
              </h1>
              <p style={{ color: branding.textColor }} className="opacity-75 mt-1">
                Gerencie todas as suas ordens de serviço
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/${tenant?.slug}`}
                style={{
                  color: branding.primaryColor,
                  borderColor: branding.primaryColor,
                }}
                className="px-4 py-2 rounded border hover:opacity-75 transition-opacity"
              >
                Voltar
              </Link>
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                style={{
                  backgroundColor: branding.primaryColor,
                  color: branding.backgroundColor,
                }}
                className="px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
              >
                Nova Ordem
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* New Order Form */}
        {showNewForm && (
          <div
            className="p-6 rounded-lg border mb-8"
            style={{
              backgroundColor: `${branding.primaryColor}08`,
              borderColor: `${branding.primaryColor}33`,
            }}
          >
            <h2 style={{ color: branding.textColor }} className="text-xl font-bold mb-4">
              Criar Nova Ordem
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Número da Ordem"
                  style={{
                    backgroundColor: `${branding.backgroundColor}99`,
                    color: branding.textColor,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="px-4 py-2 rounded border"
                />
                <input
                  type="text"
                  placeholder="Equipamento"
                  style={{
                    backgroundColor: `${branding.backgroundColor}99`,
                    color: branding.textColor,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="px-4 py-2 rounded border"
                />
              </div>
              <textarea
                placeholder="Descrição"
                rows={3}
                style={{
                  backgroundColor: `${branding.backgroundColor}99`,
                  color: branding.textColor,
                  borderColor: `${branding.primaryColor}33`,
                }}
                className="w-full px-4 py-2 rounded border"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  style={{
                    backgroundColor: branding.primaryColor,
                    color: branding.backgroundColor,
                  }}
                  className="px-6 py-2 rounded font-medium hover:opacity-90 transition-opacity"
                >
                  Criar Ordem
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  style={{
                    color: branding.primaryColor,
                    borderColor: branding.primaryColor,
                  }}
                  className="px-6 py-2 rounded border hover:opacity-75 transition-opacity"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Orders Table */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            borderColor: `${branding.primaryColor}33`,
          }}
        >
          <div
            className="p-4 border-b"
            style={{
              backgroundColor: `${branding.primaryColor}0a`,
              borderColor: `${branding.primaryColor}33`,
            }}
          >
            <h2 style={{ color: branding.textColor }} className="font-semibold">
              {orders.length} Ordens Registradas
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p style={{ color: branding.textColor }} className="mt-4">
                Carregando ordens...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div
              className="p-8 text-center"
              style={{
                backgroundColor: `${branding.primaryColor}05`,
              }}
            >
              <p style={{ color: branding.textColor }} className="opacity-75">
                Nenhuma ordem cadastrada ainda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead
                  style={{
                    backgroundColor: `${branding.primaryColor}0a`,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="border-b"
                >
                  <tr>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Número
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Equipamento
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Prioridade
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b hover:opacity-75 transition-opacity cursor-pointer"
                      style={{
                        borderColor: `${branding.primaryColor}1a`,
                      }}
                    >
                      <td className="px-6 py-4" style={{ color: branding.textColor }}>
                        <span className="font-medium">{order.numero}</span>
                      </td>
                      <td className="px-6 py-4" style={{ color: branding.textColor }}>
                        {order.descricao.substring(0, 30)}...
                      </td>
                      <td className="px-6 py-4" style={{ color: branding.textColor }}>
                        {order.equipamento || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${branding.primaryColor}20`,
                            color:
                              order.prioridade === 'alta'
                                ? '#ef4444'
                                : order.prioridade === 'normal'
                                  ? branding.primaryColor
                                  : '#10b981',
                          }}
                        >
                          {order.prioridade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${statusColors[order.status] || branding.primaryColor}20`,
                            color: statusColors[order.status] || branding.primaryColor,
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 opacity-75" style={{ color: branding.textColor }}>
                        {new Date(order.data_abertura).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
