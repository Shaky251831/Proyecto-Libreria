import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'error', texto: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!email.trim() || !email.includes('@')) {
      setMensaje({ tipo: 'error', texto: 'Introduce un correo válido.' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/forgot-password', { email });
      setMensaje({ tipo: 'success', texto: response.data.message || 'Se envió un enlace de recuperación a tu correo.' });
    } catch (error) {
      const texto = error.response?.data?.message || 'No se pudo enviar el enlace. Intenta de nuevo.';
      setMensaje({ tipo: 'error', texto });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#2C3E50', fontSize: '22px', margin: '10px 0 0 0' }}>Recuperar Contraseña</h2>
          <span style={{ fontSize: '11px', color: '#555', letterSpacing: '2px' }}>MUNDOS DE TINTA</span>
        </div>

        <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>
          Escribe el correo con el que te registraste y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {mensaje && (
          <div
            className={mensaje.tipo === 'error' ? 'error-message' : ''}
            style={{
              marginBottom: '15px',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '6px',
              background: mensaje.tipo === 'success' ? '#d4edda' : undefined,
              color: mensaje.tipo === 'success' ? '#155724' : undefined,
            }}
          >
            {mensaje.texto}
          </div>
        )}

        <div className="input-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>

        <div className="auth-links">
          <Link to="/login">Volver a Iniciar Sesión</Link>
        </div>
      </form>
    </div>
  );
}
