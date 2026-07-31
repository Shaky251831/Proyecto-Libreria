import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function MisPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/mis-prestamos');
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setPrestamos(data);
    } catch (err) {
      // El detalle técnico (status, endpoint, etc.) solo se registra en consola;
      // al usuario le mostramos siempre un mensaje claro y accionable.
      const status = err.response?.status;
      if (status === 401) {
        setError('Tu sesión expiró. Inicia sesión de nuevo para ver tus préstamos.');
      } else {
        setError('No se pudo cargar tu historial de préstamos. Intenta de nuevo más tarde.');
      }
      console.error('Error al cargar /mis-prestamos:', err);
    } finally {
      setLoading(false);
    }
  };

  const estiloEstado = (estado) => {
    const valor = (estado || '').toLowerCase();
    if (valor.includes('devuelto') || valor.includes('completad')) {
      return { background: '#e2e3e5', color: '#383d41' };
    }
    if (valor.includes('atrasad') || valor.includes('cancelad')) {
      return { background: '#f8d7da', color: '#721c24' };
    }
    // pendiente / activo por defecto
    return { background: '#d4edda', color: '#155724' };
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando tus préstamos...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Mis Préstamos</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Consulta el estatus de los libros que tienes prestados en Mundos de Tinta.
      </p>

      {error ? (
        <div style={{ textAlign: 'center', color: '#721c24', background: '#f8d7da', padding: '12px', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 10px' }}>{error}</p>
          <button
            onClick={cargarPrestamos}
            style={{ background: '#721c24', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      ) : prestamos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>No tienes préstamos activos.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Libro(s)</th>
              <th style={{ padding: '12px' }}>Fecha de Solicitud</th>
              <th style={{ padding: '12px' }}>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>#{p.id}</td>
                <td style={{ padding: '12px' }}>{p.libro}</td>
                <td style={{ padding: '12px' }}>{p.fecha}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', ...estiloEstado(p.estado) }}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
