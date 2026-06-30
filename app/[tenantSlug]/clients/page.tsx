'use client'

import { useEffect, useState } from 'react'
import { useTenant, useTenantBranding } from '@/lib/hooks/use-tenant'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Client {
  id: number
  nome: string
  email: string | null
  telefone: string | null
  cpf_cnpj: string | null
  cidade: string | null
  estado: string | null
  ativo: boolean
  valor_acumulado: string
  createdAt: string
}

export default function ClientsPage() {
  const { tenant } = useTenant()
  const branding = useTenantBranding()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf_cnpj: '',
    cidade: '',
    estado: '',
  })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/tenant/clients')
        if (response.ok) {
          const data = await response.json()
          setClients(data.data)
        }
      } catch (err) {
        console.error('Error fetching clients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tenant/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Refetch clients
        const result = await fetch('/api/tenant/clients')
        const data = await result.json()
        setClients(data.data)
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cpf_cnpj: '',
          cidade: '',
          estado: '',
        })
        setShowNewForm(false)
      }
    } catch (err) {
      console.error('Error creating client:', err)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: branding.backgroundColor }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: `${branding.primaryColor}33` }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: branding.textColor }}>
                Clientes
              </h1>
              <p style={{ color: branding.textColor }} className="opacity-75 mt-1">
                Gerencie todos os seus clientes
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
                Novo Cliente
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* New Client Form */}
        {showNewForm && (
          <div
            className="p-6 rounded-lg border mb-8"
            style={{
              backgroundColor: `${branding.primaryColor}08`,
              borderColor: `${branding.primaryColor}33`,
            }}
          >
            <h2 style={{ color: branding.textColor }} className="text-xl font-bold mb-4">
              Novo Cliente
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome *"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  style={{
                    backgroundColor: `${branding.backgroundColor}99`,
                    color: branding.textColor,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="px-4 py-2 rounded border"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    backgroundColor: `${branding.backgroundColor}99`,
                    color: branding.textColor,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="px-4 py-2 rounded border"
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  style={{
                    backgroundColor: `${branding.backgroundColor}99`,
                    color: branding.textColor,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="px-4 py-2 rounded border"
                />
                <input
                  type="text"
                  placeholder="CPF/CNPJ"
                  value={formData.cpf_cnpj}
                  onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                  style={{
                    backgroundColor: `${branding.backgroundColor}99`,
                    color: branding.textColor,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="px-4 py-2 rounded border"
                />
                <input
                  type="text"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  style={{
                    backgroundColor: `${branding.backgroundColor}99`,
                    color: branding.textColor,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="px-4 py-2 rounded border"
                />
                <input
                  type="text"
                  placeholder="Estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  style={{
                    backgroundColor: `${branding.backgroundColor}99`,
                    color: branding.textColor,
                    borderColor: `${branding.primaryColor}33`,
                  }}
                  className="px-4 py-2 rounded border"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  style={{
                    backgroundColor: branding.primaryColor,
                    color: branding.backgroundColor,
                  }}
                  className="px-6 py-2 rounded font-medium hover:opacity-90 transition-opacity"
                >
                  Criar Cliente
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

        {/* Clients List */}
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
              {clients.length} Clientes Cadastrados
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p style={{ color: branding.textColor }} className="mt-4">
                Carregando clientes...
              </p>
            </div>
          ) : clients.length === 0 ? (
            <div
              className="p-8 text-center"
              style={{
                backgroundColor: `${branding.primaryColor}05`,
              }}
            >
              <p style={{ color: branding.textColor }} className="opacity-75">
                Nenhum cliente cadastrado ainda.
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
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Email
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Cidade/Estado
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Valor Acumulado
                    </th>
                    <th className="px-6 py-3 text-left" style={{ color: branding.textColor }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b hover:opacity-75 transition-opacity cursor-pointer"
                      style={{
                        borderColor: `${branding.primaryColor}1a`,
                      }}
                    >
                      <td className="px-6 py-4" style={{ color: branding.textColor }}>
                        <span className="font-medium">{client.nome}</span>
                      </td>
                      <td className="px-6 py-4" style={{ color: branding.textColor }}>
                        {client.email || '-'}
                      </td>
                      <td className="px-6 py-4" style={{ color: branding.textColor }}>
                        {client.telefone || '-'}
                      </td>
                      <td className="px-6 py-4" style={{ color: branding.textColor }}>
                        {client.cidade && client.estado
                          ? `${client.cidade}, ${client.estado}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium" style={{ color: branding.accentColor }}>
                        R$ {parseFloat(client.valor_acumulado).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: client.ativo
                              ? `${branding.accentColor}20`
                              : `#ef444420`,
                            color: client.ativo ? branding.accentColor : '#ef4444',
                          }}
                        >
                          {client.ativo ? 'Ativo' : 'Inativo'}
                        </span>
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
