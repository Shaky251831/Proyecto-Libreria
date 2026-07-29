import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de inicio de sesión, Betsa: ajusta con tu lógica con Laravel.
    if (email === 'admin@admin.com') {
      setUser({ name: 'Bris Márquez', role: 'admin' });
      navigate('/admin/dashboard');
    } else {
      setUser({ name: 'Usuario', role: 'client' });
      navigate('/catalogo');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#2C3E50', fontSize: '22px', margin: '10px 0 0 0' }}>Mundos de Tinta</h2>
          <span style={{ fontSize: '11px', color: '#555', letterSpacing: '2px' }}>LIBRERÍA</span>
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Correo o usuario" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <div style={{ textAlign: 'right', marginTop: '4px' }}>
            <a href="#" style={{ fontSize: '11px', color: '#d9534f', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
          </div>
          
          {/* Requisitos de contraseña*/}
          <div className="error-text" style={{ fontSize: '10px', lineHeight: '1.3', marginTop: '6px' }}>
            • Debe tener al menos 8 caracteres.<br />
            • Una mayúscula.<br />
            • Un número.<br />
            • Un carácter especial.
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Entrar
        </button>

        <div className="auth-links">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>

      </form>
    </div>
  );
}