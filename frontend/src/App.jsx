import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const Login = () => <div style={{padding: '20px'}}><h2>Iniciar Sesión</h2></div>;
const CatalogoLibros = () => <div style={{padding: '20px'}}><h2>Catálogo de Libros (Público)</h2></div>;
const DashboardAdmin = () => <div style={{padding: '20px'}}><h2>Panel de Administrador (Ruta Protegida)</h2></div>;

export default function App() {
  
  const [user, setUser] = useState({
    name: 'Dolores Yassel',
    role: 'admin' 
  });

  const handleLogout = () => {
    setUser(null);
    alert('Sesión cerrada');
  };

  return (
    <Router>
      {}
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<CatalogoLibros />} />

        {}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']} userRole={user?.role}>
              <DashboardAdmin />
            </ProtectedRoute>
          } 
        />
        
        {}
        <Route path="*" element={<Navigate to="/catalogo" replace />} />
      </Routes>
    </Router>
  );
}