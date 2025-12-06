// src/components/admin/AdminDashboard.js
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { orderService } from '../../ApiService/OrderService';
import './AdminDashboard.css';

const STATUS_OPTIONS = ['all','pending','confirmed','preparing','ready','out-for-delivery','delivered','cancelled'];
const DATE_FILTERS = ['today','thisWeek','thisMonth'];

const formatCurrency = (num) => {
  const n = Number(num || 0);
  return `${n.toLocaleString()} Birr`;
};

const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const formatDay = (d) => new Date(d).toISOString().slice(0,10);

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  // Filters and paging
  const [dateFilter, setDateFilter] = useState('thisWeek');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Data state
  const [ordersPage, setOrdersPage] = useState({ orders: [], total: 0, page: 1, pages: 1 });
  const [ordersAgg, setOrdersAgg] = useState([]); // large list for aggregation
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders page (table)
  const fetchOrdersPage = async () => {
    const filters = { dateFilter, status, search, page, limit };
    return orderService.getAllOrders(filters);
  };

  // Fetch larger batch for aggregates and chart
  const fetchOrdersAgg = async () => {
    const filters = { dateFilter, status: 'all', search: '', page: 1, limit: 1000 };
    return orderService.getAllOrders(filters);
  };

  // Fetch users count
  const fetchUsersCount = async () => {
    try {
      const res = await fetch('http://localhost:27500/user', {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      // Handle current backend shape: { "All Users": "[...]" }
      let usersArr = [];
      if (Array.isArray(data)) usersArr = data;
      else if (Array.isArray(data.users)) usersArr = data.users;
      else if (typeof data["All Users"] === 'string') {
        try { usersArr = JSON.parse(data["All Users"]); } catch {}
      }
      return usersArr.length || 0;
    } catch (e) {
      return 0;
    }
  };

  // Orchestrate fetches
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setError(null);
      try {
        const [pageRes, aggRes, usersLen] = await Promise.all([
          fetchOrdersPage(),
          fetchOrdersAgg(),
          fetchUsersCount(),
        ]);

        if (!active) return;

        const pageData = pageRes?.orders ? pageRes : { orders: Array.isArray(pageRes) ? pageRes : [], total: 0, page: 1, pages: 1 };
        const aggData = aggRes?.orders ? aggRes.orders : (Array.isArray(aggRes) ? aggRes : []);

        setOrdersPage({
          orders: pageData.orders || [],
          total: pageData.total || (pageData.orders?.length || 0),
          page: pageData.page || 1,
          pages: pageData.pages || 1,
        });
        setOrdersAgg(aggData || []);
        setUsersCount(usersLen || 0);
      } catch (e) {
        setError(e?.message || 'Failed to load admin data');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [dateFilter, status, search, page, limit]);

  // Aggregations from ordersAgg
  const kpis = useMemo(() => {
    const list = Array.isArray(ordersAgg) ? ordersAgg : [];
    const todayStart = startOfDay(new Date());

    let totalRevenue = 0;
    let revenueToday = 0;
    let activeOrders = 0;
    let deliveredToday = 0;
    let pendingIssues = 0;

    const buckets = new Map(); // key: YYYY-MM-DD -> sum

    for (const o of list) {
      const amt = Number(o.totalAmount || 0);
      totalRevenue += amt;

      const created = new Date(o.createdAt || o.updatedAt || Date.now());
      const key = formatDay(created);
      buckets.set(key, (buckets.get(key) || 0) + amt);

      if (created >= todayStart) revenueToday += amt;
      const st = o.status || 'pending';
      if (st === 'pending') pendingIssues++;
      if (st !== 'delivered' && st !== 'cancelled') activeOrders++;
      if (st === 'delivered' && created >= todayStart) deliveredToday++;
    }

    // build series sorted by date asc
    const revenueSeries = Array.from(buckets.entries())
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value }));

    return {
      totalRevenue,
      revenueToday,
      activeOrders,
      deliveredToday,
      pendingIssues,
      revenueSeries,
    };
  }, [ordersAgg]);

  // Handlers
  const onSearchSubmit = (e) => { e.preventDefault(); setPage(1); };
  const changePage = (p) => { if (p >= 1 && p <= (ordersPage.pages || 1)) setPage(p); };

  // UI helpers
  const Loading = () => (
    <div className="admin-loading">Loading dashboard...</div>
  );
  const ErrorView = ({ message }) => (
    <div className="admin-error">{message}</div>
  );

  // Simple SVG bar chart
  const RevenueChart = ({ data }) => {
    const width = 600; const height = 220; const padding = 32;
    const values = data.map(d => d.value);
    const max = Math.max(1, ...values);
    const barWidth = (width - padding * 2) / Math.max(1, data.length);
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {data.map((d, i) => {
          const h = Math.round((d.value / max) * (height - padding * 2));
          const x = padding + i * barWidth;
          const y = height - padding - h;
          return (
            <g key={d.date}>
              <rect x={x + 2} y={y} width={Math.max(2, barWidth - 6)} height={h} rx="4" fill="#078930" />
              {/* label */}
              {barWidth > 28 && (
                <text x={x + barWidth/2} y={height - padding + 16} textAnchor="middle" fontSize="10" fill="#666">
                  {d.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
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
          <form onSubmit={onSearchSubmit} className="admin-search">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders, customers, items, ID" />
            <button type="submit">Search</button>
          </form>
          <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} className="time-select">
            {DATE_FILTERS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        {STATUS_OPTIONS.map(s => (
          <button key={s} className={`tab ${status === s ? 'active' : ''}`} onClick={() => { setStatus(s); setPage(1); }}>
            {s}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {error && !loading && <ErrorView message={error} />}

      {!loading && !error && (
        <>
          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card large">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">{formatCurrency(kpis.totalRevenue)}</p>
                <p className="stat-subtext">{DATE_FILTERS.includes(dateFilter) ? dateFilter : 'range'}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>Active Orders</h3>
                <p className="stat-value">{kpis.activeOrders}</p>
                <p className="stat-subtext">In progress</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{usersCount}</p>
                <p className="stat-subtext">Registered</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Delivered Today</h3>
                <p className="stat-value">{kpis.deliveredToday}</p>
                <p className="stat-subtext">vs today</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="dashboard-grid">
            <div className="left-column">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Revenue Overview</h3>
                </div>
                <div className="chart-container">
                  <RevenueChart data={kpis.revenueSeries} />
                </div>
              </div>

              {/* Orders Table */}
              <div className="orders-card">
                <div className="card-header">
                  <h3>Orders</h3>
                </div>
                <div className="orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(ordersPage.orders || []).map((o) => (
                        <tr key={o._id || o.id}>
                          <td><strong>{o._id || o.id}</strong></td>
                          <td>{o.userName || o.user?.name || '—'}</td>
                          <td>{formatCurrency(o.totalAmount)}</td>
                          <td><span className={`status-badge ${o.status}`}>{String(o.status || '').replace('_',' ')}</span></td>
                          <td>{new Date(o.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-footer">
                  <div>Page {ordersPage.page} of {ordersPage.pages}</div>
                  <div className="pager">
                    <button onClick={() => changePage(ordersPage.page - 1)} disabled={ordersPage.page <= 1}>Prev</button>
                    <button onClick={() => changePage(ordersPage.page + 1)} disabled={ordersPage.page >= ordersPage.pages}>Next</button>
                    <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
                      {[10,20,50].map(n => <option key={n} value={n}>{n}/page</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="right-column">
              {/* Pending Issues and Today Revenue */}
              <div className="top-performers">
                <div className="card-header">
                  <h3>Today Highlights</h3>
                </div>
                <div className="performers-list">
                  <div className="performer-item">
                    <div className="performer-rank">💵</div>
                    <div className="performer-info">
                      <div className="performer-name">Revenue Today</div>
                      <div className="performer-stats"><span className="stat earnings">{formatCurrency(kpis.revenueToday)}</span></div>
                    </div>
                  </div>
                  <div className="performer-item">
                    <div className="performer-rank">⏳</div>
                    <div className="performer-info">
                      <div className="performer-name">Pending Issues</div>
                      <div className="performer-stats"><span className="stat">{kpis.pendingIssues}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="admin-quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-grid">
                  <button className="admin-action-btn"><span className="action-icon">📊</span><span>Export</span></button>
                  <button className="admin-action-btn"><span className="action-icon">🔄</span><span>Refresh</span></button>
                  <button className="admin-action-btn"><span className="action-icon">⚙</span><span>Settings</span></button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;