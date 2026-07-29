import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    }
    if (!formData.email.includes('@')) {
      newErrors.email = 'Introduce un correo válido.';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true); 

    // Simulamos tiempo de respuesta del servidor (Laravel)
    setTimeout(() => {
      setLoading(false); 
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        
        <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '20px' }}>Crear Cuenta</h2>

        <div className="input-group">
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre Completo" 
            className={errors.name ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="input-group">
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo Electrónico" 
            className={errors.email ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.email ? (
            <span className="error-message">{errors.email}</span>
          ) : (
            <span className="error-text">*Introduce un correo válido</span>
          )}
        </div>

        <div className="input-group">
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña" 
            className={errors.password ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.password ? (
            <span className="error-message">{errors.password}</span>
          ) : (
            <span className="error-text">*La contraseña debe tener al menos 8 caracteres</span>
          )}
        </div>

        <div className="input-group">
          <input 
            type="password" 
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirmar contraseña" 
            className={errors.password_confirmation ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.password_confirmation && <span className="error-message">{errors.password_confirmation}</span>}
        </div>

        {}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <div className="auth-links">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
        </div>

      </form>
    </div>
  );
}