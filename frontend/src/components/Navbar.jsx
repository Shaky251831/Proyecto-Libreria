import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  // Evaluamos el rol basándonos en la estructura del objeto 'rol' que manda Laravel
  const rolId = user?.rol?.id || user?.rol_id;
  const rolNombre = user?.rol?.nombre || user?.role || '';
  const rolNombreLower = rolNombre.toLowerCase();

  const esAdmin = rolId === 1 || rolNombreLower.includes('administrador') || rolNombreLower === 'admin';
  const esEmpleado = rolId === 2 || rolNombreLower.includes('empleado') || rolNombreLower === 'vendedor';
  const esCliente = rolId === 3 || rolNombreLower.includes('cliente');

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">📚 Mundos de Tinta</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrito">Carrito</Link> 

        {/* Enlaces exclusivos para ADMINISTRADOR */}
        {esAdmin && (
          <>
            <Link to="/admin/dashboard">Panel Admin</Link>
            <Link to="/admin/categorias">Categorías</Link>
            <Link to="/admin/prestamos">Préstamos</Link>
          </>
        )}

        {/* Enlaces exclusivos para EMPLEADO */}
        {esEmpleado && (
          <>
            <Link to="/empleado/panel">Panel Empleado</Link>
            <Link to="/admin/prestamos">Préstamos</Link>
          </>
        )}

        {/* Enlaces exclusivos para CLIENTE */}
        {esCliente && (
            <>
           <Link to="/historial">Mis Compras</Link>
           <Link to="/mis-prestamos">Mis Préstamos</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        {user ? (
          <div className="user-info">
            <Link to="/perfil" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="user-name">👤 {user.nombre || user.name}</span>
              <span className="user-role">({rolNombre || (esAdmin ? 'Administrador' : esEmpleado ? 'Empleado' : 'Cliente')})</span>
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