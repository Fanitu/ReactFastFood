import React from 'react'
import Checkout from './Checkout'

const MobilePay = ({setSelectedPaymentMethod,receiptUrl,setOrders,setReceiptUrl,setIsSignInOpen,orders,cartTotal,setCartItems,cartItems}) => {
  return (
    <div>
        <p><strong>Absinia Bank</strong> <br/> <strong>175244301</strong></p>
        <p><strong>CBE Bank</strong> <br/><strong>1000175244301</strong></p>
        <p><strong>Telebirr</strong> <br/>
        <strong>0932743247</strong></p>

        <p>Input your delivery Link Below</p>
        <input 
            type="text" 
            placeholder='https://absiniabank.com/899g89sg8'
            value={receiptUrl}
            onChange={(e)=> setReceiptUrl(e.target.value)}
        />

        <Checkout setSelectedPaymentMethod={setSelectedPaymentMethod} setIsSignInOpen={setIsSignInOpen} orders={orders} setCartItems={setCartItems} cartItems={cartItems} cartTotal={cartTotal} receiptUrl={receiptUrl} setOrders={setOrders}/>
    </div>
  )
}

export default MobilePay
