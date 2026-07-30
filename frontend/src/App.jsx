import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Catalogo from './components/Catalogo';
import Carrito from './components/Carrito';
import Dashboard from './components/Dashboard';
import Historial from './components/Historial';
import ConfirmarPedido from './components/ConfirmarPedido';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DetalleLibro from './components/DetalleLibro';
import CategoriasAdmin from './components/CategoriasAdmin';
import AdminPrestamos from './components/AdminPrestamos';
import MisPrestamos from './components/MisPrestamos';

function MainContent({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate(); // <-- Ya está declarado aquí
  
  const hideNavbar =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password';
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {!hideNavbar && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/catalogo" element={<Catalogo />} />               
        <Route path="/libro/:id" element={<DetalleLibro />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/confirmar-pedido" element={<ConfirmarPedido />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={[1,'admin']} userRole={user?.rol_id || user?.role}>
              <Dashboard/>
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
      <MainContent user={user} setUser={setUser} />
    </Router>
  );
}