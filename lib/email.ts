import 'server-only'

import nodemailer from 'nodemailer'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://www.glabcursos.com.br').replace(/\/$/, '')
const from = process.env.EMAIL_FROM ?? 'G-LAB <no-reply@glabcursos.com.br>'
const institutionalImageUrl = 'https://blobs.vusercontent.net/blob/%5BPasted%20159%20lines%5D-4C3v8eYldu8hmb9aQU8HILe7ytJgQQ'

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]!)
}

function emailLayout({ eyebrow, title, preview, body, ctaLabel, ctaUrl, securityMessage, codeBlock }: { eyebrow: string; title: string; preview: string; body: string; ctaLabel?: string; ctaUrl?: string; securityMessage?: string; codeBlock?: string }) {
  const logoUrl = `${appUrl}/logo-glab-neon-transparent.png`
  const security = securityMessage ? `<div style="margin-top:28px;padding:16px 18px;background:#080c11;border:1px solid #263442;border-radius:12px;color:#91a0ae;font-size:12px;line-height:1.55">${securityMessage}</div>` : ''
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#050712;color:#eef5ff;font-family:Arial,Helvetica,sans-serif"><span style="display:none!important;max-height:0;overflow:hidden">${preview}</span><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#050712;padding:32px 12px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:620px;background:#0a0d19;border:1px solid #22314d;border-radius:24px;overflow:hidden"><tr><td style="padding:32px 38px 0;background:#0d1d31"><img src="${logoUrl}" alt="G-LAB" width="54" height="54" style="display:block;object-fit:contain"><img src="${institutionalImageUrl}" alt="Bancada institucional G-LAB com microscópio" width="544" style="display:block;width:100%;height:auto;max-height:190px;object-fit:cover;margin:28px 0 0;border-radius:14px 14px 0 0"><p style="margin:24px 0 0;color:#7de8ff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${eyebrow}</p><h1 style="margin:12px 0 28px;color:#ffffff;font-size:30px;line-height:1.15">${title}</h1></td></tr><tr><td style="padding:34px 38px;color:#c8d4e8;font-size:16px;line-height:1.65">${body}${codeBlock ?? ''}${ctaLabel && ctaUrl ? `<p style="margin:30px 0"><a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(90deg,#23d9f4,#3986ff);border-radius:999px;color:#04101d;font-weight:800;padding:15px 23px;text-decoration:none">${ctaLabel}</a></p><p style="font-size:12px;color:#8290a8;word-break:break-word">Se o botão não abrir, copie este link: ${ctaUrl}</p>` : ''}${security}</td></tr><tr><td style="padding:22px 38px;border-top:1px solid #1a263b;color:#73819a;font-size:12px;line-height:1.5">G-LAB Cursos · Educação técnica para a bancada real.<br>Esta é uma mensagem automática. Precisa de ajuda? Fale com <a href="mailto:suporte@glabcursos.com.br" style="color:#7de8ff">suporte@glabcursos.com.br</a>.</td></tr></table></td></tr></table></body></html>`
}

function textVersion(title: string, body: string, ctaUrl?: string) {
  return `G-LAB\n\n${title}\n\n${body.replace(/<[^>]*>/g, '')}${ctaUrl ? `\n\n${ctaUrl}` : ''}\n\nSuporte: suporte@glabcursos.com.br`
}

export class EmailNotConfiguredError extends Error {
  missing: string[]
  constructor(missing: string[]) {
    super(`SMTP incompleto. Configure: ${missing.join(', ')}.`)
    this.name = 'EmailNotConfiguredError'
    this.missing = missing
  }
}

/** Variáveis sem valor padrão seguro. As demais são inferidas abaixo. */
function missingSmtpVars() {
  return (['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD'] as const).filter(key => !process.env[key]?.trim())
}

function transporter() {
  const missing = missingSmtpVars()
  if (missing.length) throw new EmailNotConfiguredError(missing)
  const port = Number(process.env.SMTP_PORT ?? 465)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!.trim(),
    port,
    // Porta 465 exige TLS implícito; 587 usa STARTTLS.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: { user: process.env.SMTP_USER!.trim(), pass: process.env.SMTP_PASSWORD! },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  })
}

