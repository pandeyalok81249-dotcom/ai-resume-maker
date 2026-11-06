import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resumeai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('resumeai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const profile = await authApi.getCurrentUser();
          setUser(profile);
          localStorage.setItem('resumeai_user', JSON.stringify(profile));
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('resumeai_token', response.token);
    localStorage.setItem('resumeai_user', JSON.stringify(response.user));
    return response;
  };

  const loginAsDemo = async () => {
    return login('demo@resumeai.com', 'demo1234');
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('resumeai_token', response.token);
    localStorage.setItem('resumeai_user', JSON.stringify(response.user));
    return response;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('resumeai_token');
    localStorage.removeItem('resumeai_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      loginAsDemo,
      register,
      logout,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

