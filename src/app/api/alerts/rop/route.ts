import { and, eq, lte } from 'drizzle-orm';
import { db } from '@/lib/db';
import { materialMaster, materialPlantData, materialStock } from '@/lib/db/schema';
import { requireRole } from '@/lib/auth/rbac';

export async function GET() {
  const auth = await requireRole('admin_gudang');
  if (auth instanceof Response) return auth;
  const rows = await db.select({
    partNumber: materialStock.partNumber,
    plant: materialStock.plant,
    materialDescription: materialMaster.materialDescription,
    freeStock: materialStock.freeStock,
    reorderPoint: materialPlantData.reorderPoint,
  }).from(materialStock)
    .innerJoin(materialPlantData, and(eq(materialPlantData.partNumber, materialStock.partNumber), eq(materialPlantData.plant, materialStock.plant)))
    .innerJoin(materialMaster, eq(materialMaster.partNumber, materialStock.partNumber))
    .where(lte(materialStock.freeStock, materialPlantData.reorderPoint));
  return Response.json(rows);
}
