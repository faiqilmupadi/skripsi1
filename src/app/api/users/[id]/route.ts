import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { requireRole } from '@/lib/auth/rbac';
import { userPatchSchema } from '@/lib/validators/zod';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const parsed = userPatchSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  const payload: any = { ...parsed.data, lastChange: new Date() };
  if (payload.password) payload.password = await hashPassword(payload.password);
  await db.update(users).set(payload).where(and(eq(users.userId, Number(params.id)), eq(users.isActive, 1)));
  return Response.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  await db.update(users).set({ isActive: 0, deletedAt: new Date() }).where(eq(users.userId, Number(params.id)));
  return Response.json({ ok: true });
}
