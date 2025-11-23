const Sidebar = ({isSidebarOpen,setIsSidebarOpen,darkMode,setDarkMode,t,topOrders,setCurrentLanguage,currentLanguage}) => {
  return (
     <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        
        <div className="theme-toggle">
          <button 
            className={`theme-btn ${!darkMode ? 'active' : ''}`}
            onClick={() => setDarkMode(false)}
          >
            ☀ Light
          </button>
          <button 
            className={`theme-btn ${darkMode ? 'active' : ''}`}
            onClick={() => setDarkMode(true)}
          >
            🌙 Dark
          </button>
        </div>

        <div className="location">
          <span className="location-icon">📍</span>
          <span>{t.location}</span>
        </div>

        <div className="top-orders-section">
          <h3>{t.topOrders}</h3>
          <div className="top-orders-grid">
            {topOrders.map(product => (
              <div key={product.id} className="top-order-item">
                <img src={product.image} alt={product.name} />
                <div className="top-order-info">
                  <h4>{product.name}</h4>
                  <p>${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="language-selector">
          <button 
            className={`lang-btn ${currentLanguage === 'English' ? 'active' : ''}`}
            onClick={() => setCurrentLanguage('English')}
          >
            English
          </button>
          <button 
            className={`lang-btn ${currentLanguage === 'Amharic' ? 'active' : ''}`}
            onClick={() => setCurrentLanguage('Amharic')}
          >
            Amharic
          </button>
          <button 
            className={`lang-btn ${currentLanguage === 'Tigrigha' ? 'active' : ''}`}
            onClick={() => setCurrentLanguage('Tigrigha')}
          >
            Tigrigha
          </button>
        </div>
      </div>
  )
}

export default Sidebar
