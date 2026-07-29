import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Carrito() {
  const navigate = useNavigate();

  // Estado inicial ejemplo con algunos productos en el carrito
  const [cartItems, setCartItems] = useState([
    { id: 1, title: 'Cien años de soledad', price: 299, quantity: 1 },
    { id: 2, title: 'El Principito', price: 150, quantity: 2 }
  ]);

  // Para aumentar la cantidad
  const increaseQty = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Para disminuir
  const decreaseQty = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Eliminar un producto del carrito
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calcular el total de la compra
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Carrito de Compras - Mundos de Tinta</h2>
      <p>Revisa tus libros seleccionados antes de confirmar tu pedido.</p>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>Tu carrito está vacío.</p>
      ) : (
        <div>
          <div style={{ marginTop: '20px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '15px 0' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{item.title}</h4>
                  <p style={{ margin: 0, color: '#666' }}>${item.price} MXN c/u</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => decreaseQty(item.id)} style={{ padding: '4px 8px', cursor: 'pointer' }}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)} style={{ padding: '4px 8px', cursor: 'pointer' }}>+</button>
                  <button onClick={() => removeItem(item.id)} style={{ background: '#d9534f', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginLeft: '15px' }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', textAlign: 'right' }}>
            <h3>Total a pagar: ${total} MXN</h3>
            <button 
              style={{ background: '#3a6347', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
              onClick={() => navigate('/confirmar-pedido')}
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}