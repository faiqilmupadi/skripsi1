import { and, desc, eq, like, or, sql } from 'drizzle-orm';
import { db } from './index';
import { materialMaster, materialMovement, materialPlantData, materialStock, users } from './schema';

export async function listUsers(page: number, pageSize: number, q: string) {
  const where = and(eq(users.isActive, 1), q ? or(like(users.username, `%${q}%`), like(users.email, `%${q}%`)) : undefined);
  return db.select().from(users).where(where).limit(pageSize).offset((page - 1) * pageSize);
}

export async function listMaterials(page: number, pageSize: number, q: string) {
  const where = and(eq(materialMaster.isActive, 1), q ? or(like(materialMaster.partNumber, `%${q}%`), like(materialMaster.materialDescription, `%${q}%`)) : undefined);
  return db.select().from(materialMaster).where(where).limit(pageSize).offset((page - 1) * pageSize);
}

export async function listStocks(page: number, pageSize: number, q: string) {
  return db.select({
    partNumber: materialStock.partNumber,
    plant: materialStock.plant,
    materialDescription: materialMaster.materialDescription,
    freeStock: materialStock.freeStock,
    blocked: materialStock.blocked,
    reorderPoint: materialPlantData.reorderPoint,
  })
    .from(materialStock)
    .innerJoin(materialMaster, eq(materialMaster.partNumber, materialStock.partNumber))
    .innerJoin(materialPlantData, and(eq(materialPlantData.partNumber, materialStock.partNumber), eq(materialPlantData.plant, materialStock.plant)))
    .where(q ? or(like(materialStock.partNumber, `%${q}%`), like(materialMaster.materialDescription, `%${q}%`)) : undefined)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function listMovements(page: number, pageSize: number, q: string) {
  return db.select().from(materialMovement)
    .where(q ? or(like(materialMovement.partNumber, `%${q}%`), like(materialMovement.userName, `%${q}%`)) : undefined)
    .orderBy(desc(materialMovement.postingDate))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function pendingRestockRequests() {
  return db.execute(sql`
    select req.orderNo as requestId, req.partNumber, req.plant, req.quantity, req.userName
    from material_movement req
    left join material_movement proc on proc.orderNo = req.orderNo and proc.movementType = 'RESTOCK_PROC'
    where req.movementType = 'RESTOCK_REQ' and proc.movementId is null
  `);
}
