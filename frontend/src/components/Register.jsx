import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import './Auth.css';

function getErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return "Ocurrió un error inesperado. Intenta de nuevo.";
  if (data.message && !data.errors) return data.message;
  if (data.errors) {
    const primerCampo = Object.values(data.errors)[0];
    return Array.isArray(primerCampo) ? primerCampo[0] : String(primerCampo);
  }
  return "Ocurrió un error inesperado.";
}

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '', 
    password: '',
    password_confirmation: '',
    rol_id: 3
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'telefono') {
      value = value.replace(/\D/g, ''); // Elimina cualquier letra o símbolo
    }

    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: '',
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
    
    if (!formData.telefono?.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
    } else if (formData.telefono.length < 10) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos.';
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
      const response = await api.post('/register', formData);
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      if (setUser) {
        setUser(user);
      }

      alert('¡Cuenta registrada exitosamente!');
      navigate('/catalogo');

    } catch (error) {
  if (error.response && error.response.status === 422) {
    const rawErrors = error.response.data.errors || {};
    const normalized = {};
    Object.keys(rawErrors).forEach((campo) => {
      normalized[campo] = Array.isArray(rawErrors[campo]) ? rawErrors[campo][0] : rawErrors[campo];
    });
    setErrors(normalized);
  } else {
    setErrors({ apiError: 'No se pudo conectar con el servidor backend.' });
  }
} finally {
  setLoading(false); 
}
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        
        <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '20px' }}>Crear Cuenta</h2>

        {errors.apiError && <div className="error-message" style={{ marginBottom: '10px', textAlign: 'center' }}>{errors.apiError}</div>}
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
            type="tel" 
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Número de Teléfono (10 dígitos)" 
            maxLength={10}
            className={errors.telefono ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.telefono ? (
            <span className="error-message">{errors.telefono}</span>
          ) : (
            <span className="error-text">*Solo números (10 dígitos)</span>
          )}
        </div>
        <div className="input-group">
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña" 
              className={errors.password ? 'input-error' : ''}
              style={{ width: '100%', paddingRight: '40px' }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                display: 'flex',
                alignItems: 'center'
              }}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password ? (
            <span className="error-message">{errors.password}</span>
          ) : (
            <span className="error-text">*La contraseña debe tener al menos 8 caracteres</span>
          )}
        </div>
        <div className="input-group">
          <div style={{ position: 'relative' }}>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirmar contraseña" 
              className={errors.password_confirmation ? 'input-error' : ''}
              style={{ width: '100%', paddingRight: '40px' }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                display: 'flex',
                alignItems: 'center'
              }}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password_confirmation && <span className="error-message">{errors.password_confirmation}</span>}
        </div>

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
