'use client';
import { useEffect, useState } from 'react';
import AdminPerformanceChart from '@/components/charts/AdminPerformanceChart';
import MovingItemsBarChart from '@/components/charts/MovingItemsBarChart';

export default function Page() {
  const [admin, setAdmin] = useState<any[]>([]);
  const [fast, setFast] = useState<any[]>([]);
  const [slow, setSlow] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analytics/admin-performance').then((r) => r.json()).then(setAdmin);
    fetch('/api/analytics/moving-items?mode=fast').then((r) => r.json()).then(setFast);
    fetch('/api/analytics/moving-items?mode=slow').then((r) => r.json()).then(setSlow);
    fetch('/api/restock/process').then((r) => r.json()).then(setAlerts);
  }, []);

  return <div className="space-y-6"><h1 className="text-2xl font-semibold">Dashboard Analisis</h1><div className="card"><h3 className="font-semibold mb-2">Notifikasi Restock</h3><div className="space-y-2">{alerts.map((a) => <div key={a.requestId} className="flex justify-between border rounded-xl p-3"><span>{a.requestId} - {a.partNumber}</span><button className="bg-blue-600 text-white rounded-lg px-3 py-1" onClick={() => fetch('/api/restock/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: a.requestId }) })}>Proses Restock</button></div>)}</div></div><AdminPerformanceChart data={admin} /><MovingItemsBarChart data={fast} title="Top 10 Fast Moving" /><MovingItemsBarChart data={slow} title="Top 10 Slow Moving" /></div>;
}
