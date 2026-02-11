'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SidebarAdmin() {
  const router = useRouter();
  return <aside className="h-screen sticky top-0 w-64 bg-white border-r p-6 flex flex-col">
    <h2 className="text-xl font-semibold text-primary mb-8">Admin Gudang</h2>
    <nav className="flex-1"><Link href="/admin/stok-barang" className="block rounded-xl px-3 py-2 hover:bg-blue-50">Stok Barang</Link></nav>
    <button className="rounded-xl bg-blue-600 text-white py-2" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.replace('/login'); }}>Logout</button>
  </aside>;
}
