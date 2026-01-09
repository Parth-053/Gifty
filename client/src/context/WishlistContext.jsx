import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // 1. Load Wishlist Logic
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gifty_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // 2. Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('gifty_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // --- ACTIONS ---

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id); // Remove
      }
      return [...prev, product]; // Add
    });
  };

  const isInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};