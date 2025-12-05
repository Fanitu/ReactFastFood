// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 1247,
    activeOrders: 13,
    totalRevenue: 22850,
    activeDrivers: 2,
    totalCustomers: 1892,
    totalRestaurants: 2,
    todayRevenue: 2345.67,
    pendingIssues: 8
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topDrivers, setTopDrivers] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);

  useEffect(() => {
    // Mock recent orders
    setRecentOrders([
      { id: 'ORD-001', customer: 'John Doe', amount: 45.99, status: 'delivered', time: '10:30 AM' },
      { id: 'ORD-002', customer: 'Jane Smith', amount: 28.50, status: 'preparing', time: '10:25 AM' },
      { id: 'ORD-003', customer: 'Bob Johnson', amount: 67.80, status: 'on_the_way', time: '10:20 AM' },
      { id: 'ORD-004', customer: 'Alice Brown', amount: 32.99, status: 'pending', time: '10:15 AM' },
      { id: 'ORD-005', customer: 'Charlie Wilson', amount: 55.75, status: 'delivered', time: '10:10 AM' }
    ]);

    // Mock top drivers
    setTopDrivers([
      { id: 'DRV-001', name: 'Ashenafi Bedele', deliveries: 128, rating: 4.9, earnings: 2567.89 },
      { id: 'DRV-002', name: 'shemsu adino', deliveries: 115, rating: 4.8, earnings: 2345.67 },
   ]);

    // Mock active drivers
    setActiveDrivers([
      { id: 'DRV-101', name: 'Ashenafi Bedele', status: 'delivering', location: 'Downtown', order: 'ORD-023' },
      { id: 'DRV-102', name: 'shemsu adino', status: 'available', location: 'Uptown', order: null }
    ]);
  }, []);

  const updateDriverStatus = (driverId, status) => {
    setActiveDrivers(prev =>
      prev.map(driver =>
        driver.id === driverId ? { ...driver, status } : driver
      )
    );
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-welcome">
          <h1>👑 Admin Dashboard</h1>
          <p>Welcome back, {user?.name || 'Admin'}! Here's your overview.</p>
        </div>
        <div className="header-actions">
          <div className="header-stats">
            <span className="live-indicator"></span>
            <span>Live Updates</span>
          </div>
          <button className="btn-notification">🔔 <span className="notification-count">3</span></button>
          <button className="btn-settings">⚙</button>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card large">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">{stats.totalRevenue.toLocaleString()} Birr</p>
            <p className="stat-change positive">↑ 12.5% this month</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Active Orders</h3>
            <p className="stat-value">{stats.activeOrders}</p>
            <p className="stat-subtext">In progress</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>Active Drivers</h3>
            <p className="stat-value">{stats.activeDrivers}</p>
            <p className="stat-subtext">On duty</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Customers</h3>
            <p className="stat-value">{stats.totalCustomers}</p>
            <p className="stat-change positive">↑ 8.2%</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* Revenue Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Overview</h3>
              <select className="time-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[65, 80, 75, 90, 85, 95, 100].map((height, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${height}% `}}>
                    <div className="bar-tooltip">${(height * 100).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="orders-card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <button className="btn-view-all">View All →</button>
            </div>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.customer}</td>
                      <td>${order.amount}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Active Drivers */}
          <div className="drivers-card">
            <div className="card-header">
              <h3>Active Drivers</h3>
              <button className="btn-refresh">🔄</button>
            </div>
            <div className="drivers-list">
              {activeDrivers.map(driver => (
                <div key={driver.id} className="driver-item">
                  <div className="driver-avatar-small">
                    <span>🚗</span>
                  </div>
                  <div className="driver-info">
                    <div className="driver-name-status">
                      <strong>{driver.name}</strong>
                      <span className={`driver-status ${driver.status}`}>
                        {driver.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="driver-details">
                      <span className="location">📍 {driver.location}</span>
                      {driver.order && (
                        <span className="current-order">📦 {driver.order}</span>
                      )}
                    </div>
                  </div>
                  <div className="driver-actions">
                    <button 
                      className="btn-action"
                      onClick={() => updateDriverStatus(driver.id, 'available')}
                    >
                      ✅
                    </button>
                    <button 
                      className="btn-action"
                      onClick={() => updateDriverStatus(driver.id, 'on_break')}
                    >
                      ☕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="top-performers">
            <div className="card-header">
              <h3>Top Drivers</h3>
              <select className="time-select">
                <option>This Month</option>
                <option>This Week</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="performers-list">
              {topDrivers.map((driver, index) => (
                <div key={driver.id} className="performer-item">
                  <div className="performer-rank">{index + 1}</div>
                  <div className="performer-avatar">
                    <span>👤</span>
                  </div>
                  <div className="performer-info">
                    <div className="performer-name">{driver.name}</div>
                    <div className="performer-stats">
                      <span className="stat">{driver.deliveries} deliveries</span>
                      <span className="stat">⭐ {driver.rating}</span>
                      <span className="stat earnings">${driver.earnings.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="btn-view-profile">View</button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-grid">
              <button className="admin-action-btn">
                <span className="action-icon">➕</span>
                <span>Add Driver</span>
              </button>
              <button className="admin-action-btn">
                <span className="action-icon">🏪</span>
                <span>Add Restaurant</span>
              </button>
              <button className="admin-action-btn">
                <span className="action-icon">📊</span>
                <span>Reports</span>
              </button>
              <button className="admin-action-btn">
                <span className="action-icon">⚙</span>
                <span>Settings</span>
              </button>
              <button className="admin-action-btn">
                <span className="action-icon">📧</span>
                <span>Broadcast</span>
              </button>
              <button className="admin-action-btn">
                <span className="action-icon">🔄</span>
                <span>Update Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="bottom-stats">
        <div className="stat-item">
          <div className="stat-label">Today's Revenue</div>
          <div className="stat-value">{stats.todayRevenue.toLocaleString()} Birr</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg. Delivery Time</div>
          <div className="stat-value">24 min</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Customer Satisfaction</div>
          <div className="stat-value">94.2%</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Pending Issues</div>
          <div className="stat-value warning">{stats.pendingIssues}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;