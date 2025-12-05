import React from 'react'

const Footer = ({t}) => {
  return (
    <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{t.shopName}</h3>
              <p>Delivering happiness one meal at a time!</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#menu">Menu</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
                <a href="#">Telegram</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📍 {t.location}</p>
              <p>📞 +251 91 234 5678</p>
              <p>✉ info@yoyofastfood.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 YoYo Fast Food. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer
