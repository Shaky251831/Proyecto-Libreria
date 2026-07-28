import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';


export default function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validación en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Ingresa un correo electrónico válido.' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }

    if (name === 'password') {
      if (value.trim() === '') {
        setErrors((prev) => ({ ...prev, password: 'La contraseña es obligatoria.' }));
      } else {
        setErrors((prev) => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.email && !errors.password && formData.email && formData.password) {
      
      setUser({ name: 'Bris Márquez', role: 'admin' });
      alert('¡Bienvenida de nuevo!');
      navigate('/catalogo');
    } else {
      alert('Por favor, corrige los errores antes de continuar.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Iniciar Sesión - Mundos de Tinta</h2>
        
        <div className="input-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="btn-submit">Entrar</button>
      </form>
    </div>
  );
}