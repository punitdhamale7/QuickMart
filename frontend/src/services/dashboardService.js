import api from './api';

export const getDashboardStats = async () => {
  try {
    const res = await api.get('/dashboard/stats');
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};

export const getAnalyticsData = async () => {
  try {
    const res = await api.get('/dashboard/analytics');
    return res.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: 'Network error' };
  }
};
