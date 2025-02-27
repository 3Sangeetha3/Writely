// AuthRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserQuery } from '../hooks';

const AuthRoute = () => {
  const { isCurrentUserLoading, currentUser } = useUserQuery();

  if (isCurrentUserLoading) return <div>Loading...</div>;
  if (!currentUser?.user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default AuthRoute;
