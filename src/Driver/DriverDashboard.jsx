// src/components/driver/ProfessionalDriverDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../AuthContext/AuthContext';

// Custom Ethiopian-themed icons using emojis (no image imports)
const createEthiopiaIcon = (emoji, color, size = 40) => L.divIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, ${color}, ${color}CC);
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: ${size * 0.5}px;
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      ${emoji}
    </div>
  `,
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
  popupAnchor: [0, -size]
});

// Custom map controller
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

// Animation for driver marker
const AnimatedDriverMarker = ({ position }) => {
  const [bounce, setBounce] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(prev => (prev === 0 ? 10 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const markerStyle = {
    transform: `translateY(-${bounce}px)`,
    transition: 'transform 0.5s ease-in-out'
  };

  return (
    <Marker position={position} icon={createEthiopiaIcon('🚗', '#078930', 50)}>
      <Popup>
        <div className="ethiopia-popup">
          <h3>🏍️ የእርስዎ ቦታ</h3>
          <p>አስተናጋጅ: መኮንን አለማየሁ</p>
          <p>ሞተር ሳይክል • ETH-AB-1234</p>
          <p>አሁን እየተጓዘ ነው</p>
        </div>
      </Popup>
    </Marker>
  );
};

const ProfessionalDriverDashboard = () => {
  const { user, logout } = useAuth();
  const mapRef = useRef();
  const [driverLocation, setDriverLocation] = useState([9.0320, 38.7469]); // Addis Ababa
  const [deliveryLocation, setDeliveryLocation] = useState([9.0450, 38.7569]);
  const [route, setRoute] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [currentOrder, setCurrentOrder] = useState({
    id: 'ORD-ETH-2024-001',
    customer: {
      name: 'የስም ተጠቃሚ',
      phone: '+251 91 234 5678',
      avatar: '👤'
    },
    delivery: {
      address: 'ቦሌ መዲና, መንገድ ፫፻፲፮, ህንጻ ፬ ፎቅ ፬፻፪',
      instructions: 'ቤቱ ቀይ በረንዳ አለው፣ ሰላም አለው ብለው ይደውሉ',
      floor: '4th Floor',
      apartment: '412'
    },
    restaurant: {
      name: 'Burger Palace ኢትዮጵያ',
      address: 'ፒያሳ, ከአርበኞች ህንጻ አጠገብ'
    },
    items: [
      { name: 'ቢራንዲ በርገር', quantity: 2, price: 180 },
      { name: 'ፍራይ ብርስክት', quantity: 1, price: 120 },
      { name: 'ኮከ ባልስ', quantity: 2, price: 60 }
    ],
    total: 600,
    status: 'on_truck', // on_truck, delivered
    payment: {
      method: 'cash',
      amount: 600,
      status: 'pending'
    },
    timings: {
      pickup: '10:45 AM',
      estimated: '11:00 AM',
      current: '10:55 AM'
    },
    distance: '2.5 km',
    earnings: 50
  });
  
  const [upcomingOrders, setUpcomingOrders] = useState([
    {
      id: 'ORD-ETH-2024-002',
      restaurant: 'Pizza Heaven ኢትዮጵያ',
      customer: 'ሚካኤል ኃይለማርያም',
      address: 'መንገድ ፮, ከታዋቂው ቤተክርስቲያን በስተግራ',
      eta: '25 min',
      amount: 450
    }
  ]);

  const [stats, setStats] = useState({
    today: {
      deliveries: 8,
      earnings: 560,
      rating: 4.8,
      hours: '4h 30m'
    },
    weekly: {
      deliveries: 42,
      earnings: 2940,
      rating: 4.9
    }
  });

  // Initialize driver location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setDriverLocation(newLocation);
        },
        () => {
          console.log('Using default Addis Ababa location');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Calculate route
  useEffect(() => {
    const calculateRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${driverLocation[1]},${driverLocation[0]};${deliveryLocation[1]},${deliveryLocation[0]}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          const coordinates = data.routes[0].geometry.coordinates;
          const routePoints = coordinates.map(coord => [coord[1], coord[0]]);
          setRoute(routePoints);
        }
      } catch (error) {
        console.log('Using straight line route');
        setRoute([driverLocation, deliveryLocation]);
      }
    };

    calculateRoute();
  }, [driverLocation, deliveryLocation]);

  const handleDeliveryComplete = () => {
    setCurrentOrder(prev => ({
      ...prev,
      status: 'delivered'
    }));
    
    // Show success message
    setTimeout(() => {
      if (upcomingOrders.length > 0) {
        const nextOrder = upcomingOrders[0];
        setCurrentOrder({
          ...nextOrder,
          status: 'on_truck'
        });
        setUpcomingOrders(prev => prev.slice(1));
        alert('✅ ትዕዛዙ በተሳካ ሁኔታ ተደርሷል! ወደ ቀጣዩ ትዕዛዝ ይቀጥሉ።');
      }
    }, 1500);
  };

  const handleCallCustomer = () => {
    window.open(`tel:${currentOrder.customer.phone}`, '_blank');
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${deliveryLocation[0]},${deliveryLocation[1]}`;
    window.open(url, '_blank');
  };

  // Calculate remaining time
  const calculateRemainingTime = () => {
    const now = new Date();
    const estimated = new Date();
    estimated.setHours(11, 0, 0); // 11:00 AM
    const diff = Math.max(0, Math.floor((estimated - now) / 60000));
    return diff > 0 ? `${diff} ደቂቃ` : 'በቅርቡ ይደርሳል';
  };

  return (
    <div className="professional-driver-dashboard">
      {/* ETHIOPIAN THEMED HEADER */}
      <header className="ethiopia-header">
        <div className="header-gradient">
          <div className="header-content">
            <div className="logo-section">
              <div className="ethiopia-logo">
                <span className="logo-icon">YoYo</span>
                <div className="logo-text">
                  <p className="tagline">Yoyo Restaurant Delivery system</p>
                </div>
              </div>
            </div>

            <div className="driver-profile-section">
              <div className="driver-card">
                <div className="driver-avatar">
                  <span className="avatar-text">መ</span>
                  <div className="online-status active"></div>
                </div>
                <div className="driver-info">
                  <h3>መኮንን አለማየሁ</h3>
                </div>
              </div>

              <div className="stats-preview">
                <div>
                  <button className="btn-logout" onClick={logout}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - MAP & ORDERS */}
      <main className="dashboard-main">
        {/* LEFT SIDE - INTERACTIVE MAP */}
        <div className="map-section">
          <div className="map-header-controls">
            <div className="map-title">
              <h2>
                <span className="map-icon">🗺️</span>
                ቀጥታ አሰሳ
                <span className="eta-badge">{calculateRemainingTime()}</span>
              </h2>
              <p className="map-subtitle">ወደ ደንበኛው ቦታ እየተጓዙ ነው</p>
            </div>
            
            <div className="map-actions">
              <button 
                className="map-action-btn primary"
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.setView(driverLocation, 16);
                  }
                }}
              >
                <span className="btn-icon">📍</span>
                ወደ እኔ
              </button>
              <button 
                className="map-action-btn"
                onClick={() => {
                  if (mapRef.current) {
                    const bounds = L.latLngBounds([driverLocation, deliveryLocation]);
                    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                  }
                }}
              >
                <span className="btn-icon">👁️</span>
                ሁሉንም አሳይ
              </button>
              <button 
                className="map-action-btn"
                onClick={() => setZoomLevel(z => Math.min(z + 1, 18))}
              >
                <span className="btn-icon">➕</span>
                Zoom In
              </button>
              <button 
                className="map-action-btn"
                onClick={() => setZoomLevel(z => Math.max(z - 1, 10))}
              >
                <span className="btn-icon">➖</span>
                Zoom Out
              </button>
            </div>
          </div>

          <div className="map-container-wrapper">
            <MapContainer
              center={driverLocation}
              zoom={zoomLevel}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
              }}
              className="ethiopia-map"
            >
              {/* Beautiful Map Tiles - Multiple Options */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-tiles"
              />
              
              <AnimatedDriverMarker position={driverLocation} />

              {/* Delivery Marker */}
              <Marker position={deliveryLocation} icon={createEthiopiaIcon('📍', '#DA121A', 45)}>
                <Popup>
                  <div className="ethiopia-popup delivery">
                    <h3>📦 የማድረስ ቦታ</h3>
                    <p><strong>ደንበኛ:</strong> {currentOrder.customer.name}</p>
                    <p><strong>አድራሻ:</strong> {currentOrder.delivery.address}</p>
                    <p><strong>ፎቅ:</strong> {currentOrder.delivery.floor}</p>
                    <p><strong>ማሰራጫ:</strong> {currentOrder.delivery.apartment}</p>
                    <button 
                      className="popup-call-btn"
                      onClick={handleCallCustomer}
                    >
                      📞 ደውል
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* Route Line */}
              {route.length > 0 && (
                <Polyline
                  positions={route}
                  color="#078930"
                  weight={5}
                  opacity={0.8}
                  dashArray="15, 10"
                  lineCap="round"
                  className="animated-route"
                />
              )}

              {/* Map Controller */}
              <MapController center={driverLocation} zoom={zoomLevel} />
            </MapContainer>
          </div>

          {/* Map Footer Stats */}
          <div className="map-footer-stats">
            <div className="map-stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">{currentOrder.distance}</div>
                <div className="stat-label">ርቀት</div>
              </div>
            </div>
            <div className="map-stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <div className="stat-value">{calculateRemainingTime()}</div>
                <div className="stat-label">ቀሪ ጊዜ</div>
              </div>
            </div>
            <div className="map-stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">{currentOrder.earnings} ብር</div>
                <div className="stat-label">ገቢ</div>
              </div>
            </div>
            <div className="map-stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-value">{currentOrder.items.length}</div>
                <div className="stat-label">እቃዎች</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - ORDER DETAILS */}
        <div className="order-details-section">
          {/* Current Order Card */}
          <div className="current-order-card ethiopia-card">
            <div className="order-card-header">
              <div className="order-title">
                <h3>
                  <span className="order-icon">📦</span>
                  የአሁኑ ትዕዛዝ
                </h3>
                <div className={`order-status ${currentOrder.status}`}>
                  {currentOrder.status === 'on_truck' ? '🚚 በመኪና ላይ' : '✅ ተደርሷል'}
                </div>
              </div>
              <div className="order-meta">
                <span className="order-id">#{currentOrder.id}</span>
                <span className="order-time">⏰ {currentOrder.timings.current}</span>
              </div>
            </div>

            {/* Customer & Restaurant Info */}
            <div className="info-grid">
              <div className="info-card customer">
                <div className="info-header">
                  <span className="info-icon">👤</span>
                  <h4>ደንበኛ</h4>
                </div>
                <div className="info-content">
                  <p className="info-name">{currentOrder.customer.name}</p>
                  <p className="info-phone">
                    <span className="phone-icon">📱</span>
                    {currentOrder.customer.phone}
                  </p>
                  <button 
                    className="action-btn small"
                    onClick={handleCallCustomer}
                  >
                    📞 ደውል
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-card">
              <h4>
                <span className="items-icon">📋</span>
                የትዕዛዝ እቃዎች ({currentOrder.items.length})
              </h4>
              <div className="items-list">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">{item.price} ብር</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>ጠቅላላ:</span>
                <strong>{currentOrder.total} ብር</strong>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="order-actions">
              {currentOrder.status === 'on_truck' ? (
                <button 
                  className="deliver-btn"
                  onClick={handleDeliveryComplete}
                >
                  <span className="btn-icon">✅</span>
                  ትዕዛዙን አድርሰው ያረጋግጡ
                </button>
              ) : (
                <button className="delivered-btn" disabled>
                  <span className="btn-icon">🎉</span>
                  ትዕዛዙ ተደርሷል!
                </button>
              )}

              <div className="secondary-actions">
                <button 
                  className="secondary-btn"
                  onClick={handleGetDirections}
                >
                  <span className="btn-icon">🗺️</span>
                  መንገድ አሳይ
                </button>
                <button className="secondary-btn">
                  <span className="btn-icon">📸</span>
                  ፎቶ ያንሱ
                </button>
                <button className="secondary-btn warning">
                  <span className="btn-icon">⚠️</span>
                  ችግር አሳውቁ
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Orders */}
          {upcomingOrders.length > 0 && (
            <div className="upcoming-orders-card ethiopia-card">
              <div className="upcoming-header">
                <h3>
                  <span className="upcoming-icon">⏭️</span>
                  ቀጣይ ትዕዛዞች
                </h3>
                <span className="upcoming-count">{upcomingOrders.length}</span>
              </div>
              
              <div className="upcoming-list">
                {upcomingOrders.map((order, index) => (
                  <div key={order.id} className="upcoming-order-item">
                    <div className="upcoming-number">#{index + 1}</div>
                    <div className="upcoming-details">
                      <div className="upcoming-header-line">
                        <strong>{order.restaurant}</strong>
                        <span className="upcoming-eta">{order.eta}</span>
                      </div>
                      <p className="upcoming-customer">{order.customer}</p>
                      <p className="upcoming-address">{order.address}</p>
                      <div className="upcoming-footer">
                        <span className="upcoming-amount">{order.amount} ብር</span>
                        <button className="upcoming-view-btn">👁️ አሳይ</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="quick-stats-card ethiopia-card">
            <h3>
              <span className="stats-icon">📊</span>
              የዛሬ አፈፃፀም
            </h3>
            <div className="stats-grid">
              <div className="stat-item-large">
                <div className="stat-value-large">{stats.today.deliveries}</div>
                <div className="stat-label-large">ትዕዛዞች</div>
              </div>
              <div className="stat-item-large">
                <div className="stat-value-large">{stats.today.earnings} ብር</div>
                <div className="stat-label-large">ገቢ</div>
              </div>
              <div className="stat-item-large">
                <div className="stat-value-large">{stats.today.rating}/5</div>
                <div className="stat-label-large">ደረጃ</div>
              </div>
              <div className="stat-item-large">
                <div className="stat-value-large">{stats.today.hours}</div>
                <div className="stat-label-large">ሰዓታት</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* DELIVERY SUCCESS TOAST */}
      {currentOrder.status === 'delivered' && (
        <div className="delivery-success-toast">
          <div className="toast-content">
            <span className="toast-icon">🎉</span>
            <div className="toast-text">
              <strong>በተሳካ ሁኔታ ተደርሷል!</strong>
              <p>ትዕዛዝ #{currentOrder.id} ወደ ደንበኛው በተሳካ ሁኔታ ተደርሷል።</p>
            </div>
            <button className="toast-close">✓</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalDriverDashboard;