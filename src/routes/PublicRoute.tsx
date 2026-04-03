import useAuthUser from '@/hooks/useAuthUser';
import React from 'react';
import { Navigate } from 'react-router-dom';

type PublicRouteProps = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: PublicRouteProps): React.JSX.Element {
  const { user, loading } = useAuthUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
