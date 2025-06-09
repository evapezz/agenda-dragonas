import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { login as loginService } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar, verificar si hay sesión válida
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verificar que el token siga siendo válido
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/verify');
          
          if (response.data.valid) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token inválido, limpiar todo
            clearAuthData();
          }
        } catch (error) {
          // Error al verificar token, limpiar todo
          clearAuthData();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authData');
    sessionStorage.clear();
    delete api.defaults.headers.common['Authorization'];
  };

  const login = async (username, password) => {
    try {
      // Limpiar cualquier sesión anterior antes de hacer login
      clearAuthData();
      
      // Llamada al backend
      const { token, user: userData } = await loginService({ username, password });
      
      // Configurar Axios y estado
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      // Persistir en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData; 
    } catch (error) {
      // En caso de error, asegurar que no queden datos residuales
      clearAuthData();
      throw error;
    }
  };

  const logout = () => {
    // Limpiar completamente el estado y localStorage
    clearAuthData();
    
    // Forzar recarga de la página para limpiar cualquier estado residual
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

