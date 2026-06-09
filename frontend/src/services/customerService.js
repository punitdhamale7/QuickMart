import api from './api';

// Get all shops (public)
export const getAllShops = async (params = {}) => {
  try {
    const res = await api.get('/shops', { params });
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

// Get single shop
export const getShopById = async (shopId) => {
  try {
    const res = await api.get(`/shops/${shopId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

// Get products for a shop
export const getShopProducts = async (shopId, params = {}) => {
  try {
    const res = await api.get(`/products/shop/${shopId}`, { params });
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};
