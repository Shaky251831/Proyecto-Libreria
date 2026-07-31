import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

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
    
    // Limpieza estricta: solo permite números en el teléfono
    if (name === 'telefono') {
      value = value.replace(/\D/g, ''); 
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

    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.email.includes('@')) newErrors.email = 'Introduce un correo válido.';
    
    if (!formData.telefono?.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio para notificaciones.';
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

      if (setUser) setUser(user);

      alert('¡Bienvenido a la comunidad de Mundos de Tinta!');
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
        setErrors({ apiError: 'Servicio no disponible temporalmente.' });
      }
    } finally {
      setLoading(false); 
    }
  };

  // Estilos "Nova Style" en línea para rápida implementación
  const containerStyle = {
    backgroundColor: '#121212',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    padding: '20px'
  };

  const formStyle = {
    backgroundColor: '#1a1a1a',
    padding: '50px 40px',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
  };

  const inputContainerStyle = {
    marginBottom: '20px',
    position: 'relative'
  };

  const labelStyle = {
    display: 'block',
    color: '#888',
    fontSize: '0.75rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #444',
    color: '#fff',
    padding: '10px 0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  };

  const errorTextStyle = {
    color: '#e74c3c',
    fontSize: '0.75rem',
    marginTop: '5px',
    display: 'block'
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={formStyle}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#c5a059', fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Mundos de Tinta
          </h1>
          <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 'normal', margin: '0' }}>
            Crear una cuenta
          </h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '10px' }}>
            Únete a nuestra comunidad de lectores exclusivos.
          </p>
        </div>

        {errors.apiError && (
          <div style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid #e74c3c', color: '#e74c3c', padding: '10px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
            {errors.apiError}
          </div>
        )}

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Nombre Completo</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={{...inputStyle, borderBottomColor: errors.nombre ? '#e74c3c' : '#444'}} disabled={loading} placeholder="Ej. Ana García" />
          {errors.nombre && <span style={errorTextStyle}>{errors.nombre}</span>}
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Correo Electrónico</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={{...inputStyle, borderBottomColor: errors.email ? '#e74c3c' : '#444'}} disabled={loading} placeholder="correo@ejemplo.com" />
          {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Teléfono (WhatsApp / SMS)</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} maxLength={10} style={{...inputStyle, borderBottomColor: errors.telefono ? '#e74c3c' : '#444'}} disabled={loading} placeholder="10 dígitos" />
          {errors.telefono && <span style={errorTextStyle}>{errors.telefono}</span>}
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} style={{...inputStyle, borderBottomColor: errors.password ? '#e74c3c' : '#444', paddingRight: '40px'}} disabled={loading} placeholder="Mínimo 8 caracteres" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0', top: '10px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Confirmar Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input type={showConfirmPassword ? "text" : "password"} name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} style={{...inputStyle, borderBottomColor: errors.password_confirmation ? '#e74c3c' : '#444', paddingRight: '40px'}} disabled={loading} placeholder="Repite tu contraseña" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0', top: '10px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password_confirmation && <span style={errorTextStyle}>{errors.password_confirmation}</span>}
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#c5a059', color: '#121212', border: 'none', padding: '14px', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px', transition: 'background-color 0.3s' }}>
          {loading ? 'Procesando...' : 'Crear Cuenta'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '25px', color: '#888', fontSize: '0.85rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#c5a059', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión</Link>
        </div>

      </form>
    </div>
  );
}