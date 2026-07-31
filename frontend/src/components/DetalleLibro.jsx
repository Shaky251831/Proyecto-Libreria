import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function DetalleLibro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
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

  // Añade el libro al carrito como compra normal
  const handleAgregarCarrito = () => {
    if (!libro || libro.stock <= 0) return;
    addItem(libro);
  };

  // Añade el libro al carrito y lleva directo a confirmar pedido
  // con la modalidad de préstamo pre-seleccionada
  const handleSolicitarPrestamo = () => {
    if (!libro || libro.stock <= 0) return;
    addItem(libro);
    navigate('/confirmar-pedido', { state: { tipo: 'prestamo' } });
  };

  if (loading) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.mensajeCentro}>Cargando libro...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={estilos.pagina}>
        <div style={{ ...estilos.mensajeCentro, color: '#e07a6f' }}>{error}</div>
      </div>
    );
  }

  if (!libro) return null;

  return (
    <div style={estilos.pagina}>
      <div style={estilos.contenedor}>
        <Link to="/catalogo" style={estilos.volver}>
          &larr; Volver al catálogo
        </Link>

        <div style={estilos.tarjeta}>
          <div style={estilos.columnaImagen}>
            {libro.img_portada ? (
              <img src={libro.img_portada} alt={libro.titulo} style={estilos.imagen} />
            ) : (
              <div style={estilos.sinImagen}>Sin imagen</div>
            )}
          </div>

          <div style={estilos.columnaInfo}>
            <h2 style={estilos.titulo}>{libro.titulo}</h2>
            <p style={estilos.metaTexto}>Autor: {libro.autor}</p>
            {libro.categoria?.nombre && (
              <p style={estilos.metaTexto}>Categoría: {libro.categoria.nombre}</p>
            )}
            <p style={{ ...estilos.stockTexto, color: libro.stock > 0 ? '#8fbf8a' : '#e07a6f' }}>
              {libro.stock > 0 ? `Disponible (${libro.stock} en existencia)` : 'Sin existencias por el momento'}
            </p>

            {libro.descripcion && (
              <p style={estilos.descripcion}>{libro.descripcion}</p>
            )}

            <p style={estilos.precio}>${libro.precio} MXN</p>

            <div style={estilos.filaBotones}>
              <button
                disabled={libro.stock <= 0}
                style={{
                  ...estilos.botonPrimario,
                  ...(libro.stock <= 0 ? estilos.botonDeshabilitado : {}),
                }}
                onClick={handleAgregarCarrito}
              >
                Añadir al Carrito
              </button>
              <button
                disabled={libro.stock <= 0}
                style={{
                  ...estilos.botonSecundario,
                  ...(libro.stock <= 0 ? estilos.botonSecundarioDeshabilitado : {}),
                }}
                onClick={handleSolicitarPrestamo}
              >
                Solicitar Préstamo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Paleta oscura y elegante consistente con el resto de la app
const estilos = {
  pagina: {
    background: '#121212',
    minHeight: 'calc(100vh - 76px)',
    padding: '40px 20px',
  },
  contenedor: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  mensajeCentro: {
    textAlign: 'center',
    padding: '50px',
    color: '#f2ede4',
  },
  volver: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#c5a059',
    textDecoration: 'none',
    fontSize: '14px',
  },
  tarjeta: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    background: '#1a1a1a',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid rgba(197, 160, 89, 0.16)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
  },
  columnaImagen: {
    flex: '1 1 250px',
  },
  imagen: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  sinImagen: {
    width: '100%',
    height: '300px',
    background: '#242424',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8a8a8a',
  },
  columnaInfo: {
    flex: '2 1 350px',
  },
  titulo: {
    fontSize: '26px',
    color: '#f2ede4',
    marginBottom: '8px',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  metaTexto: {
    color: '#a89f92',
    marginBottom: '4px',
  },
  stockTexto: {
    marginBottom: '16px',
    fontSize: '13px',
  },
  descripcion: {
    color: '#d9c9ad',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  precio: {
    fontWeight: 'bold',
    fontSize: '22px',
    color: '#c5a059',
    marginBottom: '20px',
  },
  filaBotones: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  botonPrimario: {
    background: '#c5a059',
    color: '#14120f',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  botonDeshabilitado: {
    background: '#3a3a3a',
    color: '#8a8a8a',
    cursor: 'not-allowed',
  },
  botonSecundario: {
    background: 'transparent',
    color: '#c5a059',
    border: '1px solid #c5a059',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  botonSecundarioDeshabilitado: {
    color: '#8a8a8a',
    borderColor: '#3a3a3a',
    cursor: 'not-allowed',
  },
};
