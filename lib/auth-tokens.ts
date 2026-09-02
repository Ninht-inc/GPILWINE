import { randomBytes } from 'crypto'
import { prisma } from '@/lib/db'
import { sendNotificationEmail, gpilEmailTemplate } from '@/lib/email'

const EXPIRY_HOURS = { invite: 24 * 7, reset: 1 } as const

export type TokenPurpose = keyof typeof EXPIRY_HOURS

function baseUrl() {
  return (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export async function createAuthToken(userId: string, purpose: TokenPurpose): Promise<string> {
  // invalidate any outstanding tokens of the same purpose for this user
  await prisma.authToken.deleteMany({ where: { userId, purpose, usedAt: null } })

  const token = randomBytes(32).toString('hex')
  await prisma.authToken.create({
    data: {
      token,
      userId,
      purpose,
      expiresAt: new Date(Date.now() + EXPIRY_HOURS[purpose] * 3600 * 1000),
    },
  })
  return token
}

/** Returns the userId if the token is valid & unused, else null. Does NOT consume it. */
export async function verifyAuthToken(token: string, purpose: TokenPurpose): Promise<string | null> {
  const row = await prisma.authToken.findUnique({ where: { token } })
  if (!row || row.purpose !== purpose || row.usedAt || row.expiresAt < new Date()) return null
  return row.userId
}

export async function consumeAuthToken(token: string, purpose: TokenPurpose): Promise<string | null> {
  const userId = await verifyAuthToken(token, purpose)
  if (!userId) return null
  await prisma.authToken.update({ where: { token }, data: { usedAt: new Date() } })
  return userId
}

export async function sendInviteEmail(opts: { email: string; name?: string | null; token: string; inviterName?: string | null }) {
  const link = `${baseUrl()}/admin/accept-invite?token=${opts.token}`
  return sendNotificationEmail({
    recipientEmail: opts.email,
    subject: 'You have been invited to the GPIL Wines admin',
    body: gpilEmailTemplate(`
      <p>Hello${opts.name ? ` ${opts.name}` : ''},</p>
      <p>${opts.inviterName ? `${opts.inviterName} has` : 'You have been'} invited you to help manage the GPIL Wines website.</p>
      <p>Click below to set your password and get started. This link expires in 7 days.</p>
      <p style="margin:24px 0;">
        <a href="${link}" style="background:#641B2A;color:#F4EBDD;padding:12px 24px;border-radius:6px;text-decoration:none;">Accept invitation</a>
      </p>
      <p style="color:#888;font-size:12px;">If the button doesn't work, paste this into your browser:<br/>${link}</p>
    `),
  })
}

export async function sendResetEmail(opts: { email: string; name?: string | null; token: string }) {
  const link = `${baseUrl()}/admin/reset-password?token=${opts.token}`
  return sendNotificationEmail({
    recipientEmail: opts.email,
    subject: 'Reset your GPIL Wines admin password',
    body: gpilEmailTemplate(`
      <p>Hello${opts.name ? ` ${opts.name}` : ''},</p>
      <p>We received a request to reset your admin password. This link expires in 1 hour.</p>
      <p style="margin:24px 0;">
        <a href="${link}" style="background:#641B2A;color:#F4EBDD;padding:12px 24px;border-radius:6px;text-decoration:none;">Reset password</a>
      </p>
      <p style="color:#888;font-size:12px;">If you didn't request this, you can ignore this email.<br/>${link}</p>
    `),
  })
}
