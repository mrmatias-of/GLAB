import { sendMessage } from './telegram'

interface DeployReport {
  arquivosAlterados: string[]
  arquivosCriados: string[]
  arquivosRemovidos: string[]
  resumo: string
  commitHash?: string
}

export async function sendDeployReport(report: DeployReport) {
  const { arquivosAlterados, arquivosCriados, arquivosRemovidos, resumo, commitHash } = report

  const linhas: string[] = [
    '<b>🚀 ALTERAÇÃO NO SITE</b>',
    '',
    `<b>Resumo:</b> ${resumo}`,
    '',
  ]

  if (arquivosCriados.length > 0) {
    linhas.push('<b>✅ Arquivos criados:</b>')
    arquivosCriados.forEach(f => linhas.push(`• <code>${f}</code>`))
    linhas.push('')
  }

  if (arquivosAlterados.length > 0) {
    linhas.push('<b>📝 Arquivos alterados:</b>')
    arquivosAlterados.forEach(f => linhas.push(`• <code>${f}</code>`))
    linhas.push('')
  }

  if (arquivosRemovidos.length > 0) {
    linhas.push('<b>❌ Arquivos removidos:</b>')
    arquivosRemovidos.forEach(f => linhas.push(`• <code>${f}</code>`))
    linhas.push('')
  }

  if (commitHash) {
    linhas.push(`<b>Git:</b> <code>${commitHash}</code>`)
  }

  linhas.push('')
  linhas.push('🌐 <a href="https://glabcursos.com.br">Ver site</a>')

  await sendMessage(linhas.join('\n'))
}
