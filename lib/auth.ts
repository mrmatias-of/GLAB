import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/email'

const isDev = process.env.NODE_ENV === 'development'

/**
 * URL pública do site, sem barra final. Ignorada em desenvolvimento para
 * que o preview do v0 não tente autenticar contra o domínio de produção.
 */
const appUrl = isDev ? undefined : process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '')

/**
 * O domínio próprio precisa ser confiável, senão o Better Auth recusa
 * login e cadastro com "Invalid origin". Aceitamos www e apex porque a
 * Vercel serve ambos e o usuário pode chegar por qualquer um deles.
 */
function publicOrigins() {
  if (!appUrl) return []
  try {
    const { protocol, host } = new URL(appUrl)
    const bare = host.replace(/^www\./, '')
    return [`${protocol}//${bare}`, `${protocol}//www.${bare}`]
  } catch {
    return [appUrl]
  }
}

export const auth = betterAuth({
  database: pool,
  user: { modelName: 'glab_auth_user' },
  account: { modelName: 'glab_auth_account' },
  verification: { modelName: 'glab_auth_verification' },
  baseURL:
    process.env.BETTER_AUTH_URL ??
    // O domínio próprio vem antes das URLs da Vercel para que os links de
    // verificação e redefinição de senha apontem para glabcursos.com.br.
    appUrl ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ email: user.email, name: user.name, url })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ email: user.email, name: user.name, url })
    },
  },
  trustedOrigins: isDev
      ? [
          'http://localhost:3000',
          ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
          ...(process.env.V0_DEV_APP_URL ? [process.env.V0_DEV_APP_URL] : []),
          ...(process.env.V0_BUILD_URL ? [process.env.V0_BUILD_URL] : []),
          ...(process.env.V0_SANDBOX_URL ? [process.env.V0_SANDBOX_URL] : []),
        ]
      : [
          ...publicOrigins(),
          ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
          ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
            : []),
        ],
  session: {
    modelName: 'glab_auth_session',
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(isDev
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
