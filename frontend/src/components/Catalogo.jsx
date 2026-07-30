import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; 

export default function Catalogo() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  // Cargar libros desde la API de Laravel
  useEffect(() => {
    axios.get('https://mundosdetinta.duckdns.org/api/libros')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar libros:", err);
        setError("No se pudieron cargar los libros desde la base de datos.");
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.titulo?.toLowerCase().includes(search.toLowerCase());
    const authorMatch = book.autor?.toLowerCase().includes(search.toLowerCase());
    return titleMatch || authorMatch;
  });

  // PAGINACIÓN 
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando libros...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ backgroundColor: '#D2E69C', minHeight: 'calc(100vh - 70px)', padding: '40px 20px' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#2C3E50', fontSize: '28px', fontWeight: '700' }}>Vitrina de Libros - Mundos de Tinta</h2>
        <p style={{ color: '#444', marginBottom: '20px' }}>Explora nuestro catálogo disponible y selecciona tus títulos favoritos.</p>

        {/* Barra de Búsqueda */}
        <div style={{ marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="Buscar por título o autor..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{ width: '100%', maxWidth: '500px', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
          />
        </div>

        {/* Contenedor de la cuadrícula de libros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', textAlign: 'left' }}>
          {currentBooks.map((book) => (
            <div key={book.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <Link to={`/libro/${book.id}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#333' }}>{book.titulo}</h3></Link>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Autor: {book.autor}</p>
              <p style={{ fontWeight: 'bold', color: '#2b2b2b', marginBottom: '16px' }}>${book.precio} MXN</p>
              <button 
                style={{ background: '#4A7C59', color: 'white', border: 'none', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: '600' }}
                onClick={() => alert(`Agregaste "${book.titulo}" al carrito`)}
              >
                Añadir al Carrito
              </button>
            </div>
          ))}
        </div>

        {/* Controles de Paginación */}
        {totalPages > 1 && (
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: currentPage === 1 ? '#ccc' : '#2C3E50', color: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Anterior
            </button>
            <span style={{ alignSelf: 'center', fontWeight: 'bold', color: '#2C3E50' }}>
              Página {currentPage} de {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: currentPage === totalPages ? '#ccc' : '#2C3E50', color: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
