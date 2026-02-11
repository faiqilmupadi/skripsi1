import { listMovements } from '@/lib/db/queries';
import { requireRole } from '@/lib/auth/rbac';
import { paginationSchema } from '@/lib/validators/zod';

export async function GET(req: Request) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const parsed = paginationSchema.parse(Object.fromEntries(new URL(req.url).searchParams.entries()));
  return Response.json(await listMovements(parsed.page, parsed.pageSize, parsed.q));
}
