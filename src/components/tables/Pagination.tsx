'use client';
export default function Pagination({ page, setPage }: { page: number; setPage: (n: number) => void }) {
  return <div className="flex gap-2"><button onClick={() => setPage(Math.max(1, page - 1))}>Prev</button><span>{page}</span><button onClick={() => setPage(page + 1)}>Next</button></div>;
}
