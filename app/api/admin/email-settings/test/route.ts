export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { guard, SUPER_ONLY } from '@/lib/rbac'
import { getSmtpConfig, verifySmtp, sendMail } from '@/lib/mailer'
import { gpilEmailTemplate } from '@/lib/email'

export async function POST(request: Request) {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const session = gate.session as any

  const body = await request.json().catch(() => ({}))
  const to: string = body?.to || session.user.email

  const cfg = await getSmtpConfig()

  const verify = await verifySmtp(cfg)
  if (!verify.success) {
    return NextResponse.json({ success: false, stage: 'connect', error: verify.error }, { status: 200 })
  }

  const send = await sendMail(
    {
      to,
      subject: 'GPIL Wines — SMTP test email',
      html: gpilEmailTemplate(`
        <p>This is a test email from your GPIL Wines admin panel.</p>
        <p>If you are reading this, outgoing email over SMTP is working.</p>
        <p style="color:#888;font-size:12px;">Host: ${cfg.host} · Port: ${cfg.port} · Secure: ${cfg.secure}</p>
      `),
    },
    cfg
  )

  return NextResponse.json(
    send.success
      ? { success: true, to }
      : { success: false, stage: 'send', error: send.error },
    { status: 200 }
  )
}
