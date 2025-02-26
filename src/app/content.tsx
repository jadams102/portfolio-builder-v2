'use client';

import { useState } from 'react';
import AdminSidebar from './admin/sidebar';
import { useAuth } from '../app/hooks/useAuth';

export default function Content({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      {isAuthenticated && (
        <div className="relative">
          <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <button
            onClick={toggleSidebar}
            className={`absolute top-2 ${
              isSidebarOpen ? 'left-64' : 'left-0'
            } z-50 p-2 bg-dark-gray text-white rounded-r-md shadow-lg hover:text-red-600 transition-all duration-300`}
          >
            {isSidebarOpen ? '◄' : '►'}
          </button>
        </div>
      )}
      <div
        className={`flex-grow transition-all duration-300 ${
          isSidebarOpen ? 'ml-64 min-w-[calc(100%-16rem)]' : 'ml-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}