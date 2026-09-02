/** Whitelist of Wine columns the admin form is allowed to write. */
export const WINE_SCALAR_FIELDS = [
  'name', 'slug', 'category', 'subtitle', 'vintage', 'shortDescription', 'fullDescription',
  'tagline', 'status', 'featured', 'displayOrder',
  'country', 'region', 'wineOrigin', 'bottleSize', 'alcohol', 'producer', 'producerAddress',
  'madeFor', 'nigerianImporter', 'nafdacRegistration', 'containsSulphites', 'wineDesignation',
  'colour', 'aroma', 'palate', 'body', 'sweetness', 'acidity', 'finish',
  'servingTemp', 'servingInstructions', 'storageInstructions', 'idealCustomer',
  'mainImage', 'transparentImage', 'heroImage', 'cardImage', 'videoUrl',
  'seoTitle', 'metaDescription', 'ogImage', 'canonicalUrl',
  'allowQuoteRequests', 'comingSoon', 'minimumQuantity', 'price', 'currency',
] as const

export const WINE_ARRAY_FIELDS = ['foodPairings', 'idealOccasions', 'seoKeywords', 'gallery'] as const

const INT_FIELDS = new Set(['displayOrder', 'minimumQuantity'])
const FLOAT_FIELDS = new Set(['price'])
const BOOL_FIELDS = new Set(['featured', 'allowQuoteRequests', 'comingSoon'])

/** Picks and coerces only known Wine fields from an arbitrary request body. */
export function sanitizeWineInput(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {}

  for (const key of WINE_SCALAR_FIELDS) {
    if (!(key in body)) continue
    const v = body[key]
    if (BOOL_FIELDS.has(key)) data[key] = Boolean(v)
    else if (INT_FIELDS.has(key)) data[key] = v == null || v === '' ? null : Math.trunc(Number(v))
    else if (FLOAT_FIELDS.has(key)) data[key] = v == null || v === '' ? null : Number(v)
    else data[key] = v === '' ? null : v
  }

  for (const key of WINE_ARRAY_FIELDS) {
    if (!(key in body)) continue
    const v = body[key]
    data[key] = Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()) : []
  }

  return data
}
