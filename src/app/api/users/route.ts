import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { listUsers } from '@/lib/db/queries';
import { hashPassword } from '@/lib/auth/password';
import { requireRole } from '@/lib/auth/rbac';
import { paginationSchema, userCreateSchema } from '@/lib/validators/zod';

export async function GET(req: Request) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const { searchParams } = new URL(req.url);
  const parsed = paginationSchema.parse(Object.fromEntries(searchParams.entries()));
  return Response.json(await listUsers(parsed.page, parsed.pageSize, parsed.q));
}

export async function POST(req: Request) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const parsed = userCreateSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  const hashed = await hashPassword(parsed.data.password);
  await db.insert(users).values({ ...parsed.data, password: hashed, createdOn: new Date(), isActive: 1 });
  return Response.json({ ok: true });
}
