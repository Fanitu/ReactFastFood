// hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { orderService } from './OrderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    preparing: 0,
    onTruck: 0,
    delivered: 0,
    cancelled: 0
  });

  // Fetch orders with filters
  const fetchOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderService.getAllOrders(filters);
      setOrders(response.orders || response);
      
      // Calculate stats
      const newStats = {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        onTruck: 0,
        delivered: 0,
        cancelled: 0
      };
      
      (response.orders || response).forEach(order => {
        if (newStats.hasOwnProperty(order.status)) {
          newStats[order.status]++;
        }
      });
      
      setStats(newStats);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      await orderService.updateOrderStatus(orderId, { 
        status: newStatus
      });

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );

      // Update stats
      setStats(prev => {
        const oldOrder = orders.find(o => o.id === orderId);
        const newStats = { ...prev };
        if (oldOrder && newStats.hasOwnProperty(oldOrder.status)) {
          newStats[oldOrder.status]--;
        }
        if (newStats.hasOwnProperty(newStatus)) {
          newStats[newStatus]++;
        }
        return newStats;
      });

      return { success: true };
    } catch (err) {
      console.error('Error updating order:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates
  useEffect(() => {
    const disconnect = orderService.connectToOrderUpdates((updatedOrder) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => disconnect();
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    stats,
    fetchOrders,
    updateOrderStatus,
    setOrders
  };
};