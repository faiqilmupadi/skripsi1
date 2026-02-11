import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { materialMovement } from '@/lib/db/schema';
import { pendingRestockRequests } from '@/lib/db/queries';
import { requireRole } from '@/lib/auth/rbac';
import { processSchema } from '@/lib/validators/zod';

export async function GET() {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const rows = await pendingRestockRequests();
  return Response.json(rows);
}

export async function POST(req: Request) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const parsed = processSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  const [request] = await db.select().from(materialMovement).where(and(eq(materialMovement.orderNo, parsed.data.requestId), eq(materialMovement.movementType, 'RESTOCK_REQ')));
  if (!request) return Response.json({ error: { code: 'NOT_FOUND', message: 'Request not found' } }, { status: 404 });
  const exists = await db.execute(sql`select movementId from material_movement where orderNo=${parsed.data.requestId} and movementType='RESTOCK_PROC' limit 1`);
  if ((exists as any[]).length) return Response.json({ ok: true });
  await db.insert(materialMovement).values({ ...request, movementId: undefined as any, movementType: 'RESTOCK_PROC', postingDate: new Date().toISOString().slice(0,10), userName: auth.username });
  return Response.json({ ok: true });
}
