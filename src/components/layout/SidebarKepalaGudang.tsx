'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const menus = [
  ['/kepala-gudang/dashboard-analisis', 'Dashboard Analisis'],
  ['/kepala-gudang/manajemen-akun', 'Manajemen Akun'],
  ['/kepala-gudang/katalog-barang', 'Katalog Barang'],
  ['/kepala-gudang/history-barang', 'History Barang'],
] as const;

export default function SidebarKepalaGudang() {
  const router = useRouter();
  return <aside className="h-screen sticky top-0 w-64 bg-white border-r p-6 flex flex-col">
    <h2 className="text-xl font-semibold text-primary mb-8">Kepala Gudang</h2>
    <nav className="space-y-2 flex-1">{menus.map(([href, label]) => <Link key={href} href={href} className="block rounded-xl px-3 py-2 hover:bg-blue-50">{label}</Link>)}</nav>
    <button className="rounded-xl bg-blue-600 text-white py-2" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.replace('/login'); }}>Logout</button>
  </aside>;
}
