import { and, eq } from 'drizzle-orm';
import { listStocks } from '@/lib/db/queries';
import { requireRole } from '@/lib/auth/rbac';
import { issueSchema, paginationSchema, returnSchema } from '@/lib/validators/zod';
import { db } from '@/lib/db';
import { materialMovement, materialStock } from '@/lib/db/schema';
import { d, ds } from '@/lib/utils/decimal';

export async function GET(req: Request) {
  const auth = await requireRole('admin_gudang');
  if (auth instanceof Response) return auth;
  const parsed = paginationSchema.parse(Object.fromEntries(new URL(req.url).searchParams.entries()));
  return Response.json(await listStocks(parsed.page, parsed.pageSize, parsed.q));
}

export async function POST(req: Request) {
  const auth = await requireRole('admin_gudang');
  if (auth instanceof Response) return auth;
  const body = await req.json();
  const kind = body.kind as 'issue' | 'return';
  const parsed = kind === 'issue' ? issueSchema.safeParse(body) : returnSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  const [stock] = await db.select().from(materialStock).where(and(eq(materialStock.partNumber, parsed.data.partNumber), eq(materialStock.plant, parsed.data.plant)));
  const qty = d(kind === 'issue' ? (parsed.data as any).qtyAmbil : (parsed.data as any).qtyReturn);
  if (!stock) return Response.json({ error: { code: 'NOT_FOUND', message: 'Stock not found' } }, { status: 404 });
  if (kind === 'issue') {
    if (d(stock.freeStock as any) < qty) return Response.json({ error: { code: 'BAD_REQUEST', message: 'Free stock insufficient' } }, { status: 400 });
    await db.update(materialStock).set({ freeStock: ds(d(stock.freeStock as any) - qty) }).where(and(eq(materialStock.partNumber, stock.partNumber), eq(materialStock.plant, stock.plant)));
    await db.insert(materialMovement).values({ partNumber: stock.partNumber, plant: stock.plant, postingDate: new Date().toISOString().slice(0,10), movementType: '261', quantity: ds(qty), materialDescription: null, orderNo: null, purchaseOrder: null, baseUnitOfMeasure: null, userName: auth.username });
  } else {
    if (d(stock.blocked as any) < qty) return Response.json({ error: { code: 'BAD_REQUEST', message: 'Blocked stock insufficient' } }, { status: 400 });
    await db.update(materialStock).set({ blocked: ds(d(stock.blocked as any) - qty) }).where(and(eq(materialStock.partNumber, stock.partNumber), eq(materialStock.plant, stock.plant)));
    await db.insert(materialMovement).values({ partNumber: stock.partNumber, plant: stock.plant, postingDate: new Date().toISOString().slice(0,10), movementType: 'RETURN', quantity: ds(qty), materialDescription: null, orderNo: null, purchaseOrder: null, baseUnitOfMeasure: null, userName: auth.username });
  }
  return Response.json({ ok: true });
}
