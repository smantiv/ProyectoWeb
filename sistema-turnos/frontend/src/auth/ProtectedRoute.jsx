import { Navigate, useLocation } from 'react-router-dom';
import { canAccess, homeForRole } from './accessControl';
import { useAuth } from '../context/useAuth';

export function ProtectedRoute({ roles = [], children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!canAccess(user, roles)) {
    return <Navigate to={homeForRole(user.rol)} replace />;
  }

  return children;
}
