import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import AdminBookForm from './AdminBookForm';
import './Dashboard.css';

export default function Dashboard({ puedeEliminar = true }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);

  const [books, setBooks] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/libros');
      const data = response.data;
      setBooks(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error al cargar libros:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      const data = response.data;
      setCategorias(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategorias();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este libro?')) return;
    try {
      await api.delete(`/libros/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el libro.');
    }
  };

  const openNuevoLibro = () => {
    setLibroEditando(null);
    setFormOpen(true);
  };

  const openEditarLibro = (libro) => {
    setLibroEditando(libro);
    setFormOpen(true);
  };

  // Se pasa como onSubmit a AdminBookForm; crea o edita según haya libroEditando
  const handleGuardarLibro = async (form) => {
    const payload = {
      titulo: form.titulo,
      autor: form.autor,
      precio: form.precio,
      stock: form.stock,
      categoria_id: form.categoria_id,
      img_portada: form.img_portada || null,
      descripcion: form.descripcion || null,
    };

    if (libroEditando) {
      await api.put(`/libros/${libroEditando.id}`, payload);
    } else {
      await api.post('/libros', payload);
    }

    await fetchBooks();
    setFormOpen(false);
    setLibroEditando(null);
  };

  const filteredBooks = books.filter((book) => {
    const title = book.titulo || '';
    const author = book.autor || '';
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="mdt-page mdt-dashboard">
      <div className="mdt-dashboard-header">
        <div>
          <span className="mdt-eyebrow">{puedeEliminar ? 'Panel de administración' : 'Panel de empleado'}</span>
          <h2 className="mdt-serif">Gestión de inventario</h2>
        </div>
        <button className="mdt-btn mdt-btn-primary" onClick={openNuevoLibro}>
          <Plus size={15} /> Añadir libro
        </button>
      </div>

      <div className="mdt-dashboard-search">
        <Search size={16} strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Buscar por título o autor…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mdt-dashboard-table-wrap">
        <table className="mdt-dashboard-table">
          <thead>
            <tr>
              <th>Portada</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Precio</th>
              <th>Stock</th>
              <th className="mdt-col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="mdt-dashboard-empty">Cargando inventario…</td></tr>
            ) : filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div className="mdt-dashboard-thumb">
                      {book.img_portada ? <img src={book.img_portada} alt={book.titulo} /> : <span>—</span>}
                    </div>
                  </td>
                  <td>{book.titulo}</td>
                  <td>{book.autor}</td>
                  <td>${book.precio} MXN</td>
                  <td>{book.stock}</td>
                  <td className="mdt-col-actions">
                    <button className="mdt-icon-action" onClick={() => openEditarLibro(book)} aria-label="Editar">
                      <Pencil size={15} />
                    </button>
                    {puedeEliminar && (
                      <button className="mdt-icon-action mdt-icon-danger" onClick={() => handleDelete(book.id)} aria-label="Eliminar">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="mdt-dashboard-empty">No se encontraron libros coincidentes.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mdt-pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>Página {currentPage}</span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>Siguiente</button>
      </div>

      <AdminBookForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setLibroEditando(null); }}
        onSubmit={handleGuardarLibro}
        categorias={categorias}
        libroInicial={libroEditando}
      />
    </div>
  );
}