export async function sendEmail(input: { to: string; subject: string; html: string; text: string }) {
  try {
    const client = transporter()
    const info = await client.sendMail({
      from,
      replyTo: process.env.EMAIL_REPLY_TO ?? 'suporte@glabcursos.com.br',
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    })
    if (info.rejected?.length) throw new Error(`Destinatário recusado pelo servidor: ${info.rejected.join(', ')}`)
    return { delivered: true as const, messageId: info.messageId }
  } catch (error) {
    // Falha silenciosa era a causa de nenhum e-mail chegar: o erro precisa
    // aparecer no log e ser propagado para quem chamou.
    console.error('Falha ao enviar e-mail', {
      subject: input.subject,
      to: input.to,
      missingVars: error instanceof EmailNotConfiguredError ? error.missing : undefined,
      code: (error as { code?: string }).code,
      responseCode: (error as { responseCode?: number }).responseCode,
      message: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}


/**
 * Diagnóstico do SMTP para o painel admin. Nunca retorna a senha:
 * apenas quais variáveis faltam e o erro exato devolvido pelo servidor.
 */
export async function checkEmailSetup(sendTestTo?: string) {
  const missing = missingSmtpVars()
  const port = Number(process.env.SMTP_PORT ?? 465)
  const config = {
    host: process.env.SMTP_HOST?.trim() ?? null,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    user: process.env.SMTP_USER?.trim() ?? null,
    from,
    replyTo: process.env.EMAIL_REPLY_TO ?? 'suporte@glabcursos.com.br',
    passwordConfigured: Boolean(process.env.SMTP_PASSWORD),
  }
  if (missing.length) return { ok: false as const, missing, config, stage: 'CONFIG' as const }

  try {
    await transporter().verify()
  } catch (error) {
    return {
      ok: false as const,
      missing,
      config,
      stage: 'CONNECTION' as const,
      error: {
        code: (error as { code?: string }).code ?? null,
        responseCode: (error as { responseCode?: number }).responseCode ?? null,
        message: error instanceof Error ? error.message : String(error),
      },
    }
  }

  if (!sendTestTo) return { ok: true as const, missing, config, stage: 'VERIFIED' as const }

  try {
    const result = await sendEmail({
      to: sendTestTo,
      subject: 'Teste de envio — G•Lab Cursos',
      html: emailLayout({ eyebrow: 'Diagnóstico', title: 'Envio funcionando', preview: 'Teste de envio do G•Lab.', body: '<p>Se você recebeu esta mensagem, o envio de e-mails está operacional.</p>' }),
      text: 'Se você recebeu esta mensagem, o envio de e-mails está operacional.',
    })
    return { ok: true as const, missing, config, stage: 'SENT' as const, messageId: result.messageId }
  } catch (error) {
    return {
      ok: false as const,
      missing,
      config,
      stage: 'SEND' as const,
      error: {
        code: (error as { code?: string }).code ?? null,
        responseCode: (error as { responseCode?: number }).responseCode ?? null,
        message: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export async function sendVerificationEmail({ email, name, url }: { email: string; name: string; url: string }) {
  const safeName = escapeHtml(name || 'aluno')
  const title = 'Confirme seu e-mail'
  const body = `<p>Olá, ${safeName}.</p><p>Seu cadastro foi realizado com sucesso.</p><p>Para concluir a criação da sua conta e liberar o acesso à plataforma, confirme seu endereço de e-mail.</p>`
  const securityMessage = 'Este link é exclusivo para sua conta e expira por segurança.<br>Se você não realizou este cadastro, pode ignorar esta mensagem.'
  return sendEmail({ to: email, subject: 'Confirme seu e-mail — G•Lab Cursos', html: emailLayout({ eyebrow: 'Ativação de conta', title, preview: 'Falta apenas confirmar seu e-mail para ativar sua conta G•Lab.', body, ctaLabel: 'Confirmar meu e-mail', ctaUrl: url, securityMessage }), text: textVersion(title, body, url) })
}

export async function sendResetPasswordEmail({ email, name, url }: { email: string; name: string; url: string }) {
  const safeName = escapeHtml(name || 'aluno')
  const title = 'Redefina sua senha'
  const body = `<p>Olá, ${safeName}.</p><p>Recebemos uma solicitação para criar uma nova senha para sua conta G-LAB.</p><p>Clique no botão abaixo para continuar. Sua senha atual não será alterada até que você conclua o processo.</p>`
  const securityMessage = 'Se você não solicitou a redefinição, não clique no botão.<br>Sua senha atual continuará válida.'
  return sendEmail({ to: email, subject: 'Redefina sua senha — G•Lab Cursos', html: emailLayout({ eyebrow: 'Segurança da conta', title, preview: 'Recebemos uma solicitação para redefinir sua senha.', body, ctaLabel: 'Criar nova senha', ctaUrl: url, securityMessage }), text: textVersion(title, body, url) })
}

export async function sendAuthenticationCodeEmail({ email, code, expiresIn = '10 minutos' }: { email: string; code: string; expiresIn?: string }) {
  const title = 'Confirme que é você'
  const body = '<p>Use o código abaixo para concluir seu acesso ao G-LAB Cursos.</p><p>Não compartilhe este código com outras pessoas.</p>'
  const codeBlock = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;background:#080c11;border:1px solid #263442;border-radius:12px"><tr><td align="center" style="padding:25px 20px"><div style="color:#7f8b98;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:11px">Código de acesso</div><div style="color:#ffffff;font-size:36px;line-height:1;font-weight:800;letter-spacing:9px">${escapeHtml(code)}</div><div style="margin-top:13px;color:#5faed8;font-size:11px">Expira em ${escapeHtml(expiresIn)}</div></td></tr></table>`
  const securityMessage = 'A equipe G-LAB nunca solicitará seu código de autenticação por WhatsApp, telefone ou mensagem privada.'
  return sendEmail({ to: email, subject: 'Seu código de acesso — G•Lab Cursos', html: emailLayout({ eyebrow: 'Verificação', title, preview: 'Use o código para concluir seu acesso ao G-LAB Cursos.', body, codeBlock, ctaLabel: 'Acessar G-LAB', ctaUrl: appUrl, securityMessage }), text: textVersion(title, body) })
}

export async function sendPasswordChangedEmail({ email, name }: { email: string; name: string }) {
  const safeName = escapeHtml(name || 'aluno')
  const title = 'Senha atualizada com sucesso'
  const body = `<p>Olá, ${safeName}.</p><p>A senha da sua conta foi atualizada com sucesso.</p><p>Se você realizou essa alteração, nenhuma outra ação é necessária.</p>`
  const securityMessage = 'Não reconhece esta alteração?<br>Redefina sua senha imediatamente e revise a segurança da sua conta.'
  return sendEmail({ to: email, subject: 'Sua senha foi alterada — G•Lab Cursos', html: emailLayout({ eyebrow: 'Segurança', title, preview: 'A senha da sua conta G•Lab foi alterada.', body, ctaLabel: 'Acessar minha conta', ctaUrl: `${appUrl}/sign-in`, securityMessage }), text: textVersion(title, body, `${appUrl}/sign-in`) })
}

export async function sendPurchaseApprovedEmail({ email, name, courseName }: { email: string; name: string; courseName: string }) {
  const safeName = escapeHtml(name || 'aluno'); const safeCourse = escapeHtml(courseName)
  const title = 'Pagamento confirmado. Sua formação está liberada.'
  const body = `<p>Olá, ${safeName}.</p><p>Seu pagamento de <strong>${safeCourse}</strong> foi confirmado e o acesso já está na sua biblioteca G‑LAB.</p><p>Entre na plataforma para começar. Seu acesso é pessoal e vinculado ao e-mail da compra.</p>`
  return sendEmail({ to: email, subject: `Acesso liberado · ${courseName}`, html: emailLayout({ eyebrow: 'Pagamento aprovado', title, preview: `Seu acesso a ${courseName} foi liberado.`, body, ctaLabel: 'Abrir minha biblioteca', ctaUrl: `${appUrl}/aluno` }), text: textVersion(title, body, `${appUrl}/aluno`) })
}
