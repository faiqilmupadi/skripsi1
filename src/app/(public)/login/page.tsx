'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error?.message || 'Login gagal');
    router.replace(json.redirectTo);
  };

  return <main className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-50 to-white"><form onSubmit={submit} className="card w-full max-w-md space-y-4"><h1 className="text-2xl font-semibold">Login Warehouse</h1><input className="w-full border rounded-xl p-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /><input className="w-full border rounded-xl p-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="w-full bg-blue-600 text-white p-3 rounded-xl">Masuk</button></form></main>;
}
