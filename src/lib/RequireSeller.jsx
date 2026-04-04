import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

export default function RequireSeller({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoadingAuth && user && !user.is_admin && !user.is_seller) {
      toast.error('Sem permissão para acessar a área do vendedor.');
    }
  }, [isLoadingAuth, user]);

  if (isLoadingAuth) return null;
  if (!user) return <Navigate to="/conta" replace state={{ from: location }} />;
  if (!user.is_admin && !user.is_seller) return <Navigate to="/" replace />;
  return children;
}

