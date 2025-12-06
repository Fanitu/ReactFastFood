import React,{useState} from 'react'
import Checkout from './Checkout';
import CartItem from './CartItem';
import PaymentForm from './PaymentForm';
import MobilePay from './MobilePay';

const CartSidebar = ({setIsSignInOpen,cartItems,isCartOpen,setIsCartOpen,t,setCartItems,cartTotal,setOrders,orders}) => {
    
    const [isProceedToCheck,setIsProceedToCheck] = useState(false);
    const [selectedPaymentMethod,setSelectedPaymentMethod] = useState('');
    const [receiptUrl,setReceiptUrl] = useState('');
    const normalizedPaymentMethod = selectedPaymentMethod === 'mobileBanking' ? 'mobile' : selectedPaymentMethod;
    
  const handlePaymentmethod =(e) =>{
    setReceiptUrl('');
    const newPaymentMethod = e.target.value;
     console.log(newPaymentMethod);
     if( newPaymentMethod === 'cash'){
       setSelectedPaymentMethod(newPaymentMethod);
        return setReceiptUrl('Cash On Delivery.')
      }
      console.log(receiptUrl)
      setSelectedPaymentMethod(newPaymentMethod);
    }

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
                <CartItem 
                key={item.id || item._id || item.name}
                item={item}
                setCartItems={setCartItems}
                />
              ))}
              <div className="cart-total">
                <strong>{t.total}: {cartTotal} Birr</strong>
              </div>
             { isProceedToCheck &&
            <div>
             <PaymentForm 
             handlePaymentmethod={handlePaymentmethod}
             selectedPaymentMethod={selectedPaymentMethod}
             />
              {selectedPaymentMethod === "mobileBanking" && (
                <MobilePay
                  receiptUrl={receiptUrl}
                  setReceiptUrl={setReceiptUrl}
                  setIsSignInOpen={setIsSignInOpen}
                  orders={orders}
                  setCartItems={setCartItems}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  setOrders={setOrders}
                  selectedPaymentMethod={selectedPaymentMethod}
                  setSelectedPaymentMethod ={setSelectedPaymentMethod}
                />
              )}

              {/* Single Checkout render: cash immediately, mobile only after receipt */}
              {(normalizedPaymentMethod === 'cash' || (normalizedPaymentMethod === 'mobile' && receiptUrl)) && (
                <Checkout
                  setIsSignInOpen={setIsSignInOpen}
                  selectedPaymentMethod={normalizedPaymentMethod}
                  setCartItems={setCartItems}
                  receiptUrl={receiptUrl}
                  setReceiptUrl={setReceiptUrl}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  setOrders={setOrders}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  handlePaymentmethod={handlePaymentmethod}
                />
              )}

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
};

export default CartSidebar;
