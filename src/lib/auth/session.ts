import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/domain';

const key = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret');

export type SessionPayload = { username: string; email: string; role: UserRole };

export async function createSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function readSession() {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
