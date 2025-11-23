import React from 'react'

const OrderSidebar = ({isOrderOpen,setIsOrderOpen,orders}) => {
  return (
    <div className={`order-sidebar ${isOrderOpen ? 'open' : ''}`}>
            <div className="cart-header">
              <h3>Orders</h3>
              <button 
                className="close-btn"
                onClick={() => setIsOrderOpen(false)}
              >
                ×
              </button>
        </div>
        <div className="order-items">
          {orders.length === 0 ? (
            <p className="empty-cart">Your Orders is empty</p>
          ) : (
            <>
              {orders.map(order => (
                <div key={order.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{order.id}</h4>
                  </div>
                  <strong>{order.total}</strong>
                </div>
              ))}
              <div className="cart-total">
              </div>
              <button className="checkout-btn">
                Delete Order
              </button>
            </>
          )}
        </div>
      </div>
  )
}

export default OrderSidebar
