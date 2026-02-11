import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { comparePassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validators/zod';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 });
  const [user] = await db.select().from(users).where(eq(users.username, parsed.data.username));
  if (!user || !user.isActive) return Response.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }, { status: 401 });
  const ok = await comparePassword(parsed.data.password, user.password);
  if (!ok) return Response.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }, { status: 401 });
  const token = await createSession({ username: user.username, email: user.email, role: user.role });
  cookies().set('session', token, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
  const redirectTo = user.role === 'admin_gudang' ? '/admin/stok-barang' : '/kepala-gudang/dashboard-analisis';
  return Response.json({ role: user.role, redirectTo });
}
