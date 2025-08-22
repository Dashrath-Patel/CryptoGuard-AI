"use client";
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const DynamicDashboardLayout = dynamic(() => import('./dashboard-layout-inner'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
        <p>Loading Dashboard...</p>
      </div>
    </div>
  ),
});

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return <DynamicDashboardLayout children={children} />;
}
