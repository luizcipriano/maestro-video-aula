
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { authState } = useAuth();
  
  // Check if user is authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role (if specified)
  if (allowedRoles && authState.user && !allowedRoles.includes(authState.user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
