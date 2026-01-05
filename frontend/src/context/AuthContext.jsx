'use client';
import { createContext, useEffect, useContext, useState } from 'react';
import { cookieUtils, authAPI } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const userInfo = cookieUtils.getUserInfo();
        if (userInfo) setUser(userInfo);
        setLoading(false);
    }, [])

    const login = (userData) => {
    cookieUtils.setUserInfo(userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      cookieUtils.clearUserInfo();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);