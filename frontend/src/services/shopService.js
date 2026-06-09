import api from './api';

// Helper — set correct Content-Type when sending FormData
const cfg = (data) =>
  data instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};

export const createShop = async (data) => {
  try {
    const res = await api.post('/shops', data, cfg(data));
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

export const getMyShop = async () => {
  try {
    const res = await api.get('/shops/my-shop');
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

export const updateShop = async (id, data) => {
  try {
    const res = await api.put(`/shops/${id}`, data, cfg(data));
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

// Toggle shop open / closed
export const toggleShopStatus = async (shopId, currentStatus) => {
  try {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const res = await api.put(`/shops/${shopId}`, { shop_status: newStatus });
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

