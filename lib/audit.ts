import { prisma } from '@/lib/db'

export async function createAuditLog({
  adminId,
  action,
  entity,
  entityId,
  details,
}: {
  adminId: string
  action: string
  entity: string
  entityId?: string
  details?: string
}) {
  try {
    await prisma.auditLog.create({
      data: { adminId, action, entity, entityId, details },
    })
  } catch (error) {
    console.error('Audit log error:', error)
  }
}
