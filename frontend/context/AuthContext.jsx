'use client';
import { createContext, useEffect, useContext, useState } from 'react';
import { cookieUtils, authAPI } from '../src/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const userInfo = cookieUtils.getUserInfo();
        if (userInfo) setUser(userInfo);
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default useAuth = () => useContext(AuthContext);