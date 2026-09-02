import nodemailer, { type Transporter } from 'nodemailer'
import { prisma } from '@/lib/db'

/**
 * SMTP configuration is stored in the SiteSetting table (editable from
 * /admin/email-settings) and falls back to environment variables so the
 * app keeps working before an admin has filled the form in.
 */
export type SmtpConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  fromEmail: string
  fromName: string
  enabled: boolean
  adminRecipient: string
}

const SETTING_KEYS = [
  'smtp_host',
  'smtp_port',
  'smtp_secure',
  'smtp_user',
  'smtp_password',
  'smtp_from_email',
  'smtp_from_name',
  'smtp_enabled',
  'mail_admin_recipient',
] as const

export async function getSmtpConfig(): Promise<SmtpConfig> {
  let settings: Record<string, string> = {}
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: SETTING_KEYS as unknown as string[] } } })
    settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  } catch {
    // DB unreachable — fall back entirely to env
  }

  const pick = (dbKey: string, envKey: string, fallback = '') =>
    (settings[dbKey] ?? process.env[envKey] ?? fallback).trim()

  const port = Number(pick('smtp_port', 'SMTP_PORT', '465')) || 465
  // Port 465 is implicit TLS (SMTPS); 587/25 use STARTTLS. This is fixed by
  // the port itself — no reason to let it be misconfigured separately.
  const secure = port === 465

  const host = pick('smtp_host', 'SMTP_HOST')
  const user = pick('smtp_user', 'SMTP_USER')
  const password = settings['smtp_password'] ?? process.env.SMTP_PASSWORD ?? ''
  const fromEmail = pick('smtp_from_email', 'SMTP_FROM', user)
  const fromName = pick('smtp_from_name', 'SMTP_FROM_NAME', 'GPIL Wines')

  const enabledRaw = settings['smtp_enabled'] ?? process.env.SMTP_ENABLED
  const enabled = enabledRaw != null ? enabledRaw === 'true' : Boolean(host && user && password)

  const adminRecipient = pick(
    'mail_admin_recipient',
    'DEFAULT_ADMIN_NOTIFICATION_EMAIL',
    'ninht.inc@gmail.com'
  )

  return { host, port, secure, user, password, fromEmail, fromName, enabled, adminRecipient }
}

export function isSmtpUsable(cfg: SmtpConfig): boolean {
  return cfg.enabled && Boolean(cfg.host && cfg.user && cfg.password && cfg.fromEmail)
}

function buildTransport(cfg: SmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    requireTLS: !cfg.secure, // enforce STARTTLS on 587/25
    auth: { user: cfg.user, pass: cfg.password },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
    tls: { minVersion: 'TLSv1.2' },
  })
}

export type SendResult = { success: boolean; error?: string; messageId?: string }

export async function sendMail(
  opts: { to: string; subject: string; html: string; replyTo?: string },
  cfgOverride?: SmtpConfig
): Promise<SendResult> {
  const cfg = cfgOverride ?? (await getSmtpConfig())
  if (!isSmtpUsable(cfg)) {
    return { success: false, error: 'SMTP is not configured' }
  }
  try {
    const info = await buildTransport(cfg).sendMail({
      from: `"${cfg.fromName}" <${cfg.fromEmail}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Opens a connection and authenticates without sending — used by the "test" button. */
export async function verifySmtp(cfgOverride?: SmtpConfig): Promise<SendResult> {
  const cfg = cfgOverride ?? (await getSmtpConfig())
  if (!cfg.host || !cfg.user || !cfg.password) {
    return { success: false, error: 'Host, username and password are required' }
  }
  try {
    await buildTransport(cfg).verify()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
