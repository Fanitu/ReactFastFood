// services/orderService.js
import axios from 'axios';

// Prefer env-configured base URL with Vite; fallback to localhost
const API_BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:27500';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    if (status === 401) {
      try {
        localStorage.removeItem('token');
      } catch {}
      // let the app route guard handle redirection
    }
    const normalized = {
      status: status || 0,
      message: data?.message || data?.error || error.message || 'Request failed',
      data,
    };
    return Promise.reject(normalized);
  }
);

export const orderService = {
  // Get all orders with optional filters
  async getAllOrders(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.append(key, value);
    });
    return api.get(`/order?${params.toString()}`);
  },

  // Get single order by ID
  async getOrderById(id) {
    return api.get(`/order/${id}`);
  },

  // Update order status
  async updateOrderStatus(id, statusData) {
    return api.put(`/order/${id}`, statusData);
  },

  // Create new order
  async createOrder(orderData) {
    return api.post('/order', orderData);
  },

  // Delete order
  async deleteOrder(id) {
    return api.delete(`/order/${id}`);
  },

  // Get order statistics
  async getOrderStats() {
    return api.get('/order/stats');
  },

  // Real-time connection setup
  connectToOrderUpdates(callback) {
    try {
      const eventSource = new EventSource(`${API_BASE_URL}/order/updates`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch {}
      };
      eventSource.onerror = () => {
        // passive error; could add exponential backoff reconnect here
      };
      return () => eventSource.close();
    } catch {
      return () => {};
    }
  }
};