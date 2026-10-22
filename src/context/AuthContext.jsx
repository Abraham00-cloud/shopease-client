import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

// Helper to decode JWT payload (extracts role/sub if backend only returns token)
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('shopease_user');
    const token = localStorage.getItem('shopease_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    // Supports either data.jwtToken or data.token depending on your LoginResponseDto
    const token = data.jwtToken || data.token;
    localStorage.setItem('shopease_token', token);

    const decoded = parseJwt(token);
    const userObj = {
      email: data.email || decoded?.sub || email,
      role: data.role || decoded?.role || 'USER',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
    };

    localStorage.setItem('shopease_user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    localStorage.removeItem('shopease_token');
    localStorage.removeItem('shopease_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);