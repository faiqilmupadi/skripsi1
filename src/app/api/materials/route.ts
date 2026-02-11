import { db } from '@/lib/db';
import { materialMaster } from '@/lib/db/schema';
import { listMaterials } from '@/lib/db/queries';
import { requireRole } from '@/lib/auth/rbac';
import { materialCreateSchema, paginationSchema } from '@/lib/validators/zod';

export async function GET(req: Request) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const parsed = paginationSchema.parse(Object.fromEntries(new URL(req.url).searchParams.entries()));
  return Response.json(await listMaterials(parsed.page, parsed.pageSize, parsed.q));
}

export async function POST(req: Request) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const parsed = materialCreateSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  await db.insert(materialMaster).values({ ...parsed.data, createdOn: new Date().toISOString().slice(0, 10), createTime: null, createdBy: auth.username, isActive: 1 });
  return Response.json({ ok: true });
}
