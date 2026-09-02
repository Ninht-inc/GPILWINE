export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { guard, SUPER_ONLY } from '@/lib/rbac'
import { sendNotificationEmail, gpilEmailTemplate } from '@/lib/email'

export async function POST(request: Request) {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const session = gate.session as any

  const body = await request.json().catch(() => ({}))
  const to: string = body?.to || session.user.email

  const result = await sendNotificationEmail({
    recipientEmail: to,
    subject: 'GPIL Wines — test email',
    body: gpilEmailTemplate(`
      <p>This is a test email from your GPIL Wines admin panel.</p>
      <p>If you are reading this, outgoing email (via Resend) is working.</p>
    `),
  })

  return NextResponse.json(
    result.success ? { success: true, to } : { success: false, stage: 'send', error: result.error },
    { status: 200 }
  )
}
