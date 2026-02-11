import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { db } from '@/lib/db';
import { materialMaster, materialMovement, materialPlantData, materialStock, users } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/password';

const normalize = (h: string) => h.toLowerCase().trim().replace(/[\s_-]/g, '');

function rows(file: string, sheet: string) {
  const wb = XLSX.readFile(file);
  const ws = wb.Sheets[sheet];
  if (!ws) return [];
  const data = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: null });
  return data.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [normalize(k), v])));
}

async function main() {
  const file = path.join(process.cwd(), 'data/datasetreal.xlsx');
  if (!fs.existsSync(file)) throw new Error('data/datasetreal.xlsx not found');

  for (const row of rows(file, 'users')) {
    const userId = row.userid ? Number(row.userid) : undefined;
    const username = String(row.username);
    const existing = userId ? await db.select().from(users).where(eq(users.userId, userId)) : await db.select().from(users).where(eq(users.username, username));
    const payload = {
      username,
      email: String(row.email),
      password: await hashPassword(String(row.password ?? 'password123')),
      role: row.role === 'kepala_gudang' ? 'kepala_gudang' : 'admin_gudang',
      createdOn: new Date(row.createdon ?? new Date()),
      lastChange: row.lastchange ? new Date(row.lastchange) : null,
      isActive: row.isactive ?? 1,
    } as const;
    if (existing[0]) await db.update(users).set(payload).where(eq(users.userId, existing[0].userId));
    else await db.insert(users).values(userId ? { userId, ...payload } as any : payload);
  }

  for (const row of rows(file, 'material_master')) {
    await db.insert(materialMaster).values({
      partNumber: String(row.partnumber),
      materialDescription: String(row.materialdescription),
      baseUnitOfMeasure: String(row.baseunitofmeasure),
      createdOn: String(row.createdon ?? new Date().toISOString().slice(0,10)),
      createTime: row.createtime ? String(row.createtime) : null,
      createdBy: row.createdby ? String(row.createdby) : null,
      materialGroup: row.materialgroup ? String(row.materialgroup) : null,
      isActive: row.isactive ?? 1,
    }).onDuplicateKeyUpdate({ set: { materialDescription: String(row.materialdescription), baseUnitOfMeasure: String(row.baseunitofmeasure), materialGroup: row.materialgroup ? String(row.materialgroup) : null } });
  }

  for (const row of rows(file, 'material_stock')) {
    await db.insert(materialStock).values({ partNumber: String(row.partnumber), plant: String(row.plant), freeStock: String(row.freestock ?? 0), blocked: String(row.blocked ?? 0) }).onDuplicateKeyUpdate({ set: { freeStock: String(row.freestock ?? 0), blocked: String(row.blocked ?? 0) } });
  }
  for (const row of rows(file, 'material_plant_data')) {
    await db.insert(materialPlantData).values({ partNumber: String(row.partnumber), plant: String(row.plant), reorderPoint: String(row.reorderpoint ?? 0), safetyStock: String(row.safetystock ?? 0) }).onDuplicateKeyUpdate({ set: { reorderPoint: String(row.reorderpoint ?? 0), safetyStock: String(row.safetystock ?? 0) } });
  }

  let maxId = 0n;
  for (const row of rows(file, 'material_movement')) {
    const payload: any = {
      partNumber: String(row.partnumber),
      plant: String(row.plant),
      materialDescription: row.materialdescription ? String(row.materialdescription) : null,
      postingDate: String(row.postingdate ?? new Date().toISOString().slice(0,10)),
      movementType: String(row.movementtype),
      orderNo: row.orderno ? String(row.orderno) : null,
      purchaseOrder: row.purchaseorder ? String(row.purchaseorder) : null,
      quantity: String(row.quantity ?? 0),
      baseUnitOfMeasure: row.baseunitofmeasure ? String(row.baseunitofmeasure) : null,
      userName: row.username ? String(row.username) : null,
    };
    if (row.movementid) {
      payload.movementId = BigInt(row.movementid);
      if (payload.movementId > maxId) maxId = payload.movementId;
    }
    await db.insert(materialMovement).values(payload as any);
  }
  if (maxId > 0n) await db.execute(sql.raw(`ALTER TABLE material_movement AUTO_INCREMENT = ${Number(maxId + 1n)}`));

  console.log('Seed complete');
}

main().catch((e) => { console.error(e); process.exit(1); });
