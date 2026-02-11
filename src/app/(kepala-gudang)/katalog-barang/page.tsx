'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/DataTable';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { fetch('/api/materials').then((r) => r.json()).then(setRows); }, []);
  return <div className="space-y-4"><h1 className="text-2xl font-semibold">Katalog Barang</h1><DataTable headers={['Data']}>{rows.map((r, i) => <tr key={i}><td className="p-2">{JSON.stringify(r)}</td></tr>)}</DataTable></div>;
}
