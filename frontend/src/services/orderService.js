import api from './api';

// Create a new order
export const placeOrder = async (orderData) => {
  try {
    const res = await api.post('/orders', orderData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

// Get single order detail
export const getOrderDetails = async (orderId) => {
  try {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

// Get customer orders
export const getCustomerOrdersList = async () => {
  try {
    const res = await api.get('/orders/customer');
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

// Get retailer orders
export const getRetailerOrdersList = async () => {
  try {
    const res = await api.get('/orders/retailer');
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

// Update order status (retailer)
export const updateOrderStatusApi = async (orderId, statusData) => {
  try {
    const res = await api.put(`/orders/${orderId}/status`, statusData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

// Verify QR token (retailer)
export const verifyQrCode = async (token) => {
  try {
    const res = await api.get(`/orders/verify-qr/${token}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};
