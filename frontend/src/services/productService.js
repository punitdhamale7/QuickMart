import api from './api';

export const addProduct = async (formData) => {
  try {
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

export const getMyProducts = async (params = {}) => {
  try {
    const res = await api.get('/products', { params });
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const res = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

export const getInventory = async () => {
  try {
    const res = await api.get('/products/inventory');
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};
