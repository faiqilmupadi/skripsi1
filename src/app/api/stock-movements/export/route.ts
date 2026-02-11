import { listMovements } from '@/lib/db/queries';
import { toCsv } from '@/lib/utils/csv';
import { requireRole } from '@/lib/auth/rbac';

export async function GET(req: Request) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const q = new URL(req.url).searchParams.get('q') ?? '';
  const rows = await listMovements(1, 5000, q);
  const csv = toCsv(rows as unknown as Record<string, unknown>[]);
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=movements.csv' } });
}
