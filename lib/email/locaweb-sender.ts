import nodemailer from 'nodemailer'

// Configuração do transporter SMTP Locaweb
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.LOCAWEB_SMTP_HOST || 'smtp.locaweb.com.br',
    port: parseInt(process.env.LOCAWEB_SMTP_PORT || '587'),
    secure: process.env.LOCAWEB_SMTP_SECURE === 'true', // true para 465, false para outros ports
    auth: {
      user: process.env.LOCAWEB_EMAIL || '',
      pass: process.env.LOCAWEB_PASSWORD || '',
    },
  })
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"G•Lab Cursos" <${process.env.LOCAWEB_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    throw error
  }
}

// Template: Confirmação de cadastro
export function getWelcomeEmailTemplate(name: string, email: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Bem-vindo ao G•Lab Cursos!</h2>
      <p>Olá <strong>${name}</strong>,</p>
      <p>Sua conta foi criada com sucesso!</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>Agora você pode acessar o painel administrativo com suas credenciais.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Acessar Painel
        </a>
      </div>
      <p style="color: #666; font-size: 12px;">Este é um email automático, por favor não responda.</p>
    </div>
  `
}

// Template: Reset de senha
export function getResetPasswordEmailTemplate(name: string, resetLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Redefinir Senha - G•Lab Cursos</h2>
      <p>Olá <strong>${name}</strong>,</p>
      <p>Você solicitou para redefinir sua senha. Clique no link abaixo para continuar:</p>
      <div style="margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Redefinir Senha
        </a>
      </div>
      <p style="color: #666; font-size: 12px;">Este link expira em 24 horas.</p>
      <p style="color: #666; font-size: 12px;">Se você não solicitou esta ação, ignore este email.</p>
    </div>
  `
}

// Template: Confirmação de alteração
export function getPasswordChangedEmailTemplate(name: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Senha Alterada com Sucesso</h2>
      <p>Olá <strong>${name}</strong>,</p>
      <p>Sua senha foi alterada com sucesso no G•Lab Cursos.</p>
      <p>Se não foi você que fez esta alteração, entre em contato conosco imediatamente.</p>
      <div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
        <p style="margin: 0; color: #666;"><strong>Contato:</strong> suporte@glab.com.br</p>
      </div>
    </div>
  `
}
