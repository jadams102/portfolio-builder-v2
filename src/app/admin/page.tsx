'use client';

import { useAuth } from '@/app/hooks/useAuth';

export default function AdminPage() {
  useAuth(); // Protect this page

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
}