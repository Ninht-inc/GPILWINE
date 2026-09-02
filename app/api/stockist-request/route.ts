export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReferenceNumber } from '@/lib/reference-number'
import { sendNotificationEmail, gpilEmailTemplate, getAdminNotificationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    if (!data.fullName || !data.email || !data.phone || !data.country || !data.state) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const referenceNumber = generateReferenceNumber('S')
    const enquiry = await prisma.enquiry.create({
      data: {
        referenceNumber,
        type: 'STOCKIST_REQUEST',
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        whatsapp: data.phone,
        country: data.country,
        state: data.state,
        city: data.city || null,
        wineInterest: data.wineInterest || null,
        quantity: data.quantity || null,
        message: data.message || null,
        subject: 'Stockist Assistance Request',
      },
    })

    const custBody = gpilEmailTemplate(`
      <p>Hello ${data.fullName.split(' ')[0]},</p>
      <p>Thank you for contacting GPIL Wines.</p>
      <p>We've received your request to help find GPIL Wines near you.</p>
      <p><strong>Reference:</strong> ${referenceNumber}</p>
      <p>Our team will look into availability in your area and get back to you.</p>
      <p>Warm regards,<br/><strong>GPIL Wines</strong></p>
    `)
    await sendNotificationEmail({
      recipientEmail: data.email,
      subject: `We're Helping You Find GPIL Wines — ${referenceNumber}`,
      body: custBody,
    })

    const adminBody = gpilEmailTemplate(`
      <h2 style="color:#641B2A;">Stockist Assistance Request — ${referenceNumber}</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone/WhatsApp:</strong> ${data.phone}</p>
      <p><strong>Location:</strong> ${[data.city, data.state, data.country].filter(Boolean).join(', ')}</p>
      ${data.wineInterest ? `<p><strong>Wine Interest:</strong> ${data.wineInterest}</p>` : ''}
      ${data.quantity ? `<p><strong>Quantity:</strong> ${data.quantity}</p>` : ''}
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
    `)
    await sendNotificationEmail({
      recipientEmail: await getAdminNotificationEmail(),
      subject: `Stockist Request — ${referenceNumber} — ${data.fullName}`,
      body: adminBody,
      replyTo: data.email,
    })

    return NextResponse.json({ success: true, referenceNumber })
  } catch (error) {
    console.error('Stockist request error:', error)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
