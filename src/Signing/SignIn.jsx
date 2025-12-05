import React from 'react'

const SignIn = ({isSignInOpen,closeAuthModals,authError,authSuccess,setIsSignInOpen,handleSignIn,t,signInForm,handleSignInChange}) => {
  return (
    <div className={`auth-modal ${isSignInOpen ? 'open' : ''}`}>
  <div className="auth-modal-content">
    <button className="close-btn" onClick={closeAuthModals}>×</button>
    <h2>{t.signIn}</h2>
    
    {authError && <div className="auth-message error">{authError}</div>}
    {authSuccess && <div className="auth-message success">{authSuccess}</div>}
    
    <form onSubmit={handleSignIn} className="auth-form">
      <div className="form-group">
        <label htmlFor="signinName">{t.fullName}</label>
        <input
          type="text"
          id="signinName"
          name="name"
          value={signInForm.name}
          onChange={handleSignInChange}
          required
          placeholder="Enter your full name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="signinPassword">{t.password}</label>
        <input
          type="password"
          id="signinPassword"
          name="password"
          value={signInForm.password}
          onChange={handleSignInChange}
          required
          placeholder="Enter your password"
        />
      </div>
      
      <button type="submit" className="auth-submit-btn">
        {t.login}
      </button>
    </form>
    
    <p className="auth-switch">
      {t.dontHaveAccount} <span onClick={() => { setIsSignInOpen(false); setIsSignUpOpen(true); }}>{t.signUpHere}</span>
    </p>
  </div>
</div>
  )
}

export default SignIn
