import 'server-only'

import nodemailer from 'nodemailer'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://glabcursos.com.br').replace(/\/$/, '')
const from = process.env.EMAIL_FROM ?? 'G-LAB <no-reply@glabcursos.com.br>'

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]!)
}

function emailLayout({ eyebrow, title, preview, body, ctaLabel, ctaUrl }: { eyebrow: string; title: string; preview: string; body: string; ctaLabel?: string; ctaUrl?: string }) {
  const logoUrl = `${appUrl}/logo-glab-neon-transparent.png`
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#050712;color:#eef5ff;font-family:Arial,Helvetica,sans-serif"><span style="display:none!important;max-height:0;overflow:hidden">${preview}</span><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#050712;padding:32px 12px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:620px;background:#0a0d19;border:1px solid #22314d;border-radius:24px;overflow:hidden"><tr><td style="padding:34px 38px 22px;background:linear-gradient(135deg,#0d2a55,#121126)"><img src="${logoUrl}" alt="G-LAB" width="54" height="54" style="display:block;object-fit:contain"><p style="margin:24px 0 0;color:#7de8ff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${eyebrow}</p><h1 style="margin:12px 0 0;color:#ffffff;font-size:30px;line-height:1.15">${title}</h1></td></tr><tr><td style="padding:34px 38px;color:#c8d4e8;font-size:16px;line-height:1.65">${body}${ctaLabel && ctaUrl ? `<p style="margin:30px 0"><a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(90deg,#23d9f4,#3986ff);border-radius:999px;color:#04101d;font-weight:800;padding:15px 23px;text-decoration:none">${ctaLabel}</a></p><p style="font-size:12px;color:#8290a8;word-break:break-word">Se o botão não abrir, copie este link: ${ctaUrl}</p>` : ''}</td></tr><tr><td style="padding:22px 38px;border-top:1px solid #1a263b;color:#73819a;font-size:12px;line-height:1.5">G-LAB Cursos · Educação técnica para a bancada real.<br>Esta é uma mensagem automática. Precisa de ajuda? Fale com <a href="mailto:suporte@glabcursos.com.br" style="color:#7de8ff">suporte@glabcursos.com.br</a>.</td></tr></table></td></tr></table></body></html>`
}

function textVersion(title: string, body: string, ctaUrl?: string) {
  return `G-LAB\n\n${title}\n\n${body.replace(/<[^>]*>/g, '')}${ctaUrl ? `\n\n${ctaUrl}` : ''}\n\nSuporte: suporte@glabcursos.com.br`
}

function transporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  if (!host || !user || !pass) return null
  return nodemailer.createTransport({ host, port: Number(process.env.SMTP_PORT ?? 465), secure: (process.env.SMTP_SECURE ?? 'true') === 'true', auth: { user, pass } })
}

export async function sendEmail(input: { to: string; subject: string; html: string; text: string }) {
  const client = transporter()
  if (!client) {
    console.warn('[email] SMTP não configurado; e-mail não enviado.', { subject: input.subject })
    return { delivered: false as const, reason: 'SMTP_NOT_CONFIGURED' }
  }
  await client.sendMail({ from, replyTo: process.env.EMAIL_REPLY_TO ?? 'suporte@glabcursos.com.br', to: input.to, subject: input.subject, html: input.html, text: input.text })
  return { delivered: true as const }
}

export async function sendVerificationEmail({ email, name, url }: { email: string; name: string; url: string }) {
  const safeName = escapeHtml(name || 'aluno')
  const title = 'Confirme seu e-mail para entrar na G-LAB'
  const body = `<p>Olá, ${safeName}.</p><p>Para proteger sua conta e liberar sua área de aluno, confirme que este endereço de e-mail é seu.</p><p>O link é pessoal e expira por segurança. Se você não criou uma conta G‑LAB, ignore esta mensagem.</p>`
  return sendEmail({ to: email, subject: 'Confirme seu e-mail · G-LAB', html: emailLayout({ eyebrow: 'Confirmação de conta', title, preview: 'Confirme seu e-mail para ativar sua conta G-LAB.', body, ctaLabel: 'Confirmar meu e-mail', ctaUrl: url }), text: textVersion(title, body, url) })
}

export async function sendResetPasswordEmail({ email, name, url }: { email: string; name: string; url: string }) {
  const safeName = escapeHtml(name || 'aluno')
  const title = 'Redefina sua senha com segurança'
  const body = `<p>Olá, ${safeName}.</p><p>Recebemos uma solicitação para redefinir a senha da sua conta G‑LAB.</p><p>Use o botão abaixo para escolher uma nova senha. Se não foi você, ignore este e-mail — sua senha atual continua protegida.</p>`
  return sendEmail({ to: email, subject: 'Redefinição de senha · G-LAB', html: emailLayout({ eyebrow: 'Segurança da conta', title, preview: 'Use este link para redefinir sua senha G-LAB.', body, ctaLabel: 'Redefinir minha senha', ctaUrl: url }), text: textVersion(title, body, url) })
}

export async function sendPurchaseApprovedEmail({ email, name, courseName }: { email: string; name: string; courseName: string }) {
  const safeName = escapeHtml(name || 'aluno'); const safeCourse = escapeHtml(courseName)
  const title = 'Pagamento confirmado. Sua formação está liberada.'
  const body = `<p>Olá, ${safeName}.</p><p>Seu pagamento de <strong>${safeCourse}</strong> foi confirmado e o acesso já está na sua biblioteca G‑LAB.</p><p>Entre na plataforma para começar. Seu acesso é pessoal e vinculado ao e-mail da compra.</p>`
  return sendEmail({ to: email, subject: `Acesso liberado · ${courseName}`, html: emailLayout({ eyebrow: 'Pagamento aprovado', title, preview: `Seu acesso a ${courseName} foi liberado.`, body, ctaLabel: 'Abrir minha biblioteca', ctaUrl: `${appUrl}/aluno` }), text: textVersion(title, body, `${appUrl}/aluno`) })
}
