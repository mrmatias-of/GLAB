export const CURSOS = [
  {
    id: 1,
    title: 'Reparação de Smartphones',
    modules: [
      { title: 'Básico de Eletrônica', topics: ['Componentes', 'Circuitos', 'Multímetro'] },
      { title: 'Desmontagem', topics: ['Ferramentas', 'Sequência', 'Segurança'] },
    ],
  },
  {
    id: 2,
    title: 'Reparação de Notebooks',
    modules: [
      { title: 'Hardware', topics: ['Componentes', 'Diagnóstico', 'Substituição'] },
      { title: 'Software', topics: ['SO', 'Drivers', 'Troubleshooting'] },
    ],
  },
]

export const MODULOS = [
  { title: 'Introdução', duracao: 2 },
  { title: 'Prática', duracao: 8 },
  { title: 'Avançado', duracao: 5 },
]
