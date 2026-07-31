import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // 'login' o 'register' para que el modal pueda alternar entre ambas vistas
  const [authView, setAuthView] = useState('login');

  const openLogin = useCallback(() => {
    setAuthView('login');
    setIsLoginOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setAuthView('register');
    setIsLoginOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => setIsLoginOpen(false), []);

  const value = { isLoginOpen, authView, setAuthView, openLogin, openRegister, closeAuthModal };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI debe usarse dentro de un <UIProvider>');
  return ctx;
}
