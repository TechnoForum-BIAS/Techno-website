import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Pre-loaded user session for smooth testing
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('tf_token') || null);

  const loginUser = (userData, authToken) => {
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

  // API Call: Signup
  const signup = async ({ name, email, rollNumber, password, role }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, rollNumber, password, role })
    });
    return res.json();
  };

  // API Call: Verify Email with OTP Code or Token
  const verifyEmail = async ({ email, code, token }) => {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, token })
    });
    const data = await res.json();
    if (data.success && data.token && data.user) {
      loginUser(data.user, data.token);
    }
    return data;
  };

  // API Call: Resend Verification Code
  const resendOtp = async (email) => {
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  };

  // API Call: Google OAuth
  const googleLogin = async ({ email, name, picture, credential, accessToken, role }) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, picture, credential, accessToken, role })
    });
    const data = await res.json();
    if (data.success && data.token && data.user) {
      loginUser(data.user, data.token);
    }
    return data;
  };

  // API Call: Forgot Password
  const forgotPassword = async (email) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  };

  // API Call: Reset Password
  const resetPassword = async ({ email, code, token, newPassword }) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, token, newPassword })
    });
    return res.json();
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login: loginUser,
      logout,
      switchRole,
      signup,
      verifyEmail,
      resendOtp,
      googleLogin,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
