import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/prestamos')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setPrestamos(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar las transacciones.');
        setLoading(false);
      });
  }, []);

  // Nota: este toggle sigue siendo solo visual (no persiste en BD),
  // igual que en el componente original. Avísame si quieres que lo
  // conecte a un endpoint real de cambio de estado.
  const cambiarEstado = (id) => {
    setPrestamos((prev) => prev.map(p => {
      if (p.id === id) {
        return { ...p, estado: p.estado === 'Pendiente de devolución' ? 'Devuelto' : 'Pendiente de devolución' };
      }
      return p;
    }));
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Cargando transacciones...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Panel de Administración - Gestión de Transacciones y Préstamos</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Control general de ventas de libros y préstamos activos en Mundos de Tinta.</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Usuario</th>
            <th style={{ padding: '12px' }}>Libro</th>
            <th style={{ padding: '12px' }}>Tipo</th>
            <th style={{ padding: '12px' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.length === 0 ? (
            <tr><td colSpan="6" style={{ padding: '12px', textAlign: 'center', color: '#666' }}>No hay transacciones registradas.</td></tr>
          ) : (
            prestamos.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>#{p.id}</td>
                <td style={{ padding: '12px' }}>{p.usuario}</td>
                <td style={{ padding: '12px' }}>{p.libro}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '4px', background: p.tipo === 'Compra' ? '#e2f0d9' : '#fff2cc', fontSize: '12px' }}>
                    {p.tipo}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{p.estado}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {p.tipo === 'Préstamo' && (
                    <button
                      onClick={() => cambiarEstado(p.id)}
                      style={{ background: '#3a6347', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Cambiar Estatus
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}