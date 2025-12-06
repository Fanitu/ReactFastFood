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
    ready: 0,
    onTruck: 0,
    delivered: 0,
    cancelled: 0,
    'out-for-delivery': 0,
  });

  // Fetch orders with filters
  const fetchOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.getAllOrders(filters);
      const list = response?.orders || response || [];
      setOrders(Array.isArray(list) ? list : []);

      // Calculate stats
      const newStats = {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        ready: 0,
        onTruck: 0,
        delivered: 0,
        cancelled: 0,
        'out-for-delivery': 0,
      };

      (Array.isArray(list) ? list : []).forEach((order) => {
        const status = order.status || 'pending';
        if (Object.prototype.hasOwnProperty.call(newStats, status)) {
          newStats[status]++;
        }
      });

      setStats(newStats);
    } catch (err) {
      setError(err?.message || 'Failed to fetch orders');
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
        status: newStatus,
      });

      // Update local state (support both id and _id)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          (order.id === orderId || order._id === orderId)
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );

      // Update stats using fresh orders ref
      setStats((prev) => {
        const current = { ...prev };
        const oldOrder = orders.find((o) => o.id === orderId || o._id === orderId);
        if (oldOrder && Object.prototype.hasOwnProperty.call(current, oldOrder.status)) {
          current[oldOrder.status] = Math.max(0, (current[oldOrder.status] || 0) - 1);
        }
        if (Object.prototype.hasOwnProperty.call(current, newStatus)) {
          current[newStatus] = (current[newStatus] || 0) + 1;
        }
        return current;
      });

      return { success: true };
    } catch (err) {
      console.error('Error updating order:', err);
      return { success: false, error: err?.message };
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates
  useEffect(() => {
    const disconnect = orderService.connectToOrderUpdates((updatedOrder) => {
      setOrders((prevOrders) => {
        const idx = prevOrders.findIndex(
          (o) => o._id === updatedOrder._id || o.id === updatedOrder.id
        );
        if (idx === -1) return prevOrders;
        const next = [...prevOrders];
        next[idx] = { ...next[idx], ...updatedOrder };
        return next;
      });
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