'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscribeToAuthChanges } from '@/app/lib/firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';

type User = {
  uid: string;
  fullName: string;
  email: string;
  role: 'admin' | 'editor';
  avatarUrl?: string;
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'editor' | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (authUser) => {
      setIsAuthenticated(!!authUser);

      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: authUser.uid,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            avatarUrl: userData.avatarUrl,
          });
          setUserRole(userData.role);
        }
      } else {
        setUser(null);
        setUserRole(null);
        router.push('/login');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return { isAuthenticated, userRole, user, loading };
};