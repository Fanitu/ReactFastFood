import React from 'react'

const SignUp = ({isSignUpOpen,closeAuthModals,authError,authSuccess,handleSignUp,t,authUserForm,handleAuthChange,setIsSignUpOpen,setIsSignInOpen}) => {
    
  return (
    <div className={`auth-modal ${isSignUpOpen ? 'open' : ''}`}>
  <div className="auth-modal-content">
    <button className="close-btn" onClick={closeAuthModals}>×</button>
    <h2>{t.signUp}</h2>
    
    {authError && <div className="auth-message error">{authError}</div>}
    {authSuccess && <div className="auth-message success">{authSuccess}</div>}
    
    <form onSubmit={handleSignUp} className="auth-form">
      <div className="form-group">
        <label htmlFor="name">{t.fullName}</label>
        <input
          type="text"authForm
          id="name"
          name="name"
          value={authUserForm.name}
          onChange={handleAuthChange}
          required
          placeholder="Enter your full name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">{t.phone}</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={authUserForm.phone}
          onChange={handleAuthChange}
          required
          placeholder="Enter your phone number"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">{t.password}</label>
        <input
          type="password"
          id="password"
          name="password"
          value={authUserForm.password}
          onChange={handleAuthChange}
          required
          placeholder="Enter your password"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">{t.confirmPassword}</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={authUserForm.confirmPassword}
          onChange={handleAuthChange}
          required
          placeholder="Confirm your password"
        />
      </div>
      
      <button type="submit" className="auth-submit-btn">
        {t.createAccount}
      </button>
    </form>
    
    <p className="auth-switch">
      {t.alreadyHaveAccount} <span onClick={() => { setIsSignUpOpen(false); setIsSignInOpen(true); }}>{t.signInHere}</span>
    </p>
  </div>
</div>
  )
}

export default SignUp
