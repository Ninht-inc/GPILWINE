export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReferenceNumber } from '@/lib/reference-number'
import { sendNotificationEmail, gpilEmailTemplate, getAdminNotificationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    if (!data.firstName || !data.lastName || !data.businessEmail || !data.businessName || !data.country || !data.stateRegion) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const referenceNumber = generateReferenceNumber('D')
    const enquiry = await prisma.distributorEnquiry.create({
      data: {
        referenceNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        businessEmail: data.businessEmail,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        businessName: data.businessName,
        businessType: data.businessType || null,
        registrationNumber: data.registrationNumber || null,
        website: data.website || null,
        socialMediaUrl: data.socialMediaUrl || null,
        country: data.country,
        stateRegion: data.stateRegion,
        city: data.city || null,
        businessAddress: data.businessAddress || null,
        yearsInBusiness: data.yearsInBusiness || null,
        currentBrands: data.currentBrands || null,
        areasServed: data.areasServed || null,
        monthlyRequirement: data.monthlyRequirement || null,
        interestedProducts: data.interestedProducts || [],
        message: data.message || null,
        consent: data.consent || false,
      },
    })

    // Customer confirmation
    const custBody = gpilEmailTemplate(`
      <p>Hello ${data.firstName},</p>
      <p>Thank you for your interest in working with GPIL Wines.</p>
      <p>We've received the information you submitted regarding <strong>${data.businessName}</strong>.</p>
      <p><strong>Reference:</strong> ${referenceNumber}</p>
      <p>Our team will review your enquiry and contact you regarding the next steps if additional information is required or an opportunity is available.</p>
      <p>Warm regards,<br/><strong>GPIL Wines</strong></p>
    `)
    const custResult = await sendNotificationEmail({
      recipientEmail: data.businessEmail,
      subject: `Your GPIL Wines Partnership Enquiry Has Been Received`,
      body: custBody,
    })

    // Admin notification
    const adminBody = gpilEmailTemplate(`
      <h2 style="color:#641B2A;">New Distributor Enquiry — ${referenceNumber}</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Business:</strong> ${data.businessName}</p>
      <p><strong>Email:</strong> ${data.businessEmail}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      <p><strong>Type:</strong> ${data.businessType || 'Not specified'}</p>
      <p><strong>Location:</strong> ${[data.city, data.stateRegion, data.country].filter(Boolean).join(', ')}</p>
      ${data.interestedProducts?.length > 0 ? `<p><strong>Interested Products:</strong> ${data.interestedProducts.join(', ')}</p>` : ''}
      ${data.message ? `<div style="background:#f5f0e8;padding:16px;border-radius:8px;margin-top:12px;"><p style="margin:0;">${data.message}</p></div>` : ''}
    `)
    const adminResult = await sendNotificationEmail({
      recipientEmail: await getAdminNotificationEmail(),
      subject: `New Distributor Enquiry — ${referenceNumber} — ${data.businessName}`,
      body: adminBody,
      replyTo: data.businessEmail,
    })

    await prisma.distributorEnquiry.update({
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
    console.error('Distributor form error:', error)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}
