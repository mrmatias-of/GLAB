#!/bin/bash

# Este script adiciona tenantId a todas as tabelas do schema.ts que não o possuem
# Executado uma única vez para refatoração

echo "Schema refactoring script - Adding tenantId to all tables"
echo "Este é um guia de referência. Execute manualmente conforme necessário."

# Tabelas que precisam de tenantId (todas except user, session, account que já têm):
TABLES_TO_UPDATE=(
  "verification"
  "clientes"
  "estoque"
  "estoque_categoria"
  "movimentacoes_estoque"
  "ordens_servico"
  "ordens_servico_itens"
  "ordens_premium"
  "estoque_pre_movimentacoes"
  "movimentacoes_estoque_detalhes"
  "vendas"
  "vendas_itens"
  "relatorio_estoque"
  "relatorio_financeiro"
  "relatorio_ordens"
  "relatorio_vendas"
  "tecnicos"
  "alocacao_tecnicos"
  "funcionarios"
  "contracheques"
  "eventos_folha"
  "config_impostos"
  "banco_horas"
  "historico_salarial"
  "passwordResets"
)

echo "Total de tabelas para atualizar: ${#TABLES_TO_UPDATE[@]}"
echo "Adicione tenantId: text('tenantId').notNull() logo após id em cada tabela"
echo ""
echo "Exemplo:"
echo "  export const clientes = pgTable('clientes', {"
echo "    id: serial('id').primaryKey(),"
echo "    tenantId: text('tenantId').notNull(),  // <-- ADICIONAR ISTO"
echo "    ..."
