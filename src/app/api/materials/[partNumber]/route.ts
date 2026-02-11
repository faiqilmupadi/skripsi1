import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { materialMaster } from '@/lib/db/schema';
import { requireRole } from '@/lib/auth/rbac';
import { materialPatchSchema } from '@/lib/validators/zod';

export async function PATCH(req: Request, { params }: { params: { partNumber: string } }) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const parsed = materialPatchSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  await db.update(materialMaster).set(parsed.data).where(eq(materialMaster.partNumber, params.partNumber));
  return Response.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { partNumber: string } }) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  await db.update(materialMaster).set({ isActive: 0, deletedAt: new Date() }).where(eq(materialMaster.partNumber, params.partNumber));
  return Response.json({ ok: true });
}
