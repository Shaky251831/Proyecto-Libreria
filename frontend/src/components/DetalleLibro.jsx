import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function DetalleLibro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/libros/${id}`)
      .then((response) => {
        setLibro(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar la información de este libro.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando libro...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  if (!libro) return null;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/catalogo" style={{ display: 'inline-block', marginBottom: '20px', color: '#2C3E50', textDecoration: 'none' }}>
        &larr; Volver al catálogo
      </Link>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: '1 1 250px' }}>
          {libro.img_portada ? (
            <img
              src={libro.img_portada}
              alt={libro.titulo}
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '300px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              Sin imagen
            </div>
          )}
        </div>

        <div style={{ flex: '2 1 350px' }}>
          <h2 style={{ fontSize: '26px', color: '#2C3E50', marginBottom: '8px' }}>{libro.titulo}</h2>
          <p style={{ color: '#666', marginBottom: '4px' }}>Autor: {libro.autor}</p>
          {libro.categoria?.nombre && (
            <p style={{ color: '#666', marginBottom: '4px' }}>Categoría: {libro.categoria.nombre}</p>
          )}
          <p style={{ color: libro.stock > 0 ? '#155724' : '#721c24', marginBottom: '16px', fontSize: '13px' }}>
            {libro.stock > 0 ? `Disponible (${libro.stock} en existencia)` : 'Sin existencias por el momento'}
          </p>

          {libro.descripcion && (
            <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '20px' }}>{libro.descripcion}</p>
          )}

          <p style={{ fontWeight: 'bold', fontSize: '22px', color: '#2b2b2b', marginBottom: '20px' }}>
            ${libro.precio} MXN
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              disabled={libro.stock <= 0}
              style={{
                background: libro.stock > 0 ? '#4A7C59' : '#ccc',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: libro.stock > 0 ? 'pointer' : 'not-allowed',
                fontWeight: '600',
              }}
              onClick={() => alert(`Agregaste "${libro.titulo}" al carrito`)}
            >
              Añadir al Carrito
            </button>
            <button
              style={{ background: '#fff', color: '#3a6347', border: '1px solid #3a6347', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              onClick={() => navigate('/confirmar-pedido')}
            >
              Solicitar Préstamo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
