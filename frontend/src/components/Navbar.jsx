import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/catalogo">📚 Mundos de Tinta</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrito">Carrito</Link> 
        <Link to="/register">Registrarse</Link>
        {user?.role === 'admin' && (
          <Link to="/admin/dashboard">Panel Admin</Link>
        )}
      </div>

      <div className="navbar-user">
        {user ? (
          <div className="user-info">
            <span className="user-name">👤 {user.name}</span>
            <span className="user-role">({user.role})</span>
            <button onClick={onLogout} className="logout-btn">Cerrar Sesión</button>
          </div>
        ) : (
          <Link to="/login" className="login-link">Iniciar Sesión</Link>
        )}
      </div>
    </nav>
  );
}