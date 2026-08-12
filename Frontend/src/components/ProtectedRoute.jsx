import { Navigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // or a spinner, while we check localStorage on first load
  }

  if (!user) {
    // Send them to login, remembering where they were headed
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;