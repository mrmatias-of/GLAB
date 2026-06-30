import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://www.glabcursos.com.br/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const ordensService = {
  listar: () => api.get('/ordens-servico'),
  obter: (id: string) => api.get(`/ordens-servico/${id}`),
  criar: (dados: any) => api.post('/ordens-servico', dados),
  atualizar: (id: string, dados: any) => api.put(`/ordens-servico/${id}`, dados),
  deletar: (id: string) => api.delete(`/ordens-servico/${id}`),
}

export const estoqueService = {
  listar: () => api.get('/estoque'),
  obter: (id: string) => api.get(`/estoque/${id}`),
  criar: (dados: any) => api.post('/estoque', dados),
  atualizar: (id: string, dados: any) => api.put(`/estoque/${id}`, dados),
  movimentar: (dados: any) => api.post('/estoque/movimentacoes', dados),
}

export const clientesService = {
  listar: () => api.get('/clientes'),
  obter: (id: string) => api.get(`/clientes/${id}`),
}

export const tecnicosService = {
  obter: () => api.get('/tecnicos'),
}

export const financeiroService = {
  dashboard: () => api.get('/financeiro?dashboard=true'),
  relatorios: () => api.get('/relatorios'),
}
