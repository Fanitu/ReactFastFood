import React from 'react'

const PaymentForm = ({handlePaymentmethod,selectedPaymentMethod}) => {
  
  return (
    <form action="">
                <legend>Choose payment method?</legend>
                  <fieldset>
                     <p className='mobileBanking'> 
                      <input 
                        type="radio" 
                        name="banking" 
                        id="mobileBanking"
                        value="mobileBanking"
                        checked={selectedPaymentMethod==='mobileBanking'}
                        onChange={handlePaymentmethod}
                      />
                      <label htmlFor="tacos">Mobile Banking</label>
                    </p>
                     <p className='mobileBanking'>
                      <input 
                       type="radio" 
                       name="banking" 
                       id="cash"
                       value="cash"
                       checked={selectedPaymentMethod ==='cashOnDelivery'}
                       onChange={handlePaymentmethod}
                       />
                      <label htmlFor="tacos">Cash on Delivery</label>
                    </p>
                  </fieldset>
              </form>
  )
}

export default PaymentForm
