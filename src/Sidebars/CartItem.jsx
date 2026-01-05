import React from 'react'

const CartItem = ({item,setCartItems}) => {
    const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  return (
    <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className='price-cart-displayer'>{item.price} x {item.quantity} Birr</p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
  )
}

export default CartItem
