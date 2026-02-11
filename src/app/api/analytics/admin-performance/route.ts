import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth/rbac';

export async function GET() {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const rows = await db.execute(sql`
    select userName,
      count(*) as totalTransaksi,
      sum(case when movementType in ('261','101','RETURN') then abs(quantity) else 0 end) as totalKontribusi,
      sum(case when movementType in ('261','101','RETURN') then abs(quantity) else 0 end) / nullif(count(*),0) as kinerja
    from material_movement group by userName
  `);
  return Response.json(rows);
}
