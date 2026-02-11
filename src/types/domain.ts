export type DecimalString = string;
export type UserRole = 'admin_gudang' | 'kepala_gudang';

export interface User {
  userId: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdOn: string;
  lastChange: string | null;
  isActive: number;
  deletedAt: string | null;
}

export interface MaterialMaster {
  partNumber: string;
  materialDescription: string;
  baseUnitOfMeasure: string;
  createdOn: string;
  createTime: string | null;
  createdBy: string | null;
  materialGroup: string | null;
  isActive: number;
  deletedAt: string | null;
}

export interface MaterialStock {
  partNumber: string;
  plant: string;
  freeStock: DecimalString;
  blocked: DecimalString;
}

export interface MaterialPlantData {
  partNumber: string;
  plant: string;
  reorderPoint: DecimalString;
  safetyStock: DecimalString;
}

export interface MaterialMovement {
  movementId: string;
  partNumber: string;
  plant: string;
  materialDescription: string | null;
  postingDate: string;
  movementType: '101' | '261' | 'RESTOCK_REQ' | 'RESTOCK_PROC' | 'RETURN';
  orderNo: string | null;
  purchaseOrder: string | null;
  quantity: DecimalString;
  baseUnitOfMeasure: string | null;
  userName: string | null;
}
