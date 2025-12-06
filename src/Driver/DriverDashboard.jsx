// src/components/driver/ProfessionalDriverDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useOrders } from '../../ApiService/UseOrders';
import './DriverDashboard.css'
 // We'll create this CSS file

const ProfessionalDriverDashboard = () => {
  const { user, logout } = useAuth();
  const { orders = [], loading, error, stats = {}, updateOrderStatus } = useOrders() || {};
  
  // Filter only onTruck orders for drivers
  const onTruckOrders = (Array.isArray(orders) ? orders : []).filter(order => 
    order.status === 'onTruck' || order.status === 'out-for-delivery'
  );
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryConfirmation, setDeliveryConfirmation] = useState({
    show: false,
    orderId: null,
    customerName: ''
  });

  // Auto-select first order if available
  useEffect(() => {
    if (onTruckOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(onTruckOrders[0]);
    }
  }, [onTruckOrders, selectedOrder]);

  // Calculate driver stats
  const driverStats = {
    today: {
      deliveries: stats.delivered || 0,
      earnings: (stats.delivered || 0) * 50, // Assuming 50 birr per delivery
      onTimeRate: '95%',
      hours: '4h 30m'
    },
    active: {
      onTruck: stats.onTruck || 0,
      ready: stats.ready || 0,
      pending: stats.pending || 0
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleConfirmDelivery = (order) => {
    setDeliveryConfirmation({
      show: true,
      orderId: order._id || order.id,
      customerName: order.customer?.name || 'Customer'
    });
  };

  const handleDeliveryComplete = async () => {
    if (!deliveryConfirmation.orderId) return;

    try {
      const result = await updateOrderStatus(deliveryConfirmation.orderId, 'delivered');
      
      if (result.success) {
        // Show success message
        alert(`✅ Order #${deliveryConfirmation.orderId} delivered successfully!`);
        
        // Reset confirmation dialog
        setDeliveryConfirmation({ show: false, orderId: null, customerName: '' });
        
        // Remove delivered order from selected
        if (selectedOrder && (selectedOrder._id === deliveryConfirmation.orderId || selectedOrder.id === deliveryConfirmation.orderId)) {
          const remainingOrders = onTruckOrders.filter(order => 
            order._id !== deliveryConfirmation.orderId && order.id !== deliveryConfirmation.orderId
          );
          setSelectedOrder(remainingOrders[0] || null);
        }
      } else {
        alert(`Failed to update order: ${result.error}`);
      }
    } catch (err) {
      alert('Error updating order status. Please try again.');
    }
  };

  const handleCallCustomer = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_blank');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateETA = (createdAt) => {
    if (!createdAt) return 'Soon';
    const created = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - created) / 60000);
    
    if (diffMinutes < 30) return `${30 - diffMinutes} min`;
    if (diffMinutes < 60) return '30+ min';
    return '>1 hour';
  };

  const formatAddress = (addr) => {
    if (!addr) return 'Address not specified';
    if (typeof addr === 'string') return addr;
    if (typeof addr === 'object') {
      if (addr.address) return addr.address;
      const parts = [addr.street, addr.city, addr.region, addr.country].filter(Boolean);
      if (parts.length) return parts.join(', ');
      try { return JSON.stringify(addr); } catch { return 'Address not specified'; }
    }
    return String(addr);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="driver-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading driver orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="driver-dashboard error">
        <div className="error-message">
          <h3>🚨 Error Loading Orders</h3>
          <p>{typeof error === 'string' ? error : (error?.message || JSON.stringify(error))}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-driver-dashboard">
      {/* Header */}
      <header className="driver-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🚗</span>
            <h1>Driver Dashboard</h1>
          </div>
          <div className="driver-info">
            <span className="driver-name">Welcome, {user?.name || 'Driver'}</span>
            <span className="driver-id">ID: DRV-{String(user?.id || '').slice(-6) || '001'}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{driverStats.today.deliveries}</span>
              <span className="stat-label">Today</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{driverStats.today.earnings} ETB</span>
              <span className="stat-label">Earnings</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{onTruckOrders.length}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="driver-main">
        {/* Left Side - Active Orders List */}
        <div className="orders-list-section">
          <div className="section-header">
            <h2>
              <span className="section-icon">📦</span>
              Active Deliveries ({onTruckOrders.length})
            </h2>
            <div className="status-filter">
              <span className="filter-active active">On Truck ({stats.onTruck || 0})</span>
              <span className="filter-ready">Ready ({stats.ready || 0})</span>
            </div>
          </div>

          <div className="orders-container">
            {onTruckOrders.length === 0 ? (
              <div className="no-orders">
                <div className="no-orders-icon">🚗</div>
                <h3>No Active Deliveries</h3>
                <p>All orders have been delivered. Great job!</p>
                <p className="subtext">New orders will appear here automatically.</p>
              </div>
            ) : (
              onTruckOrders.map((order) => (
                <div 
                  key={order._id || order.id}
                  className={`order-card ${selectedOrder && (selectedOrder._id === order._id || selectedOrder.id === order.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectOrder(order)}
                >
                  <div className="order-card-header">
                    <div className="order-id">#{order.orderNumber || order._id?.slice(-8) || 'N/A'}</div>
                    <div className="order-time">{formatTime(order.createdAt)}</div>
                  </div>
                  
                  <div className="order-card-body">
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {order.userName?.charAt(0) || 'C'}
                      </div>
                      <div className="customer-details">
                        <h4>{order.userName || 'Customer'}</h4>
                        <p className="customer-phone">{order.userPhone || 'No phone'}</p>
                      </div>
                    </div>
                    
                    <div className="order-details">
                      <div className="detail-item">
                        <span className="detail-label">Restaurant:</span>
                        <span className="detail-value">{order.restaurant?.name || 'Heri Restaurant'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Block Number:</span>
                        <span className="detail-value">{order.blockNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Room Number:</span>
                        <span className="detail-value">{order.roomNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">ETA:</span>
                        <span className="detail-value eta">{calculateETA(order.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="order-items-preview">
                      <span className="items-count">
                        {order.items?.length || 0} items
                      </span>
                      <span className="order-total">
                        {order.totalAmount || 0} ETB
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-card-footer">
                    <button 
                      className="deliver-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmDelivery(order);
                      }}
                    >
                      ✅ Deliver Now
                    </button>
                    <button 
                      className="call-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCallCustomer(order.customer?.phone);
                      }}
                    >
                      📞 Call
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side - Order Details */}
        <div className="order-details-section">
          {selectedOrder ? (
            <div className="order-details-card">
              <div className="details-header">
                <h3>
                  <span className="details-icon">📋</span>
                  Order Details
                  <span className="order-status-badge onTruck">On Truck</span>
                </h3>
                <div className="order-meta">
                  <span className="meta-item">#{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}</span>
                  <span className="meta-item">📅 {formatTime(selectedOrder.createdAt)}</span>
                </div>
              </div>

              <div className="details-content">
                {/* Customer Info */}
                <div className="detail-section">
                  <h4 className="section-title">
                    <span className="section-icon">👤</span>
                    Customer Information
                  </h4>
                  <div className="customer-detail-card">
                    <div className="customer-header">
                      <div className="customer-avatar-large">
                        {selectedOrder.userName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h4>{selectedOrder.userName || 'Customer'}</h4>
                        <p className="customer-contact">
                          📱 {selectedOrder.userPhone || 'No phone provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="customer-actions">
                      <button 
                        className="action-btn primary"
                        onClick={() => handleCallCustomer(selectedOrder.userPhone)}
                      >
                        📞 Call Customer
                      </button>
                      <button className="action-btn">
                        📍 Get Directions
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="detail-section">
                  <h4 className="section-title">
                    <span className="section-icon">🏠</span>
                    Delivery Address
                  </h4>
                  <div className="address-card">
                    <p className="address-text">
                     <strong> Block Number:</strong>
                      {formatAddress(selectedOrder.blockNumber)}  --  
                     <strong> Room Number:</strong>
                      {formatAddress(selectedOrder.roomNumber)}
                    </p>
                    {selectedOrder.deliveryInstructions && (
                      <div className="delivery-instructions">
                        <strong>Instructions:</strong>
                        <p>{selectedOrder.deliveryInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="detail-section">
                  <h4 className="section-title">
                    <span className="section-icon">🍽️</span>
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="items-list">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-info">
                            <span className="item-quantity">{item.quantity || 1}x</span>
                            <span className="item-name">{item.name || 'Item'}</span>
                          </div>
                          <span className="item-price">
                            {((item.price || 0) * (item.quantity || 1)).toFixed(2)} ETB
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="no-items">No items listed</p>
                    )}
                    
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>{selectedOrder.subtotal || selectedOrder.totalAmount || 0} ETB</span>
                      </div>
                      <div className="summary-row">
                        <span>Delivery Fee:</span>
                        <span>{selectedOrder.deliveryFee || 0} ETB</span>
                      </div>
                      <div className="summary-row">
                        <span>Tax:</span>
                        <span>{selectedOrder.tax || 0} ETB</span>
                      </div>
                      <div className="summary-row total">
                        <strong>Total:</strong>
                        <strong>{selectedOrder.totalAmount || 0} ETB</strong>
                      </div>
                      <div className="summary-row earnings">
                        <span>Your Earnings:</span>
                        <span className="earnings-amount">50 ETB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Actions */}
                <div className="detail-section">
                  <h4 className="section-title">
                    <span className="section-icon">✅</span>
                    Delivery Actions
                  </h4>
                  <div className="delivery-actions">
                    <button 
                      className="deliver-action-btn primary"
                      onClick={() => handleConfirmDelivery(selectedOrder)}
                    >
                      <span className="btn-icon">✅</span>
                      Confirm Delivery
                    </button>
                    <div className="secondary-actions">
                      <button className="action-btn">
                        <span className="btn-icon">📸</span>
                        Upload Photo
                      </button>
                      <button className="action-btn">
                        <span className="btn-icon">📝</span>
                        Add Note
                      </button>
                      <button className="action-btn warning">
                        <span className="btn-icon">⚠️</span>
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-order-selected">
              <div className="empty-state">
                <div className="empty-icon">🚗</div>
                <h3>Select an Order</h3>
                <p>Choose an order from the list to view details</p>
                <p className="subtext">Click on any order card to view its details here</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delivery Confirmation Modal */}
      {deliveryConfirmation.show && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Delivery</h3>
              <button 
                className="modal-close"
                onClick={() => setDeliveryConfirmation({ show: false, orderId: null, customerName: '' })}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="confirmation-icon">✅</div>
              <p className="confirmation-text">
                Are you sure you have delivered the order to <strong>{deliveryConfirmation.customerName}</strong>?
              </p>
              <p className="confirmation-subtext">
                This action cannot be undone. Please verify the delivery before confirming.
              </p>
              
              <div className="confirmation-checklist">
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Customer has received the order</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Payment has been collected (if cash)</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Food quality verified</span>
                </label>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setDeliveryConfirmation({ show: false, orderId: null, customerName: '' })}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleDeliveryComplete}
              >
                ✅ Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalDriverDashboard;