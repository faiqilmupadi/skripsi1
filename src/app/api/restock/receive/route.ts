import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { materialMovement, materialStock } from '@/lib/db/schema';
import { requireRole } from '@/lib/auth/rbac';
import { receiveSchema } from '@/lib/validators/zod';
import { d } from '@/lib/utils/decimal';

export async function POST(req: Request) {
  const auth = await requireRole('admin_gudang');
  if (auth instanceof Response) return auth;
  const parsed = receiveSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  const [proc] = await db.select().from(materialMovement).where(and(eq(materialMovement.orderNo, parsed.data.requestId), eq(materialMovement.movementType, 'RESTOCK_PROC')));
  if (!proc) return Response.json({ error: { code: 'NOT_FOUND', message: 'Process not found' } }, { status: 404 });
  const [existing] = await db.execute(sql`select movementId from material_movement where orderNo=${parsed.data.requestId} and movementType='101' limit 1`) as any;
  if (existing) return Response.json({ ok: true });
  const stock = await db.select().from(materialStock).where(and(eq(materialStock.partNumber, proc.partNumber), eq(materialStock.plant, proc.plant)));
  const current = stock[0];
  await db.update(materialStock).set({ freeStock: String(d(current.freeStock as any) + d(parsed.data.freeIn)), blocked: String(d(current.blocked as any) + d(parsed.data.blockedIn)) }).where(and(eq(materialStock.partNumber, proc.partNumber), eq(materialStock.plant, proc.plant)));
  await db.insert(materialMovement).values([
    { ...proc, movementId: undefined as any, movementType: '101', quantity: parsed.data.freeIn, purchaseOrder: 'FREE', postingDate: new Date().toISOString().slice(0,10), userName: auth.username },
    { ...proc, movementId: undefined as any, movementType: '101', quantity: parsed.data.blockedIn, purchaseOrder: 'BLOCK', postingDate: new Date().toISOString().slice(0,10), userName: auth.username },
  ]);
  return Response.json({ ok: true });
}
