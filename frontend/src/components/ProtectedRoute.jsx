import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles, userRole, children }) {
  // Obtener el usuario guardado en localStorage
  const userString = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userString ? JSON.parse(userString) : null;

  // 1. Si no hay token o usuario, redirige al Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = userRole || user.rol_id || user.role;

  
  if (allowedRoles) {
    const isAllowed = allowedRoles.some(
      (role) => role === currentRole || String(role) === String(currentRole)
    );

    if (!isAllowed) {
      alert('Acceso denegado: No tienes permisos de administrador.');
      return <Navigate to="/catalogo" replace />;
    }
  }

  return children ? children : <Outlet />;
}