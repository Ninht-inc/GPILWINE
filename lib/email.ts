import { Resend } from 'resend'
import { prisma } from '@/lib/db'

/**
 * Transactional email via the Resend API (https://resend.com).
 *
 * Vercel's serverless runtime blocks outbound SMTP, so all site email — form
 * confirmations, admin notifications, user invites and password resets — goes
 * out through Resend's HTTPS API instead.
 *
 * Requires RESEND_API_KEY in the environment. The sending domain (gpilwine.com)
 * must be verified in the Resend dashboard.
 */

const FROM = process.env.RESEND_FROM || 'GPIL WINE <admin@gpilwine.com>'

let client: Resend | null = null
function resend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!client) client = new Resend(process.env.RESEND_API_KEY)
  return client
}

/**
 * Where new form submissions are emailed. Reads the "Admin notification
 * recipient" set in /admin/email-settings, falling back to env / a default.
 */
export async function getAdminNotificationEmail(): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: 'mail_admin_recipient' } })
    const v = row?.value?.trim()
    if (v) return v
  } catch {
    // DB unreachable — fall through to env / default
  }
  return process.env.DEFAULT_ADMIN_NOTIFICATION_EMAIL || 'admin@gpilwine.com'
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Sends one transactional email. Returns { success, error } — never throws, so
 * a form submission is still recorded even when email delivery fails.
 */
export async function sendNotificationEmail({
  recipientEmail,
  subject,
  body,
  replyTo,
}: {
  recipientEmail: string
  subject: string
  body: string
  replyTo?: string
}): Promise<{ success: boolean; error?: string }> {
  const r = resend()
  if (!r) {
    console.error('[email] RESEND_API_KEY is not set — cannot send', { to: recipientEmail, subject })
    return { success: false, error: 'Email is not configured (RESEND_API_KEY missing)' }
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data, error } = await r.emails.send({
        from: FROM,
        to: recipientEmail,
        subject,
        html: body,
        replyTo,
      })

      if (error) {
        const status = (error as { statusCode?: number }).statusCode
        // Resend free tier ~2 req/s; forms send two emails back to back.
        if (status === 429 && attempt === 1) {
          await sleep(1200)
          continue
        }
        console.error('[email] Resend returned an error', { to: recipientEmail, subject, error })
        return { success: false, error: error.message || 'Resend send failed' }
      }

      console.log('[email] sent', { id: data?.id, to: recipientEmail, subject })
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (attempt === 1) {
        await sleep(800)
        continue
      }
      console.error('[email] Resend request threw', { to: recipientEmail, subject, message })
      return { success: false, error: message }
    }
  }

  return { success: false, error: 'Email send failed after retry' }
}

export function gpilEmailTemplate(content: string) {
  return `
    <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F6;">
      <div style="background: #3B101A; padding: 24px 32px; text-align: center;">
        <h1 style="margin: 0; color: #C6A15B; font-family: 'Plus Jakarta Sans', 'Montserrat', Arial, sans-serif; font-size: 24px; letter-spacing: 2px;">GPIL</h1>
        <p style="margin: 2px 0 0 0; color: #C6A15B; opacity: 0.8; font-size: 10px; letter-spacing: 3px; text-transform: uppercase;">Wines</p>
      </div>
      <div style="padding: 32px; color: #222222; line-height: 1.6;">
        ${content}
      </div>
      <div style="background: #3B101A; padding: 20px 32px; text-align: center;">
        <p style="margin: 0; color: #C6A15B; opacity: 0.6; font-size: 11px;">Please enjoy responsibly.</p>
        <p style="margin: 4px 0 0 0; color: #F4EBDD; opacity: 0.4; font-size: 10px;">© ${new Date().getFullYear()} GPIL Wines. All rights reserved.</p>
      </div>
    </div>
  `
}
