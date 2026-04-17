// src/services/api.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('🔧 API Base URL:', API_URL);  
// Helper: get token from localStorage
const getToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo).token : null;
};

// Generic request function
const request = async (endpoint, method = 'GET', body = null, requireAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (requireAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Auth APIs
export const authAPI = {
  register: (userData) => request('/auth/register', 'POST', userData),
  login: (credentials) => request('/auth/login', 'POST', credentials),
  getProfile: () => request('/auth/profile', 'GET', null, true),
};

// Product APIs
export const productAPI = {
  getAll: () => request('/products'),
  getById: (id) => request(`/products/${id}`),
  create: (productData) => request('/products', 'POST', productData, true),
  update: (id, productData) => request(`/products/${id}`, 'PUT', productData, true),
  delete: (id) => request(`/products/${id}`, 'DELETE', null, true),
};

// Category APIs
export const categoryAPI = {
  getAll: () => request('/categories'),
  create: (categoryData) => request('/categories', 'POST', categoryData, true),
  update: (id, categoryData) => request(`/categories/${id}`, 'PUT', categoryData, true),
  delete: (id) => request(`/categories/${id}`, 'DELETE', null, true),
};

// Order APIs
export const orderAPI = {
  create: (orderData) => request('/orders', 'POST', orderData, true),
  getMyOrders: () => request('/orders/myorders', 'GET', null, true),
  getAll: () => request('/orders', 'GET', null, true),
  updateStatus: (id, status) => request(`/orders/${id}/status`, 'PUT', { status }, true),
};

// Contact API
export const contactAPI = {
  send: (messageData) => request('/contact', 'POST', messageData),
};

// User APIs (admin only)   ← ADD THIS BLOCK
export const userAPI = {
  getAll: () => request('/users', 'GET', null, true),
  update: (id, data) => request(`/users/${id}`, 'PUT', data, true),
  delete: (id) => request(`/users/${id}`, 'DELETE', null, true),
};

// Settings APIs   ← ALSO ADD THIS BLOCK (for Settings page)
export const settingsAPI = {
  get: () => request('/settings'),
  update: (data) => request('/settings', 'PUT', data, true),
};