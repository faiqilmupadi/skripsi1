import { ReactNode } from 'react';

export default function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return <div className="card overflow-auto"><table className="w-full text-sm"><thead><tr>{headers.map((h) => <th className="text-left p-2" key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
