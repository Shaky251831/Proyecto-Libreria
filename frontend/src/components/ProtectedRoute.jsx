import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles, userRole }) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}