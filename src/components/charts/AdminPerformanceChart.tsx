'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function AdminPerformanceChart({ data }: { data: Array<{ userName: string; kinerja: number }> }) {
  return <div className="card h-80"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="userName" /><YAxis /><Tooltip /><Bar dataKey="kinerja" fill="#2563eb" /></BarChart></ResponsiveContainer></div>;
}
