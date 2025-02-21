'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscribeToAuthChanges } from '@/app/lib/firebase/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setIsAuthenticated(!!user); // Update authentication state
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { isAuthenticated }; // Return authentication state
};