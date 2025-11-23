import React from 'react'

const Contact = ({t,setContactForm,contactForm}) => {

     const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };
  return (
    <section className="contact-section">
        <div className="container">
          <h2 className="section-title">{t.weAreHere}</h2>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t.name}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t.email}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactForm.email}
                onChange={handleContactChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t.message}</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={contactForm.message}
                onChange={handleContactChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              {t.sendMessage}
            </button>
          </form>
        </div>
      </section>
  )
}

export default Contact
