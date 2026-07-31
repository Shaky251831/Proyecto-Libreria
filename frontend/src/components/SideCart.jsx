import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './SideCart.css';

export default function SideCart() {
  const { items, isOpen, closeCart, increaseQty, decreaseQty, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/confirmar-pedido');
  };

  return (
    <>
      <div
        className={`mdt-drawer-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />
      <aside className={`mdt-drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="mdt-drawer-header">
          <div>
            <span className="mdt-eyebrow">Tu selección</span>
            <h3 className="mdt-serif">Carrito</h3>
          </div>
          <button className="mdt-drawer-close" onClick={closeCart} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        <div className="mdt-drawer-body mdt-scrollbar">
          {items.length === 0 ? (
            <div className="mdt-drawer-empty">
              <ShoppingBag size={34} strokeWidth={1} />
              <p>Tu carrito está vacío.</p>
              <button className="mdt-btn mdt-btn-outline" onClick={() => { closeCart(); navigate('/catalogo'); }}>
                Explorar catálogo
              </button>
            </div>
          ) : (
            <ul className="mdt-drawer-list">
              {items.map((item) => (
                <li key={item.id} className="mdt-drawer-item">
                  <div className="mdt-drawer-item-cover">
                    {item.img_portada ? (
                      <img src={item.img_portada} alt={item.titulo} />
                    ) : (
                      <div className="mdt-drawer-item-cover-fallback">Sin imagen</div>
                    )}
                  </div>

                  <div className="mdt-drawer-item-info">
                    <p className="mdt-drawer-item-title">{item.titulo}</p>
                    <p className="mdt-drawer-item-author">{item.autor}</p>
                    <p className="mdt-drawer-item-price">${item.precio.toFixed(2)} MXN</p>

                    <div className="mdt-drawer-item-controls">
                      <div className="mdt-qty-control">
                        <button onClick={() => decreaseQty(item.id)} aria-label="Disminuir cantidad">
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)} aria-label="Aumentar cantidad">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button className="mdt-drawer-remove" onClick={() => removeItem(item.id)} aria-label="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="mdt-drawer-footer">
            <div className="mdt-drawer-total">
              <span>Total</span>
              <span className="mdt-drawer-total-amount">${totalPrice.toFixed(2)} MXN</span>
            </div>
            <button className="mdt-btn mdt-btn-primary mdt-drawer-checkout" onClick={handleCheckout}>
              Confirmar pedido
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
