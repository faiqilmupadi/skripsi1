import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { materialMaster, materialMovement } from '@/lib/db/schema';
import { requireRole } from '@/lib/auth/rbac';
import { restockRequestSchema } from '@/lib/validators/zod';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const auth = await requireRole('admin_gudang');
  if (auth instanceof Response) return auth;
  const parsed = restockRequestSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  const [material] = await db.select().from(materialMaster).where(eq(materialMaster.partNumber, parsed.data.partNumber));
  const requestId = nanoid(10);
  await db.insert(materialMovement).values({
    partNumber: parsed.data.partNumber,
    plant: parsed.data.plant,
    materialDescription: material?.materialDescription ?? null,
    postingDate: new Date().toISOString().slice(0, 10),
    movementType: 'RESTOCK_REQ',
    orderNo: requestId,
    purchaseOrder: null,
    quantity: parsed.data.qtyRequested,
    baseUnitOfMeasure: material?.baseUnitOfMeasure ?? null,
    userName: auth.username,
  });
  return Response.json({ ok: true, requestId });
}
