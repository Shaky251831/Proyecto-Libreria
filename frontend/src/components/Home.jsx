import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Home() {
  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: '#D2E69C', fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '42px', color: '#2C3E50', margin: '0 0 10px 0', fontWeight: '700' }}>
          Mundos de Tinta
        </h1>
        <p style={{ fontSize: '14px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
          Librería Online
        </p>
      </div>

      <p style={{ fontSize: '18px', color: '#333', maxWidth: '600px', margin: '0 auto 35px auto', lineHeight: '1.6' }}>
        Descubre historias fascinantes, gestiona tus lecturas y explora nuestro catálogo exclusivo de libros.
      </p>

      {/* Botones de acción principales (Catálogo, Iniciar Sesión y Registrarse) */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/catalogo" style={{ backgroundColor: '#4A7C59', color: 'white', padding: '14px 28px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          Explorar Catálogo
        </Link>
        <Link to="/login" style={{ backgroundColor: '#ffffff', color: '#2C3E50', padding: '14px 28px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600', border: '1px solid #ccc' }}>
          Iniciar Sesión
        </Link>
        <Link to="/register" style={{ backgroundColor: '#333333', color: 'white', padding: '14px 28px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600' }}>
          Registrarse
        </Link>
      </div>

    </div>
  );
}