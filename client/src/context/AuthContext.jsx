import React, { createContext, useState, useEffect } from 'react';

// Context Object
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initial State Load (LocalStorage se)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gifty_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // 2. LocalStorage Sync
  useEffect(() => {
    if (user) {
      localStorage.setItem('gifty_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gifty_user');
    }
  }, [user]);

  // --- ACTIONS ---

  // ✅ Login Function (Abhi Dummy hai, baad me API call karega)
  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API Delay
    setTimeout(() => {
      // Dummy User Data
      const dummyUser = {
        id: 'u123',
        name: 'Arjun Sharma',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
      };
      setUser(dummyUser);
      setIsLoading(false);
      return true;
    }, 1500);
  };

  // ✅ Logout Function
  const logout = () => {
    setUser(null);
  };

  // ✅ Update Profile (Optional)
  const updateProfile = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};