import { v2 as cloudinary } from 'cloudinary'

/**
 * Server-side Cloudinary client. Credentials come from env vars set in Vercel:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * The API secret is never sent to the browser — uploads go through
 * /api/admin/upload (auth-gated).
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'xgunwvcm'
export const UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'gpil'

export function isConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  )
}

export function isCloudinaryUrl(url: string | null | undefined): boolean {
  return typeof url === 'string' && /res\.cloudinary\.com\//.test(url)
}

/** Inserts f_auto,q_auto delivery transforms into a Cloudinary URL (idempotent). */
export function optimized(url: string): string {
  if (!isCloudinaryUrl(url)) return url
  if (/\/upload\/(f_auto|q_auto)/.test(url)) return url
  return url.replace('/upload/', '/upload/f_auto,q_auto/')
}

/** Delivery URL for a known public_id (no version, format auto-detected). */
export function deliveryUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`
}

export type UploadOutcome = {
  url: string
  publicId: string
  width?: number
  height?: number
  bytes?: number
  format?: string
  resourceType?: string
}

/**
 * Uploads to Cloudinary. `source` may be a remote URL, a data: URI, or a
 * local file path. Returns the optimised secure URL.
 */
export async function uploadToCloudinary(
  source: string,
  opts: { folder?: string; publicId?: string; overwrite?: boolean; resourceType?: 'image' | 'video' | 'auto' } = {}
): Promise<UploadOutcome> {
  const res = await cloudinary.uploader.upload(source, {
    folder: opts.publicId ? undefined : opts.folder ?? UPLOAD_FOLDER,
    public_id: opts.publicId,
    overwrite: opts.overwrite ?? false,
    resource_type: opts.resourceType ?? 'image',
    // keep originals reasonable without destroying quality
    transformation: opts.resourceType === 'video' ? undefined : [{ quality: 'auto:good' }],
  })
  return {
    url: res.resource_type === 'video' ? res.secure_url : optimized(res.secure_url),
    publicId: res.public_id,
    width: res.width,
    height: res.height,
    bytes: res.bytes,
    format: res.format,
    resourceType: res.resource_type,
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

/** Extracts the public_id from a Cloudinary delivery URL, or null. */
export function publicIdFromUrl(url: string): string | null {
  const m = url.match(/\/upload\/(?:[^/]+\/)*?v\d+\/(.+?)(?:\.[a-z0-9]+)?$/i)
  if (m) return m[1]
  const m2 = url.match(/\/upload\/(?:f_auto,q_auto\/)?(.+?)(?:\.[a-z0-9]+)?$/i)
  return m2 ? m2[1] : null
}
