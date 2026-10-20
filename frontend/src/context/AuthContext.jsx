import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService, UserService, setApiToken, registerUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // In-memory token storage (NOT localStorage) per strict security requirement
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setApiToken(null);
  }, []);

  useEffect(() => {
    // Register centralized 401 handler so expired tokens cleanly log out the user
    registerUnauthorizedHandler(() => {
      logout();
    });
  }, [logout]);

  const login = async ({ email, password }) => {
    const data = await AuthService.login({ email, password });
    if (data?.token) {
      setToken(data.token);
      setApiToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async ({ name, email, password }) => {
    return await AuthService.register({ name, email, password });
  };

  const updateProfile = async ({ name }) => {
    const updated = await UserService.updateProfile({ name });
    setUser(prev => ({ ...prev, ...updated }));
    return updated;
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    return await UserService.changePassword({ currentPassword, newPassword });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isInitializing,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
