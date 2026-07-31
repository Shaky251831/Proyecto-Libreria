import React, { useState, useEffect } from 'react';
import { X, ImageIcon } from 'lucide-react';
import './AdminBookForm.css';

const emptyForm = {
  titulo: '',
  autor: '',
  precio: '',
  stock: '',
  categoria_id: '',
  img_portada: '',
  descripcion: '',
};

/**
 * Modal para crear o editar un libro (uso exclusivo del Panel de Administrador).
 * Incluye un campo dedicado para enlazar la portada del libro, con vista previa en vivo.
 *
 * Props:
 *  - open: boolean, controla la visibilidad del modal
 *  - onClose: función para cerrar sin guardar
 *  - onSubmit: función async(formData) -> se invoca al guardar (crear o editar)
 *  - categorias: array de { id, nombre }
 *  - libroInicial: objeto del libro a editar, o null si es un alta nueva
 */
export default function AdminBookForm({ open, onClose, onSubmit, categorias = [], libroInicial = null }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const esEdicion = Boolean(libroInicial);

  useEffect(() => {
    if (open) {
      setForm(
        libroInicial
          ? {
              titulo: libroInicial.titulo || libroInicial.title || '',
              autor: libroInicial.autor || libroInicial.author || '',
              precio: libroInicial.precio ?? libroInicial.price ?? '',
              stock: libroInicial.stock ?? '',
              categoria_id: libroInicial.categoria_id || '',
              img_portada: libroInicial.img_portada || '',
              descripcion: libroInicial.descripcion || '',
            }
          : emptyForm
      );
      setError('');
    }
  }, [open, libroInicial]);

  if (!open) return null;

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.autor || !form.precio || !form.stock || !form.categoria_id) {
      setError('Completa los campos obligatorios: título, autor, precio, stock y categoría.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err?.message || 'No se pudo guardar el libro.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mdt-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mdt-book-form-card">
        <button className="mdt-modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="mdt-modal-header">
          <span className="mdt-eyebrow">{esEdicion ? 'Editar título' : 'Nuevo título'}</span>
          <h2 className="mdt-serif">{esEdicion ? 'Editar libro' : 'Registrar libro'}</h2>
        </div>

        {error && <div className="mdt-modal-alert mdt-modal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="mdt-book-form-grid">
          <div className="mdt-book-form-fields">
            <div className="mdt-field">
              <label>Título</label>
              <input type="text" value={form.titulo} onChange={handleChange('titulo')} disabled={saving} />
            </div>

            <div className="mdt-field">
              <label>Autor</label>
              <input type="text" value={form.autor} onChange={handleChange('autor')} disabled={saving} />
            </div>

            <div className="mdt-field">
              <label>Categoría</label>
              <select value={form.categoria_id} onChange={handleChange('categoria_id')} disabled={saving}>
                <option value="">Selecciona una categoría…</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div className="mdt-book-form-row">
              <div className="mdt-field">
                <label>Precio (MXN)</label>
                <input type="number" step="0.01" min="0" value={form.precio} onChange={handleChange('precio')} disabled={saving} />
              </div>
              <div className="mdt-field">
                <label>Stock</label>
                <input type="number" min="0" value={form.stock} onChange={handleChange('stock')} disabled={saving} />
              </div>
            </div>

            <div className="mdt-field">
              <label>URL de la portada</label>
              <input
                type="text"
                placeholder="https://…/portada.jpg"
                value={form.img_portada}
                onChange={handleChange('img_portada')}
                disabled={saving}
              />
            </div>

            <div className="mdt-field">
              <label>Descripción (opcional)</label>
              <textarea rows={3} value={form.descripcion} onChange={handleChange('descripcion')} disabled={saving} />
            </div>
          </div>

          {/* Vista previa de la portada */}
          <div className="mdt-book-form-preview">
            <span className="mdt-book-form-preview-label">Vista previa</span>
            <div className="mdt-book-form-preview-cover">
              {form.img_portada ? (
                <img src={form.img_portada} alt="Vista previa de portada" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="mdt-book-form-preview-empty">
                  <ImageIcon size={26} strokeWidth={1} />
                  <span>Sin portada</span>
                </div>
              )}
            </div>
          </div>

          <div className="mdt-book-form-actions">
            <button type="button" className="mdt-btn mdt-btn-outline" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="mdt-btn mdt-btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Registrar libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
