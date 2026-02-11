import { NextResponse } from 'next/server';
import { readSession } from './session';
import { UserRole } from '@/types/domain';

export async function requireRole(role: UserRole) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
  if (session.role !== role) return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 });
  return session;
}
