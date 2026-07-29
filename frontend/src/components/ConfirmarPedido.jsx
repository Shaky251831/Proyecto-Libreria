import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfirmarPedido() {
  const [metodo, setMetodo] = useState('compra');
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const navigate = useNavigate();

  const handleProcesarPago = (e) => {
    e.preventDefault();
    setPagoExitoso(true);
    setTimeout(() => {
      navigate('/historial'); 
    }, 2500);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="auth-form" style={{ maxWidth: '100%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: 'white', padding: '30px', borderRadius: '8px' }}>
        
        <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '10px' }}>Confirmar Pedido</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '13px', marginBottom: '25px' }}>
          Elige la modalidad de tu orden en Mundos de Tinta.
        </p>

        {pagoExitoso ? (
          <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '6px', textAlign: 'center', fontSize: '15px' }}>
            🎉 ¡Pedido confirmado con éxito! Redirigiendo a tus compras...
          </div>
        ) : (
          <form onSubmit={handleProcesarPago}>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '8px' }}>
                Selecciona el tipo de operación:
              </label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="compra" 
                    checked={metodo === 'compra'} 
                    onChange={() => setMetodo('compra')} 
                  /> Comprar Libro
                </label>
                <label style={{ cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="prestamo" 
                    checked={metodo === 'prestamo'} 
                    onChange={() => setMetodo('prestamo')} 
                  /> Solicitar Préstamo Temporal
                </label>
              </div>
            </div>

            {metodo === 'compra' ? (
              <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>Datos de Tarjeta (Simulación)</h4>
                <input 
                  type="text" 
                  placeholder="Número de Tarjeta (XXXX-XXXX-XXXX-XXXX)" 
                  required 
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="MM/AA" required style={{ width: '50%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <input type="password" placeholder="CVV" required style={{ width: '50%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px', padding: '15px', background: '#fff8e1', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
                  📌 <b>Nota de Préstamo:</b> Los préstamos tienen un plazo máximo de devolución de 14 días naturales. Asegúrate de cuidar el material bibliográfico.
                </p>
              </div>
            )}

            <button type="submit" className="btn-submit" style={{ width: '100%', padding: '12px', background: '#3a6347', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {metodo === 'compra' ? 'Confirmar y Pagar Compra' : 'Confirmar Solicitud de Préstamo'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}