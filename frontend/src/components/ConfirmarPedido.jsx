import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

// Mensaje genérico para cualquier error que no debamos exponer tal cual al usuario
const MENSAJE_ERROR_GENERICO = 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.';

export default function ConfirmarPedido() {
  const location = useLocation();
  // Si llegamos aquí desde "Solicitar Préstamo" en Detalle de Libro,
  // preseleccionamos la modalidad de préstamo.
  const [metodo, setMetodo] = useState(location.state?.tipo === 'prestamo' ? 'prestamo' : 'compra');
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { openLogin } = useUI();

  // Datos del formulario de tarjeta (solo aplica cuando metodo === 'compra')
  const [tarjeta, setTarjeta] = useState({ numero: '', vencimiento: '', cvv: '' });
  const [erroresTarjeta, setErroresTarjeta] = useState({ numero: '', vencimiento: '', cvv: '' });

  // ---- Validaciones de tarjeta ----
  const REGEX_NUMERO = /^\d{16}$/; // 16 dígitos, solo números
  const REGEX_VENCIMIENTO = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/AA, mes 01-12
  const REGEX_CVV = /^\d{3}$/; // exactamente 3 dígitos

  const validarCampoTarjeta = (campo, valor) => {
    switch (campo) {
      case 'numero':
        if (!valor) return 'El número de tarjeta es obligatorio.';
        if (!REGEX_NUMERO.test(valor)) return 'Ingresa solo números (16 dígitos).';
        return '';
      case 'vencimiento':
        if (!valor) return 'La fecha es obligatoria.';
        if (!REGEX_VENCIMIENTO.test(valor)) return 'Formato inválido. Usa MM/AA (Mes 01-12).';
        return '';
      case 'cvv':
        if (!valor) return 'El CVV es obligatorio.';
        if (!REGEX_CVV.test(valor)) return 'El CVV debe tener 3 dígitos.';
        return '';
      default:
        return '';
    }
  };

  const handleCambioTarjeta = (campo, valor) => {
    let valorLimpio = valor;

    if (campo === 'numero') {
      valorLimpio = valor.replace(/\D/g, '').slice(0, 16);
    } 
    else if (campo === 'cvv') {
      valorLimpio = valor.replace(/\D/g, '').slice(0, 3);
    } 
    else if (campo === 'vencimiento') {
      // Auto-formateo para la fecha MM/AA
      let soloNumeros = valor.replace(/\D/g, '');
      if (soloNumeros.length > 2) {
        valorLimpio = `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2, 4)}`;
      } else {
        valorLimpio = soloNumeros;
      }
    }

    setTarjeta((prev) => ({ ...prev, [campo]: valorLimpio }));
    setErroresTarjeta((prev) => ({ ...prev, [campo]: validarCampoTarjeta(campo, valorLimpio) }));
  };

  const validarFormularioTarjeta = () => {
    const nuevosErrores = {
      numero: validarCampoTarjeta('numero', tarjeta.numero),
      vencimiento: validarCampoTarjeta('vencimiento', tarjeta.vencimiento),
      cvv: validarCampoTarjeta('cvv', tarjeta.cvv),
    };
    setErroresTarjeta(nuevosErrores);
    return !nuevosErrores.numero && !nuevosErrores.vencimiento && !nuevosErrores.cvv;
  };

  const handleProcesarPago = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Tu carrito está vacío. Agrega libros antes de continuar.');
      return;
    }

    // Solo validamos los datos de la tarjeta si la operación es una compra
    if (!localStorage.getItem('token')) {
      setErrorMsg('Inicia sesión antes de confirmar la operación.');
      openLogin();
      return;
    }

    if (metodo === 'compra' && !validarFormularioTarjeta()) {
      setErrorMsg('Revisa los datos de tu tarjeta antes de continuar.');
      return;
    }

    setProcesando(true);

    try {
      await api.post(metodo === 'compra' ? '/ventas' : '/prestamos', {
        tipo: metodo === 'compra' ? 'Compra' : 'Préstamo',
        metodo_pago: metodo === 'compra' ? 'Tarjeta' : 'Préstamo',
        items: items.map((item) => ({
          libro_id: item.id,
          cantidad: item.quantity,
        })),
      });

      clearCart();
      setPagoExitoso(true);
      setTimeout(() => {
        navigate(metodo === 'compra' ? '/historial' : '/mis-prestamos');
      }, 2500);
    } catch (error) {
      const status = error.response?.status;

      if (status === 422) {
        const mensajeValidacion = error.response?.data?.message;
        setErrorMsg(typeof mensajeValidacion === 'string' ? mensajeValidacion : 'Revisa los datos de tu pedido e intenta de nuevo.');
      } else if (status === 401) {
        setErrorMsg('Tu sesión expiró. Inicia sesión de nuevo para continuar.');
      } else {
        setErrorMsg(MENSAJE_ERROR_GENERICO);
      }
      console.error('Error al procesar la venta:', error);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div style={estilos.pagina}>
      <div style={estilos.contenedor}>
        <div style={estilos.tarjetaPrincipal}>

          <h2 style={estilos.titulo}>Confirmar Pedido</h2>
          <p style={estilos.subtitulo}>
            Elige la modalidad de tu orden en Mundos de Tinta.
          </p>

          {pagoExitoso ? (
            <div style={estilos.exito}>
              🎉 ¡Pedido confirmado con éxito! Redirigiendo a {metodo === 'compra' ? 'tus compras' : 'tus préstamos'}...
            </div>
          ) : (
            <form onSubmit={handleProcesarPago} noValidate>

              {errorMsg && (
                <div style={estilos.error}>
                  {errorMsg}
                </div>
              )}

              {items.length > 0 && (
                <p style={estilos.totalTexto}>
                  Total a pagar: <strong style={{ color: '#c5a059' }}>${totalPrice.toFixed(2)} MXN</strong>
                </p>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={estilos.etiqueta}>
                  Selecciona el tipo de operación:
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={estilos.radioLabel}>
                    <input
                      type="radio"
                      name="tipo"
                      value="compra"
                      checked={metodo === 'compra'}
                      onChange={() => setMetodo('compra')}
                    /> Comprar Libro
                  </label>
                  <label style={estilos.radioLabel}>
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
                <div style={estilos.cajaTarjeta}>
                  <h4 style={estilos.tituloCaja}>Datos de Tarjeta (Simulación)</h4>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Número de Tarjeta (16 dígitos)"
                    value={tarjeta.numero}
                    onChange={(e) => handleCambioTarjeta('numero', e.target.value)}
                    style={{ ...estilos.input, ...(erroresTarjeta.numero ? estilos.inputError : {}) }}
                  />
                  {erroresTarjeta.numero && <p style={estilos.textoErrorCampo}>{erroresTarjeta.numero}</p>}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={tarjeta.vencimiento}
                        onChange={(e) => handleCambioTarjeta('vencimiento', e.target.value)}
                        style={{ ...estilos.input, ...(erroresTarjeta.vencimiento ? estilos.inputError : {}) }}
                      />
                      {erroresTarjeta.vencimiento && <p style={estilos.textoErrorCampo}>{erroresTarjeta.vencimiento}</p>}
                    </div>
                    <div style={{ width: '50%' }}>
                      <input
                        type="password"
                        inputMode="numeric"
                        placeholder="CVV"
                        value={tarjeta.cvv}
                        onChange={(e) => handleCambioTarjeta('cvv', e.target.value)}
                        style={{ ...estilos.input, ...(erroresTarjeta.cvv ? estilos.inputError : {}) }}
                      />
                      {erroresTarjeta.cvv && <p style={estilos.textoErrorCampo}>{erroresTarjeta.cvv}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={estilos.cajaPrestamo}>
                  <p style={estilos.textoPrestamo}>
                    📌 <b>Nota de Préstamo:</b> Los préstamos tienen un plazo máximo de devolución de 14 días naturales. Asegúrate de cuidar el material bibliográfico.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={procesando}
                style={{ ...estilos.botonSubmit, ...(procesando ? estilos.botonSubmitDeshabilitado : {}) }}
              >
                {procesando ? 'Procesando...' : (metodo === 'compra' ? 'Confirmar y Pagar Compra' : 'Confirmar Solicitud de Préstamo')}
              </button>
            </form>
          )}

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
    maxWidth: '600px',
    margin: '0 auto',
  },
  tarjetaPrincipal: {
    background: '#1a1a1a',
    border: '1px solid rgba(197, 160, 89, 0.16)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
    padding: '30px',
    borderRadius: '12px',
  },
  titulo: {
    textAlign: 'center',
    color: '#f2ede4',
    marginBottom: '10px',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  subtitulo: {
    textAlign: 'center',
    color: '#a89f92',
    fontSize: '13px',
    marginBottom: '25px',
  },
  exito: {
    background: 'rgba(122, 146, 112, 0.15)',
    color: '#8fbf8a',
    border: '1px solid rgba(122, 146, 112, 0.4)',
    padding: '15px',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '15px',
  },
  error: {
    background: 'rgba(193, 97, 63, 0.15)',
    color: '#e07a6f',
    border: '1px solid rgba(193, 97, 63, 0.4)',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '13px',
    textAlign: 'center',
  },
  totalTexto: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#d9c9ad',
    marginBottom: '15px',
  },
  etiqueta: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#f2ede4',
    display: 'block',
    marginBottom: '8px',
  },
  radioLabel: {
    cursor: 'pointer',
    color: '#d9c9ad',
    fontSize: '14px',
  },
  cajaTarjeta: {
    marginBottom: '20px',
    padding: '15px',
    background: '#121212',
    border: '1px solid rgba(197, 160, 89, 0.16)',
    borderRadius: '6px',
  },
  tituloCaja: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#f2ede4',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid rgba(197, 160, 89, 0.3)',
    background: '#1a1a1a',
    color: '#f2ede4',
    boxSizing: 'border-box',
    outline: 'none',
  },
  inputError: {
    border: '1px solid #e07a6f',
  },
  textoErrorCampo: {
    color: '#e07a6f',
    fontSize: '12px',
    margin: '4px 0 0',
  },
  cajaPrestamo: {
    marginBottom: '20px',
    padding: '15px',
    background: 'rgba(197, 160, 89, 0.08)',
    border: '1px solid rgba(197, 160, 89, 0.25)',
    borderRadius: '6px',
  },
  textoPrestamo: {
    margin: 0,
    fontSize: '13px',
    color: '#d9c9ad',
  },
  botonSubmit: {
    width: '100%',
    padding: '12px',
    background: '#c5a059',
    color: '#14120f',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  botonSubmitDeshabilitado: {
    background: '#5c5241',
    color: '#8a8a8a',
    cursor: 'not-allowed',
  },
};
