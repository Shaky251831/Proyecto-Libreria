import React, { useState } from 'react';
import './Auth.css'; // O tus estilos correspondientes

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // Validación en tiempo real conforme el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validaciones específicas por campo
    if (name === 'name') {
      if (value.trim() === '') {
        setErrors((prev) => ({ ...prev, name: 'El nombre es obligatorio.' }));
      } else {
        setErrors((prev) => ({ ...prev, name: '' }));
      }
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Ingresa un correo electrónico válido.' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }

    if (name === 'password') {
      if (value.length < 6) {
        setErrors((prev) => ({ ...prev, password: 'La contraseña debe tener al menos 6 caracteres.' }));
      } else {
        setErrors((prev) => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Si no hay errores y los campos no están vacíos, puedes enviar a la API de Laravel
    if (!errors.name && !errors.email && !errors.password && formData.name) {
      console.log('Datos listos para enviar:', formData);
      alert('¡Registro validado con éxito!');
    } else {
      alert('Por favor, corrige los errores antes de continuar.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Registro - Mundos de Tinta</h2>
        
        <div className="input-group">
          <label>Nombre completo</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

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
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="btn-submit">Registrarse</button>
      </form>
    </div>
  );
}