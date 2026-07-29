import React, { useState } from 'react';

export default function AdminPrestamos() {
  // Simulando transacciones y préstamos pendientes
  const [prestamos, setPrestamos] = useState([
    { id: 1, usuario: 'Bris Márquez', libro: 'Cien años de soledad', tipo: 'Compra', estado: 'Pagado', fecha: '2026-07-28' },
    { id: 2, usuario: 'Juan Pérez', libro: 'El Principito', tipo: 'Préstamo', estado: 'Pendiente de devolución', fecha: '2026-07-29' }
  ]);

  const cambiarEstado = (id) => {
    setPrestamos(prestamos.map(p => {
      if (p.id === id) {
        return { ...p, estado: p.estado === 'Pendiente de devolución' ? 'Devuelto' : 'Pendiente de devolución' };
      }
      return p;
    }));
  };

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
          {prestamos.map(p => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}