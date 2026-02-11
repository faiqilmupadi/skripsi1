import { readSession } from '@/lib/auth/session';

export async function GET() {
  const session = await readSession();
  if (!session) return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
  return Response.json({ username: session.username, role: session.role, email: session.email });
}
