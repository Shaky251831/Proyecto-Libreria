import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Auth.css';

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    password_confirmation: '',
    rol_id:3
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
      [e.target.name]: '',
      apiError: ''
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    let newErrors = {};

    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
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

    try {
      // 1. Petición real POST a Laravel (/api/register)
      const response = await api.post('/register', formData);
      const { access_token, user } = response.data;

      // 2. Guardar Token y Usuario en localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      if (setUser) {
        setUser(user);
      }

      alert('¡Cuenta registrada exitosamente!');
      navigate('/catalogo');

    } catch (error) {
      // Manejar errores devueltos por la API (HTTP 422: contraseña no válida o correo ya registrado)
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({ apiError: 'No se pudo conectar con el servidor backend.' });
      }
    } finally {
      setLoading(false); 
    }
  };
  const renderError = (field) => {
    if (!errors[field]) return null;
    const msg = Array.isArray(errors[field]) ? errors[field][0] : errors[field];
    return <span className="error-message">{msg}</span>;
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        
        <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '20px' }}>Crear Cuenta</h2>

        <div className="input-group">
          <input 
            type="text" 
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre Completo" 
            className={errors.nombre ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
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