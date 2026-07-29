import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Introduce un correo válido.';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true); 

    // Simular un retraso de red de 1.5 segundos, después irá la petición Axios.
    setTimeout(() => {
      setLoading(false); 

      if (email === 'admin@admin.com') {
        setUser({ name: 'Bris Márquez', role: 'admin' });
        navigate('/admin/dashboard');
      } else {
        setUser({ name: 'Usuario', role: 'client' });
        navigate('/catalogo');
      }
    }, 1500);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#2C3E50', fontSize: '22px', margin: '10px 0 0 0' }}>Mundos de Tinta</h2>
          <span style={{ fontSize: '11px', color: '#555', letterSpacing: '2px' }}>LIBRERÍA</span>
        </div>

        <div className="input-group">
          <input 
            type="email" 
            placeholder="Correo o usuario" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: '' });
            }}
            className={errors.email ? 'input-error' : ''}
            disabled={loading} 
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="input-group">
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
            }}
            className={errors.password ? 'input-error' : ''}
            disabled={loading} 
          />
          {errors.password && <span className="error-message">{errors.password}</span>}

          <div style={{ textAlign: 'right', marginTop: '4px' }}>
            <a href="#" style={{ fontSize: '11px', color: '#d9534f', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
          </div>
        </div>

        {}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </button>

        <div className="auth-links">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>

      </form>
    </div>
  );
}