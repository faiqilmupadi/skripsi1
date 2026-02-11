import { ReactNode } from 'react';
import SidebarKepalaGudang from '@/components/layout/SidebarKepalaGudang';

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="flex"><SidebarKepalaGudang /><main className="flex-1 p-8 space-y-6">{children}</main></div>;
}
