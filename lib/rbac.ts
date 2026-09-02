import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export type Role = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'ENQUIRY_MANAGER'

export const ALL_ROLES: Role[] = ['SUPER_ADMIN', 'CONTENT_ADMIN', 'ENQUIRY_MANAGER']
export const CONTENT_ROLES: Role[] = ['SUPER_ADMIN', 'CONTENT_ADMIN']
export const ENQUIRY_ROLES: Role[] = ['SUPER_ADMIN', 'ENQUIRY_MANAGER']
export const SUPER_ONLY: Role[] = ['SUPER_ADMIN']

type Session = Awaited<ReturnType<typeof getServerSession>>

export function roleOf(session: Session): Role | null {
  const r = (session as any)?.user?.role
  return ALL_ROLES.includes(r) ? r : null
}

/**
 * Guards an API route. Returns `{ session }` when allowed, or `{ error }`
 * with a ready-to-return NextResponse when not.
 *
 *   const gate = await guard(CONTENT_ROLES)
 *   if ('error' in gate) return gate.error
 *   // ...use gate.session
 */
export async function guard(roles: Role[] = ALL_ROLES) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const role = roleOf(session)
  if (!role || !roles.includes(role)) {
    return { error: NextResponse.json({ error: 'You do not have permission to do that' }, { status: 403 }) }
  }
  return { session }
}
