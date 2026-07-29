import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Catalogo from './components/Catalogo';
import Carrito from './components/Carrito';
import Dashboard from './components/Dashboard';

function MainContent({ user, setUser }) {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  const handleLogout = () => {
    setUser(null);
    alert('Sesión cerrada');
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
  const [user, setUser] = useState({
    name: 'Bris Márquez',
    role: 'admin' 
  });

  return (
    <Router>
      <MainContent user={user} setUser={setUser} />
    </Router>
  );
}