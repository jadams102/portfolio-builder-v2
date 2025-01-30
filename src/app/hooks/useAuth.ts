'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { subscribeToAuthChanges } from '@/app/lib/firebase/auth';

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);
};