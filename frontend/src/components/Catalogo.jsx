import React, { useState, useEffect } from 'react';
import './Auth.css'; 

export default function Catalogo() {
  // Estado para guardar los libros que vendrán del backend
  const [books, setBooks] = useState([
    // Ejemplos temporales mientras conectamos con el backend
    { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', price: 299, stock: 10 },
    { id: 2, title: 'El Principito', author: 'Antoine de Saint-Exupéry', price: 150, stock: 5 },
    { id: 3, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', price: 350, stock: 3 }
  ]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Vitrina de Libros - Mundos de Tinta</h2>
      <p>Explora nuestro catálogo disponible y selecciona tus títulos favoritos.</p>

      {/* Contenedor de la cuadrícula de libros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#333' }}>{book.title}</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Autor: {book.author}</p>
            <p style={{ fontWeight: 'bold', color: '#2b2b2b', marginBottom: '12px' }}>${book.price} MXN</p>
            <button 
              style={{ background: '#3a6347', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
              onClick={() => alert(`Agregaste "${book.title}" al carrito`)}
            >
              Añadir al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}