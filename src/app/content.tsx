// app/components/Content.tsx
'use client';

import { useState } from 'react';
import AdminSidebar from './admin/sidebar';
import { useAuth } from '../app/hooks/useAuth';

export default function Content({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
    
    {isAuthenticated && (
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    )}
      <div
        className={`flex-grow transition-all duration-300 ${
          isSidebarOpen ? 'ml-64 min-w-[calc(100%-16rem)]' : 'ml-0'
        }`}
      >
        {isAuthenticated && (
        <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700"
      >
        {isSidebarOpen ? '◄' : '►'}
      </button>        )}


        {children}
      </div>
    </div>
  );
}