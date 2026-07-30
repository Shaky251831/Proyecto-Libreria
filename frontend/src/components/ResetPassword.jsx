import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import './Auth.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // El enlace que Laravel envía por correo trae ?token=...&email=...
  const [token] = useState(searchParams.get('token') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!token) {
      setMensaje({ tipo: 'error', texto: 'El enlace no es válido o le falta el token. Solicita uno nuevo.' });
      return;
    }
    if (password !== passwordConfirmation) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden.' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMensaje({ tipo: 'success', texto: response.data.message || 'Contraseña actualizada correctamente.' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const texto = error.response?.data?.message || 'El token es inválido o ha expirado.';
      setMensaje({ tipo: 'error', texto });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#2C3E50', fontSize: '22px', margin: '10px 0 0 0' }}>Nueva Contraseña</h2>
          <span style={{ fontSize: '11px', color: '#555', letterSpacing: '2px' }}>MUNDOS DE TINTA</span>
        </div>

        {mensaje && (
          <div
            style={{
              marginBottom: '15px',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '6px',
              background: mensaje.tipo === 'success' ? '#d4edda' : '#f8d7da',
              color: mensaje.tipo === 'success' ? '#155724' : '#721c24',
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

        <div className="input-group">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            disabled={loading}
          />
        </div>

        <p style={{ fontSize: '11px', color: '#888', marginBottom: '10px' }}>
          Debe incluir mayúscula, minúscula, número y carácter especial (@$!%*?&amp;), mínimo 8 caracteres.
        </p>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Restablecer Contraseña'}
        </button>

        <div className="auth-links">
          <Link to="/login">Volver a Iniciar Sesión</Link>
        </div>
      </form>
    </div>
  );
}
