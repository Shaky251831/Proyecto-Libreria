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
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Betsa aquí conectas con la API de Laravel para el registro
    alert('¡Cuenta creada con éxito!');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        
        <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '20px' }}>Crear Cuenta</h2>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Nombre Completo" 
            required 
          />
        </div>

        <div className="input-group">
          <input 
            type="email" 
            placeholder="Correo Electrónico" 
            required 
          />
          <span className="error-text">*Introduce un correo válido</span>
        </div>

        <div className="input-group">
          <input 
            type="password" 
            placeholder="Contraseña" 
            required 
          />
          <span className="error-text">*La contraseña debe tener al menos 8 caracteres</span>
        </div>

        <div className="input-group">
          <input 
            type="password" 
            placeholder="Confirmar contraseña" 
            required 
          />
        </div>

        <button type="submit" className="btn-submit">
          Registrarse
        </button>

        <div className="auth-links">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
        </div>

      </form>
    </div>
  );
}