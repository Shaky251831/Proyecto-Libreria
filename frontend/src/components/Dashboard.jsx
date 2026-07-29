import React, { useState } from 'react';
import './Auth.css';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Formulario para agregar libro
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoLibro, setNuevoLibro] = useState({ title: '', author: '', price: '' });

  // Ejemplo simulando mientras conecto con el backend
  const [books, setBooks] = useState([
    { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', price: 299 },
    { id: 2, title: 'El Principito', author: 'Antoine de Saint-Exupéry', price: 150 },
    { id: 3, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', price: 350 }
  ]);

  // Para eliminar un registro
  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
    alert(`Libro con ID ${id} eliminado (Simulación Frontend)`);
  };

  // Para guardar el nuevo libro
  const handleAgregarLibro = (e) => {
    e.preventDefault();
    if (!nuevoLibro.title || !nuevoLibro.author || !nuevoLibro.price) return;

    const libroObjeto = {
      id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
      title: nuevoLibro.title,
      author: nuevoLibro.author,
      price: Number(nuevoLibro.price)
    };

    setBooks([...books, libroObjeto]);
    setNuevoLibro({ title: '', author: '', price: '' }); // Limpiar formulario
    setMostrarModal(false); // Cerrar formulario
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Panel de Administración - Gestión de Inventario</h2>
      <p style={{ color: '#666' }}>Panel de control de Mundos de Tinta.</p>

      {/* --- Barra de búsqueda y botón agregar --- */}
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
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <tr key={book.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{book.id}</td>
                <td style={{ padding: '12px' }}>{book.title}</td>
                <td style={{ padding: '12px' }}>{book.author}</td>
                <td style={{ padding: '12px' }}>${book.price} MXN</td>
                <td style={{ padding: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button 
                    style={{ background: '#f0ad4e', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => alert(`Editar libro: ${book.title}`)}
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