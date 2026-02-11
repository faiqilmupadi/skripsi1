'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function MovingItemsBarChart({ data, title }: { data: Array<{ partNumber: string; outSharePct: number }>; title: string }) {
  return <div className="card h-80"><h3 className="font-semibold mb-2">{title}</h3><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="partNumber" /><YAxis /><Tooltip /><Bar dataKey="outSharePct" fill="#3b82f6" /></BarChart></ResponsiveContainer></div>;
}
