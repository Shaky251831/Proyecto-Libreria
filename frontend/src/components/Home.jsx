import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import './Home.css';

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    api
      .get('/libros')
      .then((response) => {
        if (!mounted) return;
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        // Mostramos una muestra de novedades: los últimos 8 registros dados de alta
        const ordenados = [...data].sort((a, b) => b.id - a.id).slice(0, 8);
        setDestacados(ordenados);
      })
      .catch(() => setDestacados([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="mdt-page mdt-home">
      {/* ---------- HERO ---------- */}
      <section className="mdt-hero">
        <div className="mdt-hero-overlay" />
        <div className="mdt-hero-content">
          <span className="mdt-eyebrow">Librería Online · Est. Oaxaca</span>
          <h1 className="mdt-serif mdt-hero-title">
            Historias que <em>permanecen</em>,<br /> páginas que definen
          </h1>
          <p className="mdt-hero-subtitle">
            Una selección curada de literatura para lectores exigentes.
            Descubre ediciones que merecen un lugar en tu estantería.
          </p>
          <div className="mdt-hero-actions">
            <Link to="/catalogo" className="mdt-btn mdt-btn-primary">
              Explorar catálogo <ArrowRight size={15} />
            </Link>
            <Link to="/catalogo" className="mdt-btn mdt-btn-outline">
              Ver novedades
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- NOVEDADES / DESTACADOS ---------- */}
      <section className="mdt-featured">
        <div className="mdt-featured-header">
          <div>
            <span className="mdt-eyebrow">Selección de la casa</span>
            <h2 className="mdt-serif">Novedades destacadas</h2>
          </div>
          <Link to="/catalogo" className="mdt-featured-link">
            Ver todo el catálogo <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="mdt-featured-loading">Cargando novedades…</div>
        ) : destacados.length === 0 ? (
          <div className="mdt-featured-loading">Aún no hay libros disponibles.</div>
        ) : (
          <div className="mdt-featured-grid">
            {destacados.map((book) => (
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
                  <Link to={`/libro/${book.id}`} className="mdt-book-card-title">
                    {book.titulo}
                  </Link>
                  <p className="mdt-book-card-author">{book.autor}</p>
                  <div className="mdt-book-card-footer">
                    <span className="mdt-book-card-price">${book.precio} MXN</span>
                    <button
                      className="mdt-book-card-add"
                      onClick={() => addItem(book)}
                      aria-label={`Añadir ${book.titulo} al carrito`}
                    >
                      <ShoppingBag size={15} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ---------- FRANJA EDITORIAL ---------- */}
      <section className="mdt-strip">
        <div className="mdt-strip-item">
          <span className="mdt-serif">01</span>
          <p>Curaduría experta en cada categoría, de la filosofía a la ciencia ficción.</p>
        </div>
        <div className="mdt-strip-item">
          <span className="mdt-serif">02</span>
          <p>Ediciones cuidadas, entregas confiables y seguimiento de tus pedidos.</p>
        </div>
        <div className="mdt-strip-item">
          <span className="mdt-serif">03</span>
          <p>Un espacio para lectores que valoran la calidad tanto como la historia.</p>
        </div>
      </section>
    </div>
  );
}
