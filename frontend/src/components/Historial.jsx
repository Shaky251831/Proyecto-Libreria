import React from 'react';

export default function Historial() {
  // Datos simulados de las compras del cliente
  const transacciones = [
    { id: 101, fecha: '2026-07-25', total: 449, estado: 'Completado', libros: 'Cien años de soledad, El Principito' },
    { id: 102, fecha: '2026-07-28', total: 350, estado: 'En proceso', libros: 'Don Quijote de la Mancha' }
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Historial de Mis Transacciones</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Consulta el estatus de tus compras y pedidos realizados en Mundos de Tinta.</p>

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
          {transacciones.map(t => (
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
                  background: t.estado === 'Completado' ? '#d4edda' : '#fff3cd',
                  color: t.estado === 'Completado' ? '#155724' : '#856404'
                }}>
                  {t.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}