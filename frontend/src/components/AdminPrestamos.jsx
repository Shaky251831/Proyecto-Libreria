import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarPrestamos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/prestamos');
      setPrestamos(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch {
      setError('No se pudieron cargar los préstamos.');
    } finally { setLoading(false); }
  };

  useEffect(() => { cargarPrestamos(); }, []);

  const cambiarEstado = async (prestamo) => {
    try {
      const estado = prestamo.estado === 'devuelto' ? 'activo' : 'devuelto';
      const { data } = await api.put(`/prestamos/${prestamo.id}/estado`, { estado });
      setPrestamos((actuales) => actuales.map((p) => p.id === prestamo.id ? data.prestamo : p));
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el préstamo.');
    }
  };

  if (loading) return <div style={{ padding: 30, textAlign: 'center' }}>Cargando préstamos...</div>;
  return <div style={{ padding: 30, maxWidth: 1000, margin: '0 auto' }}>
    <h2>Administración de préstamos</h2>
    {error && <p style={{ color: '#b42318' }}>{error} <button onClick={cargarPrestamos}>Reintentar</button></p>}
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
      <thead><tr><th>ID</th><th>Usuario</th><th>Libro</th><th>Inicio</th><th>Límite</th><th>Estado</th><th>Acción</th></tr></thead>
      <tbody>{prestamos.length === 0 ? <tr><td colSpan="7">No hay préstamos registrados.</td></tr> : prestamos.map((p) => <tr key={p.id}>
        <td>#{p.id}</td><td>{p.usuario}</td><td>{p.libro}</td><td>{p.fecha}</td><td>{p.fecha_limite}</td><td>{p.estado}</td>
        <td><button onClick={() => cambiarEstado(p)}>{p.estado === 'devuelto' ? 'Reabrir' : 'Registrar devolución'}</button></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
