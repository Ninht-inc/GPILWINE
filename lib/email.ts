import { getSmtpConfig, isSmtpUsable, sendMail } from '@/lib/mailer'

/**
 * Sends a transactional email over cPanel / webmail SMTP.
 * Configure the connection in the admin panel at /admin/email-settings
 * (or via SMTP_* env vars).
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
  const smtp = await getSmtpConfig()
  if (!isSmtpUsable(smtp)) {
    return { success: false, error: 'Email is not configured — set up SMTP in Email Settings' }
  }
  const result = await sendMail({ to: recipientEmail, subject, html: body, replyTo }, smtp)
  return result.success ? { success: true } : { success: false, error: result.error }
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
