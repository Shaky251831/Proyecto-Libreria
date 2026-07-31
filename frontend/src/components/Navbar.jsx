import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  const { totalItems, toggleCart } = useCart();
  const { openLogin } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const rolId = user?.rol?.id || user?.rol_id;
  const rolNombre = user?.rol?.nombre || user?.role || '';
  const rolNombreLower = String(rolNombre).toLowerCase();

  const esAdmin = rolId === 1 || rolNombreLower.includes('administrador') || rolNombreLower === 'admin';
  const esEmpleado = rolId === 2 || rolNombreLower.includes('empleado') || rolNombreLower === 'vendedor';
  const esCliente = rolId === 3 || rolNombreLower.includes('cliente');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`mdt-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="mdt-nav-inner">
        <Link to="/" className="mdt-nav-brand mdt-serif">
          Mundos de Tinta
        </Link>

        <div className={`mdt-nav-links ${mobileOpen ? 'is-open' : ''}`}>
          <Link to="/" onClick={() => setMobileOpen(false)}>Inicio</Link>
          <Link to="/catalogo" onClick={() => setMobileOpen(false)}>Catálogo</Link>

          {esAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}>Panel Admin</Link>
              <Link to="/admin/categorias" onClick={() => setMobileOpen(false)}>Categorías</Link>
              <Link to="/admin/prestamos" onClick={() => setMobileOpen(false)}>Préstamos</Link>
            </>
          )}
          {esEmpleado && (
            <>
              <Link to="/empleado/panel" onClick={() => setMobileOpen(false)}>Panel Empleado</Link>
              <Link to="/admin/prestamos" onClick={() => setMobileOpen(false)}>Préstamos</Link>
            </>
          )}
          {esCliente && (
            <>
              <Link to="/historial" onClick={() => setMobileOpen(false)}>Mis Compras</Link>
              <Link to="/mis-prestamos" onClick={() => setMobileOpen(false)}>Mis Préstamos</Link>
            </>
          )}

          <div className="mdt-nav-mobile-only">
            {user ? (
              <>
                <Link to="/perfil" onClick={() => setMobileOpen(false)}>Mi perfil</Link>
                <button className="mdt-nav-mobile-logout" onClick={onLogout}>Cerrar sesión</button>
              </>
            ) : (
              <button className="mdt-nav-mobile-logout" onClick={() => { setMobileOpen(false); openLogin(); }}>
                Iniciar sesión
              </button>
            )}
          </div>
        </div>

        <div className="mdt-nav-actions">
          {!esAdmin && (
            <button className="mdt-nav-icon-btn" onClick={toggleCart} aria-label="Abrir carrito">
              <ShoppingBag size={19} strokeWidth={1.5} />
              {totalItems > 0 && <span className="mdt-nav-badge">{totalItems}</span>}
            </button>
          )}

          {user ? (
            <Link to="/perfil" className="mdt-nav-user">
              <User size={16} strokeWidth={1.5} />
              <span>{user.nombre || user.name}</span>
            </Link>
          ) : (
            <button className="mdt-btn mdt-btn-outline mdt-nav-login" onClick={openLogin}>
              Iniciar sesión
            </button>
          )}

          {user && (
            <button className="mdt-nav-logout" onClick={onLogout}>Salir</button>
          )}

          <button className="mdt-nav-burger" onClick={() => setMobileOpen((v) => !v)} aria-label="Menú">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
