import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Bootstrap admin — only created if it doesn't already exist. Override the
  // credentials with SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (adminEmail && adminPassword) {
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (!existing) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: await bcrypt.hash(adminPassword, 12),
          name: 'Admin',
          role: 'SUPER_ADMIN',
        },
      })
      console.log(`Created admin ${adminEmail}`)
    }
  }

  // GPIL Natural Sweet Red
  await prisma.wine.upsert({
    where: { slug: 'gpil-natural-sweet-red' },
    update: {},
    create: {
      name: 'GPIL Natural Sweet Red',
      slug: 'gpil-natural-sweet-red',
      category: 'Sweet Red Wine',
      tagline: 'Smooth. Fruity. Naturally Enjoyable.',
      shortDescription: 'A smooth, fruity and approachable South African sweet red wine, crafted for easy enjoyment. GPIL Natural Sweet Red offers ripe red-berry aromas, a soft rounded palate and a pleasantly sweet finish.',
      fullDescription: 'GPIL Natural Sweet Red is a well-balanced South African sweet red wine from the Western Cape. It opens with inviting aromas of ripe red berries and delivers a smooth, rounded palate with generous fruit character and a soft finish. Its approachable style makes it an excellent choice for relaxed evenings, celebrations, social gatherings and meals with family and friends.',
      status: 'PUBLISHED',
      featured: true,
      displayOrder: 1,
      country: 'South Africa',
      region: 'Western Cape',
      wineOrigin: 'Western Cape, South Africa',
      bottleSize: '750 ml',
      alcohol: '13% Alc/Vol',
      producer: 'Zidela Wines',
      producerAddress: '2nd Floor Zidela House, 30 Techno Avenue, Stellenbosch, 7600, South Africa',
      madeFor: 'Bukhosi Royal Wines, Vryguns Road, Paarl, 7630',
      nigerianImporter: 'Global Ppraizze Investment Limited',
      nafdacRegistration: 'A5-102151',
      containsSulphites: 'A874',
      wineDesignation: 'W.O. Western Cape Wine of South Africa',
      colour: 'Deep ruby red with attractive berry-toned highlights.',
      aroma: 'Ripe red berries with suggested notes of strawberry, raspberry and red cherry.',
      palate: 'Smooth, rounded and fruit-forward, with a pleasant sweetness and ripe berry character.',
      body: 'Medium-bodied',
      sweetness: 'Sweet',
      acidity: 'Moderate and refreshing',
      finish: 'Soft, smooth and pleasantly fruity',
      foodPairings: ['Jollof rice', 'Suya', 'Grilled chicken', 'Barbecued meats', 'Pepper chicken', 'Mildly spiced beef dishes', 'Pizza', 'Pasta with tomato-based sauces', 'Burgers', 'Soft cheeses', 'Light desserts', 'Fresh berries', 'Fruit-based desserts'],
      servingTemp: '10\u201314\u00b0C',
      servingInstructions: 'Chill before serving and allow the wine to sit briefly in the glass before drinking.',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Consume within 3 days after opening.',
      idealOccasions: ['Dinner with family', 'Weekends', 'Birthdays', 'Weddings', 'Parties', 'Date nights', 'Celebrations', 'Casual entertaining', 'Gifting'],
      mainImage: 'https://s3-media0.fl.yelpcdn.com/bphoto/nPWIXLixTPZooi3nTZHpOw/1000s.jpg',
      allowQuoteRequests: true,
      comingSoon: false,
      seoTitle: 'GPIL Natural Sweet Red Wine | South African Sweet Red',
      metaDescription: 'Discover GPIL Natural Sweet Red, a smooth and fruity South African sweet red wine with ripe red-berry aromas and a soft, rounded finish. Available in Nigeria.',
    },
  })

  // GPIL Pinotage 2025
  await prisma.wine.upsert({
    where: { slug: 'gpil-pinotage-2025' },
    update: {},
    create: {
      name: 'GPIL Pinotage 2025',
      slug: 'gpil-pinotage-2025',
      category: 'Pinotage / Red Wine',
      vintage: '2025',
      tagline: 'Discover the Character of South African Pinotage.',
      shortDescription: 'A smooth and well-balanced South African Pinotage with ripe red-berry aromas, a rounded palate and a soft finish. GPIL Pinotage 2025 brings approachable South African character to the table.',
      fullDescription: 'GPIL Pinotage 2025 celebrates the character of Pinotage from South Africa\'s Western Cape. It presents inviting aromas of ripe red berries followed by a smooth, rounded palate and a soft finish. Approachable and versatile, it is well suited to hearty meals, grilled foods and relaxed occasions where good food and good wine come together.',
      status: 'PUBLISHED',
      featured: true,
      displayOrder: 2,
      country: 'South Africa',
      region: 'Western Cape',
      wineOrigin: 'Western Cape, South Africa',
      bottleSize: '750 ml',
      alcohol: '13.5% Alc/Vol',
      producer: 'Zidela Wines',
      producerAddress: '2nd Floor Zidela House, 30 Techno Avenue, Stellenbosch, 7600, South Africa',
      madeFor: 'Bukhosi Royal Wines, Vryguns Road, Paarl, 7630',
      nigerianImporter: 'Global Ppraizze Investment Limited',
      nafdacRegistration: 'A5-102152',
      containsSulphites: 'A874',
      wineDesignation: 'W.O. Western Cape Wine of South Africa',
      colour: 'Rich ruby red with deep red-purple tones.',
      aroma: 'Ripe red berries with suggested notes of cherry, plum and subtle dark-fruit character.',
      palate: 'Smooth and rounded, with ripe berry and plum-like fruit flavours and a gentle, satisfying texture.',
      body: 'Medium-bodied',
      acidity: 'Moderate',
      finish: 'Soft, smooth and lingering',
      foodPairings: ['Steak', 'Grilled beef', 'Lamb', 'Roast meat', 'Barbecue', 'Suya', 'Peppered beef', 'Grilled chicken', 'Burgers', 'Spicy Nigerian stews', 'Jollof rice with grilled meat', 'Rich tomato-based dishes', 'Mature cheeses'],
      servingTemp: '14\u201318\u00b0C',
      servingInstructions: 'Allow the wine to breathe briefly after opening and serve in a red-wine glass.',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Consume within 3 days after opening.',
      idealOccasions: ['Business dinners', 'Dinner parties', 'Steak nights', 'Barbecues', 'Celebrations', 'Weddings', 'Weekend gatherings', 'Gifting', 'Restaurant dining', 'Special occasions'],
      mainImage: 'https://placehold.co/1200x600/e2e8f0/1e293b?text=Main_image_of_a_bottle_of_GPIL_Pinotage_2025_South',
      allowQuoteRequests: true,
      comingSoon: false,
      seoTitle: 'GPIL Pinotage 2025 | South African Pinotage Wine',
      metaDescription: 'Discover GPIL Pinotage 2025, a smooth and well-balanced South African Pinotage with ripe red-berry aromas and a soft, rounded finish.',
    },
  })

  // Coming Soon wines
  await prisma.wine.upsert({
    where: { slug: 'gpil-sweet-white' },
    update: {},
    create: {
      name: 'GPIL Sweet White',
      slug: 'gpil-sweet-white',
      status: 'COMING_SOON',
      comingSoon: true,
      displayOrder: 3,
      mainImage: 'https://s3-media0.fl.yelpcdn.com/bphoto/bFjN4ztHf5GOg6uePrTOxg/1000s.jpg',
      allowQuoteRequests: false,
    },
  })

  await prisma.wine.upsert({
    where: { slug: 'gpil-executive-rose' },
    update: {},
    create: {
      name: 'GPIL Executive Ros\u00e9',
      slug: 'gpil-executive-rose',
      status: 'COMING_SOON',
      comingSoon: true,
      displayOrder: 4,
      mainImage: 'https://ceo-digitalmag.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2022/11/01091946/166729438616511870271651186244Fashion-Forward.jpg',
      allowQuoteRequests: false,
    },
  })

  await prisma.wine.upsert({
    where: { slug: 'gm-chamdor-non-alcoholic' },
    update: {},
    create: {
      name: 'GM Chamdor Non-Alcoholic Wine',
      slug: 'gm-chamdor-non-alcoholic',
      status: 'COMING_SOON',
      comingSoon: true,
      displayOrder: 5,
      mainImage: 'https://isokko.com/m/media/upload/photos/2025/05/683102419_682b180195b7c.png',
      allowQuoteRequests: false,
    },
  })

  // FAQs
  const faqs = [
    { question: 'How can I order GPIL Wines?', answer: 'Browse our wine collection, select the wines and quantities you\'re interested in, and submit a quotation request. The GPIL Wines team will contact you regarding availability and the next steps.' },
    { question: 'Can I pay directly on the website?', answer: 'The current website is designed for wine selection and quotation requests. Payment arrangements are completed directly with GPIL Wines after your enquiry is reviewed.' },
    { question: 'Where can I buy GPIL Wines?', answer: 'Visit our Find a Stockist page or submit your location and our team can assist with your enquiry.' },
    { question: 'Can businesses stock GPIL Wines?', answer: 'Yes. Businesses interested in distribution, wholesale or stocking opportunities can submit a request through our Become a Distributor page.' },
    { question: 'Where are GPIL Wines from?', answer: 'The currently documented GPIL Natural Sweet Red and GPIL Pinotage 2025 originate from the Western Cape, South Africa.' },
    { question: 'How should I store GPIL Wines?', answer: 'Keep wine in a cool, dry place away from direct sunlight. Individual wine pages include serving and storage recommendations.' },
    { question: 'How old must I be to use the GPIL Wines website?', answer: 'The website is intended for persons aged 18 and above.' },
  ]

  for (let i = 0; i < faqs.length; i++) {
    const slug = faqs[i].question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    await prisma.fAQ.upsert({
      where: { id: `faq-${i + 1}` },
      update: { question: faqs[i].question, answer: faqs[i].answer, displayOrder: i + 1 },
      create: { id: `faq-${i + 1}`, question: faqs[i].question, answer: faqs[i].answer, displayOrder: i + 1 },
    })
  }

  // Default site settings
  const defaultSettings: Record<string, string> = {
    'company_name': 'Global Ppraizze Investment Limited',
    'brand_name': 'GPIL Wines',
    'company_phone': '',
    'company_whatsapp': '',
    'company_email': '',
    'company_address': '',
    'business_hours': '',
    'social_facebook': '',
    'social_instagram': '',
    'social_x': '',
    'social_youtube': '',
    'social_linkedin': '',
    'social_tiktok': '',
    'site_name': 'GPIL Wines',
    'site_url': '',
    'seo_title': 'GPIL Wines \u2014 Premium South African Wines for the Modern African Lifestyle',
    'seo_description': 'Discover GPIL Wines. Premium South African wines crafted for the modern African lifestyle.',
    'age_gate_enabled': 'true',
    'age_gate_minimum_age': '18',
    'age_gate_expiry_days': '30',
    'age_gate_heading': 'WELCOME TO GPIL WINES',
    'age_gate_text': 'GPIL Wines is intended for adults of legal drinking age. Please confirm that you are at least 18 years old to enter.',
    'footer_description': 'Premium South African wines crafted for the modern African lifestyle.',
    'footer_responsible_drinking': 'Please enjoy responsibly.',
    'footer_copyright': '\u00a9 {year} GPIL Wines. All rights reserved.',
    'analytics_ga_id': '',
    'analytics_meta_pixel': '',
  }

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    })
  }

  // Default site content pages
  const contentPages = [
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: `<h2>Privacy Policy</h2>
<p><em>Last updated: August 2026</em></p>
<p><strong>Note: This privacy policy requires final GPIL/legal approval before production publication.</strong></p>

<h3>Information We Collect</h3>
<p>When you use the GPIL Wines website, we may collect information that you voluntarily provide through our forms, including:</p>
<ul>
<li>Name, email address, phone number, and WhatsApp number</li>
<li>Location information (country, state, city, address)</li>
<li>Wine selection and quantity preferences</li>
<li>Business information (for distributor enquiries)</li>
<li>Messages and enquiry details</li>
</ul>

<h3>How We Use Your Information</h3>
<p>We use the information collected to:</p>
<ul>
<li>Process and respond to quotation requests</li>
<li>Respond to general, distributor, and stockist enquiries</li>
<li>Send confirmation and follow-up communications</li>
<li>Improve our website and services</li>
</ul>

<h3>Age Verification</h3>
<p>We use cookies or local storage to remember your age verification confirmation. This helps ensure you are not repeatedly asked to confirm your age during normal browsing.</p>

<h3>Data Storage and Security</h3>
<p>Your information is stored securely in our database systems. We take reasonable measures to protect your personal data from unauthorized access.</p>

<h3>Contact</h3>
<p>For questions about this privacy policy, please contact GPIL Wines using the details on our Contact page.</p>`,
    },
    {
      slug: 'terms-and-conditions',
      title: 'Terms & Conditions',
      content: `<h2>Terms & Conditions</h2>
<p><em>Last updated: August 2026</em></p>
<p><strong>Note: Final legal review required before production publication.</strong></p>

<h3>Website Usage</h3>
<p>This website is operated by GPIL Wines. By accessing and using this website, you agree to these terms and conditions.</p>

<h3>Age Requirement</h3>
<p>This website is intended for persons aged 18 and above. By using this website, you confirm that you meet the minimum age requirement.</p>

<h3>Product Information</h3>
<p>Product descriptions, tasting notes, and other content are provided for informational purposes. While we strive for accuracy, we do not warrant that all information is complete or error-free.</p>

<h3>Quotation Requests</h3>
<p>Submitting a quotation request does not constitute a binding contract. GPIL Wines will review your request and contact you regarding availability and terms.</p>

<h3>Intellectual Property</h3>
<p>All content, images, logos, and materials on this website are the property of GPIL Wines or its licensors and are protected by applicable intellectual property laws.</p>

<h3>Privacy</h3>
<p>Your use of this website is also governed by our Privacy Policy.</p>`,
    },
    {
      slug: 'delivery-policy',
      title: 'Delivery Information',
      content: `<h2>Delivery Information</h2>
<p>GPIL Wines delivery and collection arrangements may vary depending on your location, product availability and the details of your quotation.</p>
<p>When you submit a wine selection, our team will confirm the applicable fulfilment arrangements as part of your quotation.</p>
<p>For questions regarding availability in your location, please contact GPIL Wines or submit a quotation request.</p>`,
    },
    {
      slug: 'returns-policy',
      title: 'Returns & Order Support',
      content: `<h2>Returns & Order Support</h2>
<p>If you experience an issue with a GPIL Wines order arranged directly with our team, please contact us using the details associated with your order or quotation.</p>
<p>Include your:</p>
<ul>
<li>Name</li>
<li>Reference/order information</li>
<li>Product concerned</li>
<li>Description of the issue</li>
</ul>
<p>GPIL Wines will review the request according to its applicable terms.</p>`,
    },
    {
      slug: 'responsible-drinking',
      title: 'Enjoy Responsibly',
      content: `<h2>Enjoy Responsibly</h2>
<p>GPIL Wines encourages responsible enjoyment of alcoholic beverages.</p>
<p>This website is intended for adults aged 18 and above. Alcohol should be enjoyed responsibly, and individuals should comply with applicable laws and guidance in their location.</p>
<p>Do not drink and drive.</p>
<p>For non-alcoholic GPIL-related products, the individual product page will clearly identify the product according to confirmed product information.</p>`,
    },
    {
      slug: 'about',
      title: 'About GPIL Wines',
      content: '',
    },
  ]

  for (const page of contentPages) {
    await prisma.siteContent.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    })
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
