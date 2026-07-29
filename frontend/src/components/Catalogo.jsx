import React, { useState, useEffect } from 'react';
import './Auth.css'; 

export default function Catalogo() {
  // Estado para guardar los libros que vendrán del backend
  const [books, setBooks] = useState([
    { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', price: 299, stock: 10 },
    { id: 2, title: 'El Principito', author: 'Antoine de Saint-Exupéry', price: 150, stock: 5 },
    { id: 3, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', price: 350, stock: 3 }
  ]);

  return (
    
    <div style={{ backgroundColor: '#D2E69C', minHeight: 'calc(100vh - 70px)', padding: '40px 20px' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#2C3E50', fontSize: '28px', fontWeight: '700' }}>Vitrina de Libros - Mundos de Tinta</h2>
        <p style={{ color: '#444', marginBottom: '30px' }}>Explora nuestro catálogo disponible y selecciona tus títulos favoritos.</p>

        {/* Contenedor de la cuadrícula de libros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', textAlign: 'left' }}>
          {books.map((book) => (
            <div key={book.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#333' }}>{book.title}</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Autor: {book.author}</p>
              <p style={{ fontWeight: 'bold', color: '#2b2b2b', marginBottom: '16px' }}>${book.price} MXN</p>
              <button 
                style={{ background: '#4A7C59', color: 'white', border: 'none', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: '600' }}
                onClick={() => alert(`Agregaste "${book.title}" al carrito`)}
              >
                Añadir al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}