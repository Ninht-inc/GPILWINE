export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReferenceNumber } from '@/lib/reference-number'
import { sendNotificationEmail, gpilEmailTemplate } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.fullName || !data.email || !data.phone || !data.country || !data.state || !data.preferredContact) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Wine selection is required' }, { status: 400 })
    }
    if (!data.consent) {
      return NextResponse.json({ error: 'Consent is required' }, { status: 400 })
    }

    const referenceNumber = generateReferenceNumber('Q')

    // Save to database first
    const quote = await prisma.quote.create({
      data: {
        referenceNumber,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp || null,
        preferredContact: data.preferredContact,
        country: data.country,
        state: data.state,
        city: data.city || null,
        deliveryLocation: data.deliveryLocation || null,
        fullAddress: data.fullAddress || null,
        occasion: data.occasion || null,
        requiredDate: data.requiredDate || null,
        message: data.message || null,
        consent: true,
        items: {
          create: data.items.map((item: { wineId: string; wineName: string; bottleSize?: string; quantity: number }) => ({
            wineId: item.wineId,
            wineName: item.wineName,
            bottleSize: item.bottleSize || '750 ml',
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    // Build product list for emails
    const productList = quote.items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i.wineName}</td><td style="padding:8px;border-bottom:1px solid #eee;">${i.bottleSize || '750 ml'}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td></tr>`).join('')

    // Send customer confirmation
    const customerBody = gpilEmailTemplate(`
      <p>Hello ${data.fullName.split(' ')[0]},</p>
      <p>Thank you for your interest in GPIL Wines.</p>
      <p>We have received your wine selection and quotation request.</p>
      <p><strong>Reference:</strong> ${referenceNumber}</p>
      <h3 style="color:#641B2A;margin-top:20px;">Your Selection</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr style="background:#f5f0e8;"><th style="padding:8px;text-align:left;">Wine</th><th style="padding:8px;text-align:left;">Size</th><th style="padding:8px;text-align:center;">Qty</th></tr></thead>
        <tbody>${productList}</tbody>
      </table>
      <p style="margin-top:20px;">Our team will review your request and contact you using your preferred contact method regarding availability, quotation details and the next steps.</p>
      <p>If you need to add anything to your request, simply reply to this email and include your reference number.</p>
      <p>Warm regards,<br/><strong>GPIL Wines</strong></p>
    `)

    const custResult = await sendNotificationEmail({
      notificationId: process.env.NOTIF_ID_QUOTE_REQUEST_CUSTOMER_CONFIRMATION || '',
      recipientEmail: data.email,
      subject: `We've Received Your GPIL Wines Enquiry — ${referenceNumber}`,
      body: customerBody,
    })

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        emailDeliveryStatus: custResult.success ? 'sent' : 'failed',
        emailDeliveryError: custResult.error || null,
      },
    })

    // Send admin notification
    const adminBody = gpilEmailTemplate(`
      <h2 style="color:#641B2A;">New Quote Request — ${referenceNumber}</h2>
      <p><strong>Customer:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.whatsapp ? `<p><strong>WhatsApp:</strong> ${data.whatsapp}</p>` : ''}
      <p><strong>Preferred Contact:</strong> ${data.preferredContact}</p>
      <p><strong>Location:</strong> ${[data.city, data.state, data.country].filter(Boolean).join(', ')}</p>
      ${data.fullAddress ? `<p><strong>Address:</strong> ${data.fullAddress}</p>` : ''}
      ${data.occasion ? `<p><strong>Occasion:</strong> ${data.occasion}</p>` : ''}
      ${data.requiredDate ? `<p><strong>Required Date:</strong> ${data.requiredDate}</p>` : ''}
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
      <h3 style="color:#641B2A;margin-top:20px;">Wine Selection</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr style="background:#f5f0e8;"><th style="padding:8px;text-align:left;">Wine</th><th style="padding:8px;text-align:left;">Size</th><th style="padding:8px;text-align:center;">Qty</th></tr></thead>
        <tbody>${productList}</tbody>
      </table>
    `)

    const adminResult = await sendNotificationEmail({
      notificationId: process.env.NOTIF_ID_QUOTE_REQUEST_ADMIN || '',
      recipientEmail: process.env.DEFAULT_ADMIN_NOTIFICATION_EMAIL || 'ninht.inc@gmail.com',
      subject: `New Quote Request — ${referenceNumber} — ${data.fullName}`,
      body: adminBody,
      replyTo: data.email,
    })

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        adminEmailStatus: adminResult.success ? 'sent' : 'failed',
        adminEmailError: adminResult.error || null,
      },
    })

    return NextResponse.json({ success: true, referenceNumber })
  } catch (error) {
    console.error('Quote submission error:', error)
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 })
  }
}
