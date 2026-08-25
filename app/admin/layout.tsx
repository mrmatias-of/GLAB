import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'
import { currentPlatformUser, isPlatformAdmin } from '@/lib/learning-platform'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await currentPlatformUser()

  if (!session) redirect('/sign-in')
  if (!isPlatformAdmin(session.email)) redirect('/aluno')

  return <AdminShell>{children}</AdminShell>
}
