import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">📚 Mundos de Tinta</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrito">Carrito</Link> 

      
        {user?.role === 'admin' && (
          <Link to="/admin/dashboard">Panel Admin</Link>
        )}
        {user?.role === 'cliente' && (
          <Link to="/historial">Mis Compras</Link>
        )}
      </div>

      <div className="navbar-user">
        {user ? (
          <div className="user-info">
            <Link to="/perfil" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="user-name">👤 {user.name}</span>
              <span className="user-role">({user.role})</span>
            </Link>
            
            <button onClick={onLogout} className="logout-btn">Cerrar Sesión</button>
          </div>
        ) : (
          <Link to="/login" className="login-link">Iniciar Sesión</Link>
        )}
      </div>
    </nav>
  );
}