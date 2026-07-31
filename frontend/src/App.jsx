import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import SideCart from './components/SideCart';
import LoginModal from './components/LoginModal';
import Home from './components/Home';
import Profile from './components/Profile';
import Catalogo from './components/Catalogo';
import Dashboard from './components/Dashboard';
import Historial from './components/Historial';
import ConfirmarPedido from './components/ConfirmarPedido';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DetalleLibro from './components/DetalleLibro';
import CategoriasAdmin from './components/CategoriasAdmin';
import AdminPrestamos from './components/AdminPrestamos';
import MisPrestamos from './components/MisPrestamos';
import { CartProvider } from './context/CartContext';
import { UIProvider } from './context/UIContext';

function MainContent({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/catalogo" element={<Catalogo user={user} />} />
        <Route path="/libro/:id" element={<DetalleLibro />} />
        <Route path="/perfil" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/confirmar-pedido" element={<ConfirmarPedido />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[1, 'admin']} userRole={user?.rol_id || user?.role}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 'admin', 'Administrador', 'Empleado']} userRole={user?.rol_id || user?.role}>
              <CategoriasAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/prestamos"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 'admin', 'Administrador', 'Empleado']} userRole={user?.rol_id || user?.role}>
              <AdminPrestamos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleado/panel"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 'admin', 'Administrador', 'Empleado']} userRole={user?.rol_id || user?.role}>
              <Dashboard puedeEliminar={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-prestamos"
          element={
            <ProtectedRoute allowedRoles={[3, 'Cliente', 'cliente']} userRole={user?.rol_id || user?.role}>
              <MisPrestamos />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SideCart />
      <LoginModal setUser={setUser} />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <CartProvider>
        <UIProvider>
          <MainContent user={user} setUser={setUser} />
        </UIProvider>
      </CartProvider>
    </Router>
  );
}