import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Don't wrap login page in admin shell
  if (!session) {
    return <>{children}</>
  }

  return <AdminShell user={session.user}>{children}</AdminShell>
}
