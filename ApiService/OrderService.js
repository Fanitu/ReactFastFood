// services/orderService.js
import axios from 'axios';


const API_BASE_URL =  'http://localhost:27500';

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
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const orderService = {
  // Get all orders with optional filters
  async getAllOrders(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
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
    // You can implement WebSocket or SSE here
    const eventSource = new EventSource(`${API_BASE_URL}/order/updates`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      // Implement reconnection logic
    };

    return () => eventSource.close();
  }
};