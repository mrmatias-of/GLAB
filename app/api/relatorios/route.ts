import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { relatoriosService } from '@/lib/services/relatorios.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { searchParams } = new URL(req.url)
    const tipo = searchParams.get('tipo')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const status = searchParams.get('status')

    if (!tipo) {
      return apiResponse(null, 400, 'tipo é obrigatório')
    }

    const datas = {
      inicio: dataInicio ? new Date(dataInicio) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      fim: dataFim ? new Date(dataFim) : new Date(),
    }

    let resultado

    switch (tipo) {
      case 'os':
        resultado = await relatoriosService.relatorioOS(session.user.id, datas.inicio, datas.fim, status || undefined)
        break
      case 'financeiro':
        resultado = await relatoriosService.relatorioFinanceiro(session.user.id, datas.inicio, datas.fim)
        break
      case 'estoque':
        resultado = await relatoriosService.relatorioEstoque(session.user.id)
        break
      case 'desempenho-tecnico':
        resultado = await relatoriosService.relatorioDesempenhoTecnico(session.user.id, datas.inicio, datas.fim)
        break
      case 'clientes-lucrativos':
        resultado = await relatoriosService.relatorioClientesLucrativos(session.user.id, datas.inicio, datas.fim)
        break
      case 'movimentacoes-estoque':
        resultado = await relatoriosService.relatorioMovimentacoesEstoque(session.user.id, datas.inicio, datas.fim)
        break
      default:
        return apiResponse(null, 400, 'Tipo de relatório inválido')
    }

    return apiResponse(resultado, 200, `Relatório de ${tipo} gerado com sucesso`)
  } catch (error) {
    return handleApiError(error)
  }
}
