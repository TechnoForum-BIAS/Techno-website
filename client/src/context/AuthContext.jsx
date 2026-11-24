import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Pre-loaded with default student session for smooth intern testing
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tf_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-002',
      name: 'Aarav Sharma (Sample Student)',
      email: 'aarav.2023@bias.ac.in',
      rollNumber: '230101',
      role: 'student' // 'student' | 'coordinator' | 'super_admin'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('tf_token') || 'mock-dev-token');

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('tf_user', JSON.stringify(userData));
    localStorage.setItem('tf_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tf_user');
    localStorage.removeItem('tf_token');
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('tf_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
