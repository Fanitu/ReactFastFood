const Header = ({setIsSidebarOpen,t,setIsSignUpOpen,setIsSignInOpen}) => {
  return (
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">{t.shopName}</h1>
            <div className="header-buttons">
              {/* Add these authentication buttons */}
              <button 
                className="auth-btn sign-in-btn"
                onClick={() => setIsSignInOpen(true)}
              >
                {t.signIn}
              </button>
              <button 
                className="auth-btn sign-up-btn"
                onClick={() => setIsSignUpOpen(true)}
              >
                {t.signUp}
              </button>
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
        </div>
      </header>
  )
}

export default Header
