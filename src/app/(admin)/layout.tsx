import { ReactNode } from 'react';
import SidebarAdmin from '@/components/layout/SidebarAdmin';

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="flex"><SidebarAdmin /><main className="flex-1 p-8">{children}</main></div>;
}
