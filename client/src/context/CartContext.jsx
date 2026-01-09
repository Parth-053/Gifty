import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Load Cart Logic
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gifty_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // 2. Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('gifty_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- ACTIONS ---
  
  const addToCart = (product, qty = 1, options = {}) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id 
          ? { ...item, qty: item.qty + qty, options: { ...item.options, ...options } } 
          : item
        );
      }
      return [...prev, { ...product, qty, options }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id, type) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: type === 'inc' ? item.qty + 1 : Math.max(1, item.qty - 1) };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};