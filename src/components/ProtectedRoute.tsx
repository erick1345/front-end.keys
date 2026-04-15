import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const adminPaths = [
  '/dashboard-admin',
  '/manage-games',
  '/add-game',
  '/edit-game',
];

function isAdminArea(pathname: string) {
  return adminPaths.some((path) => pathname.startsWith(path));
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const adminArea = isAdminArea(location.pathname);

  const token = localStorage.getItem(adminArea ? 'adminToken' : 'userToken');
  const userRaw = localStorage.getItem(adminArea ? 'adminUser' : 'userUser');

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userRaw);

  if (adminArea && user.nivel_acesso !== 'admin') {
    return <Navigate to="/store" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;