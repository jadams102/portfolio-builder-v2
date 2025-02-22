// app/users/page.tsx
'use client';

import { useAuth } from '@/app/hooks/useAuth';
import UsersList from './usersList';
import AddUserForm from './addUser';

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
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <p className="mb-8">Manage user accounts and permissions</p>
      <div className="mb-8">
        <UsersList />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <AddUserForm />
      </div>


    </div>
  );
}