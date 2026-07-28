import React, { useState } from 'react';
import './Auth.css';

export default function Dashboard() {
  // Ejemplo simulando mientras conecto con el backend
  const [books, setBooks] = useState([
    { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', price: 299 },
    { id: 2, title: 'El Principito', author: 'Antoine de Saint-Exupéry', price: 150 },
    { id: 3, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', price: 350 }
  ]);

  const handleDelete = (id) => {
    // Eliminar un registro
    setBooks(books.filter(book => book.id !== id));
    alert(`Libro con ID ${id} eliminado (Simulación Frontend)`);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Panel de Administración - Gestión de Inventario</h2>
      <p style={{ color: '#666' }}>Panel de control de Mundos de Tinta.</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '20px' }}>
        <h3>Lista de Libros Registrados</h3>
        <button 
          style={{ background: '#3a6347', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}
          onClick={() => alert('Aquí se abrirá un formulario para agregar un nuevo libro')}
        >
          + Agregar Nuevo Libro
        </button>
      </div>

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
          {books.map(book => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}