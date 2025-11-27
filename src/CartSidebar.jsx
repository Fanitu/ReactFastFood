import React,{useState} from 'react'
import Checkout from './Checkout';

const CartSidebar = ({cartItems,isCartOpen,setIsCartOpen,t,setCartItems,cartTotal}) => {
    
    const [isProceedToCheck,setIsProceedToCheck] = useState(false);
    const [selectedPaymentMethod,setSelectedPaymentMethod] = useState('');
    const [receiptUrl,setReceiptUrl] = useState('');
    const handlePaymentmethod =(e) =>{
      setSelectedPaymentMethod(e.target.value);
    }
    const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
     console.log(selectedPaymentMethod);

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
                <strong>{t.total}: {cartTotal} Birr</strong>
              </div>
             { isProceedToCheck &&
            <div>
              <form action="">
                <legend>Choose payment method?</legend>
                  <fieldset>
                     <p className='mobileBanking'> 
                      <input 
                        type="radio" 
                        name="banking" 
                        id="mobileBanking"
                        value="mobileBanking"
                        onChange={handlePaymentmethod}
                      />
                      <label for="tacos">Mobile Banking</label>
                    </p>
                     <p className='mobileBanking'> 
                      <input 
                       type="radio" 
                       name="banking" 
                       id="cashOnDelivery"
                       value="cashOnDelivery"
                       onChange={handlePaymentmethod}
                       />
                      <label for="tacos">Cash on Delivery</label>
                    </p>
                  </fieldset>
              </form>
              {selectedPaymentMethod==="mobileBanking" && 
              <div>
                <p><strong>Absinia Bank</strong> >>>> <strong>175244301</strong></p>
                <p><strong>CBE Bank</strong> >>>><strong>1000175244301</strong></p>
                <p><strong>Telebirr</strong> >>>><strong>0932743247</strong></p>

                <p>Input your delivery Link Below</p>
                <input 
                  type="text" 
                  placeholder='https://absiniabank.com/899g89sg8'
                  value={receiptUrl}
                  onChange={(e)=> setReceiptUrl(e.target.value)}
                />
                <Checkout cartItems={cartItems} cartTotal={cartTotal}/>
            </div>
              }
              {selectedPaymentMethod==="cashOnDelivery" && <Checkout cartItems={cartItems} cartTotal={cartTotal}/>}

              </div>}
              { !isProceedToCheck && <button 
              className="checkout-btn"
              onClick={() => setIsProceedToCheck(true)}
              >
                Proceed to Checkout
              </button>}
            </>
          )}
        </div>
      </div>
  )
}

export default CartSidebar
