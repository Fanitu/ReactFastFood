import React from 'react'

const CartSidebar = ({cartItems,isCartOpen,setIsCartOpen,t,setCartItems}) => {
    const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
   <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>{t.cart}</h3>
          <button 
            className="close-btn"
            onClick={() => setIsCartOpen(false)}
          >
            ×
          </button>
        </div>


        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price} x {item.quantity}</p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="cart-total">
                <strong>{t.total}: ${cartTotal}</strong>
              </div>
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
  )
}

export default CartSidebar
