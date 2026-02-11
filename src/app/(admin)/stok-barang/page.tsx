'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/DataTable';

export default function StokBarangPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/stocks').then((r) => r.json()).then(setStocks);
    fetch('/api/alerts/rop').then((r) => r.json()).then(setAlerts);
  }, []);

  return <div className="space-y-6"><h1 className="text-2xl font-semibold">Stok Barang</h1><div className="card"><h3 className="font-semibold">ROP Alerts</h3><ul>{alerts.map((a) => <li key={a.partNumber + a.plant}>{a.partNumber} - {a.plant}</li>)}</ul></div><DataTable headers={['Part', 'Plant', 'Desc', 'Free', 'Blocked', 'ROP']}>
    {stocks.map((s) => <tr key={s.partNumber + s.plant}><td className="p-2">{s.partNumber}</td><td>{s.plant}</td><td>{s.materialDescription}</td><td>{s.freeStock}</td><td>{s.blocked}</td><td>{s.reorderPoint}</td></tr>)}
  </DataTable></div>;
}
