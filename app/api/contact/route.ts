export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReferenceNumber } from '@/lib/reference-number'
import { sendNotificationEmail, gpilEmailTemplate } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    if (!data.fullName || !data.email || !data.enquiryType || !data.subject || !data.message) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const referenceNumber = generateReferenceNumber('E')
    const enquiry = await prisma.enquiry.create({
      data: {
        referenceNumber,
        type: data.enquiryType,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    })

    // Customer confirmation
    const custBody = gpilEmailTemplate(`
      <p>Hello ${data.fullName.split(' ')[0]},</p>
      <p>Thank you for contacting GPIL Wines.</p>
      <p>We've received your enquiry regarding <strong>${data.subject}</strong> and it has been sent to the appropriate team.</p>
      <p>Your enquiry reference is: <strong>${referenceNumber}</strong></p>
      <p>A member of the GPIL Wines team will contact you regarding your request.</p>
      <p>Warm regards,<br/><strong>GPIL Wines</strong></p>
    `)
    const custResult = await sendNotificationEmail({
      recipientEmail: data.email,
      subject: `We've Received Your GPIL Wines Enquiry`,
      body: custBody,
    })

    // Admin notification
    const adminBody = gpilEmailTemplate(`
      <h2 style="color:#641B2A;">New Contact Enquiry — ${referenceNumber}</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      <p><strong>Type:</strong> ${data.enquiryType.replace('_', ' ')}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <div style="background:#f5f0e8;padding:16px;border-radius:8px;margin-top:12px;">
        <p style="margin:0;">${data.message}</p>
      </div>
    `)
    const adminResult = await sendNotificationEmail({
      recipientEmail: process.env.DEFAULT_ADMIN_NOTIFICATION_EMAIL || 'ninht.inc@gmail.com',
      subject: `New Contact Enquiry — ${referenceNumber} — ${data.fullName}`,
      body: adminBody,
      replyTo: data.email,
    })

    await prisma.enquiry.update({
      where: { id: enquiry.id },
      data: {
        emailDeliveryStatus: custResult.success ? 'sent' : 'failed',
        emailDeliveryError: custResult.error || null,
        adminEmailStatus: adminResult.success ? 'sent' : 'failed',
        adminEmailError: adminResult.error || null,
      },
    })

    return NextResponse.json({ success: true, referenceNumber })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}
