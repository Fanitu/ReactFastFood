import React from 'react'

const Overlay = ({isSidebarOpen,setIsSidebarOpen,isCartOpen,closeAuthModals,setIsCartOpen,isOrderOpen,isSignInOpen,isSignUpOpen,setIsOrderOpen}) => {
  return (
    <div>
        {isSidebarOpen && (
        <div 
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {isCartOpen && (
        <div 
          className="overlay"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {isOrderOpen && (
        <div 
          className="overlay"
          onClick={() => setIsOrderOpen(false)}
        ></div>
      )}
      {/* Overlay */}
      {(isSidebarOpen || isSignUpOpen || isSignInOpen) && (
        <div 
          className="overlay"
          onClick={() => {
            if (isSidebarOpen) setIsSidebarOpen(false);
            if (isSignUpOpen || isSignInOpen) closeAuthModals();
          }}
        ></div>
      )}
      
    </div>
  )
}

export default Overlay
