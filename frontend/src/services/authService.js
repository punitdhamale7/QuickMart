import api from './api';

// Signup service
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Login service
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.user.role);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Logout service
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('role');
};
