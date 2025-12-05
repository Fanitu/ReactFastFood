import React,{useState} from 'react'
import Checkout from './Checkout';
import CartItem from './CartItem';
import PaymentForm from './PaymentForm';
import MobilePay from './MobilePay';

const CartSidebar = ({setIsSignInOpen,cartItems,isCartOpen,setIsCartOpen,t,setCartItems,cartTotal,setOrders,orders}) => {
    
    const [isProceedToCheck,setIsProceedToCheck] = useState(false);
    const [selectedPaymentMethod,setSelectedPaymentMethod] = useState('');
    const [receiptUrl,setReceiptUrl] = useState('');
    
  const handlePaymentmethod =(e) =>{
    setReceiptUrl('');
    const newPaymentMethod = e.target.value;
     console.log(newPaymentMethod);
     if( newPaymentMethod === 'cash'){
       setSelectedPaymentMethod(newPaymentMethod);
        return setReceiptUrl('Cash On Delivery.')
      }
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
                <CartItem item={item}
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
              {selectedPaymentMethod === "mobileBanking" && 
              <MobilePay receiptUrl={receiptUrl} 
              setReceiptUrl={setReceiptUrl}
              setIsSignInOpen={setIsSignInOpen} 
              orders={orders}
              setCartItems={setCartItems}
              cartItems={cartItems}
              cartTotal={cartTotal}
              setOrders={setOrders}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              />
              }
              {selectedPaymentMethod ==="cash" && <Checkout selectedPaymentMethod={selectedPaymentMethod} setCartItems={setCartItems} receiptUrl={receiptUrl} setReceiptUrl={setReceiptUrl} cartItems={cartItems} cartTotal={cartTotal} setOrders={setOrders} setSelectedPaymentMethod={setSelectedPaymentMethod}/> }

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
