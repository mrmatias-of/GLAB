// Migra os cursos estáticos de lib/catalogo.ts para a tabela operacional
// glab_products, para que admin/aluno (matrículas, aulas, progresso,
// certificados) tenham produtos reais para referenciar.
//
// Idempotente: usa slug como chave e faz UPSERT (não duplica em reexecuções).
// Preço é um placeholder (R$ 97,00) editável depois no admin.
//
// Uso: node --env-file-if-exists=/vercel/share/.env.project scripts/seed-catalog-products.mjs

import mysql from 'mysql2/promise'

const CATALOGO = [
  { slug: 'combo-iniciante-mobile', title: 'Combo Iniciante Mobile', description: 'A base completa para começar na assistência técnica com segurança e método.', coverUrl: '/images/combo/combo-iniciante.webp', priceCents: 19700 },
  { slug: 'guia-troca-de-tela', title: 'Troca de Tela Profissional', description: 'Desmontagem, preparação, aplicação e testes com acabamento premium.', coverUrl: '/images/course-troca-tela-v2.png', priceCents: 9700 },
  { slug: 'guia-troca-de-bateria', title: 'Troca de Bateria Segura', description: 'Remoção, instalação, calibração e validação de baterias.', coverUrl: '/images/samsung.png', priceCents: 9700 },
  { slug: 'guia-conectores-carga', title: 'Conectores de Carga', description: 'Diagnóstico e substituição com soldagem e controle térmico.', coverUrl: '/images/diagnostico.png', priceCents: 9700 },
  { slug: 'guia-software-celular', title: 'Software para Celulares', description: 'Atualização, restauração, backup e correção das falhas mais frequentes.', coverUrl: '/images/samsung.png', priceCents: 9700 },
  { slug: 'guia-diagnostico-avancado', title: 'Diagnóstico Avançado', description: 'Método técnico para isolar falhas, medir circuitos e decidir com precisão.', coverUrl: '/images/diagnostico.png', priceCents: 9700 },
  { slug: 'guia-consumo-eletrico', title: 'Análise de Consumo Elétrico', description: 'Interprete padrões na fonte e encontre setores defeituosos rapidamente.', coverUrl: '/images/diagnostico.png', priceCents: 9700 },
  { slug: 'guia-curto-em-placa', title: 'Curto em Placa', description: 'Localização de curto com medições e técnicas térmicas.', coverUrl: '/hero-tech-pcb.jpg', priceCents: 9700 },
  { slug: 'guia-esquema-eletrico', title: 'Leitura de Esquema Elétrico', description: 'Navegue em esquemas e boardviews para rastrear sinais e alimentações.', coverUrl: '/hero-tech-pcb.jpg', priceCents: 9700 },
  { slug: 'guia-pmic-alimentacao', title: 'PMIC e Alimentação', description: 'Arquitetura de alimentação, sequência de start e gerenciamento de energia.', coverUrl: '/hero-tech-pcb.jpg', priceCents: 9700 },
  { slug: 'guia-radiofrequencia', title: 'Radiofrequência Mobile', description: 'Diagnóstico dos setores de rede, Wi-Fi, Bluetooth e comunicação RF.', coverUrl: '/images/diagnostico.png', priceCents: 9700 },
  { slug: 'guia-falhas-intermitentes', title: 'Falhas Intermitentes', description: 'Estratégias para reproduzir, monitorar e confirmar defeitos instáveis.', coverUrl: '/images/iphone.png', priceCents: 9700 },
  { slug: 'guia-perifericos', title: 'Periféricos e Sensores', description: 'Câmeras, áudio, biometria, sensores e outros subsistemas.', coverUrl: '/images/samsung.png', priceCents: 9700 },
  { slug: 'guia-precificacao-profissional', title: 'Precificação Profissional', description: 'Preços sustentáveis considerando custos, risco, margem e posicionamento.', coverUrl: '/images/gestao.png', priceCents: 9700 },
  { slug: 'guia-padronizacao-bancada', title: 'Padronização da Bancada', description: 'Checklists, organização e controle de qualidade para profissionalizar a operação.', coverUrl: '/images/gestao.png', priceCents: 9700 },
  { slug: 'guia-otimizacao-pc-gamer', title: 'Otimização de PC Gamer', description: 'Diagnóstico, estabilidade e performance para computadores otimizados.', coverUrl: '/images/pc.png', priceCents: 9700 },
]

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL)

  for (const item of CATALOGO) {
    await conn.execute(
      `INSERT INTO glab_products (slug, title, description, cover_url, price_cents, currency, is_active)
       VALUES (?, ?, ?, ?, ?, 'BRL', 1)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         cover_url = VALUES(cover_url)`,
      [item.slug, item.title, item.description, item.coverUrl, item.priceCents],
    )
    console.log('OK:', item.slug)
  }

  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM glab_products')
  console.log(`\nTotal de produtos em glab_products: ${count}`)

  await conn.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
