const Header = ({setIsSidebarOpen,t}) => {
  return (
    <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">{t.shopName}</h1>
            <button 
              className="burger-btn"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
  )
}

export default Header
