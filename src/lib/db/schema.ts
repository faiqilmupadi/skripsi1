import { bigint, date, datetime, decimal, int, mysqlEnum, mysqlTable, primaryKey, time, timestamp, varchar, index } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  userId: int('userId').autoincrement().primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 150 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin_gudang', 'kepala_gudang']).notNull(),
  createdOn: datetime('createdOn').notNull(),
  lastChange: datetime('lastChange'),
  isActive: int('isActive').notNull().default(1),
  deletedAt: datetime('deletedAt'),
});

export const materialMaster = mysqlTable('material_master', {
  partNumber: varchar('partNumber', { length: 50 }).primaryKey(),
  materialDescription: varchar('materialDescription', { length: 255 }).notNull(),
  baseUnitOfMeasure: varchar('baseUnitOfMeasure', { length: 20 }).notNull(),
  createdOn: date('createdOn').notNull(),
  createTime: time('createTime'),
  createdBy: varchar('createdBy', { length: 100 }),
  materialGroup: varchar('materialGroup', { length: 100 }),
  isActive: int('isActive').notNull().default(1),
  deletedAt: datetime('deletedAt'),
});

export const materialStock = mysqlTable('material_stock', {
  partNumber: varchar('partNumber', { length: 50 }).notNull().references(() => materialMaster.partNumber, { onDelete: 'restrict' }),
  plant: varchar('plant', { length: 20 }).notNull(),
  freeStock: decimal('freeStock', { precision: 10, scale: 3 }).notNull().default('0'),
  blocked: decimal('blocked', { precision: 10, scale: 3 }).notNull().default('0'),
}, (t) => ({
  pk: primaryKey({ columns: [t.partNumber, t.plant] }),
}));

export const materialPlantData = mysqlTable('material_plant_data', {
  partNumber: varchar('partNumber', { length: 50 }).notNull().references(() => materialMaster.partNumber, { onDelete: 'restrict' }),
  plant: varchar('plant', { length: 20 }).notNull(),
  reorderPoint: decimal('reorderPoint', { precision: 10, scale: 3 }).notNull().default('0'),
  safetyStock: decimal('safetyStock', { precision: 10, scale: 3 }).notNull().default('0'),
}, (t) => ({
  pk: primaryKey({ columns: [t.partNumber, t.plant] }),
}));

export const materialMovement = mysqlTable('material_movement', {
  movementId: bigint('movementId', { mode: 'bigint' }).autoincrement().primaryKey(),
  partNumber: varchar('partNumber', { length: 50 }).notNull().references(() => materialMaster.partNumber, { onDelete: 'restrict' }),
  plant: varchar('plant', { length: 20 }).notNull(),
  materialDescription: varchar('materialDescription', { length: 255 }),
  postingDate: date('postingDate').notNull(),
  movementType: varchar('movementType', { length: 50 }).notNull(),
  orderNo: varchar('orderNo', { length: 50 }),
  purchaseOrder: varchar('purchaseOrder', { length: 50 }),
  quantity: decimal('quantity', { precision: 18, scale: 3 }).notNull(),
  baseUnitOfMeasure: varchar('baseUnitOfMeasure', { length: 20 }),
  userName: varchar('userName', { length: 100 }),
}, (t) => ({
  postingDateIdx: index('idx_movement_postingDate').on(t.postingDate),
  userIdx: index('idx_movement_userName').on(t.userName),
  partIdx: index('idx_movement_partNumber').on(t.partNumber),
  typeIdx: index('idx_movement_movementType').on(t.movementType),
  plantIdx: index('idx_movement_plant').on(t.plant),
}));
