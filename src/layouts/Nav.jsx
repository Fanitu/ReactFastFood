import React from 'react'

const Nav = ({t,setIsCartOpen,setIsOrderOpen,cartItems}) => {
  return (
    <nav className="fixed-nav">
        <button className="fixed-nav-btn" onClick={() => window.scrollTo(0, 0)}>
          🏠 {t.home}
        </button>
        <button 
          className="fixed-nav-btn cart-btn"
          onClick={() => setIsCartOpen(true)}
        >
          🛒 {t.cart} ({cartItems.length})
        </button>
        <button 
        className="fixed-nav-btn"
        onClick={() => setIsOrderOpen(true)}
        >
            📋 {t.myOrders}
        </button>
      </nav>
  )
}

export default Nav
