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

  // Extraemos el rol de forma segura contemplando la estructura de Laravel
  const rolId = user.rol?.id || user.rol_id;
  const rolNombre = user.rol?.nombre || user.role || '';
  
  // currentRole puede evaluarse por ID (ej. 1) o por nombre (ej. 'Administrador', 'admin')
  const currentRole = userRole || rolId;

  if (allowedRoles) {
    const isAllowed = allowedRoles.some((role) => {
      // Comparamos si coincide con el ID numérico o con el nombre del rol en texto
      return (
        role === rolId || 
        String(role) === String(rolId) ||
        String(role).toLowerCase() === String(rolNombre).toLowerCase()
      );
    });

    if (!isAllowed) {
      alert('Acceso denegado: No tienes permisos de administrador.');
      return <Navigate to="/catalogo" replace />;
    }
  }

  return children ? children : <Outlet />;
}