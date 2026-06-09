import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, isAuthenticated as checkAuth, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = () => {
      const authenticated = checkAuth();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
