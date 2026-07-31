import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import './Catalogo.css';

const ORDEN_OPCIONES = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
];

export default function Catalogo({ user }) {
  const [books, setBooks] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState('todas');
  const [orden, setOrden] = useState('relevancia');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  const { addItem } = useCart();

  const rolId = user?.rol?.id || user?.rol_id;
  const rolNombre = String(user?.rol?.nombre || user?.role || '').toLowerCase();
  const esAdmin = rolId === 1 || rolNombre.includes('administrador') || rolNombre === 'admin';

  useEffect(() => {
    api.get('/libros')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar libros:', err);
        setError('No se pudieron cargar los libros desde la base de datos.');
        setLoading(false);
      });

    api.get('/categorias')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setCategorias(data);
      })
      .catch(() => setCategorias([]));
  }, []);

  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const titleMatch = book.titulo?.toLowerCase().includes(search.toLowerCase());
      const authorMatch = book.autor?.toLowerCase().includes(search.toLowerCase());
      const matchesSearch = titleMatch || authorMatch;
      const matchesCategoria = categoriaId === 'todas' || String(book.categoria_id) === String(categoriaId);
      return matchesSearch && matchesCategoria;
    });

    if (orden === 'precio_asc') {
      result = [...result].sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (orden === 'precio_desc') {
      result = [...result].sort((a, b) => Number(b.precio) - Number(a.precio));
    }

    return result;
  }, [books, search, categoriaId, orden]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div className="mdt-page mdt-catalogo-status">Cargando libros…</div>;
  if (error) return <div className="mdt-page mdt-catalogo-status mdt-catalogo-error">{error}</div>;

  return (
    <div className="mdt-page mdt-catalogo">
      <div className="mdt-catalogo-header">
        <span className="mdt-eyebrow">Colección completa</span>
        <h2 className="mdt-serif">Vitrina de libros</h2>
        <p>Explora nuestro catálogo disponible y selecciona tus títulos favoritos.</p>
      </div>

      {/* --------- Barra de herramientas: búsqueda, categoría y orden --------- */}
      <div className="mdt-toolbar">
        <div className="mdt-toolbar-search">
          <Search size={16} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar por título o autor…"
            value={search}
            onChange={handleFilterChange(setSearch)}
          />
        </div>

        <div className="mdt-toolbar-filters">
          <div className="mdt-select-wrap">
            <SlidersHorizontal size={14} strokeWidth={1.5} />
            <select value={categoriaId} onChange={handleFilterChange(setCategoriaId)}>
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className="mdt-select-wrap">
            <select value={orden} onChange={handleFilterChange(setOrden)}>
              {ORDEN_OPCIONES.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mdt-catalogo-count">{filteredBooks.length} título{filteredBooks.length !== 1 ? 's' : ''} encontrado{filteredBooks.length !== 1 ? 's' : ''}</p>

      {/* --------- Cuadrícula --------- */}
      <div className="mdt-catalogo-grid">
        {currentBooks.map((book) => (
          <article key={book.id} className="mdt-book-card">
            <Link to={`/libro/${book.id}`} className="mdt-book-card-cover">
              {book.img_portada ? (
                <img src={book.img_portada} alt={book.titulo} loading="lazy" />
              ) : (
                <div className="mdt-book-card-cover-fallback">Sin portada</div>
              )}
              <span className="mdt-book-card-overlay" />
            </Link>
            <div className="mdt-book-card-info">
              <Link to={`/libro/${book.id}`} className="mdt-book-card-title">{book.titulo}</Link>
              <p className="mdt-book-card-author">{book.autor}</p>
              <div className="mdt-book-card-footer">
                <span className="mdt-book-card-price">${book.precio} MXN</span>
                {/* Los administradores no compran: se oculta el botón de añadir al carrito */}
                {!esAdmin && (
                  <button
                    className="mdt-book-card-add"
                    onClick={() => addItem(book)}
                    aria-label={`Añadir ${book.titulo} al carrito`}
                  >
                    <ShoppingBag size={15} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}

        {currentBooks.length === 0 && (
          <p className="mdt-catalogo-empty">No se encontraron libros con esos filtros.</p>
        )}
      </div>

      {/* --------- Paginación --------- */}
      {totalPages > 1 && (
        <div className="mdt-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
