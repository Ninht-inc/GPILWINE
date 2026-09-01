import { getSmtpConfig, isSmtpUsable, sendMail } from '@/lib/mailer'

/**
 * Sends a transactional email.
 *
 * Delivery order:
 *   1. cPanel / webmail SMTP  — when configured in /admin/email-settings (or via SMTP_* env vars)
 *   2. Abacus.AI notifications — legacy fallback, used only while SMTP is not set up
 *
 * The signature is unchanged so the form routes (contact, quotes, distributor,
 * stockist-request) don't need to know which transport ran.
 */
export async function sendNotificationEmail({
  notificationId,
  recipientEmail,
  subject,
  body,
  replyTo,
  senderAlias = 'GPIL Wines',
}: {
  notificationId: string
  recipientEmail: string
  subject: string
  body: string
  replyTo?: string
  senderAlias?: string
}): Promise<{ success: boolean; error?: string }> {
  // --- 1. SMTP -------------------------------------------------------------
  const smtp = await getSmtpConfig()
  if (isSmtpUsable(smtp)) {
    const result = await sendMail(
      { to: recipientEmail, subject, html: body, replyTo },
      smtp
    )
    if (result.success) return { success: true }
    // fall through to the legacy transport if SMTP send failed
    console.error('SMTP send failed, falling back to Abacus:', result.error)
  }

  // --- 2. Abacus.AI (legacy) --------------------------------------------------
  const appUrl = process.env.NEXTAUTH_URL || ''
  let senderEmail = 'noreply@mail.abacusai.app'
  try {
    senderEmail = `noreply@${new URL(appUrl).hostname}`
  } catch {}

  if (!process.env.ABACUSAI_API_KEY) {
    return { success: false, error: 'No email transport configured (set up SMTP in Email Settings)' }
  }

  try {
    const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.WEB_APP_ID,
        notification_id: notificationId,
        subject,
        body,
        is_html: true,
        recipient_email: recipientEmail,
        reply_to: replyTo,
        sender_email: senderEmail,
        sender_alias: senderAlias,
      }),
    })
    const result = await response.json()
    if (!result.success && !result.notification_disabled) {
      return { success: false, error: result.message || 'Email send failed' }
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export function gpilEmailTemplate(content: string) {
  return `
    <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F6;">
      <div style="background: #3B101A; padding: 24px 32px; text-align: center;">
        <h1 style="margin: 0; color: #C6A15B; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; letter-spacing: 2px;">GPIL</h1>
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
