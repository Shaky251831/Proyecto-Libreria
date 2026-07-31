import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X } from 'lucide-react';
import api from '../api/axios';
import { useUI } from '../context/UIContext';
import './LoginModal.css';

export default function LoginModal({ setUser }) {
  const { isLoginOpen, authView, setAuthView, closeAuthModal } = useUI();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Bloquea el scroll del fondo mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoginOpen]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setNombre('');
    setPasswordConfirm('');
    setErrors({});
    setLoading(false);
  };

  const handleClose = () => {
    closeAuthModal();
    resetForm();
  };

  if (!isLoginOpen) return null;

  const isRegister = authView === 'register';

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Introduce un correo válido.';
    if (!password) newErrors.password = 'La contraseña es obligatoria.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user } = response.data;
      const roleId = user.rol_id || user.rol || user.role;

      localStorage.setItem('token', access_token);
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, rol_id: roleId, role: roleId === 1 || roleId === 'admin' ? 'admin' : 'client' })
      );

      if (setUser) setUser(user);
      handleClose();

      if (user.rol_id === 1 || user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalogo');
      }
    } catch (error) {
      setErrors({
        apiError:
          error.response?.data?.message ||
          (error.response ? 'Credenciales incorrectas.' : 'No se pudo conectar con el servidor.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'Tu nombre es obligatorio.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Introduce un correo válido.';
    if (!password || password.length < 8) newErrors.password = 'Mínimo 8 caracteres.';
    if (password !== passwordConfirm) newErrors.passwordConfirm = 'Las contraseñas no coinciden.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/register', {
        nombre,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      // Tras registrarse con éxito, pasamos a la vista de login
      setAuthView('login');
      setErrors({ apiSuccess: 'Cuenta creada. Ahora inicia sesión.' });
    } catch (error) {
      setErrors({
        apiError: error.response?.data?.message || 'No se pudo completar el registro.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mdt-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="mdt-modal-card" role="dialog" aria-modal="true">
        <button className="mdt-modal-close" onClick={handleClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="mdt-modal-header">
          <span className="mdt-eyebrow">Mundos de Tinta</span>
          <h2 className="mdt-serif">{isRegister ? 'Crear una cuenta' : 'Bienvenido de nuevo'}</h2>
          <p className="mdt-modal-subtitle">
            {isRegister ? 'Únete a nuestra comunidad de lectores.' : 'Accede a tu biblioteca personal.'}
          </p>
        </div>

        {errors.apiError && <div className="mdt-modal-alert mdt-modal-alert-error">{errors.apiError}</div>}
        {errors.apiSuccess && <div className="mdt-modal-alert mdt-modal-alert-success">{errors.apiSuccess}</div>}

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="mdt-modal-form">
          {isRegister && (
            <div className="mdt-field">
              <label>Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); setErrors({ ...errors, nombre: '' }); }}
                placeholder="Tu nombre"
                disabled={loading}
                className={errors.nombre ? 'mdt-input-error' : ''}
              />
              {errors.nombre && <span className="mdt-field-error">{errors.nombre}</span>}
            </div>
          )}

          <div className="mdt-field">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
              placeholder="tu@correo.com"
              disabled={loading}
              className={errors.email ? 'mdt-input-error' : ''}
            />
            {errors.email && <span className="mdt-field-error">{errors.email}</span>}
          </div>

          <div className="mdt-field">
            <label>Contraseña</label>
            <div className="mdt-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                placeholder="••••••••"
                disabled={loading}
                className={errors.password ? 'mdt-input-error' : ''}
              />
              <button type="button" className="mdt-eye-btn" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="mdt-field-error">{errors.password}</span>}
            {!isRegister && (
              <div className="mdt-forgot-link">
                <a
                  href="/forgot-password"
                  onClick={(e) => { e.preventDefault(); handleClose(); navigate('/forgot-password'); }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}
          </div>

          {isRegister && (
            <div className="mdt-field">
              <label>Confirmar contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => { setPasswordConfirm(e.target.value); setErrors({ ...errors, passwordConfirm: '' }); }}
                placeholder="••••••••"
                disabled={loading}
                className={errors.passwordConfirm ? 'mdt-input-error' : ''}
              />
              {errors.passwordConfirm && <span className="mdt-field-error">{errors.passwordConfirm}</span>}
            </div>
          )}

          <button type="submit" className="mdt-btn mdt-btn-primary mdt-modal-submit" disabled={loading}>
            {loading ? 'Procesando…' : isRegister ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <div className="mdt-modal-switch">
          {isRegister ? (
            <>¿Ya tienes cuenta? <button onClick={() => setAuthView('login')}>Inicia sesión</button></>
          ) : (
            <>¿No tienes cuenta? <button onClick={() => setAuthView('register')}>Regístrate</button></>
          )}
        </div>
      </div>
    </div>
  );
}
