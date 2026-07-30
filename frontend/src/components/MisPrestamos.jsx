import React, { useState, useEffect } from 'react';


export default function MisPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    setLoading(true);
    // Betsa creas la de PrestamoController en el backend. Agregue ejmeplos simulados
    const datosSimulados = [
      {
        id: 1,
        libro: { titulo: 'El Hobbit' },
        estado: 'activo',
        fecha_inicial: '2026-07-20',
        fecha_limite: '2026-08-03',
        fecha_devolucion: null,
      },
      {
        id: 2,
        libro: { titulo: 'Dune' },
        estado: 'atrasado',
        fecha_inicial: '2026-07-05',
        fecha_limite: '2026-07-19',
        fecha_devolucion: null,
      },
      {
        id: 3,
        libro: { titulo: '1984' },
        estado: 'devuelto',
        fecha_inicial: '2026-06-10',
        fecha_limite: '2026-06-24',
        fecha_devolucion: '2026-06-22',
      },
    ];
    setPrestamos(datosSimulados);
    setLoading(false);
  };

  const estiloEstado = (estado) => {
    switch (estado) {
      case 'activo':
        return { background: '#d4edda', color: '#155724' };
      case 'atrasado':
        return { background: '#f8d7da', color: '#721c24' };
      case 'devuelto':
        return { background: '#e2e3e5', color: '#383d41' };
      default:
        return {};
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando tus préstamos...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Mis Préstamos</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Consulta el estatus de los libros que tienes prestados en Mundos de Tinta.
      </p>

      {/* Betsa Quitas esta parte cuando el backend tenga el endpoint real */}
      <div style={{ background: '#fff3cd', color: '#856404', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>
        ⚠️ Vista con datos de ejemplo. Falta el endpoint <code>GET /mis-prestamos</code> en el backend.
      </div>

      {prestamos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>No tienes préstamos activos.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>Libro</th>
              <th style={{ padding: '12px' }}>Fecha de Préstamo</th>
              <th style={{ padding: '12px' }}>Fecha Límite</th>
              <th style={{ padding: '12px' }}>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{p.libro?.titulo}</td>
                <td style={{ padding: '12px' }}>{p.fecha_inicial}</td>
                <td style={{ padding: '12px' }}>{p.fecha_limite}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', ...estiloEstado(p.estado) }}>
                    {p.estado === 'activo' && 'Activo'}
                    {p.estado === 'atrasado' && 'Atrasado'}
                    {p.estado === 'devuelto' && `Devuelto (${p.fecha_devolucion})`}
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