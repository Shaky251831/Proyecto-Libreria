import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'mdt_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((book, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === book.id);
      if (existing) {
        return prev.map((it) =>
          it.id === book.id ? { ...it, quantity: it.quantity + qty } : it
        );
      }
      return [
        ...prev,
        {
          id: book.id,
          titulo: book.titulo,
          autor: book.autor,
          precio: Number(book.precio),
          img_portada: book.img_portada || null,
          quantity: qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const increaseQty = useCallback((id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it)));
  }, []);

  const decreaseQty = useCallback((id) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id && it.quantity > 1 ? { ...it, quantity: it.quantity - 1 } : it))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const totalItems = useMemo(() => items.reduce((acc, it) => acc + it.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((acc, it) => acc + it.precio * it.quantity, 0),
    [items]
  );

  const value = {
    items,
    isOpen,
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de un <CartProvider>');
  return ctx;
}
