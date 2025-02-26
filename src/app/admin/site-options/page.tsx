'use client';

import { useAuth } from '@/app/hooks/useAuth';

export default function UsersPage() {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className="p-12">
      <h1 className="text-2xl font-bold mb-4">Site Options</h1>
      <p className="mb-8">Change settings that apply to the entire site</p>
    </div>
  );
}