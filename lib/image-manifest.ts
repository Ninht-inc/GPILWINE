/**
 * Every image that was hard-coded to an external host. `POST /api/admin/migrate-images`
 * ingests each `source` into Cloudinary at the given `publicId`; the matching
 * delivery URLs are already baked into lib/data.ts and the page components, so
 * once the migration has run the site serves everything from Cloudinary and no
 * longer depends on Abacus (or any other third-party host) for images.
 *
 * Safe to re-run — already-migrated images are skipped.
 */
export const STATIC_IMAGE_MANIFEST: { source: string; publicId: string }[] = [
  // Homepage hero slides (were on cdn.abacus.ai)
  { source: 'https://cdn.abacus.ai/images/4b8a36d3-4c57-4c18-9f25-cc499b84829a.png', publicId: 'gpil/home/hero-natural-sweet-red-bg' },
  { source: 'https://cdn.abacus.ai/images/a6db3584-1fb5-4365-884c-99c927e1d0d1.png', publicId: 'gpil/home/bottle-natural-sweet-red' },
  { source: 'https://cdn.abacus.ai/images/936d1efc-a386-4163-9a9b-4564312a289d.png', publicId: 'gpil/home/hero-pinotage-2025-bg' },
  { source: 'https://cdn.abacus.ai/images/cf179677-995f-4cb2-b8fc-950c96409fba.png', publicId: 'gpil/home/bottle-pinotage-2025' },
  { source: 'https://cdn.abacus.ai/images/bc5a023c-054b-41d7-928a-1ef36797f499.png', publicId: 'gpil/home/hero-sweet-white-bg' },
  { source: 'https://cdn.abacus.ai/images/16922ca9-ba29-4c95-a87d-ce96be838eee.png', publicId: 'gpil/home/bottle-sweet-white' },
  { source: 'https://cdn.abacus.ai/images/6490f560-a1ef-4873-aea3-381aad9c5747.png', publicId: 'gpil/home/hero-executive-rose-bg' },
  { source: 'https://cdn.abacus.ai/images/f993b92b-d230-4fec-979c-df2b6873919c.png', publicId: 'gpil/home/bottle-executive-rose' },
  { source: 'https://cdn.abacus.ai/images/c48de82e-a1b5-46d0-81dc-da56fab9ad8a.png', publicId: 'gpil/home/hero-chamdor-non-alcoholic-bg' },
  { source: 'https://cdn.abacus.ai/images/65972c9b-c36d-4f63-89a1-a650f34dd787.png', publicId: 'gpil/home/bottle-chamdor-non-alcoholic' },
  { source: 'https://cdn.abacus.ai/images/3f3d29ac-adc1-45c2-815f-958c638403b3.png', publicId: 'gpil/home/featured-wine' },

  // Food pairing tiles
  { source: 'https://images.unsplash.com/photo-1665332195309-9d75071138f0?fm=jpg&q=60&w=800&auto=format&fit=crop', publicId: 'gpil/pairings/jollof-rice' },
  { source: 'https://www.theintrepideater.com/wp-content/uploads/2020/12/DSC_0806-2-scaled.webp', publicId: 'gpil/pairings/suya' },
  { source: 'https://cdn.foodshot.ai/landing/use-cases/chicken/card-3.webp', publicId: 'gpil/pairings/grilled-chicken' },
  { source: 'https://shop.creekstonefarms.com/cdn/shop/products/BBQTrays_0470.jpg?v=1652802755', publicId: 'gpil/pairings/barbecued-meats' },
  { source: 'https://images.pexels.com/photos/11044498/pexels-photo-11044498.jpeg?auto=compress&w=800', publicId: 'gpil/pairings/pizza' },
  { source: 'https://www.foodandwine.com/thmb/FLM1rvQ_LyJ-F7ZzfG6DuN1S5i8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Pasta-e-Ceci-FT-RECIPE0124-27dfb146e41a47c3b7f0bacc2ce46643.jpg', publicId: 'gpil/pairings/pasta' },
  { source: 'https://cdn.babyseo.ai/images/foodshot.ai/burger-photography/burger-photography-hero-stacked.webp', publicId: 'gpil/pairings/burgers' },
  { source: 'https://images.unsplash.com/photo-1759146204204-6f2a2d9e4e67?fm=jpg&q=60&w=800&auto=format&fit=crop', publicId: 'gpil/pairings/desserts' },

  // Occasion tiles
  { source: 'https://images.pexels.com/photos/36789746/pexels-photo-36789746.jpeg?cs=srgb&fm=jpg&w=800', publicId: 'gpil/occasions/dinner-date-nights' },
  { source: 'https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&w=800', publicId: 'gpil/occasions/celebrations' },
  { source: 'https://images.pexels.com/photos/36005727/pexels-photo-36005727/free-photo-of-family-gathering-at-outdoor-cafe-setting.jpeg?auto=compress&w=800', publicId: 'gpil/occasions/weekends-friends' },
  { source: 'https://i.pinimg.com/736x/27/cc/e1/27cce1a8850b9335a72c461cc109435a.jpg', publicId: 'gpil/occasions/weddings-parties' },
  { source: 'https://thefrenchmarket.ie/wp-content/uploads/2023/10/Champagne-Gift-Box-New-beige-1-scaled.jpg', publicId: 'gpil/occasions/gifting' },
  { source: 'https://images.presentationgo.com/2025/06/business-team-dinner-celebration.jpg', publicId: 'gpil/occasions/business-occasions' },

  // Page hero backgrounds
  { source: 'https://external-cdn.morphic.com/website-production/assets/seo/images/seo/16-07-c/wine-images/wine-images-16x9-04.webp', publicId: 'gpil/heroes/about' },
  { source: 'https://gstatic1.promeai.pro/gallery/publish/2024/10/26/0919e06cb0fe4e518f508501c6c48845.jpg', publicId: 'gpil/heroes/contact' },
  { source: 'https://images.pexels.com/photos/10923023/pexels-photo-10923023.jpeg?cs=srgb&dl=pexels-gonzalo-acuna-166058093-10923023.jpg&fm=jpg', publicId: 'gpil/heroes/faq' },
  { source: 'https://daily.sevenfifty.com/wp-content/uploads/2024/12/SFD-Does-High-End-Prosecco-Sell-_Prosecco-displays-at-Garys-Bernardsville-NJ_CO_Garys-Wine-and-Marketplace_Hero-1.jpg', publicId: 'gpil/heroes/find-a-stockist' },
  { source: 'https://www.virginwines.co.uk/hub/wp-content/uploads/2023/03/Wine-Basics-Topic-How-To-Pour-Wine-18.jpg', publicId: 'gpil/heroes/become-a-distributor' },
  { source: 'https://media.cntraveler.com/photos/57f7d0deeb5a99b96dc53cbe/16:9/w_1280,c_limit/GettyImages-56112948.jpg', publicId: 'gpil/heroes/wines' },
  { source: 'https://vivawalls.com/cdn/shop/files/Wallpaper_-1429A_1200x673.jpg?v=1743514005', publicId: 'gpil/heroes/policy-pages' },
  { source: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80', publicId: 'gpil/heroes/about-vineyard' },
]

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'xgunwvcm'

/** Client-safe Cloudinary delivery URL for a public_id. */
export function cld(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto/${publicId}`
}
