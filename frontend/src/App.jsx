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

function MainContent({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate(); // <-- Ya está declarado aquí
  
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  
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
        <Route path="/catalogo" element={<Catalogo />} />               
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/confirmar-pedido" element={<ConfirmarPedido />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']} userRole={user?.role}>
              <Dashboard/>
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