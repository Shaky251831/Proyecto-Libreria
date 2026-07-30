import React, { useState, useEffect } from 'react';
import './Auth.css';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Agregar libro
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoLibro, setNuevoLibro] = useState({ title: '', author: '', price: '' });

  // Lista de libros conectada al backend
  const [books, setBooks] = useState([]);

  const token = localStorage.getItem('token');

  // Cargar libros desde Laravel al montar el componente
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('https://mundosdetinta.duckdns.org/api/libros', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        // Asegúrate de adaptarlo si tu API devuelve un objeto paginado o un array directo
        setBooks(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar libros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Para eliminar un registro conectado al backend
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este libro?')) return;

    try {
      const response = await fetch(`https://mundosdetinta.duckdns.org/api/libros/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setBooks(books.filter(book => book.id !== id));
        alert(`Libro con ID ${id} eliminado exitosamente.`);
      } else {
        alert('No se pudo eliminar el libro.');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // Guardar el nuevo libro conectado al backend
  const handleAgregarLibro = async (e) => {
    e.preventDefault();
    if (!nuevoLibro.title || !nuevoLibro.author || !nuevoLibro.price) return;

    try {
      const response = await fetch('https://mundosdetinta.duckdns.org/api/libros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          titulo: nuevoLibro.title,   
          autor: nuevoLibro.author,     
          precio: nuevoLibro.price      
        })
      });

      const data = await response.json();

      if (response.ok) {
        fetchBooks(); 
        setNuevoLibro({ title: '', author: '', price: '' }); 
        setMostrarModal(false); // Cerrar formulario
        alert('Libro registrado exitosamente.');
      } else {
        alert('Error al registrar el libro: ' + (data.message || 'Verifica los datos'));
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const filteredBooks = books.filter(book => {
    const title = book.title || book.titulo || '';
    const author = book.author || book.autor || '';
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Panel de Administración - Gestión de Inventario</h2>
      <p style={{ color: '#666' }}>Panel de control de Mundos de Tinta.</p>

      {/* --- Barra de búsqueda y botón de agregar --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar por título o autor..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            width: '300px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <button 
          style={{ background: '#3a6347', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => setMostrarModal(true)}
        >
          + Agregar Nuevo Libro
        </button>
      </div>

      {/* --- Para agregar libro--- */}
      {mostrarModal && (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd', maxWidth: '500px' }}>
          <h3 style={{ marginTop: 0, color: '#2C3E50' }}>Registrar Nuevo Libro</h3>
          <form onSubmit={handleAgregarLibro}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Título</label>
              <input 
                type="text" 
                value={nuevoLibro.title}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, title: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Autor</label>
              <input 
                type="text" 
                value={nuevoLibro.author}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, author: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Precio (MXN)</label>
              <input 
                type="number" 
                value={nuevoLibro.price}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, price: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ background: '#3a6347', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Guardar Libro
              </button>
              <button type="button" onClick={() => setMostrarModal(false)} style={{ background: '#d9534f', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Tabla inventario--- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Título</th>
            <th style={{ padding: '12px' }}>Autor</th>
            <th style={{ padding: '12px' }}>Precio</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                Cargando inventario...
              </td>
            </tr>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <tr key={book.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{book.id}</td>
                <td style={{ padding: '12px' }}>{book.title || book.titulo}</td>
                <td style={{ padding: '12px' }}>{book.author || book.autor}</td>
                <td style={{ padding: '12px' }}>${book.price || book.precio} MXN</td>
                <td style={{ padding: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button 
                    style={{ background: '#f0ad4e', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => alert(`Editar libro: ${book.title || book.titulo}`)}
                  >
                    Editar
                  </button>
                  <button 
                    style={{ background: '#d9534f', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => handleDelete(book.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                No se encontraron libros coincidentes.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- Paginación--- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', alignItems: 'center' }}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ padding: '6px 14px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
        >
          Anterior
        </button>
        
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Página {currentPage}</span>

        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          style={{ padding: '6px 14px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
        >
          Siguiente
        </button>
      </div>

    </div>
  );
}