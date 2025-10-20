import { useAuthStore } from '@/hooks/useAuthStore';
import { Navigate } from 'react-router-dom';
interface ProtectedRouteProps {
  children: React.ReactNode;
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}