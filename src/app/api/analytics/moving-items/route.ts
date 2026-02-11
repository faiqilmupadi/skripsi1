import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth/rbac';

export async function GET(req: Request) {
  const auth = await requireRole('kepala_gudang');
  if (auth instanceof Response) return auth;
  const sp = new URL(req.url).searchParams;
  const mode = sp.get('mode') === 'slow' ? 'slow' : 'fast';
  const limit = Number(sp.get('limit') ?? '10');
  const order = mode === 'fast' ? sql`ratio asc` : sql`ratio desc`;
  const rows = await db.execute(sql`
    select mm.partNumber,
      sum(case when mm.movementType='261' then mm.quantity else 0 end) as qtyOut,
      any_value(ms.freeStock) as freeStock,
      case when sum(case when mm.movementType='261' then mm.quantity else 0 end)=0 then 999999999 else any_value(ms.freeStock)/sum(case when mm.movementType='261' then mm.quantity else 0 end) end as ratio,
      (sum(case when mm.movementType='261' then mm.quantity else 0 end) / nullif((select sum(quantity) from material_movement where movementType='261'),0))*100 as outSharePct
    from material_movement mm left join material_stock ms on ms.partNumber=mm.partNumber
    group by mm.partNumber order by ${order} limit ${limit}
  `);
  return Response.json(rows);
}
