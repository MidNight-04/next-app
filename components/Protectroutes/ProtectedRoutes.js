'use client';

import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.replace('/login');
    }
  }, [isAuth]);

  if (!isAuth) return null;

  return <>{children}</>;
}
