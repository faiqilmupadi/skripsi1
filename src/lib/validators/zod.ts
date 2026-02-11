import { z } from 'zod';

export const loginSchema = z.object({ username: z.string().min(1), password: z.string().min(1) });
export const userCreateSchema = z.object({ username: z.string().min(3), email: z.string().email(), password: z.string().min(6), role: z.enum(['admin_gudang', 'kepala_gudang']) });
export const userPatchSchema = userCreateSchema.partial().extend({ password: z.string().min(6).optional() });
export const materialCreateSchema = z.object({ partNumber: z.string().min(1), materialDescription: z.string().min(1), baseUnitOfMeasure: z.string().min(1), materialGroup: z.string().optional().nullable() });
export const materialPatchSchema = materialCreateSchema.omit({ partNumber: true }).partial();
export const paginationSchema = z.object({ page: z.coerce.number().default(1), pageSize: z.coerce.number().default(10), q: z.string().optional().default('') });
export const restockRequestSchema = z.object({ partNumber: z.string().min(1), plant: z.string().min(1), qtyRequested: z.string() });
export const processSchema = z.object({ requestId: z.string().min(1) });
export const receiveSchema = z.object({ requestId: z.string().min(1), freeIn: z.string(), blockedIn: z.string() });
export const issueSchema = z.object({ partNumber: z.string(), plant: z.string(), qtyAmbil: z.string() });
export const returnSchema = z.object({ partNumber: z.string(), plant: z.string(), qtyReturn: z.string() });
