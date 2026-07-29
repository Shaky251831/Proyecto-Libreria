import React, { useState } from 'react';
import './Auth.css';

export default function Profile({ user, setUser }) {
  // Estado local para simular la edición del perfil
  const [name, setName] = useState(user?.name || 'Bris Márquez');
  const [email, setEmail] = useState(user?.email || 'admin@admin.com');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    
    // Se actualiza el estado del usuario
    setUser(prev => ({ ...prev, name, email }));
    setSuccessMessage('¡Perfil actualizado con éxito!');

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="auth-form" style={{ maxWidth: '100%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        
        <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '10px' }}>Mi Perfil</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '13px', marginBottom: '20px' }}>
          Administra la información de tu cuenta en Mundos de Tinta.
        </p>

        {successMessage && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="input-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Nombre Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Rol en el Sistema</label>
            <input 
              type="text" 
              value={user?.role === 'admin' ? 'Administrador' : 'Cliente'} 
              disabled 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ddd', background: '#f5f5f5', color: '#666' }}
            />
          </div>

          <button type="submit" className="btn-submit" style={{ width: '100%', padding: '12px' }}>
            Guardar Cambios
          </button>
        </form>

      </div>
    </div>
  );
}