# GPIL Wines

A premium South African wine brand website built with Next.js 14.

## Features
- Homepage with hero slider, wine collection, brand experience sections
- Wine catalog with detailed product pages
- Quote request system (quotation-based business model)
- Contact, distributor, and stockist request forms
- Admin CMS panel with full content management
- Email notifications for all form submissions
- Cloud storage for media uploads
- Cookie consent and age verification gate
- SEO optimized with dynamic sitemap and robots.txt

## Getting Started

1. Copy `.env.example` to `.env` and fill in your credentials
2. Install dependencies: `yarn install`
3. Generate Prisma client: `yarn prisma generate`
4. Run database migrations: `yarn prisma db push`
5. Seed the database: `yarn ts-node scripts/seed.ts`
6. Start development server: `yarn dev`

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth.js v4
- Framer Motion
- AWS S3 for file storage
