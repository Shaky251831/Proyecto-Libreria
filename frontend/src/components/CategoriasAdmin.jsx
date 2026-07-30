import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './Auth.css';

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Formulario (sirve tanto para crear como para editar)
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categorias');
      setCategorias(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar las categorías.' });
    } finally {
      setLoading(false);
    }
  };

  const abrirNueva = () => {
    setEditandoId(null);
    setNombre('');
    setDescripcion('');
    setMostrarModal(true);
  };

  const abrirEditar = (categoria) => {
    setEditandoId(categoria.id);
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion || '');
    setMostrarModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setMensaje(null);
    try {
      if (editandoId) {
        await api.put(`/categorias/${editandoId}`, { nombre, descripcion });
        setMensaje({ tipo: 'success', texto: 'Categoría actualizada.' });
      } else {
        await api.post('/categorias', { nombre, descripcion });
        setMensaje({ tipo: 'success', texto: 'Categoría creada.' });
      }
      setMostrarModal(false);
      cargarCategorias();
    } catch (error) {
      const texto = error.response?.data?.message || 'Ocurrió un error al guardar la categoría.';
      setMensaje({ tipo: 'error', texto });
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/categorias/${id}`);
      setMensaje({ tipo: 'success', texto: 'Categoría eliminada.' });
      cargarCategorias();
    } catch (error) {
      const texto = error.response?.data?.message || 'No se pudo eliminar la categoría (verifica que no tenga libros asociados).';
      setMensaje({ tipo: 'error', texto });
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>Gestión de Categorías</h2>
        <button
          onClick={abrirNueva}
          style={{ background: '#3a6347', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          + Nueva Categoría
        </button>
      </div>
      <p style={{ color: '#666', marginBottom: '20px' }}>Administra las categorías del catálogo de Mundos de Tinta.</p>

      {mensaje && (
        <div
          style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '6px',
            background: mensaje.tipo === 'success' ? '#d4edda' : '#f8d7da',
            color: mensaje.tipo === 'success' ? '#155724' : '#721c24',
          }}
        >
          {mensaje.texto}
        </div>
      )}

      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>Nombre</th>
              <th style={{ padding: '12px' }}>Descripción</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{cat.nombre}</td>
                <td style={{ padding: '12px', color: '#666' }}>{cat.descripcion || '—'}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => abrirEditar(cat)}
                    style={{ background: '#f0ad4e', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(cat.id)}
                    style={{ background: '#d9534f', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={guardar} className="auth-form" style={{ maxWidth: '400px', width: '90%', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '15px' }}>{editandoId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <textarea
                placeholder="Descripción (opcional)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-submit" style={{ flex: 1 }}>
                {editandoId ? 'Guardar Cambios' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                style={{ flex: 1, background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
