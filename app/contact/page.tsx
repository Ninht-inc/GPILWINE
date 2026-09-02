export const dynamic = 'force-dynamic'

import { PublicLayout } from '@/components/public-layout'
import { PageHero } from '@/components/page-hero'
import { ContactClient } from '@/components/contact/contact-client'

export const metadata = {
  title: 'Contact Us | GPIL Wines',
  description: 'Get in touch with GPIL Wines. We\'d love to hear from you — whether it\'s a question about our wines, a business enquiry, or just to say hello.',
}

export default function ContactPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="GET IN TOUCH"
        title="Contact Us"
        description="Have a question about our wines, a business enquiry, or just want to say hello? We'd love to hear from you."
        backgroundImage="https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/heroes/contact"
      />
      <ContactClient />
    </PublicLayout>
  )
}
