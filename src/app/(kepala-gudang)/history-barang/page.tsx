'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/DataTable';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { fetch('/api/stock-movements').then((r) => r.json()).then(setRows); }, []);
  return <div className="space-y-4"><h1 className="text-2xl font-semibold">History Barang</h1><a className="text-blue-600 underline" href="/api/stock-movements/export">Export CSV</a><DataTable headers={['Data']}>{rows.map((r, i) => <tr key={i}><td className="p-2">{JSON.stringify(r)}</td></tr>)}</DataTable></div>;
}
