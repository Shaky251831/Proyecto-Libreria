import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Historial() {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/mis-compras')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setTransacciones(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar tu historial de compras.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Historial de Mis Transacciones</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Consulta el estatus de tus compras y pedidos realizados en Mundos de Tinta.</p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando historial...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>ID Pedido</th>
              <th style={{ padding: '12px' }}>Fecha</th>
              <th style={{ padding: '12px' }}>Libros</th>
              <th style={{ padding: '12px' }}>Total</th>
              <th style={{ padding: '12px' }}>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                  Aún no tienes compras registradas.
                </td>
              </tr>
            ) : (
              transacciones.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>#{t.id}</td>
                  <td style={{ padding: '12px' }}>{t.fecha}</td>
                  <td style={{ padding: '12px' }}>{t.libros}</td>
                  <td style={{ padding: '12px' }}>${t.total} MXN</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: (t.estado === 'Completado' || t.estado === 'completada') ? '#d4edda' : '#fff3cd',
                      color: (t.estado === 'Completado' || t.estado === 'completada') ? '#155724' : '#856404'
                    }}>
                      {t.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}