import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../components/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // still checking localStorage on first load
  }

  if (!user) {
    // Not logged in at all — send to login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'admin') {
    // Logged in, but not an admin — send back to the storefront
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;